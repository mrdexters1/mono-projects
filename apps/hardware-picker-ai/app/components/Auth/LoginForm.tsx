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
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormData) => {
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
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
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
          className="w-full h-12 bg-gradient-accent text-background font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          Login
        </Button>
      </form>

      {errors.root && <ErrorMessage message={errors.root.message} />}

      <p className="mt-4 text-center text-md text-muted-foreground">
        Don’t have an account?{" "}
        <Button
          type="button"
          onClick={() => onSwitch(AuthFormEnum.REGISTER)}
          className="text-[hsl(var(--primary))] text-md p-0 bg-transparent hover:bg-transparent font-medium hover:underline hover:brightness-110 transition cursor-pointer"
        >
          Sign Up
        </Button>
      </p>

      <p className="mt-2 text-center text-sm text-muted-foreground">
        Forgot your password?{" "}
        <Button
          type="button"
          onClick={() => onSwitch(AuthFormEnum.FORGOT_PASSWORD)}
          className="text-[hsl(var(--primary))] p-0 bg-transparent hover:bg-transparent font-medium hover:underline hover:brightness-110 transition cursor-pointer"
        >
          Reset
        </Button>
      </p>
    </>
  );
};
