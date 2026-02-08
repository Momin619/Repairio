import React from "react";
import Setting from "../../components/ui/Setting";
import useDocumentTitle from "../../hooks/useDocumentTitle";
export default function SettingPage() {
  useDocumentTitle("Repairio | Setting");
  return (
    <div>
      <Setting />
    </div>
  );
}
