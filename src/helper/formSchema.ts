import { ZodType, z } from "zod";

export type login = { email: string; password: string };

export const loginForm: ZodType<login> = z.object({
  email: z
    .string()
    .nonempty("email is required")
    .email({ message: "Must be a valid email" }),
  password: z
    .string()
    .nonempty("password is required")
    .min(8, { message: "Too short" }),
});
