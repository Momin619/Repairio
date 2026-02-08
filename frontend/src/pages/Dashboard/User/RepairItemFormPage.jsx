import React from "react";
import RepairItemForm from "../../../components/Dashboard/User/RepairItemForm";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
export default function RepairItemFormPage() {
  useDocumentTitle("Repairio | Add Item");
  return (
    <div>
      <RepairItemForm />
    </div>
  );
}
