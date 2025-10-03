"use client";

import { type SubmitHandler, useForm } from "react-hook-form";

export const SignUp = () => {
  const {
    register,
    handleSubmit,
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
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("fullName")} />
      <input {...register("email")} />
      <input {...register("password")} />
      <input {...register("preferredGoal")} />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-accent text-background font-semibold py-3 px-4 rounded-md transition hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Creating account" : "Start Your Building Journey"}
      </button>
    </form>
  );
};
