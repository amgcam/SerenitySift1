// Generate secure invite tokens for patient connections

export function generateInviteToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function getInviteExpiry(): Date {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 7) // 7 days from now
  return expiry
}

export function isInviteExpired(expiresAt: string | Date): boolean {
  return new Date(expiresAt) < new Date()
}
