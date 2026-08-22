import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import TripSummaryHeader from '../components/builder/TripSummaryHeader';
import TimelineThread from '../components/builder/TimelineThread';
import TripCalendarView from '../components/builder/TripCalendarView';
import {
  createTripInDB,
  fetchTripItineraryView,
  deleteTripFromDB,
  deleteSectionFromTrip,
  deleteItemFromTripSection,
  addItineraryItemToSection,
} from '../services/api';

export default function ItineraryBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tripId } = useParams();

  const [selectedCities, setSelectedCities] = useState(location.state?.selectedCities || []);
  const [selectedActivities, setSelectedActivities] = useState(location.state?.selectedActivities || []);
  const totalPrice = location.state?.totalPrice || 0;
  const tripInfo = location.state?.tripInfo || {};

  const [viewMode, setViewMode] = useState('timeline');
  const [isLoading, setIsLoading] = useState(!!tripId);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Loaded database trip state
  const [loadedTripData, setLoadedTripData] = useState(null);

  // Add Activity Modal state
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [targetDayNumber, setTargetDayNumber] = useState(1);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityType, setNewActivityType] = useState('ACTIVITY');
  const [newActivityCost, setNewActivityCost] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('10:00 AM');
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  const loadItinerary = async () => {
    if (!tripId) return;
    try {
      setIsLoading(true);
      const data = await fetchTripItineraryView(tripId);
      if (data) {
        setLoadedTripData(data);
      }
    } catch (err) {
      console.error('Failed to fetch itinerary view:', err);
      setSaveError('Unable to load trip itinerary from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItinerary();
  }, [tripId]);

  // Construct dynamic trip object
  const routeName = loadedTripData
    ? (loadedTripData.sectionsSummary || []).map((s) => s.city).filter(Boolean).join(' → ') || loadedTripData.tripName
    : selectedCities.length > 0
    ? selectedCities.map((c) => c.name).join(' → ')
    : 'India Getaway';

  const tripObj = {
    id: tripId || 'active-builder-trip',
    title: loadedTripData?.tripName || tripInfo.title || `${selectedCities[0]?.name || 'India'} Getaway`,
    duration: loadedTripData?.dateSummary?.totalDays
      ? `${loadedTripData.dateSummary.totalDays} Days`
      : `${selectedCities.length > 0 ? selectedCities.length * 3 : 4} Days`,
    route: routeName,
    coverPhotoUrl: loadedTripData?.coverPhotoUrl,
    totalBudget: loadedTripData?.financialSummary?.totalAllocatedBudget || totalPrice || 5000,
    totalCost: loadedTripData?.financialSummary?.totalEstimatedCost || totalPrice || 0,
    cities: loadedTripData
      ? (loadedTripData.sectionsSummary || []).map((s, idx) => ({
          id: s.sectionId || `sec-${idx}`,
          name: s.city || 'City',
          image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
        }))
      : selectedCities.map((c) => ({
          id: c.id,
          name: c.name,
          image: c.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
        })),
  };

  const today = new Date();

  // Day Schedule mapping from loaded backend API or fallback state
  let daysSchedule = [];

  if (loadedTripData && loadedTripData.days) {
    daysSchedule = loadedTripData.days.map((day) => ({
      id: `day-${day.dayNumber}`,
      dayNumber: day.dayNumber,
      title: `Day ${day.dayNumber} - ${day.formattedDate}`,
      date: day.formattedDate,
      dayTotalCost: day.dayTotalCost,
      activities: (day.items || []).map((item, idx) => ({
        id: item.id || `item-${idx}`,
        sectionId: item.sectionId,
        category: item.type || 'Activity',
        time: item.startTime || (idx === 0 ? '10:00 AM' : '2:00 PM'),
        duration: item.endTime ? `${item.startTime} - ${item.endTime}` : '2h',
        title: item.title,
        description: item.notes || item.sectionTitle || `Explore ${item.cityName || 'destination'}`,
        price: `₹${item.cost}`,
        cityName: item.cityName,
        isBooked: true,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      })),
    }));
  } else {
    // Generate day buckets for draft trip
    const totalDaysCount = selectedCities.length > 0 ? selectedCities.length * 3 : 4;
    for (let i = 1; i <= totalDaysCount; i++) {
      const dDate = new Date(today.getTime() + (i - 1) * 86400000);
      const formattedD = dDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const dayActs = selectedActivities.slice((i - 1) * 2, i * 2).map((act, idx) => ({
        id: act.id || `act-${i}-${idx}`,
        category: act.category || 'Sightseeing',
        time: idx === 0 ? '10:00 AM' : '2:00 PM',
        duration: act.duration || '2h',
        title: act.title,
        description: act.description || `Explore ${act.cityName || 'destination'}`,
        price: `₹${act.price}`,
        isBooked: true,
        image: act.image,
      }));

      daysSchedule.push({
        id: `day-${i}`,
        dayNumber: i,
        title: `Day ${i} - ${formattedD}`,
        date: formattedD,
        dayTotalCost: dayActs.reduce((sum, a) => sum + (parseFloat(a.price.replace('₹', '')) || 0), 0),
        activities: dayActs,
      });
    }
  }

  const handleOpenAddActivityModal = (dayId) => {
    let dNum = 1;
    if (dayId && typeof dayId === 'string') {
      const match = dayId.match(/day-(\d+)/);
      if (match) dNum = parseInt(match[1], 10);
    }
    setTargetDayNumber(dNum);
    setNewActivityTitle('');
    setNewActivityCost('500');
    setNewActivityTime('10:00 AM');
    setNewActivityType('ACTIVITY');
    setShowAddActivityModal(true);
  };

  const handleSaveNewActivity = async (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    try {
      setIsAddingActivity(true);
      const costNum = parseFloat(newActivityCost) || 0;

      if (tripId) {
        // Find corresponding section ID for trip
        const sectionId = loadedTripData?.sectionsSummary?.[0]?.sectionId || 'auto';
        await addItineraryItemToSection(tripId, sectionId, {
          title: newActivityTitle.trim(),
          type: newActivityType,
          cost: costNum,
          startTime: newActivityTime,
          notes: `Day ${targetDayNumber}`,
        });
        await loadItinerary();
      } else {
        // Add to local state for new unsaved trip
        const newAct = {
          id: `custom-act-${Date.now()}`,
          title: newActivityTitle.trim(),
          category: newActivityType,
          duration: '2h',
          description: `Scheduled for Day ${targetDayNumber}`,
          price: costNum,
          cityName: selectedCities[0]?.name || 'Destination',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        };
        setSelectedActivities((prev) => [...prev, newAct]);
      }

      setShowAddActivityModal(false);
    } catch (err) {
      console.error('Failed to add activity:', err);
      setSaveError(err.message || 'Failed to add activity.');
    } finally {
      setIsAddingActivity(false);
    }
  };

  const handleSaveTripToDatabase = async () => {
    try {
      setIsSaving(true);
      setSaveError('');
      const startDate = tripInfo?.startDate ? new Date(tripInfo.startDate) : new Date();
      const durationDays = selectedCities.length > 0 ? selectedCities.length * 3 : 3;
      const endDate = tripInfo?.endDate ? new Date(tripInfo.endDate) : new Date(startDate.getTime() + durationDays * 86400000);

      const coverImg = tripInfo?.coverPhotoUrl || selectedCities[0]?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2';

      const payload = {
        name: tripInfo?.name || tripObj.title,
        description: tripInfo?.description || `Trip visiting ${routeName}`,
        coverPhotoUrl: coverImg.startsWith('http') ? coverImg : 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        initialBudget: totalPrice || 5000,
        initialCityId: selectedCities[0]?.id || null,
        isPublic: false,
      };

      await createTripInDB(payload);
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/my-trips');
      }, 1200);
    } catch (err) {
      console.error('Save trip error:', err);
      setSaveError(err.message || 'Failed to save trip to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntireTrip = async () => {
    if (!tripId) return;
    if (!window.confirm(`Are you sure you want to delete "${tripObj.title}" from database?`)) return;
    try {
      setIsDeleting(true);
      await deleteTripFromDB(tripId);
      navigate('/my-trips');
    } catch (err) {
      console.error('Delete trip error:', err);
      setSaveError(err.message || 'Failed to delete trip.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCityStop = async (citySectionId) => {
    if (!window.confirm('Remove this city stop from your trip?')) return;
    if (tripId && citySectionId) {
      try {
        await deleteSectionFromTrip(tripId, citySectionId);
        await loadItinerary();
      } catch (err) {
        console.warn('Failed to delete section:', err.message);
      }
    } else {
      setSelectedCities((prev) => prev.filter((c) => c.id !== citySectionId));
    }
  };

  const handleDeleteActivityItem = async (itemId, sectionId) => {
    if (!window.confirm('Remove this activity from your itinerary?')) return;
    if (tripId && sectionId && itemId) {
      try {
        await deleteItemFromTripSection(tripId, sectionId, itemId);
        await loadItinerary();
      } catch (err) {
        console.warn('Failed to delete item:', err.message);
      }
    } else {
      setSelectedActivities((prev) => prev.filter((act) => act.id !== itemId));
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md relative">
      <Header />

      <main className="relative w-full pt-16 pb-28 bg-surface min-h-screen">
        <div className="flex flex-col w-full max-w-max-width mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Trip Summary Header */}
              <TripSummaryHeader
                trip={tripObj}
                onAddStop={() => navigate('/select-cities')}
                onDeleteCity={handleDeleteCityStop}
              />

              {/* Financial & Expenses Summary Box */}
              {loadedTripData?.financialSummary && (
                <div className="mx-margin-mobile my-3 p-4 bg-surface-container rounded-2xl border border-outline-variant/20 flex flex-col gap-2">
                  <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                    <span className="font-label-md text-sm text-on-surface font-bold">Financial Summary</span>
                    <span className="font-headline-md text-sm text-primary font-bold">
                      Est. Total: ₹{loadedTripData.financialSummary.totalEstimatedCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-on-surface-variant pt-1">
                    <div>🚗 Transport: ₹{loadedTripData.financialSummary.overallBreakdown.transport}</div>
                    <div>🏨 Stay: ₹{loadedTripData.financialSummary.overallBreakdown.stay}</div>
                    <div>🎟️ Activities: ₹{loadedTripData.financialSummary.overallBreakdown.activities}</div>
                    <div>🍲 Meals: ₹{loadedTripData.financialSummary.overallBreakdown.meals}</div>
                  </div>
                </div>
              )}

              {/* View Switcher & Action Buttons Bar */}
              <div className="px-margin-mobile pt-4 pb-3 flex justify-between items-center bg-surface border-b border-outline-variant/10">
                <h3 className="font-headline-md text-on-surface text-lg font-bold">
                  {viewMode === 'timeline' ? 'Schedule Timeline' : 'Trip Calendar Grid'}
                </h3>

                <div className="flex items-center gap-2">
                  <div className="flex bg-surface-container p-1 rounded-xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('timeline')}
                      className={`px-3 py-1.5 font-label-md text-xs rounded-lg transition-all cursor-pointer ${
                        viewMode === 'timeline'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Timeline
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('calendar')}
                      className={`px-3 py-1.5 font-label-md text-xs rounded-lg transition-all cursor-pointer ${
                        viewMode === 'calendar'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Calendar View
                    </button>
                  </div>

                  {!tripId ? (
                    <button
                      type="button"
                      onClick={handleSaveTripToDatabase}
                      disabled={isSaving}
                      className="px-4 py-2 bg-electric-sky text-on-primary font-label-md rounded-xl shadow hover:bg-primary transition-all text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isSaving ? 'Saving...' : saveSuccess ? 'Saved! ✓' : 'Save Trip to Database'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDeleteEntireTrip}
                      disabled={isDeleting}
                      className="px-3 py-1.5 bg-error/10 text-error hover:bg-error hover:text-on-error font-label-md rounded-xl transition-all text-xs flex items-center gap-1 cursor-pointer disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      {isDeleting ? 'Deleting...' : 'Delete Trip'}
                    </button>
                  )}
                </div>
              </div>

              {saveError && (
                <div className="mx-margin-mobile mt-3 p-3 bg-error/10 text-error rounded-xl text-xs text-center">
                  {saveError}
                </div>
              )}

              {/* Render Timeline View OR Calendar View */}
              {viewMode === 'timeline' ? (
                <TimelineThread
                  days={daysSchedule}
                  onAddActivity={handleOpenAddActivityModal}
                  onDeleteActivity={handleDeleteActivityItem}
                />
              ) : (
                <TripCalendarView trip={tripObj} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNewActivity}
            className="bg-surface-container rounded-3xl p-6 w-full max-w-md shadow-2xl border border-outline-variant/20 flex flex-col gap-4 animate-fade-in"
          >
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
              <h3 className="font-headline-md text-on-surface font-bold text-lg">
                Add Activity for Day {targetDayNumber}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddActivityModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-label-md text-on-surface-variant font-bold">Activity Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Heritage Monument Walk & Sunset View"
                value={newActivityTitle}
                onChange={(e) => setNewActivityTitle(e.target.value)}
                className="w-full bg-surface-container-low text-sm p-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-label-md text-on-surface-variant font-bold">Category</label>
                <select
                  value={newActivityType}
                  onChange={(e) => setNewActivityType(e.target.value)}
                  className="w-full bg-surface-container-low text-xs p-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="ACTIVITY">Activity</option>
                  <option value="SIGHTSEEING">Sightseeing</option>
                  <option value="FOOD">Food / Meal</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="STAY">Stay / Accommodation</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-label-md text-on-surface-variant font-bold">Estimated Cost (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="500"
                  value={newActivityCost}
                  onChange={(e) => setNewActivityCost(e.target.value)}
                  className="w-full bg-surface-container-low text-sm p-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-label-md text-on-surface-variant font-bold">Time</label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={newActivityTime}
                onChange={(e) => setNewActivityTime(e.target.value)}
                className="w-full bg-surface-container-low text-sm p-3 rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddActivityModal(false)}
                className="flex-1 py-3 bg-surface-container-high text-on-surface font-label-md rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAddingActivity}
                className="flex-1 py-3 bg-electric-sky text-on-primary font-label-md rounded-xl text-xs shadow hover:bg-primary transition-all disabled:opacity-50 cursor-pointer font-bold"
              >
                {isAddingActivity ? 'Adding...' : 'Add Activity'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
