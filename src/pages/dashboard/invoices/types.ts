export type InvoiceType = "standard" | "credit" | "debit"
export type InvoiceStatus = "draft" | "sent" | "paid" | "cancelled"

export type CounterpartyKind = "contact" | "organization"

export interface InvoiceLineBase {
  id: string
  articleId: string | null
  code: string
  designation: string
  unit: string | null
  quantity: number
}

export interface InvoiceLine extends InvoiceLineBase {
  unitPricePuht: number
  remisePercent?: number
  vatRate: number
  dcRate: number
}

export interface ConsignmentLine {
  packagingType: string
  unitsPerArticle: number
  quantity: number
  depositValue: number
  total: number
  sourceLineId: string // links to invoice line
}

export interface InvoiceEntity {
  id: string
  number: string
  date: string // ISO
  dueDate?: string // ISO
  organizationId: string // issuer PME
  counterpartyKind: CounterpartyKind
  counterpartyId: string
  type: InvoiceType
  status: InvoiceStatus
  lines: InvoiceLine[]
  consignments: ConsignmentLine[]
  totals: {
    htSubtotal?: number
    vatByRate?: Record<number, number>
    dcByRate?: Record<number, number>
    ttc?: number
  }
  references?: {
    orderId?: string
    deliveryId?: string
    originalInvoiceId?: string
  }
  notes?: string
}

export interface DeliveryEntity {
  id: string
  number: string
  date: string
  organizationId: string
  counterpartyId: string
  driverName?: string
  vehicleRegistration?: string
  lines: Array<{ id: string; code: string; designation: string; unit: string | null; quantity: number }>
  reference?: { orderId?: string; invoiceId?: string }
  status: "draft" | "final"
}

export interface IssueEntity {
  id: string
  number: string
  date: string
  organizationId: string
  counterpartyId: string
  lines: Array<{ id: string; code: string; designation: string; unit: string | null; quantity: number }>
  reference?: { orderId?: string }
  status: "draft" | "final"
}

export interface OrderEntity {
  id: string
  number: string
  date: string
  organizationId: string
  counterpartyId: string
  type: "supplier" | "interco" | "customer"
  lines: Array<{ id: string; code: string; designation: string; unit: string | null; quantity: number; unitPrice?: number }>
  status: "draft" | "final"
}

export interface InvoicesStore {
  invoices: InvoiceEntity[]
  deliveries: DeliveryEntity[]
  issues: IssueEntity[]
  orders: OrderEntity[]
  addInvoice: (inv: InvoiceEntity) => void
  updateInvoice: (id: string, patch: Partial<InvoiceEntity>) => void
  duplicateInvoice: (id: string) => InvoiceEntity | null
  markPaid: (id: string) => void
  cancelInvoice: (id: string) => void
  addDelivery: (d: DeliveryEntity) => void
  addIssue: (i: IssueEntity) => void
  addOrder: (o: OrderEntity) => void
  createDeliveryFromInvoice: (invoiceId: string) => DeliveryEntity | null
  createInvoiceFromDelivery: (deliveryId: string) => InvoiceEntity | null
}