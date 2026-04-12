"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Plus, Search, Edit, Trash2, X, Loader2, Check, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/toast"

interface Product {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  price: number
  colorHex: string
  imageUrl: string
  featured: boolean
  categoryId: string
  category: {
    name: string
    slug: string
  }
  isFeatured?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  } as const
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { type: "spring" as const, duration: 0.3 }
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const { addToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    price: "",
    colorHex: "#cccccc",
    imageUrl: "/glacier/placeholder.svg",
    categoryId: "",
    isFeatured: false,
  })

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    try {
      const res = await fetch("/admin/api/products")
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error("Failed to load products:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await fetch("/admin/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Failed to load categories:", err)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        tagline: product.tagline || "",
        description: product.description || "",
        price: product.price.toString(),
        colorHex: product.colorHex,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        isFeatured: product.isFeatured || false,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        tagline: "",
        description: "",
        price: "",
        colorHex: "#cccccc",
        imageUrl: "/glacier/placeholder.svg",
        categoryId: "",
        isFeatured: false,
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    // Validation
    if (!formData.name || !formData.categoryId || !formData.price) {
      addToast("Please fill in all required fields", "error")
      return
    }
    
    setSaving(true)
    try {
      const category = categories.find(c => c.id === formData.categoryId)
      const payload = {
        action: editingProduct ? "update" : "add",
        ...formData,
        price: Number(formData.price),
        category: category,
      }
      
      if (editingProduct) {
        (payload as any).id = editingProduct.id
      }

      const res = await fetch("/admin/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowModal(false)
        loadProducts()
        addToast(editingProduct ? "Product updated!" : "Product created!", "success")
      } else {
        const data = await res.json()
        addToast(data.error || "Failed to save product", "error")
      }
    } catch (err) {
      console.error("Failed to save product:", err)
      addToast("An unexpected error occurred", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      const res = await fetch(`/admin/api/products?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        loadProducts()
        addToast("Product deleted!", "success")
      } else {
        addToast("Failed to delete product", "error")
      }
    } catch (err) {
      console.error("Failed to delete product:", err)
      addToast("An unexpected error occurred", "error")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Products</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Manage your product catalog</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted)" }} />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all">
            <div className="relative h-40 bg-[var(--surface-stat)]">
              <div 
                className="absolute inset-0 flex items-center justify-center text-4xl"
                style={{ backgroundColor: product.colorHex + "20" }}
              >
                <ImageIcon className="h-12 w-12 opacity-30" style={{ color: product.colorHex }} />
              </div>
              {product.isFeatured && (
                <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "var(--accent)" }}>★ Featured</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" onClick={() => handleOpenModal(product)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                {product.category?.name || "Uncategorized"}
              </p>
              <h3 className="font-semibold mt-1" style={{ color: "var(--foreground)" }}>{product.name}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>₹{product.price}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{ background: "var(--glass-bg)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
                <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[var(--surface-stat)]">
                  <X className="h-5 w-5" style={{ color: "var(--muted)" }} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Tagline</label>
                  <Input
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Short description"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Full description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Price (₹)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--glass-bg)] px-3 py-2 text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Color Hex</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.colorHex}
                        onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                        className="h-10 w-10 rounded-lg border cursor-pointer"
                      />
                      <Input
                        value={formData.colorHex}
                        onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                        placeholder="#cccccc"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Image URL</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/glacier/placeholder.jpg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    Mark as Featured
                  </label>
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-2 p-4 border-t" style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving || !formData.name || !formData.categoryId}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingProduct ? "Update" : "Add"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}