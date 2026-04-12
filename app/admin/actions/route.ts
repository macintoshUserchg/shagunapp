import { NextRequest, NextResponse } from "next/server"
import { createSession, clearSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const action = formData.get("action") as string

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@glaciericecream.com"
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "glacier2024"

  if (action === "login") {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    await createSession({
      userId: "admin",
      email: email,
      name: "Admin",
    })

    return NextResponse.json({ success: true })
  }

  if (action === "logout") {
    await clearSession()
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 })
}