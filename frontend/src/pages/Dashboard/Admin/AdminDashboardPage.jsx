import React from "react";
import AdminDashboard from "../../../components/Dashboard/Admin/AdminDashboard";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function AdminDashboardPage() {
  useDocumentTitle("Repairio | Admin Dashboard");

  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
