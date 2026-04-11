import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const SETTINGS_FILE = path.join(process.cwd(), "static-data", "settings.json")

export async function GET() {
  try {
    const data = fs.readFileSync(SETTINGS_FILE, "utf-8")
    const settings = JSON.parse(data)
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const currentData = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"))
    
    const updatedSettings = {
      ...currentData,
      ...body,
      updatedAt: new Date().toISOString(),
    }
    
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2))
    
    return NextResponse.json({ success: true, settings: updatedSettings })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}