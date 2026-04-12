"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, Package, Tag, Store, Settings, 
  TrendingUp, LogOut, Menu, X, ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Tag, label: "Categories", href: "/admin/categories" },
  { icon: Store, label: "Stores", href: "/admin/stores" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

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
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [stats, setStats] = useState({
    categoryCount: 0,
    productCount: 0,
    featuredCount: 0,
    storeCount: 0,
    totalInventoryValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    loadStats()
    return () => window.removeEventListener("resize", checkMobile)
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

  const handleLogout = async () => {
    const formData = new FormData()
    formData.append("action", "logout")
    await fetch("/admin/actions", { method: "POST", body: formData })
    router.push("/admin/login")
  }

  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--surface-stat)" }}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isMobile ? (sidebarOpen ? 0 : -280) : 0,
          width: isMobile ? 280 : (sidebarOpen ? 260 : 80)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${isMobile ? 'fixed' : 'sticky'} z-50 h-screen border-r flex flex-col ${
          isMobile ? 'left-0 top-0' : 'top-16'
        }`}
        style={{ 
          background: "var(--dark-panel)", 
          borderColor: "rgba(255,255,255,0.1)",
          marginTop: isMobile ? 0 : "64px"
        }}
      >
        {/* Mobile Header */}
        {isMobile && (
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <h2 className="text-white font-bold text-lg">Glacier Admin</h2>
            <button onClick={closeSidebar} className="text-white/50 hover:text-white p-2">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-white font-bold text-lg">Glacier Admin</h2>
              </motion.div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white/50 hover:text-white p-2"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
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
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div 
        className="flex-1 min-h-screen"
        style={{ marginTop: "64px", paddingBottom: "2rem" }}
      >
        {/* Mobile Header with Menu Button */}
        <header 
          className="sticky top-16 z-30 border-b flex items-center justify-between px-4 py-3 lg:hidden"
          style={{ 
            background: "var(--glass-bg)", 
            borderColor: "var(--border)"
          }}
        >
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[var(--surface-stat)]"
          >
            <Menu className="h-6 w-6" style={{ color: "var(--foreground)" }} />
          </button>
          <h1 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>Dashboard</h1>
          <div className="w-10" />
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Grid */}
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

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="mb-6 lg:mb-8">
              <Card>
                <CardHeader>
                  <CardTitle style={{ color: "var(--foreground)" }}>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <Button asChild size="sm">
                      <Link href="/admin/products">
                        <Package className="h-4 w-4" />
                        Add Product
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/categories">
                        <Tag className="h-4 w-4" />
                        Categories
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/stores">
                        <Store className="h-4 w-4" />
                        Add Store
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/settings">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories Overview */}
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
      </div>
    </div>
  )
}