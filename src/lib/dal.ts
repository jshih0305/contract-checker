import "server-only";
import { cache } from "react";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { User } from "@/models/User";

export type CurrentUser = {
  id: string;
  email: string;
};

// 同一個 request 內只查一次資料庫
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session || !isValidObjectId(session.userId)) return null;

  await connectToDatabase();
  const user = await User.findById(session.userId).select("email").lean();
  if (!user) return null;

  return { id: user._id.toString(), email: user.email };
});
