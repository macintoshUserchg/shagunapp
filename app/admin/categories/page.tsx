"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, Plus, Search, Edit, Trash2, X, Loader2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  accentColor: string
  products: any[]
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

const colorOptions = [
  "#FF7A59", "#7C3AED", "#D97706", "#E11D48", "#0EA5E9", "#8B5CF6", 
  "#10B981", "#F59E0B", "#3B82F6", "#EC4899", "#6366F1", "#14B8A6"
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accentColor: "#FF7A59",
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const res = await fetch("/admin/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Failed to load categories:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description,
        accentColor: category.accentColor,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: "",
        description: "",
        accentColor: "#FF7A59",
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        action: editingCategory ? "update" : "add",
        id: editingCategory?.id,
        ...formData,
      }

      const res = await fetch("/admin/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowModal(false)
        loadCategories()
      }
    } catch (err) {
      console.error("Failed to save category:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All products in this category will also be deleted.")) return
    
    try {
      await fetch(`/admin/api/categories?id=${id}`, { method: "DELETE" })
      loadCategories()
    } catch (err) {
      console.error("Failed to delete category:", err)
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
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Categories</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Manage product categories</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted)" }} />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden group hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold"
                    style={{ backgroundColor: category.accentColor }}
                  >
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>{category.name}</h3>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{category.products.length} products</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenModal(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm line-clamp-2" style={{ color: "var(--muted)" }}>
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

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
              className="w-full max-w-md rounded-2xl"
              style={{ background: "var(--glass-bg)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
                <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  {editingCategory ? "Edit Category" : "Add Category"}
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
                    placeholder="Category name"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category description"
                    className="flex min-h-[80px] w-full rounded-lg border border-[var(--border)] bg-[var(--glass-bg)] px-3 py-2 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Accent Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, accentColor: color })}
                        className={`h-8 w-8 rounded-full border-2 ${formData.accentColor === color ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-2 p-4 border-t" style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving || !formData.name}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCategory ? "Update" : "Add"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}