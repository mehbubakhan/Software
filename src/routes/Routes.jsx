import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ParentSignup from '../pages/ParentSignup'
import DaycareSignup from '../pages/DaycareSignup'
import NannySignup from '../pages/NannySignup'
import TransportSignup from '../pages/TransportSignup'
import OrphanageManagerSignup from '../pages/OrphanageManagerSignup'
import RoleSignup from '../pages/RoleSignup'
import ParentDashboard from '../pages/dashboard/ParentDashboard'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import AdminOverview from '../pages/dashboard/admin/Overview'
import UserManagement from '../pages/dashboard/admin/UserManagement'
import AdminVerification from '../pages/dashboard/admin/VerificationCenter'
import AdminComplaints from '../pages/dashboard/admin/Complaints'
import AdminPayments from '../pages/dashboard/admin/Payments'
import EmergencyCenter from '../pages/dashboard/admin/EmergencyCenter'
import DaycareManagement from '../pages/dashboard/admin/DaycareManagement'
import NannyManagement from '../pages/dashboard/admin/NannyManagement'
import ParentManagement from '../pages/dashboard/admin/ParentManagement'
import Analytics from '../pages/dashboard/admin/Analytics'
import Notifications from '../pages/dashboard/admin/Notifications'
import AdminSettings from '../pages/dashboard/admin/Settings'
import AdoptionManagement from '../pages/dashboard/admin/AdoptionManagement'
import MarketplaceManagement from '../pages/dashboard/admin/MarketplaceManagement'

