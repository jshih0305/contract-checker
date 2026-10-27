import { getSession } from "@/lib/session";
import { findReviewForUser } from "@/lib/reviews";

// 驗證是本人後才轉送 Blob 上的原始檔案
export async function GET(_request: Request, ctx: RouteContext<"/api/reviews/[id]/file">) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "請先登入" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const review = await findReviewForUser(session.userId, id);
  if (!review) {
    return Response.json({ error: "找不到這份合約" }, { status: 404 });
  }

  const blobResponse = await fetch(review.blobUrl);
  if (!blobResponse.ok || !blobResponse.body) {
    return Response.json({ error: "無法讀取檔案" }, { status: 502 });
  }

  return new Response(blobResponse.body, {
    headers: {
      "Content-Type": review.mimeType,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(review.fileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
