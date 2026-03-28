import { useState, useCallback } from 'react'
import { router } from 'expo-router'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'auth-store' })

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!storage.getString(TOKEN_KEY))

  const login = useCallback(async (email: string, password: string) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

    const res = await fetch(`${API_URL}/trpc/auth.login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: { email, password } }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? 'Login failed')
    }

    const data = await res.json()
    const result = data.result?.data?.json ?? data.result?.data ?? data

    storage.set(TOKEN_KEY, result.token)
    storage.set(REFRESH_TOKEN_KEY, result.refreshToken)
    setIsLoggedIn(true)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

    const res = await fetch(`${API_URL}/trpc/auth.signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json: { name, email, password } }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message ?? 'Signup failed')
    }

    const data = await res.json()
    const result = data.result?.data?.json ?? data.result?.data ?? data

    storage.set(TOKEN_KEY, result.token)
    storage.set(REFRESH_TOKEN_KEY, result.refreshToken)
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    storage.delete(TOKEN_KEY)
    storage.delete(REFRESH_TOKEN_KEY)
    setIsLoggedIn(false)
    router.replace('/(onboarding)')
  }, [])

  const getToken = useCallback((): string | null => {
    return storage.getString(TOKEN_KEY) ?? null
  }, [])

  return { isLoggedIn, login, signup, logout, getToken }
}
