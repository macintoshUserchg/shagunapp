"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight, MapPin, Phone, Clock, Star, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/product-image"
import { ThemeToggle } from "@/components/theme-toggle"
import { getPublicSiteData } from "@/lib/data"

const navLinks = [
  { href: "#flavours",    label: "Choose Your Flavour" },
  { href: "#collections", label: "Collections" },
  { href: "#about",       label: "Know Us Better" },
  { href: "#stores",      label: "We're Close By" },
]

const paletteCategories = [
  { label: "Chocolate",         slug: "bars-and-cones",       color: "#5C2D0A" },
  { label: "Indian Traditional",slug: "indian-classics",      color: "#D97706" },
  { label: "Fruits",            slug: "fruit-flavours",       color: "#E11D48" },
  { label: "Signature Tubs",    slug: "signature-tubs",       color: "#FF7A59" },
  { label: "Cups & Sundaes",    slug: "cups-and-sundaes",     color: "#0EA5E9" },
  { label: "Shakes & Specials", slug: "shakes-and-specials",  color: "#8B5CF6" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  } as const
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

export default function HomeClient({ 
  settings, 
  categories, 
  featuredProducts, 
  latestProducts, 
  stores 
}: {
  settings: any
  categories: any[]
  featuredProducts: any[]
  latestProducts: any[]
  stores: any[]
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const bestSellers = featuredProducts.length > 0 ? featuredProducts : latestProducts.slice(0, 4)

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b"
        style={{ borderColor: "var(--border)", background: "var(--glass-bg)", backdropFilter: "blur(20px)" }}
      >
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/glacier/logo.png" alt="GlacierIce Cream" width={120} height={40} className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link href={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--muted)" }}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/admin/login"
              className="hidden items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold sm:flex"
              style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "var(--surface-stat)" }}>
              Admin <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? "auto" : 0 }}
          className="lg:hidden border-t overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <nav className="p-4 space-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      </motion.header>

      {/* ══ HERO BANNERS ════════════════════════════════════════════════════ */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
          {[
            { src: "/glacier/banner-belgian.jpg",     alt: "Belgian Dark Chocolate", label: "New Arrival" },
            { src: "/glacier/banner-kulfi.jpg",        alt: "Kulfi Collection",       label: "Indian Classic" },
            { src: "/glacier/banner-wild-berries.jpg", alt: "Wild Berries",           label: "Bestseller" },
          ].map((b, i) => (
            <motion.div
              key={b.src}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative h-48 sm:h-64 md:h-80 overflow-hidden"
            >
              <Image src={b.src} alt={b.alt} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" priority />
              <div className="absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }}>
                <span className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/70"
                  style={{ background: "rgba(255,255,255,0.15)" }}>{b.label}</span>
                <p className="text-lg font-bold text-white">{b.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══ BEST SELLERS ════════════════════════════════════════════════════ */}
      <motion.section 
        id="flavours"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16"
      >
        <div className="shell">
          <motion.div variants={fadeInUp} className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-kicker">Best Sellers</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>
                {settings.featuredTitle}
              </h2>
            </div>
            <Link href="#menu" className="hidden items-center gap-1 text-sm font-semibold sm:flex"
              style={{ color: "var(--accent)" }}>
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bestSellers.map((product) => (
              <motion.article
                key={product.id}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group overflow-hidden rounded-2xl border transition-all"
                style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}
              >
                <div className="relative overflow-hidden">
                  <ProductImage imageUrl={product.imageUrl} colorHex={product.colorHex} name={product.name} compact />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 flex items-end justify-between p-3"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
                  >
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold" style={{ color: "var(--accent-text)" }}>
                      BUY NOW
                    </span>
                    <span className="rounded-full px-2 py-1 text-xs font-bold text-white"
                      style={{ background: "var(--dark-panel)" }}>₹{product.price}</span>
                  </motion.div>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                    {product.category.name}
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{product.tagline}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ══ CHOOSE YOUR PALETTE (categories) ════════════════════════════════ */}
      <motion.section 
        id="collections"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="border-y py-12 sm:py-16"
        style={{ borderColor: "var(--border)", background: "var(--surface-stat)" }}
      >
        <div className="shell">
          <motion.div variants={fadeInUp} className="mb-8 text-center">
            <p className="section-kicker">Choose Your</p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>PALETTE</h2>
          </motion.div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {paletteCategories.map((cat, i) => {
              const dbCat = categories.find((c) => c.slug === cat.slug)
              return (
                <motion.div
                  key={cat.slug}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <Link href="#menu"
                    className="group flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all"
                    style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}
                  >
                    <motion.div 
                      className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                      style={{ background: `${cat.color}18`, border: `2px solid ${cat.color}30` }}
                      whileHover={{ scale: 1.1 }}
                    >
                      🍦
                    </motion.div>
                    <p className="text-xs font-semibold leading-tight" style={{ color: "var(--foreground)" }}>{cat.label}</p>
                    {dbCat && (
                      <p className="text-[10px]" style={{ color: "var(--muted)" }}>{dbCat.products.length} flavours</p>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* ══ FULL MENU ═══════════════════════════════════════════════════════ */}
      <motion.section 
        id="menu"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16"
      >
        <div className="shell">
          <motion.div variants={fadeInUp} className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-kicker">Choose Your</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>STYLE</h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-7 sm:block" style={{ color: "var(--muted)" }}>
              {latestProducts.length}+ flavours across all categories
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {latestProducts.map((product) => (
              <motion.article
                key={product.id}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-2xl border transition-all"
                style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}
              >
                <div className="relative overflow-hidden">
                  <ProductImage imageUrl={product.imageUrl} colorHex={product.colorHex} name={product.name} compact />
                  {product.featured && (
                    <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: "var(--accent)" }}>★ Best Seller</span>
                  )}
                  <div className="absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                    style={{ background: "rgba(0,0,0,0.6)" }}>₹{product.price}</div>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                    {product.category.name}
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold" style={{ color: "var(--foreground)" }}>{product.name}</h3>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ══ KNOW US BETTER ══════════════════════════════════════════════════ */}
      <motion.section 
        id="about"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="border-y py-12 sm:py-16"
        style={{ borderColor: "var(--border)", background: "var(--dark-panel)" }}
      >
        <div className="shell">
          <motion.div variants={fadeInUp} className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Know Us</p>
            <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">BETTER</h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: "/glacier/icon-about.webp", title: "About Us", desc: "Established in 1995, GlacierIce Cream has grown to be loved by all — with 500+ retail outlets across multiple states.", cta: "Know More" },
              { icon: "/glacier/icon-awards.webp", title: "Awards", desc: "Making waves in the industry — our hard work and innovation have earned us recognition at the highest levels of the food and beverage industry.", cta: "Know More" },
              { icon: "/glacier/icon-csr.webp", title: "CSR", desc: "Giving it back to the world — we are who we are because of your support. Our CSR initiatives focus on community, environment, and education.", cta: "Know More" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <Image src={item.icon} alt={item.title} width={40} height={40} className="h-10 w-10 object-contain" />
                </div>
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.desc}</p>
                <Button variant="outline" className="mt-5 border-white/20 text-white/80 hover:bg-white/10">
                  {item.cta}
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
              <div>
                <h3 className="font-display text-2xl text-white">{settings.storyTitle}</h3>
                <p className="mt-4 text-sm leading-8 text-white/60">{settings.storyBody}</p>
              </div>
                <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "1995", label: "Est. Year" },
                  { value: "100+", label: "Flavours" },
                  { value: "500+", label: "Retail Outlets" },
                  { value: "50+", label: "Flagship Stores" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="font-display text-3xl font-bold text-white">{s.value}</p>
                    <p className="mt-1 text-xs text-white/50">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ══ SURPRISE ME / PARTY ORDERS ══════════════════════════════════════ */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="border-b py-12 sm:py-16"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="shell">
          <motion.div variants={fadeInUp} className="overflow-hidden rounded-2xl" style={{ background: "var(--accent-soft)" }}>
            <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
              <div>
                <p className="section-kicker">Surprise Me</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>
                  Make every event a celebration with GlacierIce Cream
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-8" style={{ color: "var(--muted)" }}>
                  Weddings, birthdays, anniversaries, or any get-together — memorable occasions deserve mouth-watering flavours.
                  Place a Party Order and we'll bring a variety of ice cream flavours that complement every event.
                  GlacierIce Cream adds MORE scoops of sweetness to all your celebrations.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="#stores">
                      Place a Party Order <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="#stores">Find a Store</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden sm:block">
                <Image src="/glacier/icon-party.webp" alt="Party Order" width={160} height={160}
                  className="h-40 w-40 object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ══ STORE LOCATOR ═══════════════════════════════════════════════════ */}
      <motion.section 
        id="stores"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16"
        style={{ background: "var(--surface-stat)" }}
      >
        <div className="shell">
          <motion.div variants={fadeInUp} className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-kicker">We're</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>CLOSE BY</h2>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/admin/login">
                Manage Stores <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <motion.article
                key={store.id}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
                style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}
              >
                <div className="flex items-center gap-3 border-b p-5"
                  style={{ borderColor: "var(--border)", background: "var(--accent-soft)" }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "var(--accent)", color: "#fff" }}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>GlacierIce Cream Parlour</p>
                    <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{store.city}</h3>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm leading-6" style={{ color: "var(--muted)" }}>{store.address}</p>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                    <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent)" }} />
                    {store.hours}
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                    <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent)" }} />
                    {store.phone}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t"
        style={{ borderColor: "var(--border)", background: "var(--dark-panel)" }}
      >
        <div className="shell py-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Image src="/glacier/logo.png" alt="GlacierIce Cream" width={120} height={40} className="h-10 w-auto brightness-0 invert" />
              <p className="mt-3 max-w-xs text-sm leading-7 text-white/50">
                Crafting smiles since 1995. Premium ice cream loved by millions.
              </p>
              <div className="mt-4 flex gap-3">
                {["Facebook", "Instagram", "YouTube", "Twitter"].map((s) => (
                  <motion.div
                    key={s}
                    whileHover={{ scale: 1.1 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50 cursor-pointer"
                  >
                    {s[0]}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {[
                { title: "Products", links: ["All Products", "Best Sellers", "New Arrivals", "Tubs", "Cones & Bars"] },
                { title: "Company",  links: ["About Us", "Awards", "CSR", "Leadership", "Careers"] },
                { title: "Connect",  links: ["Store Locator", "Contact Us", "Party Orders", "Franchise", "FAQ"] },
              ].map((col) => (
                <div key={col.title}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">{col.title}</p>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l}>
                        <Link href="#" className="text-sm text-white/70 hover:text-white transition-colors">{l}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-xs text-white/30">© {new Date().getFullYear()} GlacierIce Cream. All rights reserved.</p>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Use", "FAQ"].map((l) => (
                <Link key={l} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}