import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import Layout from "../components/layout/Layout";

import Registration from "../modules/auth/pages/Registration";
import Login from "../modules/auth/pages/Login";

// Main Pages
import Dashboard from "../modules/dashboard/pages/Dashboard";
import Leads from "../modules/leads/pages/Leads";
import LeadDetails from "../modules/leads/pages/LeadDetails";
import Companies from "../modules/companies/pages/Companies";
import CompanyDetails from "../modules/companies/pages/CompanyDetails";
import Deals from "../modules/deals/pages/Deals";
import DealDetails from "../modules/deals/pages/DealDetails";
import Tickets from "../modules/tickets/pages/Tickets";
import TicketDetails from "../modules/tickets/pages/TicketDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
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
