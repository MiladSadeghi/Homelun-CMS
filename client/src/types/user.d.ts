export type TUser = {
  isAuthenticated: boolean;
  accessToken: string | null;
  name: string | null;
  role: "super_admin" | "admin" | "agent" | null;
  profileCompleted?: boolean;
};

export type TUsers = Pick<TUser, "name" | "role"> & {
  _id: string;
  email: string;
  createdBy: { _id: string; name: string };
  publish: boolean;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TAgent = {
  _id: string;
  user: string;
  about: string;
  field: string;
  name: string;
  phoneNumber: string;
  cover: string;
  publish: boolean;
  slug: string;
};
