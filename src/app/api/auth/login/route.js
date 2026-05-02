import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function POST (request) {
  try {
    const body = await request.json()
    const email = (body.email || '').trim().toLowerCase()
    const password = body.password || ''

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const jwtSecret = process.env.JWT_SECRET

    if (!adminEmail || !adminPassword || !jwtSecret) {
      return NextResponse.json(
        { error: 'Server authentication is not configured.' },
        { status: 500 }
      )
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    if (
      email !== adminEmail.trim().toLowerCase() ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const payload = {
      email: adminEmail.trim().toLowerCase(),
      role: 'admin',
      type: 'dashboard-auth'
    }

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '8h'
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: adminEmail.trim().toLowerCase(),
        role: 'admin'
      }
    })
  } catch (error) {
    console.error('Auth login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
