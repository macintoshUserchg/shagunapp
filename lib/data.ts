import { cache } from "react";

// Import static data
const settings = require("../static-data/settings.json");
const categories = require("../static-data/categories.json");
const featuredProducts = require("../static-data/featuredProducts.json");
const latestProducts = require("../static-data/latestProducts.json");
const stores = require("../static-data/stores.json");

export const getPublicSiteData = cache(async () => {
  return {
    settings,
    categories,
    featuredProducts,
    latestProducts,
    stores,
  };
});

// Admin dashboard data is not available in static site
export const getAdminDashboardData = cache(async () => {
  return {
    settings,
    categories,
    products: [], // Empty products array since we don't have the full product list in static data
    stores,
    stats: {
      categoryCount: categories.length,
      featuredCount: featuredProducts.length,
      productCount: featuredProducts.length + latestProducts.length, // Approximation
      storeCount: stores.length,
    },
  };
});
