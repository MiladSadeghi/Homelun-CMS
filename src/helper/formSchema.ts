import { ZodType, z } from "zod";
import { TRole } from "../types/role";
import { TCreateUser, TLogin } from "../types/form";

export const loginForm: ZodType<TLogin> = z.object({
  email: z
    .string()
    .nonempty("email is required")
    .email({ message: "Must be a valid email" }),
  password: z
    .string()
    .nonempty("password is required")
    .min(8, { message: "Too short" }),
});

export const createUserForm: ZodType<TCreateUser> = z.object({
  name: z.string().nonempty("name is required"),
  email: z
    .string()
    .nonempty("email is required")
    .email({ message: "Must be a valid email" }),
  password: z
    .string()
    .nonempty("password is required")
    .min(8, { message: "Too short" }),
});
