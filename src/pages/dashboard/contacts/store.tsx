import React, { useEffect, useMemo, useState } from "react"
import type { ContactEntity, InvoiceEntity, OrganizationEntity, ContactsStore } from "./types"
import { ContactsContext } from "./store-context"

function seedContacts(): ContactEntity[] {
  return [
    {
      id: "c-tn-1001",
      partyType: "customer",
      isInternalOrg: false,
      internalOrganizationId: null,
      companyName: "Société Carthage",
      mf: "MF-TN-1234",
      uniqueId: "UID-TN-001",
      address: { line1: "10 Avenue Habib Bourguiba", city: "Tunis", zipCode: "1000", country: "Tunisie" },
      contact: { phone: "+216 20 123 456", fax: null },
      conditionsDeVente: "Paiement à 30 jours"
    },
    {
      id: "c-tn-1002",
      partyType: "supplier",
      isInternalOrg: true,
      internalOrganizationId: "org-tn-1",
      companyName: "Fournisseur Sahel",
      mf: null,
      uniqueId: "UID-TN-002",
      address: { line1: "Rue de Sousse", city: "Sousse", zipCode: "4000", country: "Tunisie" },
      contact: { phone: "+216 22 987 654", fax: "+216 71 234 567" },
      conditionsDeVente: null
    },
    {
      id: "c-tn-1003",
      partyType: "both",
      isInternalOrg: false,
      internalOrganizationId: null,
      companyName: "Entreprise Djerba",
      mf: "MF-TN-9988",
      uniqueId: null,
      address: { line1: "Houmt Souk", city: "Djerba", zipCode: "4180", country: "Tunisie" },
      contact: { phone: "+216 23 456 789", fax: null },
      conditionsDeVente: "Paiement à réception"
    }
  ]
}

function seedOrganizations(): OrganizationEntity[] {
  return [
    { id: "org-tn-1", name: "Organisation Interne Tunisie A" },
    { id: "org-tn-2", name: "Organisation Interne Tunisie B" }
  ]
}

function seedInvoices(): InvoiceEntity[] {
  return [
    { id: "inv-tn-1", contactId: "c-tn-1001", number: "TN-FA-2024-001", date: "2024-01-08", type: "standard", status: "paid", totalTTC: 1800.75 },
    { id: "inv-tn-2", contactId: "c-tn-1001", number: "TN-FA-2024-022", date: "2024-03-18", type: "standard", status: "sent", totalTTC: 950 },
    { id: "inv-tn-3", contactId: "c-tn-1002", number: "TN-FA-2024-045", date: "2024-05-30", type: "advance", status: "overdue", totalTTC: 420.5 },
    { id: "inv-tn-4", contactId: "c-tn-1003", number: "TN-FA-2024-088", date: "2024-09-02", type: "credit", status: "paid", totalTTC: -120.0 }
  ]
}

export default function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<ContactEntity[]>(seedContacts())
  const [organizations, setOrganizations] = useState<OrganizationEntity[]>(seedOrganizations())
  const [invoices] = useState<InvoiceEntity[]>(seedInvoices())
  const [archivedIds] = useState<Set<string>>(() => new Set())

  // Ensure each organization has a corresponding internal contact entry
  useEffect(() => {
    setContacts((prev) => {
      const existingOrgIds = new Set(
        prev
          .filter((c) => c.isInternalOrg && c.internalOrganizationId)
          .map((c) => c.internalOrganizationId as string)
      )
      const toAdd: ContactEntity[] = organizations
        .filter((org) => !existingOrgIds.has(org.id))
        .map((org) => ({
          id: `c-int-${org.id}`,
          partyType: "both",
          isInternalOrg: true,
          internalOrganizationId: org.id,
          companyName: org.name,
          mf: null,
          uniqueId: null,
          address: { line1: "", city: "", zipCode: "", country: "Tunisie" },
          contact: { phone: "+216 ", fax: null },
          conditionsDeVente: null,
        }))
      return toAdd.length ? [...toAdd, ...prev] : prev
    })
  }, [organizations])

  const store = useMemo<ContactsStore>(() => ({
    contacts,
    organizations,
    invoices,
    archivedIds,
    addContact: (c: ContactEntity) => setContacts((prev: ContactEntity[]) => [c, ...prev]),
    updateContact: (id: string, patch: Partial<ContactEntity>) =>
      setContacts((prev: ContactEntity[]) => prev.map((c: ContactEntity) => (c.id === id ? { ...c, ...patch } : c))),
    archiveContact: (id: string) => archivedIds.add(id),
    addOrganization: (o: OrganizationEntity) => setOrganizations((prev: OrganizationEntity[]) => [o, ...prev]),
  }), [contacts, organizations, invoices, archivedIds])

  return <ContactsContext.Provider value={store}>{children}</ContactsContext.Provider>
}