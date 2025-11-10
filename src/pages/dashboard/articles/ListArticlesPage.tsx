import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useArticlesStore } from "./store-context"
import { usePMESelection } from "@/context/pme-context"
import type { ArticleEntity } from "./types"

export default function ListArticlesPage() {
  const navigate = useNavigate()
  const { articles } = useArticlesStore()
  const { selectedOrgId } = usePMESelection()

  const [query, setQuery] = useState("")
  const [type, setType] = useState<string>("all")
  const [consignation, setConsignation] = useState<string>("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter((a) => {
      const matchesQuery = q ? [a.code, a.designation].some((v) => v.toLowerCase().includes(q)) : true
      const matchesType = type === "all" ? true : a.type === type
      const matchesCons = consignation === "all" ? true : (consignation === "yes" ? a.consignment.enabled : !a.consignment.enabled)
      const matchesOrg = selectedOrgId === "all" ? true : a.organizationId === selectedOrgId
      return matchesQuery && matchesType && matchesCons && matchesOrg
    })
  }, [articles, query, type, consignation, selectedOrgId])

  const columns: ColumnDef<ArticleEntity>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <Link to={`/dashboard/articles/${row.original.id}`} className="hover:underline">{row.original.code}</Link>
      ),
    },
    {
      accessorKey: "designation",
      header: "Désignation",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/articles/${row.original.id}`} className="hover:underline">{row.original.designation}</Link>
          <Badge variant="secondary" className="capitalize">{row.original.type}</Badge>
        </div>
      ),
    },
    {
      id: "unit",
      header: "Unité",
      cell: ({ row }) => row.original.type === "product" ? (row.original.unit ?? "—") : "—",
    },
    { accessorKey: "unitPricePuht", header: "PUHT" },
    { accessorKey: "transferPrice", header: "Transfert" },
    { accessorKey: "vatRate", header: "TVA %" },
    { accessorKey: "dcRate", header: "DC %" },
    {
      id: "onHand",
      header: "Stock (Qté)",
      cell: ({ row }) => row.original.type === "product" ? row.original.stock.onHand : "—",
    },
    {
      id: "minStock",
      header: "Stock min.",
      cell: ({ row }) => row.original.type === "product" ? row.original.stock.minStock : "—",
    },
    {
      id: "consignment",
      header: "Consignation",
      cell: ({ row }) => (row.original.consignment.enabled ? "Yes" : "No"),
    },
    // Removed active status column per requirement
    // No table actions; the code/designation link navigates to summary
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Articles (Stock)</CardTitle>
              <CardDescription>Produits et services — module facturation</CardDescription>
            </div>
            <Button onClick={() => navigate("/dashboard/articles/add")}>Add Article</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 pb-4">
            <Input
              placeholder="Rechercher (Code, Désignation)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-80"
            />
            <Select onValueChange={(v: string) => setType(v)}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="product">Produit</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v: string) => setConsignation(v)}>
              <SelectTrigger className="w-56"><SelectValue placeholder="Consignation" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DataTable columns={columns} data={filtered} />
        </CardContent>
      </Card>
    </div>
  )
}