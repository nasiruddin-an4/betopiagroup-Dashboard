import { NextResponse } from "next/server";
import { uploadToS3, getImageUrl, PROJECT_FOLDER } from "../../../utils/s3";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    // Get folder from form data, default to 'general'
    const folder = formData.get("folder") || "general";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 },
      );
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Sanitize filename and create unique S3 key with project prefix
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const key = `${PROJECT_FOLDER}/${folder}/${Date.now()}-${sanitizedFileName}`;

    // Upload to S3 using utility - returns direct S3 URL
    const { url: s3Url } = await uploadToS3(buffer, key, file.type);

    // Transform raw S3 URL to CDN URL (assets.betopiagroup.com)
    const cdnUrl = getImageUrl(s3Url);

    return NextResponse.json({
      success: true,
      url: cdnUrl,
      previewUrl: cdnUrl,
      s3Url: s3Url, // Keep internal S3 URL if needed
      key: key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed: " + error.message },
      { status: 500 },
    );
  }
}
