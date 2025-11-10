export type PartyType = "customer" | "supplier" | "both"

export type ContactEntity = {
  id: string
  partyType: PartyType
  isInternalOrg: boolean
  internalOrganizationId: string | null
  companyName: string
  mf: string | null
  uniqueId: string | null
  address: {
    line1: string
    city: string
    zipCode: string
    country: string
  }
  contact: {
    phone: string | null
    fax: string | null
  }
  conditionsDeVente: string | null
}

export type OrganizationEntity = {
  id: string
  name: string
}

export type InvoiceEntity = {
  id: string
  contactId: string
  number: string
  date: string
  type: "standard" | "credit" | "advance"
  status: "draft" | "sent" | "paid" | "overdue"
  totalTTC: number
}

export type ContactsStore = {
  contacts: ContactEntity[]
  organizations: OrganizationEntity[]
  invoices: InvoiceEntity[]
  archivedIds: Set<string>
  addContact: (c: ContactEntity) => void
  updateContact: (id: string, patch: Partial<ContactEntity>) => void
  archiveContact: (id: string) => void
  addOrganization: (o: OrganizationEntity) => void
}