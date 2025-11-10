import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useContactsStore } from "./store-context"
import { usePMESelection } from "@/context/pme-context"
import type { ContactEntity } from "./types"

export default function ListContactsPage() {
  const navigate = useNavigate()
  const { contacts, archivedIds } = useContactsStore()
  const { selectedOrgId } = usePMESelection()

  const [query, setQuery] = useState("")
  const [type, setType] = useState<string>("all")

  const visible = useMemo(() => contacts.filter((c) => !archivedIds.has(c.id)), [contacts, archivedIds])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return visible.filter((c) => {
      const matchesQuery = q
        ? [c.companyName, c.mf ?? "", c.uniqueId ?? ""].some((v) => v.toLowerCase().includes(q))
        : true
      const matchesType = type === "all" ? true : c.partyType === type
      const matchesPME = selectedOrgId === 'all'
        ? true
        : (c.isInternalOrg && c.internalOrganizationId === selectedOrgId)
      return matchesQuery && matchesType && matchesPME
    })
  }, [visible, query, type, selectedOrgId])

  const columns: ColumnDef<ContactEntity>[] = [
    {
      accessorKey: "companyName",
      header: "Nom de société",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/contacts/${row.original.id}`} className="hover:underline">{row.original.companyName}</Link>
          {row.original.isInternalOrg && <Badge variant="outline">Interne</Badge>}
        </div>
      ),
    },
    { accessorKey: "mf", header: "MF", cell: ({ row }) => row.original.mf ?? "—" },
    { accessorKey: "uniqueId", header: "Identifiant unique", cell: ({ row }) => row.original.uniqueId ?? "—" },
    { id: "phone", header: "Num Télé", cell: ({ row }) => row.original.contact.phone ?? "—" },
    { id: "fax", header: "Num Fax", cell: ({ row }) => row.original.contact.fax ?? "—" },
    { id: "city", header: "Ville", cell: ({ row }) => row.original.address.city },
    // Country column removed per requirement
    {
      id: "partyType",
      header: "Type",
      cell: ({ row }) => <Badge variant="secondary" className="capitalize">{row.original.partyType}</Badge>,
    },
    // Actions column removed; company name link handles navigation
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Module facturation — clients et fournisseurs</CardDescription>
            </div>
            <Button onClick={() => navigate("/dashboard/contacts/add")}>Add Contact</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 pb-4">
            <Input
              placeholder="Rechercher (Nom de société, MF, Identifiant unique)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={type} onValueChange={(v) => setType(v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="supplier">Supplier</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            {/* PME filter removed; global selector in the top bar applies */}
          </div>
          <DataTable columns={columns} data={filtered} pageSizeOptions={[25,50,100]} />
        </CardContent>
      </Card>
    </div>
  )
}