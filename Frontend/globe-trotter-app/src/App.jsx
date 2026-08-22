import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import MyTripsPage from './pages/MyTripsPage';
import SelectCitiesPage from './pages/SelectCitiesPage';
import SelectActivitiesPage from './pages/SelectActivitiesPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout with top header and bottom nav */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="my-trips" element={<MyTripsPage />} />
        </Route>

        {/* Dedicated flow pages with custom headers & action bars */}
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/select-cities" element={<SelectCitiesPage />} />
        <Route path="/search/cities" element={<SelectCitiesPage />} />
        <Route path="/select-activities" element={<SelectActivitiesPage />} />
        <Route path="/search/activities" element={<SelectActivitiesPage />} />
        <Route path="/itinerary-builder" element={<ItineraryBuilderPage />} />
        <Route path="/builder/:tripId" element={<ItineraryBuilderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
