import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "signature-tubs" },
      update: {},
      create: {
        name: "Signature Tubs",
        slug: "signature-tubs",
        description: "Big, shareable tubs made for birthdays, celebrations, and family table moments.",
        accentColor: "#FF7A59",
      },
    }),
    prisma.category.upsert({
      where: { slug: "bars-and-cones" },
      update: {},
      create: {
        name: "Bars & Cones",
        slug: "bars-and-cones",
        description: "On-the-go indulgence — crunchy cones, coated bars, and stick treats.",
        accentColor: "#7C3AED",
      },
    }),
    prisma.category.upsert({
      where: { slug: "indian-classics" },
      update: {},
      create: {
        name: "Indian Classics",
        slug: "indian-classics",
        description: "Traditional Indian favourites — Kulfi, Rabdi, and more.",
        accentColor: "#D97706",
      },
    }),
    prisma.category.upsert({
      where: { slug: "fruit-flavours" },
      update: {},
      create: {
        name: "Fruit Flavours",
        slug: "fruit-flavours",
        description: "Fresh and fruity ice creams made with real fruits.",
        accentColor: "#E11D48",
      },
    }),
    prisma.category.upsert({
      where: { slug: "cups-and-sundaes" },
      update: {},
      create: {
        name: "Cups & Sundaes",
        slug: "cups-and-sundaes",
        description: "Perfect portions for every craving.",
        accentColor: "#0EA5E9",
      },
    }),
    prisma.category.upsert({
      where: { slug: "shakes-and-specials" },
      update: {},
      create: {
        name: "Shakes & Specials",
        slug: "shakes-and-specials",
        description: "Thick shakes and special creations.",
        accentColor: "#8B5CF6",
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Get category IDs
  const signatureTubs = categories.find(c => c.slug === "signature-tubs")!;
  const barsCones = categories.find(c => c.slug === "bars-and-cones")!;
  const indianClassics = categories.find(c => c.slug === "indian-classics")!;
  const fruitFlavours = categories.find(c => c.slug === "fruit-flavours")!;

  // Create products
  const products = [
    {
      name: "Belgian Dark Chocolate",
      slug: "belgian-dark-chocolate",
      tagline: "Premium Belgian cocoa in a rich, indulgent tub.",
      description: "Crafted with premium Belgian dark chocolate, this signature tub delivers deep cocoa intensity and a velvety smooth finish.",
      price: 420,
      colorHex: "#3B1F0A",
      imageUrl: "/glacier/banner-1.jpg",
      featured: true,
      categoryId: signatureTubs.id,
    },
    {
      name: "Kesar Pista",
      slug: "kesar-pista",
      tagline: "Royal saffron and pistachio — a festive Indian classic.",
      description: "A premium ice cream crafted with real pistachio nuts (2.9%), cardamom, and saffron flavouring.",
      price: 350,
      colorHex: "#A3E635",
      imageUrl: "/glacier/product-1.jpg",
      featured: true,
      categoryId: indianClassics.id,
    },
    {
      name: "Strawberry",
      slug: "strawberry",
      tagline: "Creamy strawberry made with real fruit.",
      description: "A classic favourite — creamy strawberry ice cream made with processed strawberry fruit.",
      price: 150,
      colorHex: "#F43F5E",
      imageUrl: "/glacier/banner-2.jpg",
      featured: false,
      categoryId: fruitFlavours.id,
    },
    {
      name: "Rajwadi Kulfi",
      slug: "rajwadi-kulfi",
      tagline: "Traditional Indian kulfi with dry fruits.",
      description: "The authentic Rajwadi Kulfi with the richness of malai and aromatic cardamom.",
      price: 200,
      colorHex: "#FEF3C7",
      imageUrl: "/glacier/product-2.jpg",
      featured: true,
      categoryId: indianClassics.id,
    },
    {
      name: "Chocolate Cone",
      slug: "chocolate-cone",
      tagline: "Crunchy cone with rich chocolate ice cream.",
      description: "A delicious chocolate cone that's perfect for on-the-go enjoyment.",
      price: 80,
      colorHex: "#5C2D0A",
      imageUrl: "/glacier/banner-3.jpg",
      featured: false,
      categoryId: barsCones.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`Created ${products.length} products`);

  // Create store locations
  const stores = [
    {
      city: "Jaipur",
      slug: "jaipur",
      address: "D 4, Janpath, Shyam Nagar, New Sanganer Road, Jaipur – 302019",
      hours: "11:00 AM – 11:00 PM",
      phone: "+91 94613 06267",
    },
    {
      city: "Ahmedabad",
      slug: "ahmedabad",
      address: "17 Sukan City, Opp. Arya Villa Apartment, C.S.T Crossing Road, New Ranip, Ahmedabad – 382480",
      hours: "11:00 AM – 11:30 PM",
      phone: "+91 84600 84600",
    },
    {
      city: "Mumbai",
      slug: "mumbai",
      address: "GlacierIce Cream Parlour, Linking Road, Bandra West, Mumbai – 400050",
      hours: "11:00 AM – 12:00 AM",
      phone: "+91 22 4246 0606",
    },
  ];

  for (const store of stores) {
    await prisma.storeLocation.upsert({
      where: { slug: store.slug },
      update: store,
      create: store,
    });
  }

  console.log(`Created ${stores.length} store locations`);

  // Create or update site settings
  await prisma.siteSettings.upsert({
    where: { id: "site-settings" },
    update: {},
    create: {
      id: "site-settings",
      brandName: "GlacierIce Cream",
      announcement: "Premium ice cream crafted with love since 1995.",
      heroKicker: "100+ flavours. 500+ retail outlets. One unforgettable scoop.",
      heroTitle: "India's finest ice cream, now at your doorstep.",
      heroSubtitle: "From traditional Kulfis to Belgian Dark Chocolate, GlacierIce Cream's portfolio spans signature tubs, ice candies, crunchy cones and celebration tubs.",
      featuredTitle: "Bestsellers Right Now",
      featuredSubtitle: "Our most-loved scoops — from fruit explosions to rich dark chocolate — picked fresh for the season.",
      storyTitle: "Innovating always. Serving joy since 1995.",
      storyBody: "GlacierIce Cream is present in every nook and corner of the nation with 500+ retail outlets and over 50 flagship stores.",
    },
  });

  console.log("Created site settings");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });