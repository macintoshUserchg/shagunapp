import { getPublicSiteData } from "@/lib/data"
import HomeClient from "@/components/home-client"

export default async function Home() {
  const { settings, categories, featuredProducts, latestProducts, stores } =
    await getPublicSiteData()

  return (
    <HomeClient
      settings={settings}
      categories={categories}
      featuredProducts={featuredProducts}
      latestProducts={latestProducts}
      stores={stores}
    />
  )
}