"use client";

import { Button } from "@ui/button";
import { AuthFormEnum, type AuthFormEnumProps } from "./AuthForm";

export const ForgotPasswordForm = ({ onSwitch }: AuthFormEnumProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

      <p className="mt-4 text-center">
        Remembered your password?{" "}
        <Button
          onClick={() => onSwitch(AuthFormEnum.LOGIN)}
          className="text-primary cursor-pointer hover:underline"
        >
          Back to Login
        </Button>
      </p>
    </div>
  );
};
