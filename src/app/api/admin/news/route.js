import { MongoClient } from 'mongodb'
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

export async function GET () {
  try {
    const client = await getClient()
    const db = client.db('monirceodb')
    const news = await db.collection('news').find({}).sort({ date: -1 }).toArray()
    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST (request) {
  try {
    const body = await request.json()
    const client = await getClient()
    const db = client.db('monirceodb')
    const result = await db.collection('news').insertOne({
      ...body,
      createdAt: new Date()
    })
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
