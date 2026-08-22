import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import MyTripsPage from './pages/MyTripsPage';
import SelectCitiesPage from './pages/SelectCitiesPage';
import SelectActivitiesPage from './pages/SelectActivitiesPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import AddStopPage from './pages/AddStopPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Main Layout Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="my-trips" element={<MyTripsPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Dedicated Flow Pages Protected */}
          <Route
            path="/create-trip"
            element={
              <ProtectedRoute>
                <CreateTripPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-cities"
            element={
              <ProtectedRoute>
                <SelectCitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search/cities"
            element={
              <ProtectedRoute>
                <SelectCitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-activities"
            element={
              <ProtectedRoute>
                <SelectActivitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search/activities"
            element={
              <ProtectedRoute>
                <SelectActivitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itinerary-builder"
            element={
              <ProtectedRoute>
                <ItineraryBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder/:tripId"
            element={
              <ProtectedRoute>
                <ItineraryBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-stop"
            element={
              <ProtectedRoute>
                <AddStopPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
