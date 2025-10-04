import type { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

declare global {
  type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
    preferredGoal: string;
  };

  type FormInputProps = {
    name: keyof SignUpFormData;
    label: string;
    placeholder?: string;
    type?: string;
    register: UseFormRegister<SignUpFormData>;
    error?: FieldError;
    validation?: RegisterOptions<SignUpFormData, K>;
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
    control: Control<any>;
    error?: FieldError;
    required?: boolean;
  };
}
