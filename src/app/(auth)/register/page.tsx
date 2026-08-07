"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/templates/authlayout";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import S from "./styles.module.scss";

interface FormState {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.nome.trim()) {
      newErrors.nome = "Nome obrigatório";
    } else if (form.nome.trim().length < 3) {
      newErrors.nome = "Mínimo 3 caracteres";
    }

    if (!form.email) {
      newErrors.email = "E-mail obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!form.senha) {
      newErrors.senha = "Senha obrigatória";
    } else if (form.senha.length < 8) {
      newErrors.senha = "Mínimo 8 caracteres";
    } else if (!/[A-Z]/.test(form.senha)) {
      newErrors.senha = "Deve conter ao menos uma letra maiúscula";
    } else if (!/[0-9]/.test(form.senha)) {
      newErrors.senha = "Deve conter ao menos um número";
    }

    if (!form.confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação obrigatória";
    } else if (form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

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

    // TODO: integrar com a API — POST /users
    // const response = await fetch("/api/users", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ nome: form.nome, email: form.email, senha: form.senha }),
    // });

    await new Promise((r) => setTimeout(r, 1500));

    console.log("Dados para salvar no banco:", {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
    });

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthLayout>
        <div className={S.register__success}>
          <div className={S.register__successicon}>✓</div>
          <h2 className={S.register__successtitle}>Conta criada!</h2>
          <p className={S.register__successmsg}>
            Bem-vindo ao Custe.AI, <strong>{form.nome}</strong>. Faça login para acessar seu dashboard.
          </p>
          <Button onClick={() => (window.location.href = "/login")}>
            Ir para o login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className={S.register}>
        <div className={S.register__header}>
          <Eyebrow>Criar conta</Eyebrow>
          <h1 className={S.register__title}>Comece de graça</h1>
          <p className={S.register__subtitle}>
            Já tem uma conta?{" "}
            <a href="/login" className={S.register__link}>
              Fazer login
            </a>
          </p>
        </div>

        <div className={S.register__form}>
          <Input
            id="nome"
            label="Nome completo"
            type="text"
            placeholder="Seu nome"
            value={form.nome}
            onChange={handleChange("nome")}
            error={errors.nome}
            autoComplete="name"
          />
          <Input
            id="email"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            id="senha"
            label="Senha"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={form.senha}
            onChange={handleChange("senha")}
            error={errors.senha}
            autoComplete="new-password"
          />
          <Input
            id="confirmarSenha"
            label="Confirmar senha"
            type="password"
            placeholder="Repita a senha"
            value={form.confirmarSenha}
            onChange={handleChange("confirmarSenha")}
            error={errors.confirmarSenha}
            autoComplete="new-password"
          />

          <p className={S.register__hint}>
            Ao criar uma conta você concorda com nossos{" "}
            <a href="#" className={S.register__link}>Termos de uso</a>.
          </p>

          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            Criar conta
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
