import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdoptionDashboard from './adoption/AdoptionDashboard';
import AdoptionDirectory from './adoption/AdoptionDirectory';
import AdoptionChildProfile from './adoption/AdoptionChildProfile';
import AdoptionApplication from './adoption/AdoptionApplication';
import AdoptionSchedule from './adoption/AdoptionSchedule';
import OrphanageDirectory from './adoption/OrphanageDirectory';
import OrphanageProfile from './adoption/OrphanageProfile';
import AdoptionTracker from './adoption/AdoptionTracker';

export default function AdoptionLayout() {
  return (
    <Routes>
      <Route path="/" element={<AdoptionDashboard />} />
      <Route path="children" element={<AdoptionDirectory />} />
      <Route path="children/:id" element={<AdoptionChildProfile />} />
      <Route path="children/:id/apply" element={<AdoptionApplication />} />
      <Route path="children/:id/schedule" element={<AdoptionSchedule />} />
      <Route path="orphanages" element={<OrphanageDirectory />} />
      <Route path="orphanages/:id" element={<OrphanageProfile />} />
      <Route path="applications" element={<AdoptionTracker />} />
    </Routes>
  );
}

