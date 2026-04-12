"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Package, Tag, Store, Settings, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  } as const
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categoryCount: 0,
    productCount: 0,
    featuredCount: 0,
    storeCount: 0,
    totalInventoryValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch("/admin/api/stats")
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error("Failed to load stats:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 lg:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          {[
            { label: "Products", value: stats.productCount, icon: Package },
            { label: "Categories", value: stats.categoryCount, icon: Tag },
            { label: "Stores", value: stats.storeCount, icon: Store },
            { label: "Featured", value: stats.featuredCount, icon: TrendingUp },
          ].map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 lg:p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs lg:text-sm" style={{ color: "var(--muted)" }}>{stat.label}</p>
                      <p className="text-xl lg:text-2xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
                        {loading ? "..." : stat.value}
                      </p>
                    </div>
                    <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-lg"
                      style={{ background: "var(--accent-soft)" }}>
                      <stat.icon className="h-4 w-4 lg:h-5 lg:w-5" style={{ color: "var(--accent)" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle style={{ color: "var(--foreground)" }}>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
                {[
                  { name: "Signature Tubs", color: "#FF7A59" },
                  { name: "Bars & Cones", color: "#7C3AED" },
                  { name: "Indian Classics", color: "#D97706" },
                  { name: "Fruit Flavours", color: "#E11D48" },
                  { name: "Cups & Sundaes", color: "#0EA5E9" },
                  { name: "Shakes & Specials", color: "#8B5CF6" },
                ].map((cat) => (
                  <Link 
                    key={cat.name} 
                    href="/admin/categories"
                    className="flex items-center gap-2 p-2 lg:p-3 rounded-lg border hover:bg-[var(--surface-stat)] transition-colors"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs lg:text-sm truncate" style={{ color: "var(--foreground)" }}>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  )
}