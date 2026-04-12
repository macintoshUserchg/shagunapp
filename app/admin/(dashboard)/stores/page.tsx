"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Store, Plus, Search, Edit, Trash2, X, Loader2, MapPin, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StoreLocation {
  id: string
  city: string
  slug: string
  address: string
  hours: string
  phone: string
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

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    city: "",
    address: "",
    hours: "11:00 AM – 10:00 PM",
    phone: "",
  })

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    try {
      const res = await fetch("/admin/api/stores")
      const data = await res.json()
      setStores(data)
    } catch (err) {
      console.error("Failed to load stores:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStores = stores.filter(s => 
    s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (store?: StoreLocation) => {
    if (store) {
      setEditingStore(store)
      setFormData({
        city: store.city,
        address: store.address,
        hours: store.hours,
        phone: store.phone,
      })
    } else {
      setEditingStore(null)
      setFormData({
        city: "",
        address: "",
        hours: "11:00 AM – 10:00 PM",
        phone: "",
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        action: editingStore ? "update" : "add",
        id: editingStore?.id,
        ...formData,
      }

      const res = await fetch("/admin/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setShowModal(false)
        loadStores()
      }
    } catch (err) {
      console.error("Failed to save store:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this store?")) return
    
    try {
      await fetch(`/admin/api/stores?id=${id}`, { method: "DELETE" })
      loadStores()
    } catch (err) {
      console.error("Failed to delete store:", err)
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
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Store Locations</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Manage your physical stores</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted)" }} />
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStores.map((store) => (
          <Card key={store.id} className="overflow-hidden group hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 border-b p-4" style={{ borderColor: "var(--border)", background: "var(--accent-soft)" }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--accent)", color: "#fff" }}>
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: "var(--foreground)" }}>{store.city}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <p className="text-sm" style={{ color: "var(--muted)" }}>{store.address}</p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                    <Clock className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                    {store.hours}
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                    <Phone className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                    {store.phone}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenModal(store)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(store.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
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
                  {editingStore ? "Edit Store" : "Add Store"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[var(--surface-stat)]">
                  <X className="h-5 w-5" style={{ color: "var(--muted)" }} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Jaipur"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address"
                    className="flex min-h-[80px] w-full rounded-lg border border-[var(--border)] bg-[var(--glass-bg)] px-3 py-2 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 12345 67890"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Hours</label>
                  <Input
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="11:00 AM – 10:00 PM"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-2 p-4 border-t" style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving || !formData.city || !formData.address}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingStore ? "Update" : "Add"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}