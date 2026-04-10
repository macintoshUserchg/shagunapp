import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, MapPin, Phone, Clock, Star } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { getPublicSiteData } from "@/lib/data";

const navLinks = [
  { href: "#flavours",    label: "Choose Your Flavour" },
  { href: "#collections", label: "Collections" },
  { href: "#about",       label: "Know Us Better" },
  { href: "#stores",      label: "We're Close By" },
];

// Havmor palette categories (matching their site)
const paletteCategories = [
  { label: "Chocolate",         slug: "bars-and-cones",       color: "#5C2D0A" },
  { label: "Indian Traditional",slug: "indian-classics",      color: "#D97706" },
  { label: "Fruits",            slug: "fruit-flavours",       color: "#E11D48" },
  { label: "Signature Tubs",    slug: "signature-tubs",       color: "#FF7A59" },
  { label: "Cups & Sundaes",    slug: "cups-and-sundaes",     color: "#0EA5E9" },
  { label: "Shakes & Specials", slug: "shakes-and-specials",  color: "#8B5CF6" },
];

export default async function Home() {
  const { settings, categories, featuredProducts, latestProducts, stores } =
    await getPublicSiteData();

  const bestSellers = featuredProducts.length > 0 ? featuredProducts : latestProducts.slice(0, 4);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b"
        style={{ borderColor: "var(--border)", background: "var(--glass-bg)", backdropFilter: "blur(20px)" }}>
        <div className="shell flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/havmor/logo.png" alt="Havmor" width={120} height={40} className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--muted)" }}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/admin/login"
              className="hidden items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold sm:flex"
              style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "var(--surface-stat)" }}>
              Admin <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* ══ HERO BANNERS ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
          {[
            { src: "/havmor/banner-belgian.jpg",     alt: "Belgian Dark Chocolate", label: "New Arrival" },
            { src: "/havmor/banner-kulfi.jpg",        alt: "Kulfi Collection",       label: "Indian Classic" },
            { src: "/havmor/banner-wild-berries.jpg", alt: "Wild Berries",           label: "Bestseller" },
          ].map((b) => (
            <div key={b.src} className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
              <Image src={b.src} alt={b.alt} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" priority />
              <div className="absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }}>
                <span className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/70"
                  style={{ background: "rgba(255,255,255,0.15)" }}>{b.label}</span>
                <p className="text-lg font-bold text-white">{b.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ BEST SELLERS ════════════════════════════════════════════════════ */}
      <section id="flavours" className="py-12 sm:py-16">
        <div className="shell">
          <div className="mb-8 flex items-end justify-between">
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
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bestSellers.map((product) => (
              <article key={product.id}
                className="group overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
                <div className="relative overflow-hidden">
                  <ProductImage imageUrl={product.imageUrl} colorHex={product.colorHex} name={product.name} compact />
                  <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold" style={{ color: "var(--accent-text)" }}>
                      BUY NOW
                    </span>
                    <span className="rounded-full px-2 py-1 text-xs font-bold text-white"
                      style={{ background: "var(--dark-panel)" }}>₹{product.price}</span>
                  </div>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CHOOSE YOUR PALETTE (categories) ════════════════════════════════ */}
      <section id="collections" className="border-y py-12 sm:py-16"
        style={{ borderColor: "var(--border)", background: "var(--surface-stat)" }}>
        <div className="shell">
          <div className="mb-8 text-center">
            <p className="section-kicker">Choose Your</p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>PALETTE</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {paletteCategories.map((cat) => {
              const dbCat = categories.find((c) => c.slug === cat.slug);
              return (
                <Link key={cat.slug} href="#menu"
                  className="group flex flex-col items-center gap-3 rounded-2xl border p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                    style={{ background: `${cat.color}18`, border: `2px solid ${cat.color}30` }}>
                    🍦
                  </div>
                  <p className="text-xs font-semibold leading-tight" style={{ color: "var(--foreground)" }}>{cat.label}</p>
                  {dbCat && (
                    <p className="text-[10px]" style={{ color: "var(--muted)" }}>{dbCat.products.length} flavours</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FULL MENU ═══════════════════════════════════════════════════════ */}
      <section id="menu" className="py-12 sm:py-16">
        <div className="shell">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-kicker">Choose Your</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>STYLE</h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-7 sm:block" style={{ color: "var(--muted)" }}>
              {latestProducts.length}+ flavours across all categories
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {latestProducts.map((product) => (
              <article key={product.id}
                className="group overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ KNOW US BETTER ══════════════════════════════════════════════════ */}
      <section id="about" className="border-y py-12 sm:py-16"
        style={{ borderColor: "var(--border)", background: "var(--dark-panel)" }}>
        <div className="shell">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Know Us</p>
            <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">BETTER</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "/havmor/icon-about.webp",
                title: "About Us",
                desc: "Established in the year 1944 and now a part of LOTTE Wellfood Co. Ltd., Havmor has grown to be loved by all — with 72,000 retail outlets across 21 states.",
                cta: "Know More",
              },
              {
                icon: "/havmor/icon-awards.webp",
                title: "Awards",
                desc: "Making waves in the industry — our hard work and innovation have earned us recognition at the highest levels of the food and beverage industry.",
                cta: "Know More",
              },
              {
                icon: "/havmor/icon-csr.webp",
                title: "CSR",
                desc: "Giving it back to the world — we are who we are because of your support. Our CSR initiatives focus on community, environment, and education.",
                cta: "Know More",
              },
            ].map((item) => (
              <div key={item.title}
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <Image src={item.icon} alt={item.title} width={40} height={40} className="h-10 w-10 object-contain" />
                </div>
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.desc}</p>
                <button className="mt-5 rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10">
                  {item.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Brand story strip */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
              <div>
                <h3 className="font-display text-2xl text-white">{settings.storyTitle}</h3>
                <p className="mt-4 text-sm leading-8 text-white/60">{settings.storyBody}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "1944", label: "Est. Year" },
                  { value: "150+", label: "Flavours" },
                  { value: "72K+", label: "Retail Outlets" },
                  { value: "250+", label: "Flagship Stores" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="font-display text-3xl font-bold text-white">{s.value}</p>
                    <p className="mt-1 text-xs text-white/50">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SURPRISE ME / PARTY ORDERS ══════════════════════════════════════ */}
      <section className="border-b py-12 sm:py-16" style={{ borderColor: "var(--border)" }}>
        <div className="shell">
          <div className="overflow-hidden rounded-2xl" style={{ background: "var(--accent-soft)" }}>
            <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
              <div>
                <p className="section-kicker">Surprise Me</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>
                  Make every event a celebration with Havmor ice creams
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-8" style={{ color: "var(--muted)" }}>
                  Weddings, birthdays, anniversaries, or any get-together — memorable occasions deserve mouth-watering flavours.
                  Place a Party Order and we'll bring a variety of ice cream flavours that complement every event.
                  Havmor adds MORE scoops of sweetness to all your celebrations.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="#stores" className="primary-button">
                    Place a Party Order <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="#stores" className="secondary-button">
                    Find a Store
                  </Link>
                </div>
              </div>
              <div className="hidden sm:block">
                <Image src="/havmor/icon-party.webp" alt="Party Order" width={160} height={160}
                  className="h-40 w-40 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STORE LOCATOR ═══════════════════════════════════════════════════ */}
      <section id="stores" className="py-12 sm:py-16" style={{ background: "var(--surface-stat)" }}>
        <div className="shell">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-kicker">We're</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl" style={{ color: "var(--foreground)" }}>CLOSE BY</h2>
            </div>
            <Link href="/admin/login" className="secondary-button hidden sm:inline-flex">
              Manage Stores <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <article key={store.id}
                className="overflow-hidden rounded-2xl border transition-shadow hover:shadow-md"
                style={{ borderColor: "var(--border)", background: "var(--glass-bg)" }}>
                <div className="flex items-center gap-3 border-b p-5"
                  style={{ borderColor: "var(--border)", background: "var(--accent-soft)" }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "var(--accent)", color: "#fff" }}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Havmor Havfunn</p>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="border-t" style={{ borderColor: "var(--border)", background: "var(--dark-panel)" }}>
        <div className="shell py-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Image src="/havmor/logo.png" alt="Havmor" width={120} height={40} className="h-10 w-auto brightness-0 invert" />
              <p className="mt-3 max-w-xs text-sm leading-7 text-white/50">
                Crafting smiles since 1944. Part of LOTTE Wellfood Co. Ltd.
              </p>
              <div className="mt-4 flex gap-3">
                {["Facebook", "Instagram", "YouTube", "Twitter"].map((s) => (
                  <div key={s} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[10px] text-white/50">
                    {s[0]}
                  </div>
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
            <p className="text-xs text-white/30">© {new Date().getFullYear()} Havmor Ice Cream. All rights reserved.</p>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Use", "FAQ"].map((l) => (
                <Link key={l} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
// VERCEL DEPLOYMENT VERIFICATION - Fri Apr 10 21:27:25 IST 2026
