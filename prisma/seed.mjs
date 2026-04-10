import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const settings = {
  id: "site-settings",
  brandName: "Havmor",
  announcement: "Crafting smiles since 1944 — now part of LOTTE Wellfood Co. Ltd.",
  heroKicker: "150+ flavours. 72,000 retail outlets. One unforgettable scoop.",
  heroTitle: "India's most loved ice cream, now at your doorstep.",
  heroSubtitle:
    "From traditional Kulfis to Belgian Dark Chocolate, Havmor's portfolio spans signature tubs, ice candies, crunchy cones and celebration tubs — all made with stringent quality checks that meet global standards.",
  featuredTitle: "Bestsellers Right Now",
  featuredSubtitle:
    "Our most-loved scoops — from fruit explosions to rich dark chocolate — picked fresh for the season.",
  storyTitle: "Innovating always. Serving joy since 1944.",
  storyBody:
    "Havmor is present in every nook and corner of the nation with 72,000 retail outlets and over 250 flagship stores across 21 states and 4 union territories. We produce over 4 million litres of ice cream — approximately 36 million units served to consumers every single day. From IIM Ahmedabad to Taj, Marriott and Four Seasons, our ice creams are trusted by India's finest institutions.",
};

const categorySeeds = [
  { name: "Signature Tubs",  slug: "signature-tubs",  description: "Big, shareable tubs made for birthdays, celebrations, and family table moments. Rich flavours in generous portions.", accentColor: "#FF7A59" },
  { name: "Fruit Flavours",  slug: "fruit-flavours",  description: "Bright, real-fruit scoops bursting with tropical freshness — from Mahabaleshwar Strawberry to Wild Berries.", accentColor: "#F97316" },
  { name: "Indian Classics", slug: "indian-classics", description: "Traditional recipes reimagined — Kesar Pista, Rajwadi Kulfi Falooda, and other desi favourites.", accentColor: "#D97706" },
  { name: "Bars & Cones",    slug: "bars-and-cones",  description: "On-the-go indulgence — crunchy cones, coated bars, and stick treats for every mood and moment.", accentColor: "#7C3AED" },
  { name: "Cups & Sundaes",  slug: "cups-and-sundaes", description: "Single-serve cups and indulgent sundaes — perfect for a quick treat or a dessert moment.", accentColor: "#0EA5E9" },
  { name: "Shakes & Specials", slug: "shakes-and-specials", description: "Thick shakes, fusion flavours, and limited-edition specials that push the boundaries of ice cream.", accentColor: "#8B5CF6" },
];

