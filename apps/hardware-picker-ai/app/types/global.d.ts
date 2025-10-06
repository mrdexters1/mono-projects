import type { DefaultSession } from "next-auth";
import type { FieldError, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare global {
  type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
    preferredGoal: string;
  };

  type LoginFormData = {
    email: string;
    password: string;
  };

  type FormInputProps<TFormValues extends Record<string, unknown> = SignUpFormData> = {
    name: Path<TFormValues>;
    label: string;
    placeholder?: string;
    type?: string;
    register: UseFormRegister<TFormValues>;
    error?: FieldError;
    validation?: RegisterOptions<TFormValues>;
    disabled?: boolean;
    value?: string;
  };

  type Option = {
    value: string;
    label: string;
  };

  type SelectInputProps = {
    name: string;
    label: string;
    placeholder: string;
    options: readonly Option[];
    control: Control<TFormValues>;
    error?: FieldError;
    required?: boolean;
  };
}
