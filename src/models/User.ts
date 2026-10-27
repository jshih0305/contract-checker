import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // 只存 bcrypt 雜湊，預設查詢不帶出來
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;

// 避免 HMR 時重複註冊 model
export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>("User", userSchema);
