"use client";

import { useParams } from "next/navigation";
import { FormDisplay } from "@/components/organisms/FormDisplay";

// This is a mock form definition - in a real app, you would fetch this from your backend
const mockFormDefinition = {
  title: "Sample Feedback Form",
  description: "Please provide your feedback about our service",
  fields: [
    {
      name: "name",
      label: "Your Name",
      type: "text" as const,
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email" as const,
      required: true,
    },
    {
      name: "feedback",
      label: "Your Feedback",
      type: "textarea" as const,
      required: true,
    },
    {
      name: "rating",
      label: "Rating",
      type: "select" as const,
      required: true,
      options: ["Excellent", "Good", "Fair", "Poor"],
    },
  ],
};

export default function FormPage() {
  const params = useParams();
  const formId = params.formId as string;

  // In a real app, you would fetch the form definition based on the formId
  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your backend
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <FormDisplay
        formDefinition={mockFormDefinition}
        onSubmit={handleSubmit}
      />
    </main>
  );
} 