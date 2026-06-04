import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import SEO from '../../../components/SEO';

const daycareSidebarItems = [
  { label: 'Dashboard', path: '/dashboard/daycare', icon: 'svg-dashboard' },
  { label: 'Daycare Profile', path: '/dashboard/daycare/profile', icon: 'svg-settings' },
  { label: 'Programs & Packages', path: '/dashboard/daycare/packages', icon: 'svg-settings' },
  { label: 'Booking Management', path: '/dashboard/daycare/bookings', icon: 'svg-schedule' },
  { label: 'Children Management', path: '/dashboard/daycare/children', icon: 'svg-nanny' },
  { label: 'Staff Management', path: '/dashboard/daycare/staff', icon: 'svg-interviews' },
  { label: 'Transport Management', path: '/dashboard/daycare/transport', icon: 'svg-nanny' },
  { label: 'Payment', path: '/dashboard/daycare/payments', icon: 'svg-job-requests' },
  { label: 'Reviews', path: '/dashboard/daycare/reviews', icon: 'svg-job-requests' },
  { label: 'Messages', path: '/dashboard/daycare/messages', icon: 'svg-messages' },
  { label: 'Daily Reports', path: '/dashboard/daycare/reports', icon: 'svg-notifications' },
  { label: 'Complaints', path: '/dashboard/daycare/complaints', icon: 'svg-notifications' },
  { label: 'Settings', path: '/dashboard/daycare/settings', icon: 'svg-settings' }
];

export default function DaycareLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
      <SEO title="Daycare Portal - Smart Nanny" description="Manage your daycare profile, bookings, children, and staff." />
      <Sidebar items={daycareSidebarItems} variant="daycare-workspace" />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
