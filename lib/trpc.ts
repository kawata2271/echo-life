// tRPC client placeholder for React Native
// Full tRPC client setup requires @trpc/client (installed in Phase 3)
// For now, this provides a typed fetch wrapper

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function trpcQuery<T>(
  path: string,
  token: string | null,
  input?: Record<string, unknown>
): Promise<T> {
  const url = new URL(`/trpc/${path}`, API_URL)
  if (input) {
    url.searchParams.set('input', JSON.stringify(input))
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url.toString(), { headers })
  if (!res.ok) {
    throw new Error(`tRPC query failed: ${res.status}`)
  }

  const data = await res.json()
  return data.result?.data as T
}

export async function trpcMutation<T>(
  path: string,
  token: string | null,
  input: Record<string, unknown>
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}/trpc/${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    throw new Error(`tRPC mutation failed: ${res.status}`)
  }

  const data = await res.json()
  return data.result?.data as T
}
