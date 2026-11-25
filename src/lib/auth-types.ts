export type SignupField =
  | "full_name"
  | "email"
  | "password"
  | "confirm_password"
  | "ack";

export type SignupState = {
  error?: string;
  message?: string;
  fieldErrors?: Partial<Record<SignupField, string>>;
  values?: { full_name?: string; email?: string };
};
