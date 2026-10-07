import { getAdminUser } from '@/features/admin/api/admin-user'

export type { AdminUser } from '@/features/admin/api/admin-user'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export { getAdminUser }
