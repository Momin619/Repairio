import React from "react";
import AdminUserDetails from "../../../components/Dashboard/Admin/AdminUserDetails";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function AdminUserDetailsPage() {
  useDocumentTitle("Repairio | User Details");
  return (
    <div>
      <AdminUserDetails />
    </div>
  );
}
