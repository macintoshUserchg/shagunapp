import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [categories, products, stores] = await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.storeLocation.count(),
    ]);

    const featuredCount = await prisma.product.count({
      where: { featured: true },
    });

    const productsWithPrice = await prisma.product.findMany({
      select: { price: true },
    });
    const totalInventoryValue = productsWithPrice.reduce((sum, p) => sum + p.price, 0);

    return NextResponse.json({
      categoryCount: categories,
      productCount: products,
      featuredCount,
      storeCount: stores,
      totalInventoryValue,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}