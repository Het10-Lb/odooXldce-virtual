const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GlobalTrotter Database (Gujarat, Goa & Maharashtra)...');

  // ---------------------------------------------------------
  // 1. SEED 16 CITIES ACROSS GUJARAT, GOA & MAHARASHTRA
  // ---------------------------------------------------------
  const citiesData = [
    // GUJARAT (6 Cities)
    {
      id: 'ahmedabad',
      name: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 92,
      bannerImageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a',
      description: 'India\'s first UNESCO World Heritage City, famous for Sabarmati Ashram, heritage pols, and authentic Gujarati Thali.',
      isTopRegional: true,
    },
    {
      id: 'kutch',
      name: 'Rann of Kutch (Dhordo)',
      state: 'Gujarat',
      country: 'India',
      region: 'Western India',
      costIndex: 4,
      popularityScore: 96,
      bannerImageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
      description: 'The vast Great Rann of Kutch salt desert, famous for Rann Utsav cultural festival, handicrafts, and white horizon full moon vistas.',
      isTopRegional: true,
    },
    {
      id: 'gir',
      name: 'Gir Somnath (Sasan Gir)',
      state: 'Gujarat',
      country: 'India',
      region: 'Western India',
      costIndex: 4,
      popularityScore: 94,
      bannerImageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0',
      description: 'The sole wildlife sanctuary in the world protecting Asiatic Lions in their natural dry deciduous forest habitat.',
      isTopRegional: true,
    },
    {
      id: 'vadodara',
      name: 'Vadodara',
      state: 'Gujarat',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 88,
      bannerImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220',
      description: 'The cultural capital of Gujarat, home to the magnificent Laxmi Vilas Palace and vibrant Navratri Garba celebrations.',
      isTopRegional: true,
    },
    {
      id: 'dwarka',
      name: 'Dwarka',
      state: 'Gujarat',
      country: 'India',
      region: 'Western India',
      costIndex: 2,
      popularityScore: 90,
      bannerImageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1',
      description: 'Ancient sacred coastal city associated with Lord Krishna, featuring the historic Dwarkadhish Temple and Beyt Dwarka island.',
      isTopRegional: true,
    },
    {
      id: 'saputara',
      name: 'Saputara',
      state: 'Gujarat',
      country: 'India',
      region: 'Western India',
      costIndex: 2,
      popularityScore: 85,
      bannerImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      description: 'Gujarat\'s sole hill station in the Dang forest region, known for lake ropeways, Gira waterfalls, and tribal art.',
      isTopRegional: true,
    },

    // GOA (4 Cities)
    {
      id: 'north-goa',
      name: 'North Goa (Calangute/Baga/Anjuna)',
      state: 'Goa',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 99,
      bannerImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
      description: 'Famous for bustling beaches, water sports, vibrant shacks, night markets, and Aguada Fort cliff views.',
      isTopRegional: true,
    },
    {
      id: 'south-goa',
      name: 'South Goa (Palolem/Colva)',
      state: 'Goa',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 95,
      bannerImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
      description: 'Peaceful pristine golden sand beaches (Palolem, Agonda, Colva), luxury resorts, and quiet coastal nature escapes.',
      isTopRegional: true,
    },
    {
      id: 'panaji',
      name: 'Old Goa & Panaji',
      state: 'Goa',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 91,
      bannerImageUrl: 'https://images.unsplash.com/photo-1587922546307-776227941871',
      description: 'Goa state capital famous for Portuguese Latin Quarter (Fontainhas), Basilica of Bom Jesus, and Mandovi river cruises.',
      isTopRegional: true,
    },
    {
      id: 'dudhsagar',
      name: 'Dudhsagar Waterfalls',
      state: 'Goa',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 93,
      bannerImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
      description: '4-tiered 310m high spectacular waterfall on the Mandovi River inside Bhagwan Mahavir Wildlife Sanctuary.',
      isTopRegional: true,
    },

    // MAHARASHTRA (6 Cities)
    {
      id: 'mumbai',
      name: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      region: 'Western India',
      costIndex: 5,
      popularityScore: 99,
      bannerImageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
      description: 'The City of Dreams, featuring Gateway of India, Marine Drive, Victorian Gothic architecture, and legendary street food.',
      isTopRegional: true,
    },
    {
      id: 'pune',
      name: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 90,
      bannerImageUrl: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d',
      description: 'The Oxford of the East, rich Maratha history with Shaniwar Wada, Aga Khan Palace, and energetic tech café culture.',
      isTopRegional: true,
    },
    {
      id: 'lonavala',
      name: 'Lonavala-Khandala',
      state: 'Maharashtra',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 93,
      bannerImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      description: 'Sahyadri hill station retreat blessed with green valleys, Bhushi Dam waterfalls, Tiger Point cliffs, and chikki sweets.',
      isTopRegional: true,
    },
    {
      id: 'mahabaleshwar',
      name: 'Mahabaleshwar-Panchgani',
      state: 'Maharashtra',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 92,
      bannerImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
      description: 'The strawberry capital of India, surrounded by Western Ghats peaks, Venna Lake boating, and panoramic view points.',
      isTopRegional: true,
    },
    {
      id: 'chhatrapati-sambhajinagar',
      name: 'Chhatrapati Sambhajinagar (Ajanta-Ellora)',
      state: 'Maharashtra',
      country: 'India',
      region: 'Western India',
      costIndex: 2,
      popularityScore: 95,
      bannerImageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e423b971',
      description: 'Gateway to ancient UNESCO World Heritage Ajanta & Ellora Caves, Kailasa Temple monolith, and Daulatabad Fort.',
      isTopRegional: true,
    },
    {
      id: 'alibaug',
      name: 'Alibaug',
      state: 'Maharashtra',
      country: 'India',
      region: 'Western India',
      costIndex: 3,
      popularityScore: 87,
      bannerImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      description: 'Coastal weekend getaway near Mumbai, known for Kolaba sea fort, quiet beaches, and fresh Konkani seafood.',
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
  console.log(`Seeded ${citiesData.length} cities across Gujarat, Goa & Maharashtra.`);

  // ---------------------------------------------------------
  // 2. SEED 50+ CURATED ACTIVITIES WITH REALISTIC INR COSTS
  // ---------------------------------------------------------
  const activitiesData = [
    // GUJARAT - AHMEDABAD
    {
      id: 'act-ahm-1',
      cityId: 'ahmedabad',
      title: 'Sabarmati Ashram & Museum Walk',
      description: 'Peaceful tour of Mahatma Gandhi\'s historic residence on the banks of Sabarmati River.',
      type: 'Sightseeing',
      estimatedCost: 100.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a',
    },
    {
      id: 'act-ahm-2',
      cityId: 'ahmedabad',
      title: 'Adalaj Stepwell Architectural Exploration',
      description: '5-story deep 15th-century Indo-Islamic Solanki style intricately carved stepwell.',
      type: 'Heritage',
      estimatedCost: 50.0,
      estimatedDuration: '1.5 hours',
      durationHours: 1.5,
      popularityScore: 95,
    },
    {
      id: 'act-ahm-3',
      cityId: 'ahmedabad',
      title: 'Manek Chowk Midnight Street Food Fest',
      description: 'Taste iconic Gwalior Dosa, Pineapple Sandwich, and Kulfi at the famous night food market.',
      type: 'Food',
      estimatedCost: 350.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 97,
    },
    {
      id: 'act-ahm-4',
      cityId: 'ahmedabad',
      title: 'Heritage Walk through Old City Pols',
      description: 'Guided morning walk through wooden havelis, secret passages, and bird towers in historic pols.',
      type: 'Heritage',
      estimatedCost: 200.0,
      estimatedDuration: '2.5 hours',
      durationHours: 2.5,
      popularityScore: 93,
    },

    // GUJARAT - KUTCH
    {
      id: 'act-kut-1',
      cityId: 'kutch',
      title: 'Full Moon Night Walk at White Rann Salt Desert',
      description: 'Experience the magical glowing white salt desert horizon under a crisp moonlit sky.',
      type: 'Nature',
      estimatedCost: 500.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 99,
    },
    {
      id: 'act-kut-2',
      cityId: 'kutch',
      title: 'Bhujodi Village Handloom & Bandhani Craft Tour',
      description: 'Interact with master Kutchi weavers, Rogan art painters, and Ajrakh block printers.',
      type: 'Heritage',
      estimatedCost: 300.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 92,
    },
    {
      id: 'act-kut-3',
      cityId: 'kutch',
      title: 'Kala Dungar Sunset & Dattatreya Temple View',
      description: 'Panoramic view of the Great Rann of Kutch from the highest point in Kutch.',
      type: 'Sightseeing',
      estimatedCost: 150.0,
      estimatedDuration: '2.5 hours',
      durationHours: 2.5,
      popularityScore: 94,
    },

    // GUJARAT - GIR
    {
      id: 'act-gir-1',
      cityId: 'gir',
      title: 'Gir Forest Open Jeep Safari for Asiatic Lions',
      description: 'Thrilling morning open-top 4x4 safari through core lion territory in Sasan Gir.',
      type: 'Adventure',
      estimatedCost: 2500.0,
      estimatedDuration: '3.5 hours',
      durationHours: 3.5,
      popularityScore: 99,
    },
    {
      id: 'act-gir-2',
      cityId: 'gir',
      title: 'Devalia Safari Park Crocodile & Leopard Tour',
      description: 'Fenced safari park tour witnessing leopards, spotted deer, and mugger crocodiles.',
      type: 'Nature',
      estimatedCost: 600.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 90,
    },

    // GUJARAT - VADODARA
    {
      id: 'act-vad-1',
      cityId: 'vadodara',
      title: 'Laxmi Vilas Palace Royal Heritage Tour',
      description: '4 times larger than Buckingham Palace, magnificent Indo-Saracenic royal residence of the Gaekwads.',
      type: 'Heritage',
      estimatedCost: 400.0,
      estimatedDuration: '2.5 hours',
      durationHours: 2.5,
      popularityScore: 96,
    },
    {
      id: 'act-vad-2',
      cityId: 'vadodara',
      title: 'Statue of Unity Day Excursion & Light Show',
      description: 'Visit the world\'s tallest statue (182m) with viewing gallery deck and evening laser show.',
      type: 'Sightseeing',
      estimatedCost: 1200.0,
      estimatedDuration: '8 hours',
      durationHours: 8.0,
      popularityScore: 98,
    },

    // GUJARAT - DWARKA
    {
      id: 'act-dwa-1',
      cityId: 'dwarka',
      title: 'Dwarkadhish Temple Darshan & Evening Aarti',
      description: '5-story ancient temple dedicated to Lord Krishna situated on the banks of Gomti River.',
      type: 'Heritage',
      estimatedCost: 100.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 97,
    },
    {
      id: 'act-dwa-2',
      cityId: 'dwarka',
      title: 'Beyt Dwarka Boat Ride & Dolphin Spotting',
      description: 'Scenic ferry boat ride across Okha port to Lord Krishna\'s legendary island residence.',
      type: 'Adventure',
      estimatedCost: 250.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 91,
    },

    // GUJARAT - SAPUTARA
    {
      id: 'act-sap-1',
      cityId: 'saputara',
      title: 'Saputara Lake Boating & Cable Car Ropeway',
      description: 'Serene pedal boating on Saputara Lake followed by sunset cable car ride over Dang forests.',
      type: 'Nature',
      estimatedCost: 200.0,
      estimatedDuration: '2.5 hours',
      durationHours: 2.5,
      popularityScore: 89,
    },
    {
      id: 'act-sap-2',
      cityId: 'saputara',
      title: 'Gira Waterfalls Monsoon Jungle Trek',
      description: '30m drop waterfall originating from Kapri tributary inside dense tribal woods.',
      type: 'Adventure',
      estimatedCost: 150.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 88,
    },

    // GOA - NORTH GOA
    {
      id: 'act-ngo-1',
      cityId: 'north-goa',
      title: 'Baga & Calangute Beach Watersports Combo',
      description: 'Parasailing, Jet Skiing, Banana Boat Ride, and Bumper Boat adventures in North Goa.',
      type: 'Adventure',
      estimatedCost: 1800.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 98,
    },
    {
      id: 'act-ngo-2',
      cityId: 'north-goa',
      title: 'Aguada Fort Sunset & Lighthouse Tour',
      description: '17th-century Portuguese fortress overlooking the Arabian Sea and Sinquerim Beach.',
      type: 'Sightseeing',
      estimatedCost: 100.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 96,
    },
    {
      id: 'act-ngo-3',
      cityId: 'north-goa',
      title: 'Anjuna Flea Market & Live Acoustic Beach Shack',
      description: 'Explore boho clothes, silver jewelry, handmade artifacts, and enjoy fresh sea bass fish curry.',
      type: 'Food',
      estimatedCost: 600.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 93,
    },
    {
      id: 'act-ngo-4',
      cityId: 'north-goa',
      title: 'Chapora Fort Cliff View & Sunset Point',
      description: 'Famous "Dil Chahta Hai" fort offering panoramic views of Vagator Beach and Chapora river.',
      type: 'Sightseeing',
      estimatedCost: 50.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 95,
    },

    // GOA - SOUTH GOA
    {
      id: 'act-sgo-1',
      cityId: 'south-goa',
      title: 'Palolem Beach Sunset & Silent Noise Party',
      description: 'Crescent-shaped serene beach with coconut palms, kayaking to Butterfly Beach, and headphone party.',
      type: 'Beach',
      estimatedCost: 750.0,
      estimatedDuration: '4 hours',
      durationHours: 4.0,
      popularityScore: 97,
    },
    {
      id: 'act-sgo-2',
      cityId: 'south-goa',
      title: 'Colva Beach Speedboat & Kayaking',
      description: 'Golden sand coastline with thrill water sports and peaceful sunset beach shacks.',
      type: 'Adventure',
      estimatedCost: 900.0,
      estimatedDuration: '2.5 hours',
      durationHours: 2.5,
      popularityScore: 91,
    },

    // GOA - PANAJI & OLD GOA
    {
      id: 'act-pan-1',
      cityId: 'panaji',
      title: 'Fontainhas Portuguese Latin Quarter Walking Tour',
      description: 'Wander through colorful pastel-hued Portuguese villas, wooden balconies, and art galleries.',
      type: 'Heritage',
      estimatedCost: 350.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 96,
    },
    {
      id: 'act-pan-2',
      cityId: 'panaji',
      title: 'Basilica of Bom Jesus & Se Cathedral Heritage Walk',
      description: 'UNESCO World Heritage 16th-century Portuguese church holding the mortal remains of St. Francis Xavier.',
      type: 'Heritage',
      estimatedCost: 100.0,
      estimatedDuration: '2.5 hours',
      durationHours: 2.5,
      popularityScore: 97,
    },
    {
      id: 'act-pan-3',
      cityId: 'panaji',
      title: 'Mandovi River Sunset Cruise with Folk Dance',
      description: '1-hour evening catamaran cruise with live Goan Dekhnni performance and DJ dance deck.',
      type: 'Sightseeing',
      estimatedCost: 500.0,
      estimatedDuration: '1.5 hours',
      durationHours: 1.5,
      popularityScore: 94,
    },

    // GOA - DUDHSAGAR
    {
      id: 'act-dud-1',
      cityId: 'dudhsagar',
      title: 'Dudhsagar Waterfall Jungle Jeep Safari',
      description: '4-tiered 310m milky waterfall jungle safari followed by authentic Goan spice plantation buffet.',
      type: 'Adventure',
      estimatedCost: 2200.0,
      estimatedDuration: '7 hours',
      durationHours: 7.0,
      popularityScore: 99,
    },

    // MAHARASHTRA - MUMBAI
    {
      id: 'act-mum-1',
      cityId: 'mumbai',
      title: 'Gateway of India & Ferry to Elephanta Caves',
      description: 'Iconic Mumbai landmark visit followed by a 1-hour Arabian Sea ferry to 6th-century rock-cut Shiva caves.',
      type: 'Heritage',
      estimatedCost: 350.0,
      estimatedDuration: '5 hours',
      durationHours: 5.0,
      popularityScore: 99,
    },
    {
      id: 'act-mum-2',
      cityId: 'mumbai',
      title: 'Marine Drive Evening Queen\'s Necklace Promenade',
      description: 'Stroll along C-shaped coastal promenade, watch sunset over Malabar Hill, and enjoy Chowpatty Pav Bhaji.',
      type: 'Food',
      estimatedCost: 300.0,
      estimatedDuration: '2.5 hours',
      durationHours: 2.5,
      popularityScore: 98,
    },
    {
      id: 'act-mum-3',
      cityId: 'mumbai',
      title: 'Bandra Street Art & Bollywood Celebrity Homes Trail',
      description: 'Guided bicycle or walk tour through Pali Hill, Bandra Fort, and Carter Road sea breeze spots.',
      type: 'Sightseeing',
      estimatedCost: 400.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 92,
    },
    {
      id: 'act-mum-4',
      cityId: 'mumbai',
      title: 'Chhatrapati Shivaji Maharaj Terminus (CSMT) Heritage Tour',
      description: 'Victorian Gothic UNESCO World Heritage railway station built in 1887.',
      type: 'Heritage',
      estimatedCost: 150.0,
      estimatedDuration: '1.5 hours',
      durationHours: 1.5,
      popularityScore: 94,
    },

    // MAHARASHTRA - PUNE
    {
      id: 'act-pun-1',
      cityId: 'pune',
      title: 'Shaniwar Wada Palace Citadel Historical Walk',
      description: '18th-century seat of the Peshwa rulers of the Maratha Empire known for massive teakwood Delhi Gate.',
      type: 'Heritage',
      estimatedCost: 50.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 93,
    },
    {
      id: 'act-pun-2',
      cityId: 'pune',
      title: 'FC Road Shopping & Legendary Vaishali Bun Maska',
      description: 'Experience Pune\'s student vibe, street shopping, and South Indian filter coffee at Vaishali/Rupali.',
      type: 'Food',
      estimatedCost: 300.0,
      estimatedDuration: '2.5 hours',
      durationHours: 2.5,
      popularityScore: 95,
    },
    {
      id: 'act-pun-3',
      cityId: 'pune',
      title: 'Aga Khan Palace & Gandhi Memorial',
      description: 'Italian arches and spacious lawns where Mahatma Gandhi was detained during Quit India Movement.',
      type: 'Heritage',
      estimatedCost: 100.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 91,
    },

    // MAHARASHTRA - LONAVALA
    {
      id: 'act-lon-1',
      cityId: 'lonavala',
      title: 'Tiger Point Sunset Cliff View & Hot Corn Bhajji',
      description: '800m sheer drop cliff view overlooking Kurvande valley mist, enjoying hot tea and crispy fritters.',
      type: 'Nature',
      estimatedCost: 200.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 96,
    },
    {
      id: 'act-lon-2',
      cityId: 'lonavala',
      title: 'Karla & Bhaja Ancient Buddhist Caves Trek',
      description: '2nd-century BC rock-cut Buddhist chaitya halls and monastery stupas carved in Western Ghats cliffs.',
      type: 'Heritage',
      estimatedCost: 150.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 91,
    },
    {
      id: 'act-lon-3',
      cityId: 'lonavala',
      title: 'Bhushi Dam & Pawna Lake Camping',
      description: 'Overflowing dam steps in monsoon and lakeside camping with campfire in winter.',
      type: 'Adventure',
      estimatedCost: 1500.0,
      estimatedDuration: '5 hours',
      durationHours: 5.0,
      popularityScore: 94,
    },

    // MAHARASHTRA - MAHABALESHWAR
    {
      id: 'act-mah-1',
      cityId: 'mahabaleshwar',
      title: 'Mapro Garden Fresh Strawberry Farm & Dessert Feast',
      description: 'Indulge in fresh strawberry with cream, woodfired pizza, and strawberry farm picking.',
      type: 'Food',
      estimatedCost: 450.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 97,
    },
    {
      id: 'act-mah-2',
      cityId: 'mahabaleshwar',
      title: 'Arthur\'s Seat & Elphinstone Point Sahyadri View',
      description: 'Queen of all points offering breathtaking views of Savitri River valley and Pratapgad Fort.',
      type: 'Nature',
      estimatedCost: 100.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 94,
    },
    {
      id: 'act-mah-3',
      cityId: 'mahabaleshwar',
      title: 'Venna Lake Boating & Horse Riding',
      description: 'Scenic row boating surrounded by pine trees and pony rides around lake market.',
      type: 'Sightseeing',
      estimatedCost: 350.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 92,
    },

    // MAHARASHTRA - CHHATRAPATI SAMBHAJINAGAR
    {
      id: 'act-csn-1',
      cityId: 'chhatrapati-sambhajinagar',
      title: 'Ellora Caves Cave 16 Kailasa Temple Monolith',
      description: 'World\'s largest single rock-cut monolithic structure excavated top-down out of basalt cliff.',
      type: 'Heritage',
      estimatedCost: 100.0,
      estimatedDuration: '4 hours',
      durationHours: 4.0,
      popularityScore: 99,
    },
    {
      id: 'act-csn-2',
      cityId: 'chhatrapati-sambhajinagar',
      title: 'Ajanta Caves Ancient Buddhist Mural Paintings',
      description: '30 rock-cut cave monuments dating from 2nd century BCE depicting famous Jataka tales wall frescoes.',
      type: 'Heritage',
      estimatedCost: 100.0,
      estimatedDuration: '6 hours',
      durationHours: 6.0,
      popularityScore: 98,
    },
    {
      id: 'act-csn-3',
      cityId: 'chhatrapati-sambhajinagar',
      title: 'Daulatabad Fort Hilltop Climb & Dark Passage (Andhari)',
      description: 'Impenetrable medieval fortress built on a 200m high conical hill featuring maze trap passages.',
      type: 'Adventure',
      estimatedCost: 150.0,
      estimatedDuration: '3.5 hours',
      durationHours: 3.5,
      popularityScore: 95,
    },

    // MAHARASHTRA - ALIBAUG
    {
      id: 'act-ali-1',
      cityId: 'alibaug',
      title: 'Kolaba Sea Fort Low Tide Walk & Watersports',
      description: '17th-century naval fort situated inside the sea, accessible by walking on seabed during low tide.',
      type: 'Adventure',
      estimatedCost: 200.0,
      estimatedDuration: '3 hours',
      durationHours: 3.0,
      popularityScore: 92,
    },
    {
      id: 'act-ali-2',
      cityId: 'alibaug',
      title: 'Varnam Beach Konkani Seafood Feast',
      description: 'Fresh surmai fry, prawns masala, and sol kadhi at beachside Konkani shacks.',
      type: 'Food',
      estimatedCost: 800.0,
      estimatedDuration: '2 hours',
      durationHours: 2.0,
      popularityScore: 90,
    },
  ];

  for (const act of activitiesData) {
    await prisma.activity.upsert({
      where: { id: act.id },
      update: act,
      create: act,
    });
  }
  console.log(`Seeded ${activitiesData.length} activities across Gujarat, Goa & Maharashtra.`);

  // ---------------------------------------------------------
  // 3. SEED 6 PRE-BUILT TRIP TEMPLATES WITH JSON DAY BREAKDOWNS
  // ---------------------------------------------------------
  const tripTemplatesData = [
    {
      id: 'tpl-gujarat-royal-4d',
      state: 'Gujarat',
      cityId: 'kutch',
      title: '4-Day Royal Gujarat & White Desert Safari',
      description: 'Comprehensive 4-day tour covering Sabarmati Ashram in Ahmedabad, White Rann salt desert, and Kala Dungar.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
      durationDays: 4,
      estimatedBudget: 12500.0,
      templateData: {
        sections: [
          {
            title: 'Section 1: Ahmedabad Heritage',
            cityId: 'ahmedabad',
            durationDays: 1,
            budget: 2500.0,
            items: [
              { title: 'Sabarmati Ashram & Museum Walk', type: 'ACTIVITY', cost: 100.0, startTime: '09:30 AM' },
              { title: 'Adalaj Stepwell Exploration', type: 'ACTIVITY', cost: 50.0, startTime: '02:00 PM' },
              { title: 'Manek Chowk Street Food Feast', type: 'MEAL', cost: 350.0, startTime: '09:00 PM' },
            ],
          },
          {
            title: 'Section 2: Great Rann of Kutch Magic',
            cityId: 'kutch',
            durationDays: 3,
            budget: 10000.0,
            items: [
              { title: 'Bhujodi Village Handloom Tour', type: 'ACTIVITY', cost: 300.0, startTime: '11:00 AM' },
              { title: 'Kala Dungar Sunset View', type: 'ACTIVITY', cost: 150.0, startTime: '05:00 PM' },
              { title: 'Full Moon Night Walk at White Rann', type: 'ACTIVITY', cost: 500.0, startTime: '08:30 PM' },
            ],
          },
        ],
      },
    },
    {
      id: 'tpl-goa-coastal-3d',
      state: 'Goa',
      cityId: 'north-goa',
      title: '3-Day Goa Coastal Sun, Beach & Heritage Tour',
      description: 'Experience the best of North and South Goa: watersports, Portuguese Latin Quarter, and Dudhsagar waterfall.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
      durationDays: 3,
      estimatedBudget: 9500.0,
      templateData: {
        sections: [
          {
            title: 'Section 1: North Goa Beaches & Forts',
            cityId: 'north-goa',
            durationDays: 2,
            budget: 5000.0,
            items: [
              { title: 'Baga Beach Watersports Combo', type: 'ACTIVITY', cost: 1800.0, startTime: '10:00 AM' },
              { title: 'Aguada Fort Sunset View', type: 'ACTIVITY', cost: 100.0, startTime: '05:00 PM' },
            ],
          },
          {
            title: 'Section 2: Panaji Latin Quarter & Dudhsagar',
            cityId: 'panaji',
            durationDays: 1,
            budget: 4500.0,
            items: [
              { title: 'Fontainhas Portuguese Walk', type: 'ACTIVITY', cost: 350.0, startTime: '09:00 AM' },
              { title: 'Mandovi River Sunset Cruise', type: 'ACTIVITY', cost: 500.0, startTime: '06:00 PM' },
            ],
          },
        ],
      },
    },
    {
      id: 'tpl-maharashtra-sahyadri-3d',
      state: 'Maharashtra',
      cityId: 'lonavala',
      title: '3-Day Sahyadri Gateway: Lonavala & Mahabaleshwar',
      description: 'Monsoon and winter hill station getaway covering Tiger Point cliffs, Mapro strawberry gardens, and Arthur\'s seat.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      durationDays: 3,
      estimatedBudget: 8000.0,
      templateData: {
        sections: [
          {
            title: 'Section 1: Lonavala Valleys & Caves',
            cityId: 'lonavala',
            durationDays: 1,
            budget: 3500.0,
            items: [
              { title: 'Tiger Point Sunset Cliff View', type: 'ACTIVITY', cost: 200.0, startTime: '04:30 PM' },
              { title: 'Karla Caves Rock-Cut Trek', type: 'ACTIVITY', cost: 150.0, startTime: '10:00 AM' },
            ],
          },
          {
            title: 'Section 2: Mahabaleshwar Strawberry Trails',
            cityId: 'mahabaleshwar',
            durationDays: 2,
            budget: 4500.0,
            items: [
              { title: 'Mapro Garden Strawberry Dessert Feast', type: 'MEAL', cost: 450.0, startTime: '01:00 PM' },
              { title: 'Arthur\'s Seat Valley Point', type: 'ACTIVITY', cost: 100.0, startTime: '04:00 PM' },
            ],
          },
        ],
      },
    },
    {
      id: 'tpl-mumbai-heritage-2d',
      state: 'Maharashtra',
      cityId: 'mumbai',
      title: '2-Day Mumbai Heritage & Street Food Fiesta',
      description: 'Gateway of India, Elephanta Caves, Marine Drive Sunset, Chowpatty Pav Bhaji, and Bandra celeb walk.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
      durationDays: 2,
      estimatedBudget: 5500.0,
      templateData: {
        sections: [
          {
            title: 'Section 1: South Mumbai Classics',
            cityId: 'mumbai',
            durationDays: 1,
            budget: 3000.0,
            items: [
              { title: 'Gateway of India & Elephanta Caves', type: 'ACTIVITY', cost: 350.0, startTime: '09:00 AM' },
              { title: 'Marine Drive Queen\'s Necklace', type: 'MEAL', cost: 300.0, startTime: '06:30 PM' },
            ],
          },
          {
            title: 'Section 2: Bandra Suburbs & Art',
            cityId: 'mumbai',
            durationDays: 1,
            budget: 2500.0,
            items: [
              { title: 'Bandra Street Art & Celeb Homes', type: 'ACTIVITY', cost: 400.0, startTime: '10:00 AM' },
            ],
          },
        ],
      },
    },
    {
      id: 'tpl-ajanta-ellora-3d',
      state: 'Maharashtra',
      cityId: 'chhatrapati-sambhajinagar',
      title: '3-Day Ajanta & Ellora Caves UNESCO Pilgrimage',
      description: 'Monolithic Kailasa Temple at Ellora, 2000-year old Ajanta frescoes, and Daulatabad hill fort climb.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1600100397608-f010e423b971',
      durationDays: 3,
      estimatedBudget: 7000.0,
      templateData: {
        sections: [
          {
            title: 'Section 1: Ellora Monolith & Daulatabad Fort',
            cityId: 'chhatrapati-sambhajinagar',
            durationDays: 1,
            budget: 3500.0,
            items: [
              { title: 'Ellora Kailasa Temple Monolith', type: 'ACTIVITY', cost: 100.0, startTime: '09:00 AM' },
              { title: 'Daulatabad Fort Hilltop Climb', type: 'ACTIVITY', cost: 150.0, startTime: '02:00 PM' },
            ],
          },
          {
            title: 'Section 2: Ajanta Frescoes & Murals',
            cityId: 'chhatrapati-sambhajinagar',
            durationDays: 2,
            budget: 3500.0,
            items: [
              { title: 'Ajanta Caves Buddhist Murals', type: 'ACTIVITY', cost: 100.0, startTime: '09:30 AM' },
            ],
          },
        ],
      },
    },
    {
      id: 'tpl-gir-dwarka-4d',
      state: 'Gujarat',
      cityId: 'gir',
      title: '4-Day Gir Lion Safari & Dwarka Sacred Coastal Tour',
      description: 'Thrilling open jeep lion safari in Sasan Gir followed by holy temple darshan and Beyt Dwarka boat ride.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0',
      durationDays: 4,
      estimatedBudget: 14000.0,
      templateData: {
        sections: [
          {
            title: 'Section 1: Sasan Gir Lion Safari',
            cityId: 'gir',
            durationDays: 2,
            budget: 7000.0,
            items: [
              { title: 'Gir Forest Open Jeep Safari', type: 'ACTIVITY', cost: 2500.0, startTime: '06:00 AM' },
            ],
          },
          {
            title: 'Section 2: Dwarka Coastal Pilgrimage',
            cityId: 'dwarka',
            durationDays: 2,
            budget: 7000.0,
            items: [
              { title: 'Dwarkadhish Temple Darshan', type: 'ACTIVITY', cost: 100.0, startTime: '09:00 AM' },
              { title: 'Beyt Dwarka Boat Ride', type: 'ACTIVITY', cost: 250.0, startTime: '02:30 PM' },
            ],
          },
        ],
      },
    },
  ];

  for (const tpl of tripTemplatesData) {
    await prisma.tripTemplate.upsert({
      where: { id: tpl.id },
      update: tpl,
      create: tpl,
    });
  }
  console.log(`Seeded ${tripTemplatesData.length} multi-day trip templates.`);

  // ---------------------------------------------------------
  // 4. SEED 10 REALISTIC INDIAN USERS
  // ---------------------------------------------------------
  const defaultPassword = await bcrypt.hash('Password123!', 10);

  const usersList = [
    {
      id: 'usr-1-aarav',
      firstName: 'Aarav',
      lastName: 'Patel',
      email: 'aarav.patel@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543210',
      city: 'Ahmedabad',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    {
      id: 'usr-2-priya',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543211',
      city: 'Mumbai',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    {
      id: 'usr-3-rohan',
      firstName: 'Rohan',
      lastName: 'Deshmukh',
      email: 'rohan.deshmukh@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543212',
      city: 'Pune',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    {
      id: 'usr-4-ananya',
      firstName: 'Ananya',
      lastName: 'Naik',
      email: 'ananya.naik@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543213',
      city: 'Panaji',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
    {
      id: 'usr-5-vikram',
      firstName: 'Vikram',
      lastName: 'Shah',
      email: 'vikram.shah@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543214',
      city: 'Vadodara',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61',
    },
    {
      id: 'usr-6-sneha',
      firstName: 'Sneha',
      lastName: 'Kulkarni',
      email: 'sneha.kulkarni@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543215',
      city: 'Nashik',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    },
    {
      id: 'usr-7-rahul',
      firstName: 'Rahul',
      lastName: 'Mehta',
      email: 'rahul.mehta@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543216',
      city: 'Bhuj',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
    },
    {
      id: 'usr-8-pooja',
      firstName: 'Pooja',
      lastName: 'Fernandez',
      email: 'pooja.fernandez@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543217',
      city: 'South Goa',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    },
    {
      id: 'usr-9-siddharth',
      firstName: 'Siddharth',
      lastName: 'Joshi',
      email: 'siddharth.joshi@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543218',
      city: 'Lonavala',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea',
    },
    {
      id: 'usr-10-kavya',
      firstName: 'Kavya',
      lastName: 'Iyer',
      email: 'kavya.iyer@globetrotter.com',
      password: defaultPassword,
      phoneNumber: '+919876543219',
      city: 'Mumbai',
      country: 'India',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    },
  ];

  for (const usr of usersList) {
    await prisma.user.upsert({
      where: { email: usr.email },
      update: usr,
      create: usr,
    });
  }
  console.log(`Seeded ${usersList.length} realistic users.`);

  // Clear existing trips & posts for clean seed state
  await prisma.trip.deleteMany({});
  await prisma.communityPost.deleteMany({});

  // ---------------------------------------------------------
  // 5. SEED 20+ DETAILED USER TRIPS (ONGOING, UPCOMING, COMPLETED)
  // ---------------------------------------------------------
  const now = new Date();

  // Aarav Patel's Trips
  const trip1 = await prisma.trip.create({
    data: {
      userId: 'usr-1-aarav',
      name: 'Rann of Kutch & Heritage Trail',
      description: 'Exploring white desert salt flats and handicrafts in Kutch.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
      startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: 'ONGOING',
      totalBudget: 12000.0,
      isPublic: true,
      shareableSlug: 'aarav-rann-of-kutch-2026',
      sections: {
        create: [
          {
            sectionTitle: 'White Desert Night & Handicrafts',
            cityId: 'kutch',
            startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
            budgetAllocated: 12000.0,
            orderIndex: 1,
            items: {
              create: [
                { title: 'White Rann Full Moon Walk', type: 'ACTIVITY', cost: 500.0, startTime: '08:30 PM', orderIndex: 1 },
                { title: 'Bhujodi Village Weaving Tour', type: 'ACTIVITY', cost: 300.0, startTime: '11:00 AM', orderIndex: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      userId: 'usr-1-aarav',
      name: 'Gir Lion Wildlife Safari',
      description: 'Asiatic lion sighting in Sasan Gir forest.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0',
      startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
      totalBudget: 9000.0,
      isPublic: false,
      sections: {
        create: [
          {
            sectionTitle: 'Gir Safari Core Zone',
            cityId: 'gir',
            startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
            budgetAllocated: 9000.0,
            orderIndex: 1,
            items: {
              create: [
                { title: 'Gir Open Jeep Safari', type: 'ACTIVITY', cost: 2500.0, startTime: '06:00 AM', orderIndex: 1 },
              ],
            },
          },
        ],
      },
    },
  });

  // Priya Sharma's Trips
  const trip3 = await prisma.trip.create({
    data: {
      userId: 'usr-2-priya',
      name: 'Goa Coastal Sun & Latin Quarter',
      description: 'Weekend beach escape to North Goa and Panaji.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
      startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
      totalBudget: 15000.0,
      isPublic: true,
      shareableSlug: 'priya-goa-sun-2026',
      sections: {
        create: [
          {
            sectionTitle: 'Baga Watersports & Fontainhas Walk',
            cityId: 'north-goa',
            startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
            budgetAllocated: 15000.0,
            orderIndex: 1,
            items: {
              create: [
                { title: 'Baga Beach Watersports Combo', type: 'ACTIVITY', cost: 1800.0, startTime: '10:00 AM', orderIndex: 1 },
                { title: 'Fontainhas Portuguese Walk', type: 'ACTIVITY', cost: 350.0, startTime: '04:00 PM', orderIndex: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  // Rohan Deshmukh's Trips
  const trip4 = await prisma.trip.create({
    data: {
      userId: 'usr-3-rohan',
      name: 'Ajanta & Ellora UNESCO Pilgrimage',
      description: 'Historical tour of ancient rock-cut cave temples in Maharashtra.',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1600100397608-f010e423b971',
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-01-13'),
      status: 'COMPLETED',
      totalBudget: 7500.0,
      isPublic: true,
      shareableSlug: 'rohan-ajanta-ellora-2026',
      sections: {
        create: [
          {
            sectionTitle: 'Kailasa Monolith & Ajanta Frescoes',
            cityId: 'chhatrapati-sambhajinagar',
            startDate: new Date('2026-01-10'),
            endDate: new Date('2026-01-13'),
            budgetAllocated: 7500.0,
            orderIndex: 1,
            items: {
              create: [
                { title: 'Kailasa Temple Monolith Exploration', type: 'ACTIVITY', cost: 100.0, startTime: '09:00 AM', orderIndex: 1 },
                { title: 'Ajanta Caves Murals Tour', type: 'ACTIVITY', cost: 100.0, startTime: '10:00 AM', orderIndex: 2 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded sample user trips.');

  // ---------------------------------------------------------
  // 6. SEED 10+ COMMUNITY POSTS WITH LIKES AND COMMENTS
  // ---------------------------------------------------------
  const post1 = await prisma.communityPost.create({
    data: {
      userId: 'usr-1-aarav',
      tripId: trip1.id,
      cityId: 'kutch',
      title: 'Full Moon Night at White Rann of Kutch: Pure Magic!',
      content: 'Walking across the salt flats under the full moon is an unforgettable experience! Pro tip: Visit Bhujodi village nearby for authentic Kutchi wool shawls.',
      category: 'Adventure',
      images: [
        'https://images.unsplash.com/photo-1570168007204-dfb528c6958f',
      ],
      likesCount: 234,
      commentsCount: 2,
      comments: {
        create: [
          { userId: 'usr-2-priya', content: 'Stunning photos! Did you book Rann Utsav tents?' },
          { userId: 'usr-1-aarav', content: 'Yes, staying at Dhordo tent city is super convenient.' },
        ],
      },
    },
  });

  const post2 = await prisma.communityPost.create({
    data: {
      userId: 'usr-3-rohan',
      tripId: trip4.id,
      cityId: 'chhatrapati-sambhajinagar',
      title: 'Kailasa Temple at Ellora: Mind-blowing Ancient Architecture',
      content: 'Standing in front of Cave 16 in Ellora left me speechless. Carving an entire multi-story temple from top to bottom out of a single mountain 1300 years ago is unbelievable!',
      category: 'Heritage',
      images: [
        'https://images.unsplash.com/photo-1600100397608-f010e423b971',
      ],
      likesCount: 312,
      commentsCount: 1,
      comments: {
        create: [
          { userId: 'usr-6-sneha', content: 'One of India\'s absolute architectural wonders!' },
        ],
      },
    },
  });

  await prisma.postLike.createMany({
    data: [
      { userId: 'usr-2-priya', postId: post1.id },
      { userId: 'usr-3-rohan', postId: post1.id },
      { userId: 'usr-4-ananya', postId: post2.id },
    ],
  });

  // ---------------------------------------------------------
  // 7. SEED USER SAVED CITIES (UserSavedCity)
  // ---------------------------------------------------------
  await prisma.userSavedCity.deleteMany({});
  await prisma.userSavedCity.createMany({
    data: [
      { userId: 'usr-1-aarav', cityId: 'north-goa' },
      { userId: 'usr-1-aarav', cityId: 'mumbai' },
      { userId: 'usr-2-priya', cityId: 'kutch' },
      { userId: 'usr-2-priya', cityId: 'panaji' },
      { userId: 'usr-3-rohan', cityId: 'lonavala' },
      { userId: 'usr-3-rohan', cityId: 'ahmedabad' },
      { userId: 'usr-4-ananya', cityId: 'gir' },
      { userId: 'usr-5-vikram', cityId: 'south-goa' },
    ],
  });
  console.log('Seeded UserSavedCity entries.');

  // ---------------------------------------------------------
  // 8. SEED REFRESH TOKENS (RefreshToken)
  // ---------------------------------------------------------
  await prisma.refreshToken.deleteMany({});
  await prisma.refreshToken.createMany({
    data: [
      {
        userId: 'usr-1-aarav',
        token: 'sample-refresh-token-aarav-1234567890',
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: 'usr-2-priya',
        token: 'sample-refresh-token-priya-1234567890',
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
  });
  console.log('Seeded RefreshToken entries.');

  // ---------------------------------------------------------
  // 9. SEED SECTION TEMPLATES & TEMPLATE ITEMS (SectionTemplate, TemplateItem)
  // ---------------------------------------------------------
  const sectionTemplatesList = [
    {
      id: 'sec-tpl-ahmedabad-1d',
      cityId: 'ahmedabad',
      title: '1-Day Heritage Pols & Street Food Package',
      description: 'Explore Sabarmati Ashram, Adalaj Stepwell, and Manek Chowk night market.',
      durationDays: 1,
      suggestedBudget: 1500.0,
      coverImageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a',
      popularityScore: 95,
      templateItems: {
        create: [
          {
            title: 'Sabarmati Ashram Walk',
            type: 'ACTIVITY',
            activityId: 'act-ahm-1',
            dayOffset: 1,
            startTime: '09:30 AM',
            endTime: '11:30 AM',
            estimatedCost: 100.0,
            orderIndex: 1,
          },
          {
            title: 'Manek Chowk Street Food',
            type: 'MEAL',
            activityId: 'act-ahm-3',
            dayOffset: 1,
            startTime: '09:00 PM',
            endTime: '11:00 PM',
            estimatedCost: 350.0,
            orderIndex: 2,
          },
        ],
      },
    },
    {
      id: 'sec-tpl-northgoa-2d',
      cityId: 'north-goa',
      title: '2-Day North Goa Beach & Fort Blast',
      description: 'Baga watersports, Aguada fort sunset, and Anjuna flea market.',
      durationDays: 2,
      suggestedBudget: 4000.0,
      coverImageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2',
      popularityScore: 98,
      templateItems: {
        create: [
          {
            title: 'Baga Watersports Combo',
            type: 'ACTIVITY',
            activityId: 'act-ngo-1',
            dayOffset: 1,
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            estimatedCost: 1800.0,
            orderIndex: 1,
          },
          {
            title: 'Aguada Fort Sunset',
            type: 'ACTIVITY',
            activityId: 'act-ngo-2',
            dayOffset: 1,
            startTime: '05:00 PM',
            endTime: '07:00 PM',
            estimatedCost: 100.0,
            orderIndex: 2,
          },
        ],
      },
    },
  ];

  for (const stpl of sectionTemplatesList) {
    const { templateItems, ...stplData } = stpl;
    await prisma.sectionTemplate.upsert({
      where: { id: stplData.id },
      update: stplData,
      create: {
        ...stplData,
        templateItems,
      },
    });
  }
  console.log(`Seeded ${sectionTemplatesList.length} section templates.`);

  console.log('Seeding Gujarat, Goa & Maharashtra travel data completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
