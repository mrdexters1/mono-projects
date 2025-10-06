"use client";

import { ErrorMessage } from "@hardware/components/forms/ErrorMessage";
import { InputField } from "@hardware/components/forms/InputField";
import { Button } from "@ui/button";
import { useForm } from "react-hook-form";
import { AuthFormEnum, type AuthFormEnumProps } from "./AuthForm";

type ForgotPasswordData = {
  email: string;
};

export const ForgotPasswordForm = ({ onSwitch }: AuthFormEnumProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      console.log("Password reset requested:", data.email);
      // TODO:
      // await sendResetEmail(data.email);
    } catch (err) {
      console.error("Forgot password error", err);
      setError("root", { type: "server", message: "Something went wrong. Please try again later." });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2 text-white">Forgot your password?</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your email address and we’ll send you a link to reset your password.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <InputField
          name="email"
          label="Email"
          placeholder="you@example.com"
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-accent text-background font-semibold rounded-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Sending link..." : "Send reset link"}
        </Button>
      </form>

      {errors.root && <ErrorMessage message={errors.root.message} />}

      <p className="mt-6 text-center text-md text-muted-foreground">
        Remembered your password?{" "}
        <Button
          type="button"
          onClick={() => onSwitch(AuthFormEnum.LOGIN)}
          className="text-[hsl(var(--primary))] text-md p-0 bg-transparent hover:bg-transparent font-medium hover:underline hover:brightness-110 transition cursor-pointer"
        >
          Back to Login
        </Button>
      </p>

      <p className="mt-2 text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Button
          type="button"
          onClick={() => onSwitch(AuthFormEnum.REGISTER)}
          className="text-[hsl(var(--primary))] p-0 bg-transparent hover:bg-transparent font-medium hover:underline hover:brightness-110 transition cursor-pointer"
        >
          Sign Up
        </Button>
      </p>
    </>
  );
};
