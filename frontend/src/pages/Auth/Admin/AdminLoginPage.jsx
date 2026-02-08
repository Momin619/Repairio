import React from "react";
import AdminLogin from "../../../components/Auth/Admin/AdminLogin";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function AdminLoginPage() {
  useDocumentTitle("Admin | Login");
  return (
    <div>
      <AdminLogin />
    </div>
  );
}
