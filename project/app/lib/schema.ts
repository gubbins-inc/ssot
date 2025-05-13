import { z } from 'zod';

// Define Zod schemas for validation
export const headerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  documentNumber: z.string().min(1, "Document number is required"),
  revision: z.string().min(1, "Revision is required"),
  date: z.string().min(1, "Date is required"),
  author: z.string().min(1, "Author is required"),
  department: z.string().min(1, "Department is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string())
});

export const partSchema = z.object({
  partNumber: z.string().min(1, "Part number is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().int().positive("Quantity must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  reference: z.string().optional(),
  notes: z.string().optional(),
  imageUri: z.string().optional()
});

export const stepSchema = z.object({
  stepNumber: z.number().int().positive("Step number must be a positive number"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.number().int().nonnegative().optional(),
  warnings: z.array(z.string()),
  tools: z.array(z.string()),
  partsUsed: z.array(z.string()),
  imageUri: z.string().optional()
});

export const footerSchema = z.object({
  approvals: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    date: z.string().min(1, "Date is required")
  })),
  notes: z.string().optional(),
  references: z.string().optional(),
  contactInformation: z.string().optional()
});

export const changeLogEntrySchema = z.object({
  revision: z.string().min(1, "Revision is required"),
  date: z.string().min(1, "Date is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(1, "Description is required"),
  approvedBy: z.string().optional(),
  sections: z.array(z.string())
});

export const instructionSchema = z.object({
  header: headerSchema,
  parts: z.array(partSchema),
  steps: z.array(stepSchema),
  footer: footerSchema,
  changeLog: z.array(changeLogEntrySchema)
});

export type Header = z.infer<typeof headerSchema>;
export type Part = z.infer<typeof partSchema>;
export type Step = z.infer<typeof stepSchema>;
export type Footer = z.infer<typeof footerSchema>;
export type ChangeLogEntry = z.infer<typeof changeLogEntrySchema>;
export type Instruction = z.infer<typeof instructionSchema>;