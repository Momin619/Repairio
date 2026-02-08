import React from "react";
import SignUp from "../../../components/Auth/User/Signup";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function SignupPage() {
  useDocumentTitle("Repairio | Signup");

  return (
    <div>
      <SignUp />
    </div>
  );
}
