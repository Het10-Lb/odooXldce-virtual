const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GlobalTrotter database...');

  // 1. Seed Cities / Top Regional Destinations
  const citiesData = [
    {
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
      where: { id: city.name.toLowerCase().replace(/\s+/g, '-') },
      update: city,
      create: {
        id: city.name.toLowerCase().replace(/\s+/g, '-'),
        ...city,
      },
    });
  }

  console.log(`Seeded ${citiesData.length} top regional cities.`);

  // 2. Seed Sample User
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

  // 3. Seed Sample User Saved Cities
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

  await prisma.userSavedCity.upsert({
    where: {
      userId_cityId: {
        userId: sampleUser.id,
        cityId: 'kyoto',
      },
    },
    update: {},
    create: {
      userId: sampleUser.id,
      cityId: 'kyoto',
    },
  });

  // 4. Seed Sample Trips for User
  const now = new Date();

  // Ongoing Trip
  const ongoingTrip = await prisma.trip.upsert({
    where: { id: 'sample-trip-ongoing-1' },
    update: {},
    create: {
      id: 'sample-trip-ongoing-1',
      userId: sampleUser.id,
      name: 'Autumn in Japan Expedition',
      description: 'Exploring vibrant Tokyo streets and serene Kyoto bamboo groves.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
      startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // in 5 days
      status: 'ONGOING',
      totalBudget: 3500.00,
      isPublic: true,
      sections: {
        create: [
          { title: 'Tokyo Exploration & Shibuya Crossing', order: 1, cityId: 'tokyo' },
          { title: 'Kyoto Temples & Arashiyama', order: 2, cityId: 'kyoto' },
        ],
      },
    },
  });

  // Upcoming Trip
  const upcomingTrip = await prisma.trip.upsert({
    where: { id: 'sample-trip-upcoming-1' },
    update: {},
    create: {
      id: 'sample-trip-upcoming-1',
      userId: sampleUser.id,
      name: 'European Romance Escape',
      description: 'Summer getaway across Paris cafes and Roman ruins.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // in 30 days
      endDate: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
      totalBudget: 4200.00,
      isPublic: false,
      sections: {
        create: [
          { title: 'Parisian Museums & Eiffel Tower', order: 1, cityId: 'paris' },
          { title: 'Rome Colosseum Tour', order: 2, cityId: 'rome' },
          { title: 'Barcelona Beach Relax', order: 3, cityId: 'barcelona' },
        ],
      },
    },
  });

  // Completed Trip
  const completedTrip = await prisma.trip.upsert({
    where: { id: 'sample-trip-completed-1' },
    update: {},
    create: {
      id: 'sample-trip-completed-1',
      userId: sampleUser.id,
      name: 'Southeast Asia Backpacking',
      description: 'Incredible island hopping and street food trail.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      startDate: new Date('2025-11-01'),
      endDate: new Date('2025-11-20'),
      status: 'COMPLETED',
      totalBudget: 2100.00,
      isPublic: true,
      sections: {
        create: [
          { title: 'Bangkok Markets', order: 1, cityId: 'bangkok' },
          { title: 'Bali Beach & Rice Terraces', order: 2, cityId: 'bali' },
        ],
      },
    },
  });

  console.log('Seeded sample trips:', [ongoingTrip.name, upcomingTrip.name, completedTrip.name]);
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
