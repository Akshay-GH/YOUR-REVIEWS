import { z } from "zod";
import { emailValidation } from "@/schemas/signupSchema";

export const forgotPasswordSchema = z.object({
  email: emailValidation,
});
