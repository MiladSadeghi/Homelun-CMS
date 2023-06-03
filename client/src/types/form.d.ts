import { TRole } from "./role";

export type TCreateUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "agent" | "super_admin";
};

export type TLogin = { email: string; password: string };

export type TPropertyForm = {
  address: string;
  furnished: "true" | "false";
  exclusivity: string;
  price: number;
  offPercent?: number;
  about: string;
  map: string;
  status: "rent" | "sale";
  agent?: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
};

export type TAgentForm = {
  name: string;
  field: string;
  phoneNumber: string;
  social: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  about: string;
  cover: string;
};
