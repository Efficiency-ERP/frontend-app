import { useMemo, useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useInvoicesStore } from "./store-context"
import type { InvoiceEntity } from "./types"
import { formatTND } from "@/lib/utils"

// All monetary amounts displayed in TND

export default function AllInvoicesPage() {
  const navigate = useNavigate()
  const { invoices } = useInvoicesStore()
  const [searchParams] = useSearchParams()

  const [query, setQuery] = useState("")
  const [type, setType] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")

  useEffect(() => {
    const s = searchParams.get('status')
    if (s) setStatus(s)
    const t = searchParams.get('type')
    if (t) setType(t)
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [searchParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return invoices.filter((i) => {
      const matchesQuery = q ? [i.number, i.counterpartyId].some((v) => v.toLowerCase().includes(q)) : true
      const matchesType = type === "all" ? true : i.type === type
      const matchesStatus = status === "all" ? true : i.status === status
      return matchesQuery && matchesType && matchesStatus
    })
  }, [invoices, query, type, status])

  const totalInvoices = invoices.length
  const paidCount = invoices.filter((i) => i.status === "paid").length
  const outstandingCount = invoices.filter((i) => i.status !== "paid").length
  const outstandingAmount = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + (i.totals.ttc ?? 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">{paidCount} paid · {totalInvoices - paidCount} unpaid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalInvoices ? Math.round((paidCount / totalInvoices) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTND(outstandingAmount)}</div>
            <p className="text-xs text-muted-foreground">Across {outstandingCount} invoice{outstandingCount === 1 ? "" : "s"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>List, search and filter</CardDescription>
            </div>
            <Button onClick={() => navigate("/dashboard/invoices/create")}>Create</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 pb-4">
            <Input placeholder="Search (number or counterparty)" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
            <Select value={type} onValueChange={(v) => setType(v)}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">TTC</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((i: InvoiceEntity) => (
                  <TableRow key={i.id}>
                    <TableCell>{i.number}</TableCell>
                    <TableCell>{i.date}</TableCell>
                    <TableCell className="capitalize">{i.type}</TableCell>
                    <TableCell>{i.counterpartyId}</TableCell>
                    <TableCell className="capitalize">{i.status}</TableCell>
                    <TableCell className="text-right">{i.totals.ttc !== undefined ? formatTND(i.totals.ttc) : "—"}</TableCell>
                    <TableCell>{i.dueDate ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/invoices/${i.id}`)}>View</Button>
                        {i.status === "draft" && <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/invoices/${i.id}/edit`)}>Edit</Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}