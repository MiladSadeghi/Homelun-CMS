import { ZodType, z } from "zod";
import { TRole } from "../types/role";
import { TCreateUser, TLogin, TPropertyForm } from "../types/form";

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

export const createPropertyForm: ZodType<TPropertyForm> = z.object({
  address: z.string().nonempty("address is required"),
  furnished: z.enum(["true", "false"]),
  status: z.enum(["rent", "buy"]),
  agent: z.string().nonempty("agent is required"),
  exclusivity: z.string().nonempty("exclusivity is required"),
  price: z.string().nonempty("price is required"),
  offPercent: z.number().min(0).max(100),
  about: z.string().nonempty("about is required"),
  map: z.string().nonempty("map is required"),
});
