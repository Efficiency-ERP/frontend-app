import type { Invoice } from "./columns"

export const invoices: Invoice[] = [
  { id: "INV-0001", customer: "Acme Inc.", amount: 1200, status: "paid", date: "2025-10-01" },
  { id: "INV-0002", customer: "Globex Corp.", amount: 980, status: "pending", date: "2025-10-05" },
  { id: "INV-0003", customer: "Soylent Co.", amount: 450, status: "overdue", date: "2025-09-20" },
  { id: "INV-0004", customer: "Initech", amount: 2200, status: "pending", date: "2025-10-15" },
  { id: "INV-0005", customer: "Umbrella Corp.", amount: 750, status: "paid", date: "2025-10-12" },
  { id: "INV-0006", customer: "Wayne Enterprises", amount: 3110, status: "pending", date: "2025-10-17" },
  { id: "INV-0007", customer: "Stark Industries", amount: 499, status: "overdue", date: "2025-09-28" },
]