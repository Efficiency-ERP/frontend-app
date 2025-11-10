import React, { useMemo, useState } from "react"
import { useContactsStore } from "@/pages/dashboard/contacts/store-context"
import { PMEContext } from "./pme-context"

export default function PMEProvider({ children }: { children: React.ReactNode }) {
  const { organizations } = useContactsStore()
  const [selectedOrgId, setSelectedOrgId] = useState<string>("all")

  const selectedOrgName = useMemo(() => {
    if (selectedOrgId === "all") return null
    const org = organizations.find((o) => o.id === selectedOrgId)
    return org ? org.name : null
  }, [selectedOrgId, organizations])

  const value = {
    selectedOrgId,
    setSelectedOrgId,
    selectedOrgName,
  }

  return <PMEContext.Provider value={value}>{children}</PMEContext.Provider>
}