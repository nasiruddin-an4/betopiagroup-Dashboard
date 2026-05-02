import { MongoClient, ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

let cachedClient = null

async function getClient () {
  if (cachedClient) return cachedClient
  const uri = process.env.NEWS_MONGODB_URI
  if (!uri) throw new Error('NEWS_MONGODB_URI not configured')
  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  return client
}

export async function PUT (request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const client = await getClient()
    const db = client.db('monirceodb')
    
    await db.collection('news').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {
  try {
    const { id } = await params
    const client = await getClient()
    const db = client.db('monirceodb')
    
    await db.collection('news').deleteOne({ _id: new ObjectId(id) })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
