-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'site-settings',
    "brandName" TEXT NOT NULL DEFAULT 'Polar Swirl',
    "announcement" TEXT NOT NULL DEFAULT 'Fresh scoops, wafer cones, and celebration tubs are now live.',
    "heroKicker" TEXT NOT NULL DEFAULT 'Ice cream that feels editorial, festive, and ready for the spotlight.',
    "heroTitle" TEXT NOT NULL DEFAULT 'Build a flavor-first brand home that looks as joyful as the menu tastes.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'This CMS-driven storefront turns your featured scoops, flavor families, and store locations into a bright portfolio experience that feels inspired by premium ice cream brands.',
    "featuredTitle" TEXT NOT NULL DEFAULT 'Featured Scoops',
    "featuredSubtitle" TEXT NOT NULL DEFAULT 'Lead with the flavors that deserve the most attention, then keep the rest of the menu easy to browse.',
    "storyTitle" TEXT NOT NULL DEFAULT 'Made for cravings, gifting, late-night runs, and launch-day wow moments.',
    "storyBody" TEXT NOT NULL DEFAULT 'Use the dashboard to refresh banners, flavor cards, pricing, and scoop-shop details whenever you need. The public site updates from Postgres, so the homepage and CMS stay in sync.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL DEFAULT '#F97316',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "colorHex" TEXT NOT NULL DEFAULT '#F59E0B',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreLocation" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreLocation_slug_key" ON "StoreLocation"("slug");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
