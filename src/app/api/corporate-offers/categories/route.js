import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not configured");
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

// GET all categories (docs with 'name' field, no 'title' field)
export async function GET() {
  try {
    const client = await getClient();
    const db = client.db("betopia_group");

    const categories = await db
      .collection("corporate_offer")
      .find({ name: { $exists: true }, title: { $exists: false } })
      .sort({ createdAt: -1 })
      .toArray();

    // Also count offers per category
    const offerCounts = await db
      .collection("corporate_offer")
      .aggregate([
        { $match: { title: { $exists: true } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ])
      .toArray();

    const countMap = {};
    offerCounts.forEach((item) => {
      if (item._id) countMap[item._id] = item.count;
    });

    const serialized = categories.map((item) => ({
      ...item,
      _id: item._id.toString(),
      offerCount: countMap[item.name] || 0,
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - create new category
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db("betopia_group");

    const newCategory = {
      name,
      description: description || "",
      image: image || "",
      createdAt: new Date(),
    };

    const result = await db
      .collection("corporate_offer")
      .insertOne(newCategory);

    return NextResponse.json({
      success: true,
      data: { ...newCategory, _id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT - update category
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, name, description, image } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db("betopia_group");

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;

    await db
      .collection("corporate_offer")
      .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE - delete category
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db("betopia_group");

    await db.collection("corporate_offer").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
