"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/app/actions/auth";

const MODES = {
  login: {
    action: login,
    eyebrow: "Welcome back",
    title: "登入帳號",
    description: "繼續審查你的合約。",
    submitLabel: "登入",
    pendingLabel: "登入中…",
    passwordAutoComplete: "current-password",
    passwordHint: null,
    switchText: "還沒有帳號？",
    switchLabel: "免費註冊",
    switchHref: "/signup",
  },
  signup: {
    action: signup,
    eyebrow: "Get started",
    title: "建立帳號",
    description: "只需要 Email 和密碼，馬上開始審查第一份合約。",
    submitLabel: "建立帳號",
    pendingLabel: "建立中…",
    passwordAutoComplete: "new-password",
    passwordHint: "至少 8 個字元，需包含英文字母與數字",
    switchText: "已經有帳號了？",
    switchLabel: "登入",
    switchHref: "/login",
  },
} as const;

const inputClassName =
  "h-12 rounded-xl border border-line-strong bg-paper px-4 text-ink outline-none transition-colors placeholder:text-muted focus:border-ink aria-[invalid=true]:border-risk-high";

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <ul id={id} className="text-sm text-risk-high">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}

export default function AuthForm({ mode }: { mode: keyof typeof MODES }) {
  const config = MODES[mode];
  const [state, formAction, pending] = useActionState(config.action, undefined);

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="eyebrow">{config.eyebrow}</p>
        <h1 className="font-serif text-3xl font-bold tracking-tight">{config.title}</h1>
        <p className="text-ink-soft">{config.description}</p>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            defaultValue={state?.email}
            aria-invalid={Boolean(state?.errors?.email)}
            aria-describedby="email-error"
            className={inputClassName}
          />
          <FieldErrors id="email-error" errors={state?.errors?.email} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            密碼
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={config.passwordAutoComplete}
            required
            aria-invalid={Boolean(state?.errors?.password)}
            aria-describedby="password-error"
            className={inputClassName}
          />
          {config.passwordHint && <p className="text-xs text-muted">{config.passwordHint}</p>}
          <FieldErrors id="password-error" errors={state?.errors?.password} />
        </div>

        {state?.message && (
          <p role="alert" className="rounded-xl border border-risk-high/30 bg-risk-high-soft px-4 py-3 text-sm text-risk-high">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary mt-2 h-12">
          {pending ? config.pendingLabel : config.submitLabel}
        </button>
      </form>

      <p className="text-sm text-muted">
        {config.switchText}
        <Link href={config.switchHref} className="ml-1 font-medium text-ink underline decoration-accent underline-offset-4">
          {config.switchLabel}
        </Link>
      </p>
    </div>
  );
}
