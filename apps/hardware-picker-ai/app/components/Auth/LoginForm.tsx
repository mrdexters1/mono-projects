"use client";

import { ErrorMessage } from "@hardware/components/forms/ErrorMessage";
import { InputField } from "@hardware/components/forms/InputField";
import { Button } from "@ui/button";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { AuthFormEnum, type AuthFormEnumProps } from "./AuthForm";

export const LoginForm = ({ onSwitch }: AuthFormEnumProps) => {
  const {
    register,
    handleSubmit,
    setError,
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
        setError("root", { type: "server", message: "Invalid email or password" });
      }
    } catch (err) {
      console.error("Fatal login error", err);
      setError("root", { type: "server", message: "Something went wrong. Please try again later." });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-white">Login to your account</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-accent text-background font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50"
        >
          Login
        </Button>
      </form>

      {errors.root && <ErrorMessage message={errors.root.message} />}

      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <Button
          onClick={() => onSwitch(AuthFormEnum.REGISTER)}
          className="text-primary cursor-pointer hover:underline"
        >
          Sign Up
        </Button>
      </p>

      <p className="mt-2 text-center">
        Forgot your password?{" "}
        <Button
          onClick={() => onSwitch(AuthFormEnum.FORGOT_PASSWORD)}
          className="text-primary cursor-pointer hover:underline"
        >
          Reset
        </Button>
      </p>
    </>
  );
};