const productSeeds = [
  // Fruit Flavours
  { name: "Wild Berries", slug: "wild-berries", tagline: "A real fruit explosion of strawberries, blueberries & raspberries.", description: "Indulge in a real fruit explosion with Wild Berries BlockBuster! Made with real strawberries and bursting with the flavors of blueberries and raspberries — a wild ride of taste that elevates your senses.", price: 180, colorHex: "#7C3AED", imageUrl: "/havmor/product-wild-berries.png", featured: true, categorySlug: "fruit-flavours" },
  { name: "Mahabaleshwar Strawberry", slug: "mahabaleshwar-strawberry", tagline: "Sun-ripened strawberries from the hills of Mahabaleshwar.", description: "A classic Havmor favourite — creamy strawberry ice cream made with 16% processed Mahabaleshwar strawberry fruit for a naturally sweet, vibrant finish.", price: 160, colorHex: "#EC4899", imageUrl: "/havmor/p-mahabaleshwar-strawberry.jpg", featured: true, categorySlug: "fruit-flavours" },
  { name: "Yoghurt Berry Krunch", slug: "yoghurt-berry-krunch", tagline: "Tangy yoghurt meets crunchy berry bits in every bite.", description: "A refreshing blend of creamy yoghurt ice cream layered with real berry pieces and a satisfying krunch coating — light, tangy, and totally addictive.", price: 60, colorHex: "#DB2777", imageUrl: "/havmor/p-yoghurt-berry-krunch.jpg", featured: false, categorySlug: "fruit-flavours" },

  // Indian Classics
  { name: "Rajwadi Kulfi Falooda", slug: "rajwadi-kulfi-falooda", tagline: "Creamy kulfi meets falooda with almonds, cashews & saffron.", description: "Experience the luxurious flavor of Rajwadi Kulfi Falooda — a creamy blend of kulfi and falooda, infused with the richness of almonds, cashews, pistachios and the true flavour of saffron.", price: 220, colorHex: "#D97706", imageUrl: "/havmor/product-rajwadi-kulfi.jpg", featured: true, categorySlug: "indian-classics" },
  { name: "Kesar Pista", slug: "kesar-pista", tagline: "Royal saffron and pistachio — a festive Indian classic.", description: "A premium ice cream crafted with real pistachio nuts (2.9%), cardamom, and nature-identical saffron flavouring — rich, aromatic, and perfect for celebrations.", price: 200, colorHex: "#65A30D", imageUrl: "/havmor/p-kesar-pista.jpg", featured: true, categorySlug: "indian-classics" },
  { name: "Rajbhog Ice Cream Shake", slug: "rajbhog-shake", tagline: "The royal Rajbhog flavour in a thick, indulgent shake.", description: "Inspired by the classic Indian mithai, this thick shake blends the rich saffron and dry-fruit notes of Rajbhog into a creamy, indulgent ice cream drink.", price: 120, colorHex: "#F59E0B", imageUrl: "/havmor/p-rajbhog.png", featured: false, categorySlug: "indian-classics" },

  // Bars & Cones
  { name: "Zulubar Dark Crunch", slug: "zulubar-dark-crunch", tagline: "Rich dark chocolate with a satisfying almond crunch.", description: "Get ready to indulge in the darkness with the irresistible Zulubar Dark Crunch — the perfect combination of rich dark chocolate flavours and satisfying crunch with the goodness of almonds.", price: 50, colorHex: "#1C1917", imageUrl: "/havmor/product-zulubar.jpg", featured: true, categorySlug: "bars-and-cones" },
  { name: "Cookie N Cream", slug: "cookie-n-cream", tagline: "Creamy vanilla meets crunchy cookie in a coated cone.", description: "A crowd-pleasing classic — smooth vanilla and cookie cream ice cream in a white compound-coated cone, delivering the perfect balance of crunch and creaminess.", price: 60, colorHex: "#78716C", imageUrl: "/havmor/product-cookie-cream.jpg", featured: false, categorySlug: "bars-and-cones" },
  { name: "Choco Vanilla Krunch", slug: "choco-vanilla-krunch", tagline: "Chocolate and vanilla swirled in a crunchy coated bar.", description: "Two beloved flavours in one — a swirl of rich chocolate and smooth vanilla ice cream encased in a crispy compound coating for the ultimate on-the-go treat.", price: 50, colorHex: "#92400E", imageUrl: "/havmor/p-choco-vanilla-krunch.jpg", featured: false, categorySlug: "bars-and-cones" },
  { name: "Choco Berry Krunch", slug: "choco-berry-krunch", tagline: "Dark chocolate meets berry in a crunchy coated bar.", description: "A bold combination of rich chocolate and tangy berry ice cream, coated in a crispy compound shell — the perfect balance of sweet and tart in every bite.", price: 50, colorHex: "#BE185D", imageUrl: "/havmor/p-choco-berry-krunch.jpg", featured: false, categorySlug: "bars-and-cones" },
  { name: "Hazelnut", slug: "hazelnut", tagline: "Premium hazelnut in a rich, nutty ice cream bar.", description: "Inspired by the world's love for hazelnut, this indulgent bar combines creamy hazelnut ice cream with a smooth chocolate coating for a truly premium experience.", price: 70, colorHex: "#92400E", imageUrl: "/havmor/p-hazelnut.png", featured: false, categorySlug: "bars-and-cones" },

  // Signature Tubs
  { name: "Biscotti", slug: "biscotti", tagline: "Italian-inspired biscuit and cream in a celebration tub.", description: "A sophisticated tub flavour inspired by Italian biscotti — creamy ice cream with biscuit pieces and a buttery, caramelised finish that pairs beautifully with any celebration.", price: 350, colorHex: "#B45309", imageUrl: "/havmor/p-biscotti.jpg", featured: false, categorySlug: "signature-tubs" },
  { name: "Belgian Dark Chocolate", slug: "belgian-dark-chocolate", tagline: "Premium Belgian cocoa in a rich, indulgent tub.", description: "Crafted with premium Belgian dark chocolate, this signature tub delivers deep cocoa intensity and a velvety smooth finish — Havmor's most indulgent creation.", price: 420, colorHex: "#3B1F0A", imageUrl: "/havmor/banner-belgian.jpg", featured: true, categorySlug: "signature-tubs" },
  { name: "Choco Brownie Tub", slug: "choco-brownie-tub", tagline: "Fudgy brownie pieces in rich chocolate ice cream.", description: "A decadent tub of rich chocolate ice cream loaded with fudgy brownie pieces — the ultimate indulgence for chocolate lovers who want more in every scoop.", price: 380, colorHex: "#44200A", imageUrl: "/havmor/p-choco-brownie-tub.jpg", featured: false, categorySlug: "signature-tubs" },

  // Cups & Sundaes
  { name: "Choco Brownie Sundae", slug: "choco-brownie-sundae", tagline: "Warm brownie vibes in a single-serve sundae cup.", description: "A single-serve sundae cup packed with chocolate ice cream and brownie-inspired swirls — the perfect quick indulgence for chocolate cravings on the go.", price: 80, colorHex: "#78350F", imageUrl: "/havmor/p-choco-brownie-sundae.jpg", featured: false, categorySlug: "cups-and-sundaes" },
  { name: "Vanilla Cup", slug: "vanilla-cup", tagline: "Classic smooth vanilla in a convenient single-serve cup.", description: "Pure, creamy vanilla ice cream in a convenient 50ml cup — the timeless classic that pairs with everything and satisfies every time.", price: 30, colorHex: "#FDE68A", imageUrl: "/havmor/p-vanilla-cup.jpg", featured: false, categorySlug: "cups-and-sundaes" },

  // Shakes & Specials
  { name: "Cookie N Cream Shake", slug: "cookie-cream-shake", tagline: "Thick cookie and cream shake — dessert in a glass.", description: "A thick, indulgent shake blending cookie and cream ice cream into a rich, creamy drink loaded with cookie pieces — the ultimate dessert-in-a-glass experience.", price: 150, colorHex: "#6B7280", imageUrl: "/havmor/p-cookie-cream-shake.png", featured: false, categorySlug: "shakes-and-specials" },
];

