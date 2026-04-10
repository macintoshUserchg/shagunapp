import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const colorPattern = /^#[0-9a-fA-F]{6}$/;

const optionalIdSchema = z.string().trim().min(1).optional();

const settingsSchema = z.object({
  brandName: z.string().trim().min(2).max(60),
  announcement: z.string().trim().min(8).max(120),
  heroKicker: z.string().trim().min(8).max(120),
  heroTitle: z.string().trim().min(12).max(120),
  heroSubtitle: z.string().trim().min(30).max(320),
  featuredTitle: z.string().trim().min(4).max(60),
  featuredSubtitle: z.string().trim().min(16).max(180),
  storyTitle: z.string().trim().min(8).max(100),
  storyBody: z.string().trim().min(24).max(420),
});

const categorySchema = z.object({
  id: optionalIdSchema,
  name: z.string().trim().min(2).max(40),
  slug: z.string().trim().min(2).max(60).regex(slugPattern),
  description: z.string().trim().min(12).max(180),
  accentColor: z.string().trim().regex(colorPattern),
});

const productSchema = z.object({
  id: optionalIdSchema,
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().min(2).max(60).regex(slugPattern),
  tagline: z.string().trim().min(8).max(100),
  description: z.string().trim().min(20).max(220),
  price: z.number().int().min(50).max(5000),
  colorHex: z.string().trim().regex(colorPattern),
  featured: z.boolean(),
  categoryId: z.string().trim().min(1),
});

const storeLocationSchema = z.object({
  id: optionalIdSchema,
  city: z.string().trim().min(2).max(50),
  slug: z.string().trim().min(2).max(60).regex(slugPattern),
  address: z.string().trim().min(10).max(160),
  hours: z.string().trim().min(6).max(80),
  phone: z.string().trim().min(8).max(30),
});

const deleteEntitySchema = z.object({
  id: z.string().trim().min(1),
});

function readValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseSettingsForm(formData: FormData) {
  return settingsSchema.parse({
    brandName: readValue(formData, "brandName"),
    announcement: readValue(formData, "announcement"),
    heroKicker: readValue(formData, "heroKicker"),
    heroTitle: readValue(formData, "heroTitle"),
    heroSubtitle: readValue(formData, "heroSubtitle"),
    featuredTitle: readValue(formData, "featuredTitle"),
    featuredSubtitle: readValue(formData, "featuredSubtitle"),
    storyTitle: readValue(formData, "storyTitle"),
    storyBody: readValue(formData, "storyBody"),
  });
}

export function parseCategoryForm(formData: FormData) {
  return categorySchema.parse({
    id: readValue(formData, "id") || undefined,
    name: readValue(formData, "name"),
    slug: normalizeSlug(readValue(formData, "slug")),
    description: readValue(formData, "description"),
    accentColor: readValue(formData, "accentColor"),
  });
}

export function parseProductForm(formData: FormData) {
  return productSchema.parse({
    id: readValue(formData, "id") || undefined,
    name: readValue(formData, "name"),
    slug: normalizeSlug(readValue(formData, "slug")),
    tagline: readValue(formData, "tagline"),
    description: readValue(formData, "description"),
    price: Number(readValue(formData, "price")),
    colorHex: readValue(formData, "colorHex"),
    featured: formData.get("featured") === "on",
    categoryId: readValue(formData, "categoryId"),
  });
}

export function parseStoreLocationForm(formData: FormData) {
  return storeLocationSchema.parse({
    id: readValue(formData, "id") || undefined,
    city: readValue(formData, "city"),
    slug: normalizeSlug(readValue(formData, "slug")),
    address: readValue(formData, "address"),
    hours: readValue(formData, "hours"),
    phone: readValue(formData, "phone"),
  });
}

export function parseDeleteEntityForm(formData: FormData) {
  return deleteEntitySchema.parse({
    id: readValue(formData, "id"),
  });
}
