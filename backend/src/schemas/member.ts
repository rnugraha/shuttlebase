import { z } from "zod";

export const createMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  pronoun: z.string().min(1, "Pronoun is required"),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
});

export const updateMemberSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  pronoun: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "PENDING", "WAITLIST", "TRYOUT"])
    .optional(),
  paymentStatus: z.enum(["PAID", "UNPAID", "OVERDUE", "EXEMPT"]).optional(),
  paidAt: z.string().optional(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
