export type ArticleType = "product" | "service"
export type PackagingType = "BOUTEILLE" | "PALETTE" | "CASIER"

export interface ConsignmentPackaging {
  type: PackagingType
  unitsPerArticle: number
  depositValue: number
}

export interface ArticleEntity {
  id: string
  type: ArticleType
  code: string
  designation: string
  organizationId: string | null
  unit: string | null
  unitPricePuht: number
  transferPrice: number
  vatRate: number
  dcRate: number
  stock: { onHand: 0 | number; minStock: 0 | number }
  consignment: { enabled: boolean; packaging: ConsignmentPackaging[] }
  active: boolean
}

export type InvoiceType = "standard" | "interco"
export type PriceBasis = "PUHT" | "transfer"

export interface MockInvoiceLine {
  invoiceId: string
  invoiceNumber: string
  date: string // ISO date
  articleId: string
  type: InvoiceType
  quantity: number
  priceBasis: PriceBasis
  unitPrice: number
}

export interface ArticlesStore {
  articles: ArticleEntity[]
  invoices: MockInvoiceLine[]
  addArticle: (a: ArticleEntity) => void
  updateArticle: (id: string, patch: Partial<ArticleEntity>) => void
  toggleActive: (id: string) => void
}