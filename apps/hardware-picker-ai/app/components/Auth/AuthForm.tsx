"use client";

import { useState } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export enum AuthFormEnum {
  LOGIN = "login",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot_password",
}

export type AuthFormEnumProps = {
  onSwitch: (view: AuthFormEnum) => void;
};

export const AuthForm = () => {
  const [view, setView] = useState<AuthFormEnum>(AuthFormEnum.LOGIN);

  const forms = {
    [AuthFormEnum.LOGIN]: LoginForm,
    [AuthFormEnum.REGISTER]: RegisterForm,
    [AuthFormEnum.FORGOT_PASSWORD]: ForgotPasswordForm,
  };

  const ActiveForm = forms[view];

  return (
    <div className="w-full max-w-md bg-background/40 p-6 rounded-xl shadow-lg">
      <ActiveForm onSwitch={setView} />
    </div>
  );
};
