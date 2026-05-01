import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ParentSignup from '../pages/ParentSignup'
import DaycareSignup from '../pages/DaycareSignup'
import NannySignup from '../pages/NannySignup'
import TransportSignup from '../pages/TransportSignup'
import RoleSignup from '../pages/RoleSignup'
import ParentDashboard from '../pages/dashboard/ParentDashboard'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import NannyDashboard from '../pages/dashboard/NannyDashboard'
import Children from '../pages/dashboard/nanny/Children'
import ChildDetail from '../pages/dashboard/nanny/ChildDetail'
import Update from '../pages/dashboard/nanny/Update'
import Applications from '../pages/dashboard/nanny/Applications'
import ApplyForWork from '../pages/dashboard/nanny/ApplyForWork'
import Profile from '../pages/dashboard/nanny/Profile'
import Availability from '../pages/dashboard/nanny/Availability'
import Safety from '../pages/dashboard/nanny/Safety'
import ProtectedRoute from '../components/ProtectedRoute'
import RoleRedirect from '../components/RoleRedirect'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/signup/parent" element={<ParentSignup/>} />
      <Route path="/signup/daycare" element={<DaycareSignup/>} />
      <Route path="/signup/nanny" element={<NannySignup/>} />
      <Route path="/signup/admin" element={<RoleSignup role="admin" eyebrow="Admin Signup" title="Create admin access" description="Create an admin account for oversight, approvals, and daily operations." accent="from-slate-700 to-slate-950" extraLabel="Admin Area" extraKey="adminArea" />} />
      <Route path="/signup/marketplace-seller" element={<RoleSignup role="marketplace_seller" eyebrow="Marketplace Seller" title="Start selling in the marketplace" description="Create a seller account for daycare products, supplies, and services." accent="from-amber-400 to-orange-500" extraLabel="Shop Name" extraKey="shopName" />} />
      <Route path="/signup/orphanage-manager" element={<RoleSignup role="orphanage_manager" eyebrow="Orphanage Manager" title="Coordinate adoption support" description="Create an account for orphanage management and adoption-related coordination." accent="from-violet-400 to-fuchsia-500" extraLabel="Organization Name" extraKey="organizationName" />} />
      <Route path="/signup/transport" element={<TransportSignup/>} />

      <Route path="/role-redirect" element={<RoleRedirect/>} />

      <Route path="/dashboard/parent/*" element={<ProtectedRoute roles={["parent"]}><ParentDashboard/></ProtectedRoute>} />
      <Route path="/dashboard/admin/*" element={<ProtectedRoute roles={["admin","daycare"]}><AdminDashboard/></ProtectedRoute>} />
      <Route path="/dashboard/nanny/*" element={<ProtectedRoute roles={["nanny"]}><NannyDashboard/></ProtectedRoute>}>
        <Route path="children" element={<Children/>} />
        <Route path="children/:id" element={<ChildDetail/>} />
        <Route path="update" element={<Update/>} />
        <Route path="applications" element={<Applications/>} />
        <Route path="apply" element={<ApplyForWork/>} />
        <Route path="profile" element={<Profile/>} />
        <Route path="availability" element={<Availability/>} />
        <Route path="safety" element={<Safety/>} />
      </Route>
    </Routes>
  )
}
         <Route path="children/:id" element={<ChildDetail/>} />
         <Route path="update" element={<Update/>} />
         <Route path="applications" element={<Applications/>} />
         <Route path="apply" element={<ApplyForWork/>} />
         <Route path="profile" element={<Profile/>} />
         <Route path="availability" element={<Availability/>} />
         <Route path="safety" element={<Safety/>} />
    </Routes>
  )
}
