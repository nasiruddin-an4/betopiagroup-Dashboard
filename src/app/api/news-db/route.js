import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

let cachedClient = null;

async function getNewsClient() {
  if (cachedClient) return cachedClient;
  const uri = process.env.NEWS_MONGODB_URI;
  if (!uri) throw new Error("NEWS_MONGODB_URI not configured");
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function GET() {
  try {
    const client = await getNewsClient();
    const db = client.db("monirceodb");
    const news = await db
      .collection("news")
      .find({})
      .sort({ _id: -1 })
      .limit(100)
      .toArray();

    // Serialize _id to string
    const serialized = news.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error("Failed to fetch news from monirceodb:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
