import clientPromise from '../../utils/mongodb';
import { NextResponse } from "next/server";

async function getDb() {
  const client = await clientPromise;
  return client.db("betopia_group");
}

export async function GET() {
  try {
    const db = await getDb();

    // 1. Fetch all individual ventures from `page_ventures` collection
    const ventures = await db
      .collection("page_ventures")
      .find({ name: { $exists: true } })
      .sort({ createdAt: 1 })
      .toArray();

    console.log(`[Ventures API] Found ${ventures.length} ventures in database`);

    // 2. Fetch hero text from page_ventures collection (contentKey-based docs)
    const pageContent = await db
      .collection("page_ventures")
      .find({ contentKey: { $exists: true } })
      .toArray();

    const pageSettings = {};
    pageContent.forEach((item) => {
      let value = item.value;
      if (item.type === 'json' || (typeof value === 'string' && (value.startsWith('{') || value.startsWith('[')))) {
        try { value = JSON.parse(value); } catch (e) {}
      }
      pageSettings[item.contentKey] = value;
    });

    // 3. Construct the response
    let heroLineOne = pageSettings.hero_line_one || "One Group";
    let heroLineTwo = pageSettings.hero_line_two || "Multiple Engines of Growth";

    let categories = [];
    try {
      if (pageSettings.venture_categories) {
        categories = typeof pageSettings.venture_categories === 'string' 
          ? JSON.parse(pageSettings.venture_categories) 
          : pageSettings.venture_categories;
      }
    } catch (e) {
      console.warn("[Ventures API] Failed to parse venture_categories:", e.message);
    }

    // Populate categories with ventures
    if (Array.isArray(categories) && categories.length > 0) {
      categories = categories.map(cat => {
        const catVentures = ventures
          .filter(v => v.category === cat.title)
          .map(v => ({
            ...v,
            id: v._id.toString(),
            _id: v._id.toString()
          }));
        return { ...cat, ventures: catVentures };
      });

      // If all categories ended up empty (maybe categories were renamed), fallback to grouping
      const totalPopulated = categories.reduce((sum, c) => sum + (c.ventures?.length || 0), 0);
      if (totalPopulated === 0 && ventures.length > 0) {
        console.log("[Ventures API] Defined categories were all empty, falling back to grouping");
        categories = [];
      }
    }

    // Fallback: Group by the 'category' field in the ventures themselves
    if (!Array.isArray(categories) || categories.length === 0) {
      const groups = ventures.reduce((acc, v) => {
        const cat = v.category || "Our Ventures";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({ 
          ...v, 
          id: v._id.toString(),
          _id: v._id.toString() 
        });
        return acc;
      }, {});

      categories = Object.entries(groups).map(([title, items]) => ({
        title,
        ventures: items
      }));
      console.log(`[Ventures API] Fallback grouping created ${categories.length} categories`);
    }

    return NextResponse.json({
      success: true,
      data: {
        hero_line_one: heroLineOne,
        hero_line_two: heroLineTwo,
        venture_categories: categories
      }
    });

  } catch (error) {
    console.error("Failed to fetch consolidated ventures page data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
