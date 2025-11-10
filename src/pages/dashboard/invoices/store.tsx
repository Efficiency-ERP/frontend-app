import React, { useMemo, useState } from "react"
import { InvoicesContext } from "./store-context"
import type {
  InvoicesStore,
  InvoiceEntity,
  DeliveryEntity,
  IssueEntity,
  OrderEntity,
  InvoiceLine,
} from "./types"

function seedInvoices(): InvoiceEntity[] {
  return []
}

function seedDeliveries(): DeliveryEntity[] { return [] }
function seedIssues(): IssueEntity[] { return [] }
function seedOrders(): OrderEntity[] { return [] }

function computeTotals(inv: InvoiceEntity): InvoiceEntity["totals"] {
  const htSubtotal = inv.lines.reduce((sum, l: InvoiceLine) => {
    const remise = l.remisePercent ? (l.unitPricePuht * l.remisePercent) / 100 : 0
    const puhtNet = l.unitPricePuht - remise
    return sum + puhtNet * l.quantity
  }, 0)

  const vatByRate: Record<number, number> = {}
  const dcByRate: Record<number, number> = {}
  for (const l of inv.lines as InvoiceLine[]) {
    const remise = l.remisePercent ? (l.unitPricePuht * l.remisePercent) / 100 : 0
    const puhtNet = l.unitPricePuht - remise
    const ht = puhtNet * l.quantity
    vatByRate[l.vatRate] = (vatByRate[l.vatRate] || 0) + (ht * l.vatRate) / 100
    dcByRate[l.dcRate] = (dcByRate[l.dcRate] || 0) + (ht * l.dcRate) / 100
  }
  const vatTotal = Object.values(vatByRate).reduce((a, b) => a + b, 0)
  const dcTotal = Object.values(dcByRate).reduce((a, b) => a + b, 0)
  const ttc = htSubtotal + vatTotal + dcTotal
  return { htSubtotal, vatByRate, dcByRate, ttc }
}

export default function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<InvoiceEntity[]>(seedInvoices())
  const [deliveries, setDeliveries] = useState<DeliveryEntity[]>(seedDeliveries())
  const [issues, setIssues] = useState<IssueEntity[]>(seedIssues())
  const [orders, setOrders] = useState<OrderEntity[]>(seedOrders())

  const store = useMemo<InvoicesStore>(() => ({
    invoices,
    deliveries,
    issues,
    orders,
    addInvoice: (inv: InvoiceEntity) => setInvoices((prev) => [{ ...inv, totals: computeTotals(inv) }, ...prev]),
    updateInvoice: (id: string, patch: Partial<InvoiceEntity>) =>
      setInvoices((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch, totals: computeTotals({ ...x, ...patch }) } : x))),
    duplicateInvoice: (id: string) => {
      const src = invoices.find((i) => i.id === id)
      if (!src) return null
      const copy: InvoiceEntity = { ...src, id: `inv-${Date.now()}`, status: "draft", number: `${src.number}-copy` }
      setInvoices((prev) => [copy, ...prev])
      return copy
    },
    markPaid: (id: string) => setInvoices((prev) => prev.map((x) => (x.id === id ? { ...x, status: "paid" } : x))),
    cancelInvoice: (id: string) => setInvoices((prev) => prev.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x))),
    addDelivery: (d: DeliveryEntity) => setDeliveries((prev) => [d, ...prev]),
    addIssue: (i: IssueEntity) => setIssues((prev) => [i, ...prev]),
    addOrder: (o: OrderEntity) => setOrders((prev) => [o, ...prev]),
    createDeliveryFromInvoice: (invoiceId: string) => {
      const inv = invoices.find((i) => i.id === invoiceId)
      if (!inv) return null
      const d: DeliveryEntity = {
        id: `del-${Date.now()}`,
        number: `BL-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().slice(0, 10),
        organizationId: inv.organizationId,
        counterpartyId: inv.counterpartyId,
        lines: inv.lines.map((l) => ({ id: `dl-${l.id}`, code: l.code, designation: l.designation, unit: l.unit, quantity: l.quantity })),
        reference: { invoiceId: inv.id },
        status: "draft",
      }
      setDeliveries((prev) => [d, ...prev])
      return d
    },
    createInvoiceFromDelivery: (deliveryId: string) => {
      const del = deliveries.find((d) => d.id === deliveryId)
      if (!del) return null
      const inv: InvoiceEntity = {
        id: `inv-${Date.now()}`,
        number: `INV-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().slice(0, 10),
        dueDate: undefined,
        organizationId: del.organizationId,
        counterpartyKind: "contact",
        counterpartyId: del.counterpartyId,
        type: "standard",
        status: "draft",
        lines: del.lines.map((l) => ({ id: `li-${l.id}`, articleId: null, code: l.code, designation: l.designation, unit: l.unit, quantity: l.quantity, unitPricePuht: 0, vatRate: 19, dcRate: 1 })),
        consignments: [],
        totals: { htSubtotal: 0, vatByRate: {}, dcByRate: {}, ttc: 0 },
        references: { deliveryId },
      }
      inv.totals = computeTotals(inv)
      setInvoices((prev) => [inv, ...prev])
      return inv
    },
  }), [invoices, deliveries, issues, orders])

  return <InvoicesContext.Provider value={store}>{children}</InvoicesContext.Provider>
}