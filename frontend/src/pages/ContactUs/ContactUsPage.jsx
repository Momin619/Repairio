import React from "react";
import ContactUs from "../../components/ContactUs/ContactUs";
import useDocumentTitle from "../../hooks/useDocumentTitle";
export default function ContactUsPage() {
  useDocumentTitle("Repairio | Contact Us");
  return (
    <div>
      <ContactUs />
    </div>
  );
}
