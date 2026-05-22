import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DaycareDirectory from './daycare/DaycareDirectory'
import DaycareProfile from './daycare/DaycareProfile'
import DaycareApply from './daycare/DaycareApply'
import DaycarePayment from './daycare/DaycarePayment'
import DaycareCCTV from './daycare/DaycareCCTV'
import DaycareChat from './daycare/DaycareChat'
import ChildDaycareDashboard from './daycare/ChildDaycareDashboard'

export default function DaycareLayout() {
  return (
    <Routes>
      {/* Directory listing */}
      <Route path="/" element={<DaycareDirectory />} />
      
      {/* Enrolled Child Dashboard */}
      <Route path="child/:childId" element={<ChildDaycareDashboard />} />

      {/* Specific Daycare Profile & Actions */}
      <Route path=":id" element={<DaycareProfile />} />
      <Route path=":id/apply" element={<DaycareApply />} />
      <Route path=":id/payment" element={<DaycarePayment />} />
      <Route path=":id/cctv" element={<DaycareCCTV />} />
      <Route path=":id/chat" element={<DaycareChat />} />
    </Routes>
  )
}
