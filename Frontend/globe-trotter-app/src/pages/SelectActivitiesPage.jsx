import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import ActivityCard from '../components/select-activities/ActivityCard';
import CategoryFilterPills from '../components/select-activities/CategoryFilterPills';

const MOCK_ACTIVITIES = [
  {
    id: 'jaipur-ballooning',
    cityName: 'Jaipur',
    title: 'Hot Air Ballooning',
    category: 'Adventure',
    duration: '3h',
    rating: 4.9,
    reviewsCount: 120,
    price: 8500,
    image:
      'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jaipur-food-tour',
    cityName: 'Jaipur',
    title: 'Local Food Tour',
    category: 'Food',
    duration: '2.5h',
    rating: 4.8,
    reviewsCount: 85,
    price: 1200,
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'goa-scuba',
    cityName: 'Goa',
    title: 'Scuba Diving',
    category: 'Adventure',
    duration: '4h',
    rating: 4.7,
    reviewsCount: 210,
    price: 3500,
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'goa-heritage-walk',
    cityName: 'Goa',
    title: 'Heritage Walk',
    category: 'Culture',
    duration: '2h',
    rating: 4.6,
    reviewsCount: 95,
    price: 800,
    image:
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mumbai-sunset-cruise',
    cityName: 'Mumbai',
    title: 'Marine Drive Sunset Cruise',
    category: 'Leisure',
    duration: '1.5h',
    rating: 4.9,
    reviewsCount: 310,
    price: 2500,
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
  },
];

export default function SelectActivitiesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedActivityIds, setSelectedActivityIds] = useState(['goa-heritage-walk']);

  const handleToggleActivity = (activityId) => {
    setSelectedActivityIds((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Filter activities by search & category
  const filteredActivities = MOCK_ACTIVITIES.filter((act) => {
    const matchesCategory =
      activeCategory === 'All' || act.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group activities by city
  const cityGroups = filteredActivities.reduce((acc, act) => {
    if (!acc[act.cityName]) {
      acc[act.cityName] = [];
    }
    acc[act.cityName].push(act);
    return acc;
  }, {});

  // Compute live selection totals
  const selectedActivities = MOCK_ACTIVITIES.filter((act) =>
    selectedActivityIds.includes(act.id)
  );
  const totalPrice = selectedActivities.reduce((sum, act) => sum + act.price, 0);

  const handleReviewItinerary = () => {
    navigate('/itinerary-builder', {
      state: { selectedActivities, totalPrice },
    });
  };

  return (
    <div className="min-h-screen bg-surface font-body-md relative">
      <Header />

      <main className="relative w-full pt-20 pb-36 bg-surface min-h-screen">
        <div className="flex flex-col w-full max-w-max-width mx-auto">
          {/* Header Section */}
          <div className="px-margin-mobile pt-2 pb-2">
            <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface mb-2">
              Choose your activities
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Pick experiences for your selected cities.
            </p>
          </div>

          {/* Sticky Search Bar */}
          <div className="px-margin-mobile py-3 sticky top-16 z-30 bg-surface/90 backdrop-blur-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-10 bg-surface-container rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-shadow"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <CategoryFilterPills
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* City Grouped Activities List */}
          <div className="px-margin-mobile flex flex-col gap-8">
            {Object.keys(cityGroups).length > 0 ? (
              Object.entries(cityGroups).map(([cityName, activities]) => (
                <div key={cityName} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      {cityName}
                    </h3>
                    <button className="font-label-md text-label-md text-primary hover:underline cursor-pointer">
                      View map
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {activities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        isSelected={selectedActivityIds.includes(activity.id)}
                        onToggle={handleToggleActivity}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-surface-container rounded-2xl">
                <p className="font-body-md text-on-surface-variant">
                  No activities found for "{searchQuery}" under {activeCategory}.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-40 pb-safe border-t border-outline-variant/20">
        <div className="max-w-max-width mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Selected ({selectedActivityIds.length})
              </span>
              <span className="font-headline-md text-headline-md text-on-surface">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReviewItinerary}
            disabled={selectedActivityIds.length === 0}
            className={`w-full h-14 font-label-md text-label-md rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
              selectedActivityIds.length > 0
                ? 'bg-electric-sky text-on-primary hover:bg-primary'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-60'
            }`}
          >
            Review Itinerary
          </button>
        </div>
      </div>
    </div>
  );
}
