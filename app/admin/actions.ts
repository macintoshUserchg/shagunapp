"use server"

import { redirect } from "next/navigation"
import { createSession, clearSession } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = loginSchema.safeParse({ email, password })

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@havmor.com"
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "havmor2024"

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { success: false, error: "Invalid email or password" }
  }

  await createSession({
    userId: "admin",
    email: email,
    name: "Admin",
  })

  redirect("/admin")
}

export async function logoutAction() {
  await clearSession()
  redirect("/admin/login")
}

export async function saveCategoryAction(formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string

  if (!name || !slug) {
    return { success: false, error: "Name and slug are required" }
  }

  return { success: true, message: "Category saved (demo mode)" }
}

export async function deleteCategoryAction(id: string) {
  return { success: true, message: "Category deleted (demo mode)" }
}

export async function saveProductAction(formData: FormData) {
  const name = formData.get("name") as string

  if (!name) {
    return { success: false, error: "Name is required" }
  }

  return { success: true, message: "Product saved (demo mode)" }
}

export async function deleteProductAction(id: string) {
  return { success: true, message: "Product deleted (demo mode)" }
}

export async function saveStoreLocationAction(formData: FormData) {
  const city = formData.get("city") as string

  if (!city) {
    return { success: false, error: "City is required" }
  }

  return { success: true, message: "Store saved (demo mode)" }
}

export async function deleteStoreLocationAction(id: string) {
  return { success: true, message: "Store deleted (demo mode)" }
}

export async function updateSettingsAction(formData: FormData) {
  return { success: true, message: "Settings updated (demo mode)" }
}