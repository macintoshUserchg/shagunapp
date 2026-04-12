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
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--accent)" }}>
            <Image src="/glacier/logo.svg" alt="GlacierIce Cream" width={60} height={24} className="h-6 w-auto object-contain brightness-0 invert" />
          </div>
          <span className="text-white font-semibold hidden sm:inline">GlacierIce Cream Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      {children}
    </ToastProvider>
  )
}