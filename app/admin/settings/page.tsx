"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Settings as SettingsIcon, Save, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface Settings {
  brandName: string
  announcement: string
  heroKicker: string
  heroTitle: string
  heroSubtitle: string
  featuredTitle: string
  featuredSubtitle: string
  storyTitle: string
  storyBody: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  } as const
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    brandName: "",
    announcement: "",
    heroKicker: "",
    heroTitle: "",
    heroSubtitle: "",
    featuredTitle: "",
    featuredSubtitle: "",
    storyTitle: "",
    storyBody: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/admin/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Failed to load settings:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    
    try {
      const response = await fetch("/admin/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      
      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error("Failed to save settings:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Manage your website content</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>

      {/* Hero Section */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle style={{ color: "var(--foreground)" }}>Hero Section</CardTitle>
            <CardDescription style={{ color: "var(--muted)" }}>Main banner content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Brand Name</label>
              <Input
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                placeholder="GlacierIce Cream"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Announcement</label>
              <Input
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                placeholder="Crafting smiles since 1944..."
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Hero Kicker</label>
              <Input
                value={settings.heroKicker}
                onChange={(e) => setSettings({ ...settings, heroKicker: e.target.value })}
                placeholder="150+ flavours. 72,000 retail outlets..."
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Hero Title</label>
              <Input
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                placeholder="India's most loved ice cream..."
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Hero Subtitle</label>
              <Textarea
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                placeholder="From traditional Kulfis to Belgian Dark Chocolate..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Section */}
      <motion.div variants={itemVariants}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle style={{ color: "var(--foreground)" }}>Featured Section</CardTitle>
            <CardDescription style={{ color: "var(--muted)" }}>Best sellers display</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Featured Title</label>
              <Input
                value={settings.featuredTitle}
                onChange={(e) => setSettings({ ...settings, featuredTitle: e.target.value })}
                placeholder="Bestsellers Right Now"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Featured Subtitle</label>
              <Textarea
                value={settings.featuredSubtitle}
                onChange={(e) => setSettings({ ...settings, featuredSubtitle: e.target.value })}
                placeholder="Our most-loved scoops..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Story Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle style={{ color: "var(--foreground)" }}>Story Section</CardTitle>
            <CardDescription style={{ color: "var(--muted)" }}>About us page content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Story Title</label>
              <Input
                value={settings.storyTitle}
                onChange={(e) => setSettings({ ...settings, storyTitle: e.target.value })}
                placeholder="Innovating always. Serving joy since 1944."
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Story Body</label>
              <Textarea
                value={settings.storyBody}
                onChange={(e) => setSettings({ ...settings, storyBody: e.target.value })}
                placeholder="Havmor is present in every nook and corner..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}