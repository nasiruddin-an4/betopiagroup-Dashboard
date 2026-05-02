import clientPromise from '../../../utils/mongodb'
import { NextResponse } from 'next/server'

async function getDb() {
  const client = await clientPromise
  return client.db('betopia_group')
}

/**
 * Maps a page name to its MongoDB collection name.
 * Collections: page_home, page_about-us, page_career, page_footer,
 *              page_industries, page_leadership, page_news-media,
 *              page_ventures, page_vision-2030
 */
function getCollectionName(pageName) {
  return `page_${pageName}`
}

export async function GET (request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (!page) {
      return NextResponse.json({ error: 'Page parameter required' }, { status: 400 })
    }

    const db = await getDb()
    const collectionName = getCollectionName(page)
    
    const content = await db
      .collection(collectionName)
      .find({})
      .toArray()

    console.log(`[Admin Content API] Collection: ${collectionName}, Found ${content.length} items`)
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Failed to load content:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const body = await request.json()
    const { page, component, contentKey, value, type } = body

    if (!page || !contentKey) {
      return NextResponse.json({ error: 'Page and contentKey required' }, { status: 400 })
    }

    const db = await getDb()
    const collectionName = getCollectionName(page)

    const updateData = {
      contentKey,
      value,
      type: type || 'text',
      updatedAt: new Date(),
      updatedBy: 'admin@betopiagroup.com'
    }

    await db.collection(collectionName).updateOne(
      { contentKey },
      { $set: updateData },
      { upsert: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save content:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
