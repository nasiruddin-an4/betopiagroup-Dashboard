import clientPromise from '../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

async function getDb() {
  const client = await clientPromise
  return client.db('betopia_group')
}

export async function GET () {
  try {
    const db = await getDb()

    const ventures = await db
      .collection('page_ventures')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const serialized = ventures.map(item => ({
      ...item,
      _id: item._id.toString()
    }))

    return NextResponse.json({ success: true, data: serialized })
  } catch (error) {
    console.error('Failed to fetch ventures:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST (request) {
  try {
    const body = await request.json()
    const { name, logoUrl, websiteUrl, category, description } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const db = await getDb()

    const newVenture = {
      name,
      logoUrl: logoUrl || '',
      websiteUrl: websiteUrl || '',
      category: category || 'General',
      description: description || '',
      createdAt: new Date()
    }

    const result = await db.collection('page_ventures').insertOne(newVenture)

    return NextResponse.json({
      success: true,
      data: { ...newVenture, _id: result.insertedId.toString() }
    })
  } catch (error) {
    console.error('Failed to create venture:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT (request) {
  try {
    const body = await request.json()
    const { _id, ...updateFields } = body

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Venture ID is required' },
        { status: 400 }
      )
    }

    const db = await getDb()

    const updateData = {}
    Object.entries(updateFields).forEach(([key, value]) => {
      if (value !== undefined) updateData[key] = value
    })

    await db
      .collection('page_ventures')
      .updateOne({ _id: new ObjectId(_id) }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update venture:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE (request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Venture ID is required' },
        { status: 400 }
      )
    }

    const db = await getDb()

    await db.collection('page_ventures').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete venture:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

