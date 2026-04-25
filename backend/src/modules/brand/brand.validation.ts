import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(1, "Tên brand là bắt buộc"),
  logo: z.string().optional().default(""),
  description: z.string().optional().default(""),
  isVisible: z.boolean().optional().default(true),
});

export const updateBrandSchema = z.object({
  name: z.string().min(1, "Tên brand là bắt buộc").optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
  isVisible: z.boolean().optional(),
});