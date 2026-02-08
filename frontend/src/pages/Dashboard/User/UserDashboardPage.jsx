import React from "react";
import UserDashboard from "../../../components/Dashboard/User/UserDashboard";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function UserDashboardPage() {
  useDocumentTitle("Repairio | Dashboard");
  return (
    <div>
      <UserDashboard />
    </div>
  );
}
