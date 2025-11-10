import React, { useMemo, useState } from 'react'
import { UserContext, type AppUser, type Tenant, type UserContextType } from './user-context'

function seedUser(): AppUser {
  return { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', role: 'Administrator', avatarUrl: undefined }
}

function seedTenant(): Tenant {
  return { id: 'tenant-1', name: 'Efficiency Group' }
}

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser>(seedUser())
  const [tenant, setTenant] = useState<Tenant>(seedTenant())

  const value = useMemo<UserContextType>(() => ({
    user,
    tenant,
    updateUser: (patch: Partial<AppUser>) => setUser((prev) => ({ ...prev, ...patch })),
    updateTenant: (patch: Partial<Tenant>) => setTenant((prev) => ({ ...prev, ...patch })),
  }), [user, tenant])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}