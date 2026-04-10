const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function extractData() {
  try {
    const staticDataDir = './static-data';
    if (!fs.existsSync(staticDataDir)) {
      fs.mkdirSync(staticDataDir);
    }

    // Extract settings
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site-settings' }
    });
    fs.writeFileSync(path.join(staticDataDir, 'settings.json'), JSON.stringify(settings, null, 2));

    // Extract categories with products
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        products: {
          orderBy: [{ featured: 'desc' }, { name: 'asc' }],
        },
      },
    });
    fs.writeFileSync(path.join(staticDataDir, 'categories.json'), JSON.stringify(categories, null, 2));

    // Extract featured products
    const featuredProducts = await prisma.product.findMany({
      where: { featured: true },
      orderBy: { name: 'asc' },
      include: {
        category: true,
      },
      take: 4,
    });
    fs.writeFileSync(path.join(staticDataDir, 'featuredProducts.json'), JSON.stringify(featuredProducts, null, 2));

    // Extract latest products
    const latestProducts = await prisma.product.findMany({
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
      include: {
        category: true,
      },
      take: 8,
    });
    fs.writeFileSync(path.join(staticDataDir, 'latestProducts.json'), JSON.stringify(latestProducts, null, 2));

    // Extract stores
    const stores = await prisma.storeLocation.findMany({
      orderBy: { city: 'asc' },
    });
    fs.writeFileSync(path.join(staticDataDir, 'stores.json'), JSON.stringify(stores, null, 2));

    console.log('Static data extracted successfully!');
  } catch (error) {
    console.error('Error extracting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

extractData();