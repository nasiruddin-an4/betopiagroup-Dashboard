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

// GET all offers (docs with 'title' field, optionally filter by category)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const client = await getClient();
    const db = client.db("betopia_group");

    // Only fetch offers (have 'title'), not categories (have 'name' only)
    const filter = { title: { $exists: true } };
    if (category) filter.category = category;

    const offers = await db
      .collection("corporate_offer")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = offers.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    // Fetch all categories for the listing/sidebar
    const categories = await db
      .collection("corporate_offer")
      .find({ name: { $exists: true }, title: { $exists: false } })
      .sort({ createdAt: -1 })
      .toArray();

    const serializedCategories = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
    }));

    // Fetch specific category details if a filter is applied
    let categoryDetails = null;
    if (category) {
      categoryDetails = serializedCategories.find(
        (cat) => cat.name.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: serialized,
      categories: serializedCategories,
      categoryDetails: categoryDetails || null,
    });
  } catch (error) {
    console.error("Failed to fetch corporate offers:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - create new offer
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      partner,
      category,
      location,
      applicability,
      website,
      hotline,
      image,
      logo,
      tnc,
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db("betopia_group");

    const newOffer = {
      title: title || "",
      description: description || "",
      partner: partner || "",
      category: category || "",
      location: location || "",
      applicability: applicability || "",
      website: website || "",
      hotline: hotline || "",
      image: image || "",
      logo: logo || "",
      tnc: Array.isArray(tnc) ? tnc : [],
      createdAt: new Date(),
    };

    const result = await db.collection("corporate_offer").insertOne(newOffer);

    return NextResponse.json({
      success: true,
      data: { ...newOffer, _id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error("Failed to create offer:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT - update offer
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, ...updateFields } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Offer ID is required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db("betopia_group");

    // Remove undefined fields
    const updateData = {};
    Object.entries(updateFields).forEach(([key, value]) => {
      if (value !== undefined) updateData[key] = value;
    });

    await db
      .collection("corporate_offer")
      .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update offer:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE - delete offer
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Offer ID is required" },
        { status: 400 },
      );
    }

    const client = await getClient();
    const db = client.db("betopia_group");

    await db.collection("corporate_offer").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete offer:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
