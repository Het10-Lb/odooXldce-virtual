const prisma = require('../config/prisma');
const {
  formatDateRange,
  calculateTotalDays,
  generateContiguousDays,
  formatISODateOnly,
} = require('../utils/dateUtils');

/**
 * Helper to initialize zeroed category breakdown object
 */
const createEmptyBreakdown = () => ({
  transport: 0.0,
  stay: 0.0,
  activities: 0.0,
  meals: 0.0,
  other: 0.0,
});

/**
 * Helper to map ItemType enum to category breakdown key
 */
const getCategoryKey = (type) => {
  switch (type) {
    case 'TRANSPORT':
      return 'transport';
    case 'STAY':
      return 'stay';
    case 'ACTIVITY':
      return 'activities';
    case 'MEAL':
      return 'meals';
    default:
      return 'other';
  }
};

/**
 * @desc    Get structured Itinerary View & Financial Budget Breakdown for a trip (Screens 6, 9, 10, 11)
 * @route   GET /api/trips/:id/itinerary-view
 * @access  Public (if trip is public) / Private (if trip owner)
 */
const getItineraryView = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;
    const currentUserId = req.user?.id;

    // 1. Fetch trip with sections, cities, and itinerary items
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            photoUrl: true,
          },
        },
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            city: true,
            items: {
              orderBy: [{ orderIndex: 'asc' }, { startTime: 'asc' }],
              include: {
                activity: true,
              },
            },
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found.',
      });
    }

    // 2. Authorization Check: Private trips require owner authentication
    if (!trip.isPublic && (!currentUserId || currentUserId !== trip.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: This trip itinerary is private.',
      });
    }

    // 3. Overall Timeline Summary
    const totalDays = calculateTotalDays(trip.startDate, trip.endDate);
    const dateSummary = {
      startDate: trip.startDate,
      endDate: trip.endDate,
      formattedDateRange: formatDateRange(trip.startDate, trip.endDate),
      totalDays,
    };

    // 4. Calculate Financial Metrics & Overall Category Breakdown
    let totalAllocatedBudget = 0.0;
    let totalEstimatedCost = 0.0;
    const overallBreakdown = createEmptyBreakdown();

    const sectionsSummary = trip.sections.map((section) => {
      const budgetAllocated = parseFloat(section.budgetAllocated) || 0.0;
      totalAllocatedBudget += budgetAllocated;

      let sectionTotalCost = 0.0;
      section.items.forEach((item) => {
        const itemCost = parseFloat(item.cost) || 0.0;
        sectionTotalCost += itemCost;
        totalEstimatedCost += itemCost;

        const categoryKey = getCategoryKey(item.type);
        overallBreakdown[categoryKey] += itemCost;
      });

      return {
        sectionId: section.id,
        sectionTitle: section.sectionTitle,
        city: section.city ? `${section.city.name}, ${section.city.country}` : 'Flexible Location',
        dateRange: formatDateRange(section.startDate, section.endDate),
        budgetAllocated: parseFloat(budgetAllocated.toFixed(2)),
        sectionTotalCost: parseFloat(sectionTotalCost.toFixed(2)),
      };
    });

    const remainingBudget = parseFloat((totalAllocatedBudget - totalEstimatedCost).toFixed(2));
    const averageCostPerDay = totalDays > 0 ? parseFloat((totalEstimatedCost / totalDays).toFixed(2)) : 0.0;

    // Round overall breakdown numbers
    Object.keys(overallBreakdown).forEach((key) => {
      overallBreakdown[key] = parseFloat(overallBreakdown[key].toFixed(2));
    });

    const financialSummary = {
      totalAllocatedBudget: parseFloat(totalAllocatedBudget.toFixed(2)),
      totalEstimatedCost: parseFloat(totalEstimatedCost.toFixed(2)),
      remainingBudget,
      averageCostPerDay,
      overallBreakdown,
    };

    // 5. Generate Contiguous Day Buckets
    const rawDays = generateContiguousDays(trip.startDate, trip.endDate);

    const days = rawDays.map((dayObj) => {
      const dayDateStr = dayObj.date;
      const dayTotalCostObj = { cost: 0.0 };
      const dayBreakdown = createEmptyBreakdown();
      const dayItems = [];

      // Assign items to days based on section date boundaries
      trip.sections.forEach((section) => {
        const secStart = formatISODateOnly(section.startDate);
        const secEnd = formatISODateOnly(section.endDate);

        // Check if current day falls within this section's date range
        if (dayDateStr >= secStart && dayDateStr <= secEnd) {
          // Calculate day index within section (1-indexed)
          const sectionStartMs = new Date(secStart).getTime();
          const currentDayMs = new Date(dayDateStr).getTime();
          const dayIndex = Math.floor((currentDayMs - sectionStartMs) / (1000 * 60 * 60 * 24)) + 1;

          section.items.forEach((item) => {
            // Include items for this section (distribute across days or attach)
            // If item has day notes e.g. "Day 2", match dayIndex, or include in section days
            const itemCost = parseFloat(item.cost) || 0.0;

            // Check if item specifically belongs to this day index or general section day
            let belongsToThisDay = true;
            if (item.notes && item.notes.includes('Day ')) {
              const match = item.notes.match(/Day\s+(\d+)/i);
              if (match && parseInt(match[1], 10) !== dayIndex) {
                belongsToThisDay = false;
              }
            }

            if (belongsToThisDay) {
              dayTotalCostObj.cost += itemCost;
              const catKey = getCategoryKey(item.type);
              dayBreakdown[catKey] += itemCost;

              dayItems.push({
                id: item.id,
                title: item.title,
                type: item.type,
                startTime: item.startTime || null,
                endTime: item.endTime || null,
                cost: parseFloat(itemCost.toFixed(2)),
                orderIndex: item.orderIndex,
                notes: item.notes || null,
                sectionId: section.id,
                sectionTitle: section.sectionTitle,
                cityName: section.city ? section.city.name : null,
              });
            }
          });
        }
      });

      // Sort day items by startTime / orderIndex
      dayItems.sort((a, b) => {
        if (a.orderIndex !== b.orderIndex) return a.orderIndex - b.orderIndex;
        if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
        return 0;
      });

      // Format breakdown numbers
      Object.keys(dayBreakdown).forEach((k) => {
        dayBreakdown[k] = parseFloat(dayBreakdown[k].toFixed(2));
      });

      return {
        dayNumber: dayObj.dayNumber,
        date: dayObj.date,
        formattedDate: dayObj.formattedDate,
        dayTotalCost: parseFloat(dayTotalCostObj.cost.toFixed(2)),
        dayBreakdown,
        items: dayItems,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        tripId: trip.id,
        tripName: trip.name,
        description: trip.description,
        coverPhotoUrl: trip.coverPhotoUrl,
        status: trip.status,
        isPublic: trip.isPublic,
        owner: trip.user,
        dateSummary,
        financialSummary,
        sectionsSummary,
        days,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItineraryView,
};
