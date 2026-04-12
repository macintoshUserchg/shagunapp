import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error loading categories:", error);
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === "add") {
      const slug = data.name.toLowerCase().replace(/\s+/g, "-");
      const category = await prisma.category.create({
        data: {
          name: data.name,
          slug,
          description: data.description || "",
          accentColor: data.accentColor || "#F97316",
        },
      });
      return NextResponse.json({ success: true, category });
    }

    if (action === "update") {
      const category = await prisma.category.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description || "",
          accentColor: data.accentColor || "#F97316",
        },
      });
      return NextResponse.json({ success: true, category });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error saving category:", error);
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}