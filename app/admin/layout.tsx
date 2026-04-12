"use client"

import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { ToastProvider } from "@/components/toast"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
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
      {children}
    </ToastProvider>
  )
}