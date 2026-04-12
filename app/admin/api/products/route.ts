import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const productsWithFeatured = products.map(p => ({
      ...p,
      isFeatured: p.featured,
    }));

    return NextResponse.json(productsWithFeatured);
  } catch (error) {
    console.error("Error loading products:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...productData } = body;

    if (action === "add") {
      const category = await prisma.category.findUnique({
        where: { id: productData.categoryId },
      });

      const newProduct = await prisma.product.create({
        data: {
          name: productData.name,
          slug: productData.name.toLowerCase().replace(/\s+/g, "-"),
          tagline: productData.tagline || "",
          description: productData.description || "",
          price: Number(productData.price) || 0,
          colorHex: productData.colorHex || "#F59E0B",
          imageUrl: productData.imageUrl || "/glacier/placeholder.svg",
          featured: productData.isFeatured || false,
          categoryId: productData.categoryId,
        },
        include: { category: true },
      });

      return NextResponse.json({ success: true, product: newProduct });
    }

    if (action === "update") {
      const existing = await prisma.product.findUnique({
        where: { id: productData.id },
      });

      if (!existing) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productData.id },
        data: {
          name: productData.name,
          slug: productData.name.toLowerCase().replace(/\s+/g, "-"),
          tagline: productData.tagline || "",
          description: productData.description || "",
          price: Number(productData.price) || 0,
          colorHex: productData.colorHex || "#F59E0B",
          imageUrl: productData.imageUrl,
          featured: productData.isFeatured || false,
          categoryId: productData.categoryId,
        },
        include: { category: true },
      });

      return NextResponse.json({ success: true, product: updatedProduct });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error saving product:", error);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}