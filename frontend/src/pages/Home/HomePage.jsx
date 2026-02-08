import React from "react";
import Home from "../../components/HomePage/Home";
import useDocumentTitle from "../../hooks/useDocumentTitle";
export default function HomePage() {
  useDocumentTitle("Repairio");

  return (
    <div>
      <Home />
    </div>
  );
}
