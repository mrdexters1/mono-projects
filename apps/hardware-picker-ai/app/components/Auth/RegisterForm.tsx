"use client";

import { ErrorMessage } from "@hardware/components/forms/ErrorMessage";
import { InputField } from "@hardware/components/forms/InputField";
import { SelectField } from "@hardware/components/forms/SelectField";
import { PREFFERED_GOAL } from "@hardware/constant";
import { Button } from "@ui/button";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { AuthFormEnum, type AuthFormEnumProps } from "./AuthForm";

export const RegisterForm = ({ onSwitch }: AuthFormEnumProps) => {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      preferredGoal: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("root", { type: "server", message: "Registration failed. Please check your data." });
      }
    } catch (err) {
      console.error("Fatal registration error", err);
      setError("root", { type: "server", message: "Something went wrong. Please try again later." });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-white">Create your account</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="Jonh Doe"
          register={register}
          error={errors.fullName}
          validation={{ required: "Full name is required", minLength: 2 }}
        />

        <InputField
          name="email"
          label="Email"
          placeholder="contact@smartpc.com"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
          }}
        />

        <InputField
          name="password"
          label="Password"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          }}
        />

        <SelectField
          name="preferredGoal"
          label="Preffered Goal"
          placeholder="Select you goal"
          options={PREFFERED_GOAL}
          control={control}
          error={errors.preferredGoal}
          required
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-accent text-background font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Creating account" : "Start Your Building Journey"}
        </Button>
      </form>

      {errors.root && <ErrorMessage message={errors.root.message} />}

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Button
          onClick={() => onSwitch(AuthFormEnum.LOGIN)}
          className="text-primary cursor-pointer hover:underline"
        >
          Login
        </Button>
      </p>
    </>
  );
};
