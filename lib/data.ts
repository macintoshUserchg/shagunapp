import { cache } from "react";
import { prisma } from "./prisma";

export const getPublicSiteData = cache(async () => {
  const [settings, categories, featuredProducts, latestProducts, stores] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.category.findMany({
      include: { products: true },
    }),
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
    }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.storeLocation.findMany(),
  ]);

  return {
    settings: settings ?? {
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
    categories: categories ?? [],
    featuredProducts: featuredProducts ?? [],
    latestProducts: latestProducts ?? [],
    stores: stores ?? [],
  };
});

export const getAdminDashboardData = cache(async () => {
  const [settings, categories, products, stores] = await Promise.all([
    prisma.siteSettings.findFirst(),
    prisma.category.findMany(),
    prisma.product.findMany({ include: { category: true } }),
    prisma.storeLocation.findMany(),
  ]);

  return {
    settings,
    categories,
    products,
    stores,
    stats: {
      categoryCount: categories?.length ?? 0,
      productCount: products?.length ?? 0,
      featuredCount: products?.filter(p => p.featured).length ?? 0,
      storeCount: stores?.length ?? 0,
    },
  };
});