"use client"

import { useState } from "react"

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (fn: () => Promise<T>) => Promise<T | null>
}

export function useApi<T>(options?: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async (fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fn()
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      options?.onError?.(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, execute }
}