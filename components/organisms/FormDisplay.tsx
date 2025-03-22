"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select";
  required: boolean;
  options?: string[];
}

interface FormDefinition {
  title: string;
  description?: string;
  fields: FormField[];
}

interface FormDisplayProps {
  formDefinition: FormDefinition;
  onSubmit: (data: Record<string, unknown>) => void;
}

export function FormDisplay({ formDefinition, onSubmit }: FormDisplayProps) {
  // Dynamically create a Zod schema based on the form definition
  const generateSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    
    formDefinition.fields.forEach((field) => {
      if (field.type === "email") {
        if (field.required) {
          schemaFields[field.name] = z.string()
            .min(1, `${field.label} is required`)
            .email("Invalid email address");
        } else {
          schemaFields[field.name] = z.string()
            .email("Invalid email address")
            .optional();
        }
      } else if (field.type === "number") {
        if (field.required) {
          schemaFields[field.name] = z.coerce.number({
            required_error: `${field.label} is required`,
            invalid_type_error: `${field.label} must be a number`
          });
        } else {
          schemaFields[field.name] = z.coerce.number().optional();
        }
      } else {
        if (field.required) {
          schemaFields[field.name] = z.string()
            .min(1, `${field.label} is required`);
        } else {
          schemaFields[field.name] = z.string().optional();
        }
      }
    });

    return z.object(schemaFields);
  };

  const form = useForm({
    resolver: zodResolver(generateSchema()),
  });

  const handleSubmit = (data: Record<string, unknown>) => {
    onSubmit(data);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...form.register(field.name)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full"
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(value) => form.setValue(field.name, value)}
            defaultValue={form.getValues(field.name)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            {...form.register(field.name)}
            type={field.type}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{formDefinition.title}</h1>
        {formDefinition.description && (
          <p className="text-gray-600">{formDefinition.description}</p>
        )}
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {formDefinition.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {form.formState.errors[field.name] && (
              <p className="text-red-500 text-sm">
                {form.formState.errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
} 