const storeSeeds = [
  { city: "Jaipur",     slug: "jaipur",     address: "D 4, Janpath, Shyam Nagar, New Sanganer Road, Jaipur – 302019",                                              hours: "11:00 AM – 11:00 PM", phone: "+91 94613 06267" },
  { city: "Ahmedabad",  slug: "ahmedabad",  address: "17 Sukan City, Opp. Arya Villa Apartment, C.S.T Crossing Road, New Ranip, Ahmedabad – 382480",               hours: "11:00 AM – 11:30 PM", phone: "+91 84600 84600" },
  { city: "Mumbai",     slug: "mumbai",     address: "Havmor Havfunn, Linking Road, Bandra West, Mumbai – 400050",                                                  hours: "11:00 AM – 12:00 AM", phone: "+91 22 4246 0606" },
];

async function main() {
  await prisma.siteSettings.upsert({ where: { id: settings.id }, update: settings, create: settings });

  await prisma.adminUser.upsert({
    where: { email: "admin@gmail.com" },
    update: { name: "CMS Admin", passwordHash: await hash("Admin@123", 12) },
    create: { email: "admin@gmail.com", name: "CMS Admin", passwordHash: await hash("Admin@123", 12) },
  });

  for (const cat of categorySeeds) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
  }

  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map((c) => [c.slug, c.id]));

  // Clear old products not in new seed
  const newSlugs = productSeeds.map((p) => p.slug);
  await prisma.product.deleteMany({ where: { slug: { notIn: newSlugs } } });

  for (const p of productSeeds) {
    const categoryId = catMap.get(p.categorySlug);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, tagline: p.tagline, description: p.description, price: p.price, colorHex: p.colorHex, imageUrl: p.imageUrl ?? null, featured: p.featured, categoryId },
      create: { name: p.name, slug: p.slug, tagline: p.tagline, description: p.description, price: p.price, colorHex: p.colorHex, imageUrl: p.imageUrl ?? null, featured: p.featured, categoryId },
    });
  }

  // Remove old unused categories
  const usedSlugs = [...new Set(productSeeds.map((p) => p.categorySlug))];
  await prisma.category.deleteMany({ where: { slug: { notIn: usedSlugs } } });

  for (const s of storeSeeds) {
    await prisma.storeLocation.upsert({ where: { slug: s.slug }, update: s, create: s });
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