import ParentApproval from '../pages/dashboard/admin/ParentApproval'
import NannyApproval from '../pages/dashboard/admin/NannyApproval'
import DaycareApproval from '../pages/dashboard/admin/DaycareApproval'
import MarketplaceApproval from '../pages/dashboard/admin/MarketplaceApproval'
import AdoptionApproval from '../pages/dashboard/admin/AdoptionApproval'
import ChildMonitoring from '../pages/dashboard/admin/ChildMonitoring'
import TransportMonitoring from '../pages/dashboard/admin/TransportMonitoring'
import AdminReviews from '../pages/dashboard/admin/AdminReviews'
import NannyDashboard from '../pages/dashboard/NannyDashboard'
import Overview from '../pages/dashboard/nanny/Overview'
import OrphanageApp from '../pages/dashboard/orphanage/components/OrphanageApp'
import MarketplaceSellerDashboard from '../pages/dashboard/marketplace-seller/new-design/App'
import MarketplaceBuyerDashboard from '../pages/dashboard/MarketplaceBuyerDashboard'
import CartAndWishlist from '../pages/dashboard/CartAndWishlist'
import OrderTracking from '../pages/dashboard/OrderTracking'
import ContactSupport from '../pages/dashboard/ContactSupport'
import DaycareApp from '../pages/dashboard/daycare/new-design/App'
import Children from '../pages/dashboard/nanny/Children'
import ChildDetail from '../pages/dashboard/nanny/ChildDetail'
import Update from '../pages/dashboard/nanny/Update'
import Applications from '../pages/dashboard/nanny/Applications'
import ApplyForWork from '../pages/dashboard/nanny/ApplyForWork'
import Profile from '../pages/dashboard/nanny/Profile'
import Availability from '../pages/dashboard/nanny/Availability'
import Safety from '../pages/dashboard/nanny/Safety'
import Communication from '../pages/dashboard/nanny/Communication'
import Reviews from '../pages/dashboard/nanny/Reviews'
import Payments from '../pages/dashboard/nanny/Payments'
import Learning from '../pages/dashboard/nanny/Learning'
import ActiveJobs from '../pages/dashboard/nanny/ActiveJobs'
import Verification from '../pages/dashboard/nanny/Verification'
import Wellness from '../pages/dashboard/nanny/Wellness'
import Settings from '../pages/dashboard/nanny/Settings'
import PostJob from '../pages/dashboard/nanny/PostJob'
import Compatibility from '../pages/dashboard/nanny/Compatibility'
import SOS from '../pages/dashboard/nanny/SOS'
import ProtectedRoute from '../components/ProtectedRoute'
import RoleRedirect from '../components/RoleRedirect'
import ChildDashboard from '../pages/dashboard/ChildDashboard'
import LearningLanding from '../pages/LearningLanding'
import AdoptionLanding from '../pages/adoption/AdoptionLanding'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/learning" element={<LearningLanding/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/signup/parent" element={<ParentSignup/>} />
      <Route path="/signup/daycare" element={<DaycareSignup/>} />
      <Route path="/signup/nanny" element={<NannySignup/>} />
      <Route path="/signup/admin" element={<RoleSignup role="admin" eyebrow="Admin Signup" title="Create admin access" description="Create an admin account for oversight, approvals, and daily operations." accent="from-slate-700 to-slate-950" extraLabel="Admin Area" extraKey="adminArea" />} />
      <Route path="/signup/marketplace-seller" element={<RoleSignup role="marketplace_seller" eyebrow="Marketplace Seller" title="Start selling in the marketplace" description="Create a seller account for daycare products, supplies, and services." accent="from-amber-400 to-orange-500" extraLabel="Shop Name" extraKey="shopName" />} />
      <Route path="/signup/orphanage-manager" element={<OrphanageManagerSignup />} />
      <Route path="/signup/transport" element={<TransportSignup/>} />

      <Route path="/role-redirect" element={<RoleRedirect/>} />

      <Route path="/dashboard/child/*" element={<ProtectedRoute roles={["parent"]}><ChildDashboard/></ProtectedRoute>} />
      <Route path="/dashboard/parent/*" element={<ProtectedRoute roles={["parent"]}><ParentDashboard/></ProtectedRoute>} />
      
      {/* Daycare Portal Routes */}
      <Route path="/dashboard/daycare/*" element={<ProtectedRoute roles={["daycare", "admin"]}><DaycareApp/></ProtectedRoute>} />
      
      <Route path="/adoption" element={<AdoptionLanding/>} />
      <Route path="/dashboard/admin/*" element={<ProtectedRoute roles={["admin"]}><AdminDashboard/></ProtectedRoute>}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="verifications" element={<AdminVerification />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="sos" element={<EmergencyCenter />} />
        <Route path="daycares" element={<DaycareManagement />} />
        <Route path="nannies" element={<NannyManagement />} />
        <Route path="parents" element={<ParentManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="adoption" element={<AdoptionManagement />} />
        <Route path="marketplace" element={<MarketplaceManagement />} />

        {/* New Approval & Monitoring Routes */}
        <Route path="parent-approval" element={<ParentApproval />} />
        <Route path="nanny-approval" element={<NannyApproval />} />
        <Route path="daycare-approval" element={<DaycareApproval />} />
        <Route path="marketplace-approval" element={<MarketplaceApproval />} />
        <Route path="adoption-approval" element={<AdoptionApproval />} />
        <Route path="child-monitoring" element={<ChildMonitoring />} />
        <Route path="transport-monitoring" element={<TransportMonitoring />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
      
      {/* Orphanage Dashboard Routes */}
      <Route path="/dashboard/adoption/*" element={<ProtectedRoute roles={["orphanage_manager", "counsellor", "verification_officer", "legal_officer", "super_admin"]}><OrphanageApp/></ProtectedRoute>} />

      <Route path="/dashboard/marketplace" element={<ProtectedRoute roles={["parent"]}><MarketplaceBuyerDashboard/></ProtectedRoute>} />
      <Route path="/dashboard/marketplace/cart" element={<ProtectedRoute roles={["parent"]}><CartAndWishlist/></ProtectedRoute>} />
      <Route path="/dashboard/marketplace/wishlist" element={<ProtectedRoute roles={["parent"]}><CartAndWishlist/></ProtectedRoute>} />
      <Route path="/dashboard/marketplace/orders/:tracking_number" element={<ProtectedRoute roles={["parent"]}><OrderTracking/></ProtectedRoute>} />
      <Route path="/dashboard/marketplace/support" element={<ProtectedRoute roles={["parent"]}><ContactSupport/></ProtectedRoute>} />
      <Route path="/dashboard/marketplace-seller/*" element={<ProtectedRoute roles={["marketplace_seller"]}><MarketplaceSellerDashboard/></ProtectedRoute>} />
      <Route path="/dashboard/nanny/*" element={<ProtectedRoute roles={["nanny"]}><NannyDashboard/></ProtectedRoute>}>
        <Route index element={<Overview/>} />
        <Route path="children" element={<Children/>} />
        <Route path="children/:id" element={<ChildDetail/>} />
        <Route path="update" element={<Update/>} />
        <Route path="applications" element={<Applications/>} />
        <Route path="apply" element={<ApplyForWork/>} />
        <Route path="post-job" element={<PostJob/>} />
        <Route path="profile" element={<Profile/>} />
        <Route path="availability" element={<Availability/>} />
        <Route path="compatibility" element={<Compatibility/>} />
        <Route path="safety" element={<Safety/>} />
        <Route path="sos" element={<SOS/>} />
        <Route path="communication" element={<Communication/>} />
        <Route path="reviews" element={<Reviews/>} />
        <Route path="payments" element={<Payments/>} />
        <Route path="learning" element={<Learning/>} />
        <Route path="active-jobs" element={<ActiveJobs/>} />
        <Route path="verification" element={<Verification/>} />
        <Route path="wellness" element={<Wellness/>} />
        <Route path="settings" element={<Settings/>} />
      </Route>
    </Routes>
  )
}
