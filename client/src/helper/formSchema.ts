import { ZodType, z } from "zod";
import { TAgentForm, TCreateUser, TLogin, TPropertyForm } from "../types/form";

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
  role: z.enum(["admin", "agent", "super_admin"]),
});

export const createPropertyForm: ZodType<TPropertyForm> = z.object({
  address: z.string().nonempty("address is required"),
  furnished: z.enum(["true", "false"]),
  status: z.enum(["rent", "sale"]),
  agent: z.string(),
  exclusivity: z.string().nonempty("exclusivity is required"),
  price: z.string().nonempty("price is required"),
  offPercent: z.number().min(0).max(100),
  about: z.string().nonempty("about is required"),
  map: z.string().nonempty("map is required"),
  area: z.number(),
  bedrooms: z.number(),
  bathrooms: z.number(),
});

export const editProfileForm: ZodType<TAgentForm> = z.object({
  name: z.string().nonempty("name is required"),
  field: z.string().nonempty("field is required"),
  phoneNumber: z.string().nonempty("phone number is required"),
  social: z.object({
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }),
  about: z.string().nonempty("about is required"),
  cover: z.string().nonempty("cover is required"),
});
