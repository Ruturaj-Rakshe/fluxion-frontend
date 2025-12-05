import { email, z } from "zod";

class ZodSchemas {
  
  // Register Schema
  public static RegisterUser = z.object({
    email: z.string().email().max(255, "Email must not exceed 255 characters"),
    name: z.string().min(1).max(100, "Name must not exceed 100 characters").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must not exceed 100 characters"),
  });


  // Login Schema
  public static LoginUser = z.object({
    email: z.string().email().max(255, "Email must not exceed 255 characters"),
    password: z.string().min(6).max(100, "Password must not exceed 100 characters"),
  });

  // Update User Schema
  public static UpdateUser = z.object({
    name: z.string().min(1).max(100, "Name must not exceed 100 characters").optional(),
    email: z.string().email().max(255, "Email must not exceed 255 characters").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must not exceed 100 characters").optional(),
    organization: z.string().max(200, "Organization must not exceed 200 characters").optional(),
    contactNumber: z.string().max(50, "Contact number must not exceed 50 characters").optional(),
    address: z.string().max(500, "Address must not exceed 500 characters").optional(),
    avatarUrl: z.string().url("Invalid avatar URL").max(500, "Avatar URL must not exceed 500 characters").optional(),
  }).refine(data => 
    data.name !== undefined || 
    data.email !== undefined ||
    data.password !== undefined || 
    data.organization !== undefined || 
    data.contactNumber !== undefined || 
    data.address !== undefined || 
    data.avatarUrl !== undefined, {
    message: "At least one field must be provided"
  });

  public static ChangePassword = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters").max(100, "Current password must not exceed 100 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").max(100, "New password must not exceed 100 characters"),
  });

  public static ForgotPassword = z.object({
    email: z.string().email("Invalid email address").max(255, "Email must not exceed 255 characters"),
  });

  public static ResetPassword = z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must not exceed 100 characters"),
  });

  public static SendVerificationEmail = z.object({
    email: z.string().email("Invalid email address").max(255, "Email must not exceed 255 characters"),
  });

  public static VerifyEmail = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^[0-9]+$/, "OTP must contain only numbers"),
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
    tempelateId: z.string().cuid("Invalid template ID").optional(),
    tempelateDetailId: z.string().cuid("Invalid template detail/model ID").optional(),
    quantity: z.number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(100, "Maximum 100 items per template"),
  }).refine(data => data.tempelateId || data.tempelateDetailId, {
    message: "Either tempelateId or tempelateDetailId must be provided"
  });

  // Order Schema
  public static OrderSchema = z.object({
    paymentId: z.string().max(255, "Payment ID must not exceed 255 characters").optional(),
    paymentRef: z.string().max(255, "Payment reference must not exceed 255 characters").optional(),
  });

  // Order Item Schema
  public static OrderItemSchema = z.object({
    tempelateId: z.string().cuid("Invalid template ID"),
    tempelateDetailId: z.string().cuid("Invalid template detail ID").optional(),
    quantity: z.number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
    price: z.number()
      .min(0.01, "Price must be at least $0.01")
      .max(999999.99, "Price cannot exceed $999,999.99"),
  });

  // Create Order Schema (for checkout)
  public static CreateOrderSchema = z.object({
    paymentId: z.string().max(255, "Payment ID must not exceed 255 characters").optional(),
    paymentRef: z.string().max(255, "Payment reference must not exceed 255 characters").optional(),
  });

  // Update Order Status Schema
  public static UpdateOrderStatusSchema = z.object({
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"] as const, {
      error: "Status must be PENDING, COMPLETED, or CANCELLED"
    }),
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
export type OrderType = z.infer<typeof ZodSchemas.OrderSchema>;
export type OrderItemType = z.infer<typeof ZodSchemas.OrderItemSchema>;
export type CreateOrderType = z.infer<typeof ZodSchemas.CreateOrderSchema>;
export type UpdateOrderStatusType = z.infer<typeof ZodSchemas.UpdateOrderStatusSchema>;
export type ChangePasswordType = z.infer<typeof ZodSchemas.ChangePassword>;
export type ForgotPasswordType = z.infer<typeof ZodSchemas.ForgotPassword>;
export type ResetPasswordType = z.infer<typeof ZodSchemas.ResetPassword>;
