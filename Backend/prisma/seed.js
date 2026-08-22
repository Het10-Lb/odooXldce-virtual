const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GlobalTrotter database with Section Templates...');

  // 1. Seed Cities / Top Regional Destinations
  const citiesData = [
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      costIndex: 4,
      popularityScore: 98,
      bannerImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      description: 'The City of Light, famous for the Eiffel Tower, world-class cuisine, and artistic history.',
      isTopRegional: true,
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      region: 'East Asia',
      costIndex: 4,
      popularityScore: 99,
      bannerImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
      description: 'An extraordinary blend of ultramodern neon skyscrapers and historic temples.',
      isTopRegional: true,
    },
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      region: 'Southeast Asia',
      costIndex: 2,
      popularityScore: 95,
      bannerImageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      description: 'Tropical paradise known for volcanic mountains, iconic rice paddies, and coral reefs.',
      isTopRegional: true,
    },
    {
      id: 'bangkok',
      name: 'Bangkok',
      country: 'Thailand',
      region: 'Southeast Asia',
      costIndex: 2,
      popularityScore: 92,
      bannerImageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365',
      description: 'Vibrant street life, ornate shrines, and bustling floating markets.',
      isTopRegional: true,
    },
    {
      id: 'rome',
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      costIndex: 3,
      popularityScore: 94,
      bannerImageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
      description: 'The Eternal City packed with ancient ruins, Renaissance architecture, and gelato.',
      isTopRegional: true,
    },
    {
      id: 'new-york-city',
      name: 'New York City',
      country: 'United States',
      region: 'North America',
      costIndex: 5,
      popularityScore: 97,
      bannerImageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      description: 'The Big Apple with iconic skyline, Broadway, Central Park, and global culture.',
      isTopRegional: true,
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      costIndex: 3,
      popularityScore: 91,
      bannerImageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4',
      description: 'Famous for Gaudí architecture, sun-soaked beaches, and tapas culture.',
      isTopRegional: true,
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      country: 'Japan',
      region: 'East Asia',
      costIndex: 3,
      popularityScore: 93,
      bannerImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
      description: 'Japan\'s cultural heart with thousands of classical Buddhist temples and gardens.',
      isTopRegional: true,
    },
  ];

  for (const city of citiesData) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: city,
      create: city,
    });
  }

  console.log(`Seeded ${citiesData.length} top regional cities.`);

  // 2. Seed Activities Catalog
  const activitiesData = [
    {
      id: 'act-paris-1',
      cityId: 'paris',
      title: 'Eiffel Tower Summit Access & Champagne Toast',
      description: 'Iconic view of Paris skyline from top floor deck.',
      type: 'ACTIVITY',
      estimatedCost: 35.0,
      estimatedDuration: '2.5 hours',
      popularityScore: 99,
    },
    {
      id: 'act-paris-2',
      cityId: 'paris',
      title: 'Louvre Museum Guided Masterpieces Tour',
      description: 'Fast-track entry to see Mona Lisa, Venus de Milo, and Winged Victory.',
      type: 'ACTIVITY',
      estimatedCost: 65.0,
      estimatedDuration: '3 hours',
      popularityScore: 97,
    },
    {
      id: 'act-tokyo-1',
      cityId: 'tokyo',
      title: 'Shibuya Crossing & Harajuku Street Food Crawl',
      description: 'Guided walk through Shibuya Sky and Takeshita Street crepes.',
      type: 'MEAL',
      estimatedCost: 45.0,
      estimatedDuration: '3 hours',
      popularityScore: 98,
    },
    {
      id: 'act-tokyo-2',
      cityId: 'tokyo',
      title: 'teamLab Planets Digital Art Museum',
      description: 'Immersive body-on digital artwork installation in Toyosu.',
      type: 'ACTIVITY',
      estimatedCost: 30.0,
      estimatedDuration: '2 hours',
      popularityScore: 96,
    },
    {
      id: 'act-kyoto-1',
      cityId: 'kyoto',
      title: 'Fushimi Inari Shrine Early Morning Hike',
      description: 'Walk through 10,000 vermilion torii gates up Mount Inari.',
      type: 'ACTIVITY',
      estimatedCost: 0.0,
      estimatedDuration: '2.5 hours',
      popularityScore: 99,
    },
    {
      id: 'act-rome-1',
      cityId: 'rome',
      title: 'Colosseum & Roman Forum VIP Arena Floor Access',
      description: 'Walk where gladiators fought with an expert archaeologist guide.',
      type: 'ACTIVITY',
      estimatedCost: 55.0,
      estimatedDuration: '3.5 hours',
      popularityScore: 98,
    },
  ];

  for (const act of activitiesData) {
    await prisma.activity.upsert({
      where: { id: act.id },
      update: act,
      create: act,
    });
  }

  // 3. Seed Curated Section Templates (Predefined Section Packages)
  const sectionTemplatesData = [
    {
      id: 'tpl-paris-classic-3d',
      cityId: 'paris',
      title: '3-Day Classic Paris Highlights',
      description: 'Pre-designed section package featuring top art museums, Eiffel Tower, and Seine River cruises.',
      durationDays: 3,
      suggestedBudget: 650.0,
      coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      popularityScore: 98,
      templateItems: {
        create: [
          {
            title: 'Louvre Museum Guided Masterpieces Tour',
            type: 'ACTIVITY',
            activityId: 'act-paris-2',
            dayOffset: 1,
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            estimatedCost: 65.0,
            orderIndex: 1,
          },
          {
            title: 'Eiffel Tower Summit & Sunset Champagne Toast',
            type: 'ACTIVITY',
            activityId: 'act-paris-1',
            dayOffset: 2,
            startTime: '06:00 PM',
            endTime: '08:30 PM',
            estimatedCost: 35.0,
            orderIndex: 2,
          },
        ],
      },
    },
    {
      id: 'tpl-tokyo-tech-3d',
      cityId: 'tokyo',
      title: '3-Day Tokyo Cyberpunk & Food Tour',
      description: 'Pre-designed section package covering futuristic digital art, Shibuya, and Tokyo culinary nightlife.',
      durationDays: 3,
      suggestedBudget: 800.0,
      coverImageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
      popularityScore: 99,
      templateItems: {
        create: [
          {
            title: 'Shibuya Crossing & Harajuku Food Crawl',
            type: 'MEAL',
            activityId: 'act-tokyo-1',
            dayOffset: 1,
            startTime: '05:00 PM',
            endTime: '08:00 PM',
            estimatedCost: 45.0,
            orderIndex: 1,
          },
          {
            title: 'teamLab Planets Digital Art Museum',
            type: 'ACTIVITY',
            activityId: 'act-tokyo-2',
            dayOffset: 2,
            startTime: '10:00 AM',
            endTime: '12:00 PM',
            estimatedCost: 30.0,
            orderIndex: 2,
          },
        ],
      },
    },
    {
      id: 'tpl-kyoto-zen-2d',
      cityId: 'kyoto',
      title: '2-Day Kyoto Zen Temple & Shrine Trail',
      description: 'Serene preset section package exploring thousand-year-old shrines and traditional bamboo groves.',
      durationDays: 2,
      suggestedBudget: 450.0,
      coverImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
      popularityScore: 95,
      templateItems: {
        create: [
          {
            title: 'Fushimi Inari Torii Gate Hike',
            type: 'ACTIVITY',
            activityId: 'act-kyoto-1',
            dayOffset: 1,
            startTime: '07:00 AM',
            endTime: '09:30 AM',
            estimatedCost: 0.0,
            orderIndex: 1,
          },
        ],
      },
    },
    {
      id: 'tpl-rome-history-3d',
      cityId: 'rome',
      title: '3-Day Imperial Rome & Ancient Wonders',
      description: 'Step back in time with VIP Colosseum access and Vatican masterwork tours.',
      durationDays: 3,
      suggestedBudget: 600.0,
      coverImageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
      popularityScore: 96,
      templateItems: {
        create: [
          {
            title: 'Colosseum VIP Arena Floor Access',
            type: 'ACTIVITY',
            activityId: 'act-rome-1',
            dayOffset: 1,
            startTime: '09:00 AM',
            endTime: '12:30 PM',
            estimatedCost: 55.0,
            orderIndex: 1,
          },
        ],
      },
    },
  ];

  for (const tpl of sectionTemplatesData) {
    const { templateItems, ...templateData } = tpl;
    await prisma.sectionTemplate.upsert({
      where: { id: templateData.id },
      update: templateData,
      create: {
        ...templateData,
        templateItems,
      },
    });
  }

  console.log(`Seeded ${sectionTemplatesData.length} predefined section templates.`);

  // 4. Seed Sample User
  const samplePassword = await bcrypt.hash('Password123!', 10);
  const sampleUser = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.com' },
    update: {},
    create: {
      id: 'demo-user-id-12345',
      firstName: 'Alex',
      lastName: 'Traveler',
      email: 'demo@globetrotter.com',
      password: samplePassword,
      city: 'San Francisco',
      country: 'United States',
      role: 'USER',
    },
  });

  console.log(`Seeded sample user: ${sampleUser.email}`);

  // 5. Seed Sample User Saved Cities
  await prisma.userSavedCity.upsert({
    where: {
      userId_cityId: {
        userId: sampleUser.id,
        cityId: 'paris',
      },
    },
    update: {},
    create: {
      userId: sampleUser.id,
      cityId: 'paris',
    },
  });

  // 6. Seed Sample Trips
  const now = new Date();

  await prisma.trip.deleteMany({
    where: { userId: sampleUser.id },
  });

  const ongoingTrip = await prisma.trip.create({
    data: {
      id: 'sample-trip-ongoing-1',
      userId: sampleUser.id,
      name: 'Autumn in Japan Expedition',
      description: 'Exploring vibrant Tokyo streets and serene Kyoto bamboo groves.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
      startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: 'ONGOING',
      totalBudget: 3500.0,
      isPublic: true,
      sections: {
        create: [
          {
            id: 'sec-tokyo-1',
            sectionTitle: 'Tokyo Neon & Culinary Wonders',
            startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
            budgetAllocated: 2000.0,
            cityId: 'tokyo',
            orderIndex: 1,
            description: 'Stops at Shibuya, Shinjuku, and Toyosu.',
            items: {
              create: [
                {
                  title: 'Shibuya Crossing & Harajuku Food Crawl',
                  type: 'MEAL',
                  activityId: 'act-tokyo-1',
                  startTime: '05:00 PM',
                  endTime: '08:00 PM',
                  cost: 45.0,
                  orderIndex: 1,
                },
                {
                  title: 'teamLab Planets Digital Art Museum',
                  type: 'ACTIVITY',
                  activityId: 'act-tokyo-2',
                  startTime: '10:00 AM',
                  endTime: '12:00 PM',
                  cost: 30.0,
                  orderIndex: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded sample trip:', ongoingTrip.name);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
