"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
	control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    defaultValues: {
		fullName: ''
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          alert("Ошибка входа. Проверьте данные.");
        }
      } else {
        // Здесь будет логика регистрации
        alert("Регистрация пока не реализована");
      }
    } catch (error) {
      alert("Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (session) {
    return (
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border">
        <h2 className="text-3xl font-bold mb-6 text-center">Добро пожаловать!</h2>
        <div className="text-center space-y-4">
          <p className="text-lg">Привет, {session.user?.name || session.user?.email}!</p>
          <button
            onClick={handleLogout}
            className="w-full bg-destructive text-destructive-foreground font-semibold py-3 px-4 rounded-md transition hover:opacity-90"
          >
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border">
      <h2 className="text-3xl font-bold mb-6 text-center">{isLogin ? "Вход" : "Регистрация"}</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {!isLogin && (
          <div>
            <label className="block text-sm mb-1">Имя</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-background border border-input focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Введите ваше имя"
              {...register("name", { required: !isLogin && "Имя обязательно" })}
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-md bg-background border border-input focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Введите email"
            {...register("email", {
              required: "Email обязателен",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Неверный формат email",
              },
            })}
          />
          {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Пароль</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-md bg-background border border-input focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Введите пароль"
            {...register("password", {
              required: "Пароль обязателен",
              minLength: {
                value: 6,
                message: "Пароль должен содержать минимум 6 символов",
              },
            })}
          />
          {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-accent text-background font-semibold py-3 px-4 rounded-md transition hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-4">
        {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            reset();
          }}
          className="text-primary hover:underline"
        >
          {isLogin ? "Зарегистрироваться" : "Войти"}
        </button>
      </p>

      {isLogin && (
        <div className="mt-4 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">Тестовый аккаунт: test@test.com / password</p>
        </div>
      )}
    </div>
  );
}
