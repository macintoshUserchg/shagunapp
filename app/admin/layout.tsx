"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, Package, Tag, Store, Settings, 
  LogOut, Menu, X
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ToastProvider } from "@/components/toast"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Tag, label: "Categories", href: "/admin/categories" },
  { icon: Store, label: "Stores", href: "/admin/stores" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    <ToastProvider>
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

        {/* Top Header */}
        <header 
          className="fixed top-0 left-0 right-0 z-50 border-b flex items-center justify-between px-4 h-16"
          style={{ 
            background: "var(--dark-panel)", 
            borderColor: "rgba(255,255,255,0.1)" 
          }}
        >
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: "var(--accent)" }}>
              <Image src="/glacier/logo.svg" alt="GlacierIce Cream" width={60} height={24} className="h-6 w-auto object-contain brightness-0 invert" />
            </div>
            <span className="text-white font-semibold hidden sm:inline">GlacierIce Cream Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white/50 hover:text-white p-2 lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="h-8 w-8 rounded-full flex items-center justify-center hidden sm:flex"
              style={{ background: "var(--accent)" }}>
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-sm font-semibold">Admin</p>
              <p className="text-white/50 text-xs">admin@glaciericecream.com</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

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
          {children}
        </div>
      </div>
    </ToastProvider>
  )
}