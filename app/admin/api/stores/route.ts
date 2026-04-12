import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stores = await prisma.storeLocation.findMany({
      orderBy: { city: "asc" },
    });
    return NextResponse.json(stores);
  } catch (error) {
    console.error("Error loading stores:", error);
    return NextResponse.json({ error: "Failed to load stores" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "add") {
      const slug = data.city.toLowerCase().replace(/\s+/g, "-");
      const store = await prisma.storeLocation.create({
        data: {
          city: data.city,
          slug,
          address: data.address || "",
          hours: data.hours || "11:00 AM – 10:00 PM",
          phone: data.phone || "",
        },
      });
      return NextResponse.json({ success: true, store });
    }

    if (action === "update") {
      const store = await prisma.storeLocation.update({
        where: { id: data.id },
        data: {
          city: data.city,
          address: data.address || "",
          hours: data.hours || "11:00 AM – 10:00 PM",
          phone: data.phone || "",
        },
      });
      return NextResponse.json({ success: true, store });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error saving store:", error);
    return NextResponse.json({ error: "Failed to save store" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Store ID required" }, { status: 400 });
    }

    await prisma.storeLocation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting store:", error);
    return NextResponse.json({ error: "Failed to delete store" }, { status: 500 });
  }
}