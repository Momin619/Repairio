import React from "react";
import Login from "../../../components/Auth/User/Login";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function LoginPage() {
  useDocumentTitle("Repairio | Login");
  return (
    <div>
      <Login />
    </div>
  );
}
