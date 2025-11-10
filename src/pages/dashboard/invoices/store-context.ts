import { createContext, useContext } from "react"
import type { InvoicesStore } from "./types"

export const InvoicesContext = createContext<InvoicesStore | null>(null)

export function useInvoicesStore() {
  const ctx = useContext(InvoicesContext)
  if (!ctx) throw new Error("useInvoicesStore must be used within an InvoicesProvider")
  return ctx
}