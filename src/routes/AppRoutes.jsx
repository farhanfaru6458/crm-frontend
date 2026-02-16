import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layout
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import Registration from "../modules/auth/pages/Registration";
import Login from "../modules/auth/pages/Login";

// Main Pages
import Dashboard from "../modules/dashboard/pages/Dashboard";
import Profile from "../modules/profile/pages/Profile";
import Leads from "../modules/leads/pages/Leads";
import LeadDetails from "../modules/leads/pages/LeadDetails";
import Companies from "../modules/companies/pages/Companies";
import CompanyDetails from "../modules/companies/pages/CompanyDetails";
import Deals from "../modules/deals/pages/Deals";
import DealDetails from "../modules/deals/pages/DealDetails";

import Tickets from "../modules/tickets/pages/Tickets";
import TicketDetails from "../modules/tickets/pages/TicketDetails";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

      <Route path="/register" element={!user ? <Registration /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />

        <Route path="/deals" element={<Deals />} />
        <Route path="/deals/:id" element={<DealDetails />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
      </Route>
    </Routes>
  );
}
