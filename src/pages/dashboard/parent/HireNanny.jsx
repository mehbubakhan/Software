import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NannyLanding from './nanny/NannyLanding'
import IndividualNannies from './nanny/IndividualNannies'
import AgencyNannies from './nanny/AgencyNannies'
import NannyProfile from './nanny/NannyProfile'

export default function HireNanny() {
  return (
    <Routes>
      <Route index element={<NannyLanding />} />
      <Route path="individuals" element={<IndividualNannies />} />
      <Route path="agencies" element={<AgencyNannies />} />
      <Route path=":id" element={<NannyProfile />} />
    </Routes>
  )
}
