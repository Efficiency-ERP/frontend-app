import React, { useMemo, useState } from "react"
import type { ArticleEntity, ConsignmentPackaging, MockInvoiceLine, ArticlesStore } from "./types"
import { ArticlesContext } from "./store-context"

function seedArticles(): ArticleEntity[] {
  const consignmentPkgs: ConsignmentPackaging[] = [
    { type: "BOUTEILLE", unitsPerArticle: 12, depositValue: 1.5 },
    { type: "CASIER", unitsPerArticle: 6, depositValue: 5 },
  ]

  return [
    {
      id: "art-tn-1001",
      type: "product",
      code: "P-BTL-001",
      designation: "Eau Minérale 1L",
      organizationId: "org-tn-1",
      unit: "pièce",
      unitPricePuht: 2.5,
      transferPrice: 2.2,
      vatRate: 19,
      dcRate: 1,
      stock: { onHand: 120, minStock: 50 },
      consignment: { enabled: true, packaging: consignmentPkgs },
      active: true,
    },
    {
      id: "art-tn-2001",
      type: "service",
      code: "S-CONS-001",
      designation: "Consultation technique",
      organizationId: "org-tn-2",
      unit: null,
      unitPricePuht: 150,
      transferPrice: 150,
      vatRate: 19,
      dcRate: 1,
      stock: { onHand: 0, minStock: 0 },
      consignment: { enabled: false, packaging: [] },
      active: true,
    },
  ]
}

function seedInvoices(): MockInvoiceLine[] {
  return [
    {
      invoiceId: "INV-001",
      invoiceNumber: "INV-001",
      date: new Date().toISOString(),
      articleId: "art-tn-1001",
      type: "standard",
      quantity: 10,
      priceBasis: "PUHT",
      unitPrice: 2.5,
    },
    {
      invoiceId: "INV-002",
      invoiceNumber: "INV-002",
      date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      articleId: "art-tn-1001",
      type: "interco",
      quantity: 5,
      priceBasis: "transfer",
      unitPrice: 2.2,
    },
    {
      invoiceId: "INV-003",
      invoiceNumber: "INV-003",
      date: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      articleId: "art-tn-2001",
      type: "standard",
      quantity: 2,
      priceBasis: "PUHT",
      unitPrice: 150,
    },
  ]
}

export default function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<ArticleEntity[]>(seedArticles())
  const [invoices] = useState<MockInvoiceLine[]>(seedInvoices())

  const store = useMemo<ArticlesStore>(() => ({
    articles,
    invoices,
    addArticle: (a: ArticleEntity) => setArticles((prev) => [a, ...prev]),
    updateArticle: (id: string, patch: Partial<ArticleEntity>) =>
      setArticles((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    toggleActive: (id: string) =>
      setArticles((prev) => prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x))),
  }), [articles, invoices])

  return <ArticlesContext.Provider value={store}>{children}</ArticlesContext.Provider>
}