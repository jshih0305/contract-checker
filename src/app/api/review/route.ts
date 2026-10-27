import { put, del } from "@vercel/blob";
import { analyzeContract, OPENAI_MODEL } from "@/lib/analyze-contract";
import { getContractMimeType, validateContractFile } from "@/lib/contract-file";
import { connectToDatabase } from "@/lib/mongodb";
import { getReviewFileUrl } from "@/lib/reviews";
import { getSession } from "@/lib/session";
import { ContractReview } from "@/models/ContractReview";

// AI 審查長合約可能需要較久時間
export const maxDuration = 120;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "請先登入" }, { status: 401 });
  }

  let file: File;
  try {
    const formData = await request.formData();
    const value = formData.get("file");
    if (!(value instanceof File)) {
      return Response.json({ error: "請上傳合約檔案" }, { status: 400 });
    }
    file = value;
  } catch {
    return Response.json({ error: "無法解析上傳內容" }, { status: 400 });
  }

  const validationError = validateContractFile(file);
  const mimeType = getContractMimeType(file);
  if (validationError || !mimeType) {
    return Response.json({ error: validationError }, { status: 400 });
  }

  // 上傳檔案和 AI 分析互不依賴，平行執行
  const [blobResult, analysisResult] = await Promise.allSettled([
    put(`contracts/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: mimeType,
    }),
    analyzeContract(file, mimeType),
  ]);

  if (blobResult.status === "rejected" || analysisResult.status === "rejected") {
    // 其中一邊失敗時，清掉已上傳的檔案避免留下孤兒檔案
    if (blobResult.status === "fulfilled") {
      await del(blobResult.value.url).catch(() => {});
    }
    const reason =
      blobResult.status === "rejected" ? blobResult.reason : (analysisResult as PromiseRejectedResult).reason;
    console.error("合約審查失敗", reason);
    return Response.json(
      { error: blobResult.status === "rejected" ? "檔案上傳失敗，請稍後再試" : "AI 審查失敗，請稍後再試" },
      { status: 502 },
    );
  }

  const blob = blobResult.value;

  try {
    await connectToDatabase();
    const review = await ContractReview.create({
      userId: session.userId,
      fileName: file.name,
      fileSize: file.size,
      mimeType,
      blobUrl: blob.url,
      blobPathname: blob.pathname,
      model: OPENAI_MODEL,
      analysis: analysisResult.value,
    });

    const id = review._id.toString();
    return Response.json(
      {
        id,
        fileName: review.fileName,
        fileUrl: getReviewFileUrl(id),
        analysis: analysisResult.value,
        createdAt: review.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("儲存審查結果失敗", error);
    await del(blob.url).catch(() => {});
    return Response.json({ error: "儲存審查結果失敗，請稍後再試" }, { status: 500 });
  }
}
