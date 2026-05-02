import clientPromise from '../../../utils/mongodb'
import { NextResponse } from 'next/server'

async function getDb () {
  const client = await clientPromise
  return client.db('betopia_group')
}

/**
 * GET /api/pages/[slug]
 * Dynamically fetches data from the `page_<slug>` collection.
 * e.g., /api/pages/home → page_home, /api/pages/about-us → page_about-us
 */
export async function GET (request, { params }) {
  try {
    const { slug } = await params
    const db = await getDb()
    const collectionName = `page_${slug}`

    const content = await db.collection(collectionName).find({}).toArray()

    if (content.length === 0) {
      return NextResponse.json({
        success: true,
        data: {},
        message: 'No data found'
      })
    }

    const data = {}
    content.forEach(item => {
      let value = item.value
      if (
        item.type === 'json' ||
        (typeof value === 'string' &&
          (value.startsWith('{') || value.startsWith('[')))
      ) {
        try {
          value = JSON.parse(value)
        } catch (e) {}
      }
      if (item.contentKey) {
        data[item.contentKey] = value
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/pages/[slug]
 * Dynamically saves key-value pairs into the `page_<slug>` collection.
 * Body: { "key1": "value1", "key2": { ... } }
 */
export async function POST (request, { params }) {
  try {
    const { slug } = await params
    const body = await request.json()
    const db = await getDb()
    const collectionName = `page_${slug}`
    const collection = db.collection(collectionName)

    const updates = Object.entries(body).map(async ([key, value]) => {
      const type = typeof value === 'object' ? 'json' : 'text'
      const stringValue =
        typeof value === 'object' ? JSON.stringify(value) : value

      return collection.updateOne(
        { contentKey: key },
        {
          $set: {
            contentKey: key,
            value: stringValue,
            type,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      )
    })

    await Promise.all(updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/pages/[slug]
 * Deletes all content in the `page_<slug>` collection.
 */
export async function DELETE (request, { params }) {
  try {
    const { slug } = await params
    const db = await getDb()

    await db.collection(`page_${slug}`).deleteMany({})
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
