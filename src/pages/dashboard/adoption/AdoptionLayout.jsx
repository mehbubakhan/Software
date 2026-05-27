import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdoptionTracker from './AdoptionTracker';
import CompatibilityMatch from './CompatibilityMatch';

export default function AdoptionLayout() {
  return (
    <Routes>
      <Route index element={<AdoptionTracker />} />
      <Route path="compatibility" element={<CompatibilityMatch />} />
    </Routes>
  );
}
