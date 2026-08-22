import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md">
      <Header />
      <main className="relative w-full pt-16 pb-24 bg-surface min-h-screen">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
