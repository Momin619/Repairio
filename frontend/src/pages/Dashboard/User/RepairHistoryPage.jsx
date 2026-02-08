import React from "react";
import RepairHistory from "../../../components/Dashboard/User/RepairHistory";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function RepairHistoryPage() {
  useDocumentTitle("Repairio | Repair History");

  return (
    <div>
      <RepairHistory />
    </div>
  );
}
