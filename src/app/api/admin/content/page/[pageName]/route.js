import clientPromise from '../../../../../utils/mongodb'
import { NextResponse } from 'next/server'

async function getDb() {
  const client = await clientPromise
  return client.db('betopia_group')
}

/**
 * DELETE all documents in a page-specific collection.
 * Collection name: page_<pageName> (e.g., page_home, page_about-us)
 */
export async function DELETE (request, { params }) {
  try {
    const { pageName } = await params
    
    if (!pageName) {
      return NextResponse.json({ error: 'Page name required' }, { status: 400 })
    }

    const db = await getDb()
    const collectionName = `page_${pageName}`

    await db.collection(collectionName).deleteMany({})

    console.log(`[Admin Content] Reset collection: ${collectionName}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to reset page data:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
