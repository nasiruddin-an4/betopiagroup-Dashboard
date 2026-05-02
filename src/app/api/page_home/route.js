import clientPromise from '../../utils/mongodb'
import { NextResponse } from 'next/server'

async function getDb() {
  const client = await clientPromise
  return client.db('betopia_group')
}

/**
 * GET /api/page_home
 * Reads all documents from the `page_home` collection
 * and returns them as a flat key-value object.
 */
export async function GET () {
  try {
    const db = await getDb()
    const content = await db.collection('page_home').find({}).toArray()
    
    const data = {}
    content.forEach(item => {
      let value = item.value
      if (item.type === 'json' || (typeof value === 'string' && (value.startsWith('{') || value.startsWith('[')))) {
        try { value = JSON.parse(value) } catch (e) {}
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
