import React from "react";
import Revenue from "../../../components/Dashboard/User/Revenue";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function RevenuePage() {
  useDocumentTitle("Repairio | Revenue");

  return (
    <div>
      <Revenue />
    </div>
  );
}
