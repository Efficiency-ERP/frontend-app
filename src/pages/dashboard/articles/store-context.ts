import { createContext, useContext } from "react"
import type { ArticlesStore } from "./types"

export const ArticlesContext = createContext<ArticlesStore | null>(null)

export function useArticlesStore() {
  const ctx = useContext(ArticlesContext)
  if (!ctx) throw new Error("useArticlesStore must be used within an ArticlesProvider")
  return ctx
}