import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const LATEST_PRODUCTS_FILE = path.join(process.cwd(), "static-data", "latestProducts.json")
const FEATURED_PRODUCTS_FILE = path.join(process.cwd(), "static-data", "featuredProducts.json")

function generateId(): string {
  return "cmne" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function GET() {
  try {
    const latestData = JSON.parse(fs.readFileSync(LATEST_PRODUCTS_FILE, "utf-8"))
    const featuredData = JSON.parse(fs.readFileSync(FEATURED_PRODUCTS_FILE, "utf-8"))
    
    const allProducts = latestData.map((p: any) => ({
      ...p,
      isFeatured: featuredData.some((f: any) => f.id === p.id)
    }))
    
    return NextResponse.json(allProducts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...productData } = body
    
    const latestData = JSON.parse(fs.readFileSync(LATEST_PRODUCTS_FILE, "utf-8"))
    const featuredData = JSON.parse(fs.readFileSync(FEATURED_PRODUCTS_FILE, "utf-8"))
    
    if (action === "add") {
      const newProduct = {
        id: generateId(),
        name: productData.name,
        slug: productData.name.toLowerCase().replace(/\s+/g, "-"),
        tagline: productData.tagline || "",
        description: productData.description || "",
        price: Number(productData.price) || 0,
        colorHex: productData.colorHex || "#cccccc",
        imageUrl: productData.imageUrl || "/glacier/placeholder.svg",
        featured: productData.isFeatured || false,
        categoryId: productData.categoryId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: productData.category
      }
      
      latestData.unshift(newProduct)
      
      if (productData.isFeatured) {
        featuredData.unshift(newProduct)
      }
      
      fs.writeFileSync(LATEST_PRODUCTS_FILE, JSON.stringify(latestData, null, 2))
      fs.writeFileSync(FEATURED_PRODUCTS_FILE, JSON.stringify(featuredData, null, 2))
      
      return NextResponse.json({ success: true, product: newProduct })
    }
    
    if (action === "update") {
      const index = latestData.findIndex((p: any) => p.id === productData.id)
      if (index === -1) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      
      const updatedProduct = {
        ...latestData[index],
        ...productData,
        slug: productData.name.toLowerCase().replace(/\s+/g, "-"),
        updatedAt: new Date().toISOString()
      }
      
      latestData[index] = updatedProduct
      
      const featIndex = featuredData.findIndex((f: any) => f.id === productData.id)
      if (productData.isFeatured && featIndex === -1) {
        featuredData.push(updatedProduct)
      } else if (!productData.isFeatured && featIndex !== -1) {
        featuredData.splice(featIndex, 1)
      } else if (productData.isFeatured && featIndex !== -1) {
        featuredData[featIndex] = updatedProduct
      }
      
      fs.writeFileSync(LATEST_PRODUCTS_FILE, JSON.stringify(latestData, null, 2))
      fs.writeFileSync(FEATURED_PRODUCTS_FILE, JSON.stringify(featuredData, null, 2))
      
      return NextResponse.json({ success: true, product: updatedProduct })
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error saving product:", error)
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }
    
    let latestData = JSON.parse(fs.readFileSync(LATEST_PRODUCTS_FILE, "utf-8"))
    let featuredData = JSON.parse(fs.readFileSync(FEATURED_PRODUCTS_FILE, "utf-8"))
    
    latestData = latestData.filter((p: any) => p.id !== id)
    featuredData = featuredData.filter((f: any) => f.id !== id)
    
    fs.writeFileSync(LATEST_PRODUCTS_FILE, JSON.stringify(latestData, null, 2))
    fs.writeFileSync(FEATURED_PRODUCTS_FILE, JSON.stringify(featuredData, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}