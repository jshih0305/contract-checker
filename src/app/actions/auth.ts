"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { createSession, deleteSession } from "@/lib/session";
import { User } from "@/models/User";

export type AuthFormState =
  | {
      email?: string;
      errors?: { email?: string[]; password?: string[] };
      message?: string;
    }
  | undefined;

const BCRYPT_ROUNDS = 12;

const credentialsSchema = z.object({
  email: z.email({ error: "請輸入有效的 Email" }).trim().toLowerCase(),
  password: z.string().min(1, { error: "請輸入密碼" }),
});

const signupSchema = credentialsSchema.extend({
  password: z
    .string()
    .min(8, { error: "密碼至少需要 8 個字元" })
    .max(72, { error: "密碼不能超過 72 個字元" })
    .regex(/[a-zA-Z]/, { error: "密碼需包含至少一個英文字母" })
    .regex(/[0-9]/, { error: "密碼需包含至少一個數字" }),
});

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

function isDuplicateKeyError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

export async function signup(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = readCredentials(formData);
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { email: input.email, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { email, password } = parsed.data;
  await connectToDatabase();

  let userId: string;
  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await User.create({ email, passwordHash });
    userId = user._id.toString();
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return { email: input.email, errors: { email: ["這個 Email 已經註冊過了"] } };
    }
    console.error("註冊失敗", error);
    return { email: input.email, message: "註冊失敗，請稍後再試" };
  }

  await createSession(userId);
  redirect("/review");
}

export async function login(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const input = readCredentials(formData);
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { email: input.email, errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { email, password } = parsed.data;
  await connectToDatabase();
  const user = await User.findOne({ email }).select("+passwordHash");

  // 不透露是 Email 不存在還是密碼錯誤
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { email: input.email, message: "Email 或密碼錯誤" };
  }

  await createSession(user._id.toString());
  redirect("/review");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
