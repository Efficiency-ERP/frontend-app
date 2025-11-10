import { createContext, useContext } from "react"
import type { ContactsStore } from "./types"

export const ContactsContext = createContext<ContactsStore | null>(null)

export function useContactsStore() {
  const ctx = useContext(ContactsContext)
  if (!ctx) throw new Error("useContactsStore must be used within a ContactsProvider")
  return ctx
}