// Standalone JWT implementation for portability
// Uses Node.js crypto instead of @fastify/jwt for flexibility

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production'

interface TokenPayload {
  id: string
}

// Simple JWT implementation using Node.js crypto
import { createHmac } from 'crypto'

function base64url(str: string): string {
  return Buffer.from(str).toString('base64url')
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, 'base64url').toString()
}

function sign(payload: object, expiresIn: number): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const body = base64url(JSON.stringify({ ...payload, iat: now, exp: now + expiresIn }))
  const signature = createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')
  return `${header}.${body}.${signature}`
}

function verify(token: string): TokenPayload | null {
  try {
    const [header, body, signature] = token.split('.')
    const expected = createHmac('sha256', SECRET)
      .update(`${header}.${body}`)
      .digest('base64url')
    if (signature !== expected) return null
    const payload = JSON.parse(base64urlDecode(body))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return { id: payload.id }
  } catch {
    return null
  }
}

export function signToken(userId: string): string {
  return sign({ id: userId }, 3600) // 1 hour
}

export function verifyToken(token: string): TokenPayload | null {
  return verify(token)
}

export function signRefreshToken(userId: string): string {
  return sign({ id: userId }, 30 * 24 * 3600) // 30 days
}
