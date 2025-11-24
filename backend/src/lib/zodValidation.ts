import { email, z } from "zod";

class ZodSchemas {
  
  // Register Schema
  public static RegisterUser = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });


  // Login Schema
  public static LoginUser = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  // Update User Schema
  public static UpdateUser = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  }).refine(data => data.name !== undefined || data.password !== undefined, {
    message: "At least one field (name or password) must be provided"
  });

  // Template Schema
  public static TemplateSchema = z.object({
    title: z.string()
      .min(1, "Title is required")
      .max(200, "Title must not exceed 200 characters")
      .trim(),
    description: z.string()
      .min(1, "Description is required")
      .max(10000, "Description must not exceed 10,000 characters")
      .trim(),
    price: z.number()
      .min(0.01, "Price must be at least $0.01")
      .max(999999.99, "Price cannot exceed $999,999.99"),
    imageUrl: z.string()
      .url("Image URL must be a valid URL")
      .max(500, "Image URL must not exceed 500 characters"),
    thumbnailUrl: z.string()
      .url("Thumbnail URL must be a valid URL")
      .max(500, "Thumbnail URL must not exceed 500 characters"),
    isActive: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  });

  // Template Detail Schema
  public static TemplateDetailSchema = z.object({
    header: z.string()
      .min(1, "Header is required")
      .max(300, "Header must not exceed 300 characters")
      .trim(),
    headerSubtitle: z.string()
      .min(1, "Header subtitle is required")
      .max(500, "Header subtitle must not exceed 500 characters")
      .trim(),
    features: z.array(z.string().min(1).max(200))
      .min(1, "At least one feature is required")
      .max(20, "Maximum 20 features allowed"),
    benefits: z.array(z.string().min(1).max(200))
      .min(1, "At least one benefit is required")
      .max(20, "Maximum 20 benefits allowed"),
  });

  // Cart Schema
  public static CartSchema = z.object({
    tempelateId: z.string().cuid("Invalid template ID"),
    quantity: z.number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(100, "Maximum 100 items per template"),
  });
}

export default ZodSchemas;

// Types
export type RegisterUserType = z.infer<typeof ZodSchemas.RegisterUser>;
export type LoginUserType = z.infer<typeof ZodSchemas.LoginUser>;
export type UpdateUserType = z.infer<typeof ZodSchemas.UpdateUser>;
export type TemplateType = z.infer<typeof ZodSchemas.TemplateSchema>;
export type TemplateDetailType = z.infer<typeof ZodSchemas.TemplateDetailSchema>;
export type CartType = z.infer<typeof ZodSchemas.CartSchema>;
