import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import Layout from "../components/layout/Layout";
// Main Pages
import Dashboard from "../modules/dashboard/pages/Dashboard";
import Leads from "../modules/leads/pages/Leads";
import Companies from "../modules/companies/pages/Companies";
import CompanyDetails from "../modules/companies/pages/CompanyDetails";
import Deals from "../modules/deals/pages/Deals";
import Tickets from "../modules/tickets/pages/Tickets";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/dashboard" />} />



      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/tickets" element={<Tickets />} />
      </Route>

    </Routes>
  );
}
