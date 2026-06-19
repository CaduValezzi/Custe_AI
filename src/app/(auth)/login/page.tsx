"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/templates/authlayout";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import Link from "next/link";
import S from "./styles.module.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "E-mail obrigatorio";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "E-mail invalido";
    if (!password) newErrors.password = "Senha obrigatoria";
    else if (password.length < 6) newErrors.password = "Minimo 6 caracteres";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    // TODO: integrar com a API de autenticacao
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <AuthLayout>
      
      <div className={S.login}>
        <div className={S.login__header}>
          <Eyebrow>Bem-vindo de volta</Eyebrow>
          <h1 className={S.login__title}>Entrar na sua conta</h1>
          <p className={S.login__subtitle}>
            Nao tem uma conta?{" "}
            <a href="/register" className={S.login__link}>
              Cadastre-se gratis
            </a>
          </p>
        </div>

        <div className={S.login__form}>
          <Input
            id="email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />

          <a href="/forgot-password" className={S.login__forgot}>
            Esqueceu a senha?
          </a>

          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            Entrar
          </Button>
        </div>

        <div className={S.login__divider}>
          <span>ou continue com</span>
        </div>

        <Button variant="ghost">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.705A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.705V4.963H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.963L3.964 7.295C4.672 5.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Entrar com Google
        </Button>
        <Link href="/" className={S.login__back}>
          <span className={S.login__back__arrow}>←</span>
          Voltar
        </Link>
      </div>
    </AuthLayout>
  );
}
