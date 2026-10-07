import { getAdminUser } from '@/features/admin/api/admin-user'

export type { AdminUser } from '@/features/admin/api/admin-user'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login and callback pages skip the role check
  return <>{children}</>
}

// Utility for admin pages to get the current user + role
export { getAdminUser }
