"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  LayoutDashboard, Package, Tag, Store, Settings, 
  TrendingUp, DollarSign, LogOut, Menu, X,
  Plus, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Tag, label: "Categories", href: "/admin/categories" },
  { icon: Store, label: "Stores", href: "/admin/stores" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

const stats = [
  { label: "Total Products", value: "5", change: "+2", icon: Package },
  { label: "Categories", value: "6", change: "+1", icon: Tag },
  { label: "Store Locations", value: "3", change: "+0", icon: Store },
  { label: "Featured Items", value: "3", change: "Top", icon: TrendingUp },
]

const recentProducts = []

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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLogout = async () => {
    const formData = new FormData()
    formData.append("action", "logout")
    await fetch("/admin/actions", { method: "POST", body: formData })
    window.location.href = "/admin/login"
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--surface-stat)" }}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="fixed left-0 top-0 z-40 h-screen border-r flex flex-col"
        style={{ 
          background: "var(--dark-panel)", 
          borderColor: "rgba(255,255,255,0.1)",
          marginTop: "64px"
        }}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-white font-bold text-lg">GlacierIce Cream Admin</h2>
            </motion.div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/50 hover:text-white p-2"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div 
        className="flex-1 transition-all"
        style={{ marginLeft: sidebarOpen ? "260px" : "80px", marginTop: "64px" }}
      >
        {/* Top Header */}
        <header 
          className="sticky top-0 z-30 border-b flex items-center justify-between px-6 py-4"
          style={{ 
            background: "var(--glass-bg)", 
            borderColor: "var(--border)",
            backdropFilter: "blur(20px)"
          }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--accent)" }}>
                <span className="text-white font-semibold">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Admin</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>admin@glaciericecream.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div key={stat.label} variants={itemVariants}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm" style={{ color: "var(--muted)" }}>{stat.label}</p>
                          <p className="text-2xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
                            {stat.value}
                          </p>
                          <p className="text-xs mt-2" style={{ color: "var(--accent)" }}>
                            {stat.change}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{ background: "var(--accent-soft)" }}>
                          <stat.icon className="h-5 w-5" style={{ color: "var(--accent)" }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: "var(--foreground)" }}>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href="/admin/products">
                        <Plus className="h-4 w-4" />
                        Add Product
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/admin/categories">
                        <Tag className="h-4 w-4" />
                        Categories
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/admin/stores">
                        <Store className="h-4 w-4" />
                        Add Store
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories Overview */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle style={{ color: "var(--foreground)" }}>Categories</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/categories">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: "Signature Tubs", color: "#FF7A59" },
                      { name: "Bars & Cones", color: "#7C3AED" },
                      { name: "Indian Classics", color: "#D97706" },
                      { name: "Fruit Flavours", color: "#E11D48" },
                      { name: "Cups & Sundaes", color: "#0EA5E9" },
                      { name: "Shakes & Specials", color: "#8B5CF6" },
                    ].map((cat) => (
                      <div key={cat.name} className="flex items-center gap-2 p-2 rounded-lg border" style={{ borderColor: "var(--border)" }}>
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm" style={{ color: "var(--foreground)" }}>{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}