import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-neutral-900 selection:bg-neutral-200 selection:text-neutral-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
