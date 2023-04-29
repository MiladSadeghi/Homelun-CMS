export type TCreateUser = {
  name: string;
  email: string;
  password: string;
};

export type TLogin = { email: string; password: string };

export type TPropertyForm = {
  address: string;
  furnished: "true" | "false";
  exclusivity: string;
  price: string;
  offPercent?: number;
  about: string;
  map: string;
  status: "rent" | "buy";
  agent?: string;
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
