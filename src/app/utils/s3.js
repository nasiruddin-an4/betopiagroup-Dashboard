import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(buffer, key, mimeType) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  try {
    await s3Client.send(command);
    // Construct the direct public S3 URL
    const region = process.env.AWS_REGION || "us-east-1";
    const bucket = process.env.AWS_S3_BUCKET;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return { url, key };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw error;
  }
}

export async function deleteFromS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("S3 Deletion Error:", error);
    throw error;
  }
}

export default s3Client;

/**
 * Root folder inside the bucket for all uploads in this project.
 */
export const PROJECT_FOLDER = "betopia-group-web";

export function getImageUrl(url) {
  if (!url) return "";

  // Already a CDN URL, proxy URL, blob URL, or relative local path — return as-is
  if (
    url.includes("assets.betopiagroup.com") ||
    url.startsWith("/api/proxy/image") ||
    url.startsWith("blob:") ||
    url.startsWith("/")
  ) {
    return url;
  }

  // Direct S3 URL → convert to CDN
  // Grab everything after ".amazonaws.com/" as the full key
  const s3Match = url.match(/https?:\/\/[^\/]*\.amazonaws\.com\/(.+)/);

  if (s3Match) {
    const fullKey = s3Match[1];
    // Handle both cases: if key already includes the prefix, use it as is, otherwise add it.
    const path = fullKey.startsWith(`${PROJECT_FOLDER}/`)
      ? fullKey
      : `${PROJECT_FOLDER}/${fullKey}`;
    return `https://assets.betopiagroup.com/${path}`;
  }

  // Non-S3 external images (Unsplash, postimg, etc.) — return as-is
  return url;
}

/**
 * Process HTML content and replace all S3 image URLs with CDN URLs.
 * This is needed for rich-text blog content where <img> tags contain
 * raw S3 URLs that bypass the getImageUrl() helper.
 */
export function processContentImages(html) {
  if (!html) return html;

  // Replace &nbsp; with regular spaces so text wraps at word boundaries
  let processed = html.replace(/&nbsp;/g, " ");

  // Replace S3 URLs in src attributes (both regional and generic S3 patterns)
  processed = processed.replace(
    /(https?:\/\/[^"'\s]*\.amazonaws\.com\/[^"'\s]+)/g,
    (match) => getImageUrl(match),
  );

  return processed;
}
