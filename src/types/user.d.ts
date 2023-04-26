export type TUser = {
  isAuthenticated: boolean;
  accessToken: string | null;
  name: string | null;
  role: "super_admin" | "admin" | "agent" | null;
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