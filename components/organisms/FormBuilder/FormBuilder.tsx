"use client";

import { useState } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(["text", "email", "number", "textarea", "select"]),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

const formSchema = z.object({
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
});

type FormValues = {
  title: string;
  description?: string;
  fields: {
    id: string; // Important to include 'id' from useFieldArray, if it's used
    name: string;
    label: string;
    type: "text" | "email" | "number" | "textarea" | "select";
    required: boolean;
    options?: string[];
  }[];
};

export function FormBuilder() {
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      title: "",
      description: "",
      fields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Here you would typically save the form definition
  };

  const addField = () => {
    append({
      name: "",
      label: "",
      type: "text",
      required: false,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Form Builder</h1>
        <Button
          onClick={() => setPreviewMode(!previewMode)}
          variant="outline"
        >
          {previewMode ? "Edit Mode" : "Preview Mode"}
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Form Title</label>
                <Input
                  {...form.register("title")}
                  placeholder="Enter form title"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <Input
                  {...form.register("description")}
                  placeholder="Enter form description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Field Name</label>
                    <Input
                      {...form.register(`fields.${index}.name`)}
                      placeholder="Enter field name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Field Label</label>
                    <Input
                      {...form.register(`fields.${index}.label`)}
                      placeholder="Enter field label"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Field Type</label>
                    <Select
                      onValueChange={(value) => form.setValue(`fields.${index}.type`, value as any)}
                      defaultValue={field.type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...form.register(`fields.${index}.required`)}
                      className="h-4 w-4"
                    />
                    <label className="text-sm">Required</label>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                      className="ml-auto"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex space-x-4">
          <Button type="button" onClick={addField} variant="outline">
            Add Field
          </Button>
          <Button type="submit">Save Form</Button>
        </div>
      </form>
    </div>
  );
} 