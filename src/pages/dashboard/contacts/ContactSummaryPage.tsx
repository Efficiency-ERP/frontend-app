import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useContactsStore } from "./store-context"
import { useInvoicesStore } from "@/pages/dashboard/invoices/store-context"
import { formatTND } from "@/lib/utils"
import { FileText, MinusCircle, PlusCircle } from "lucide-react"

export default function ContactSummaryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { contacts } = useContactsStore()
  const { invoices } = useInvoicesStore()

  const contact = useMemo(() => contacts.find((c) => c.id === id), [contacts, id])
  const contactInvoices = useMemo(
    () => invoices.filter((i) => i.counterpartyKind === "contact" && i.counterpartyId === id),
    [invoices, id]
  )

  const invoiceCount = contactInvoices.length
  const totalTTC = contactInvoices.reduce((sum, i) => sum + (i.totals.ttc ?? 0), 0)
  const outstanding = contactInvoices
    .filter((i) => i.status === "sent")
    .reduce((sum, i) => sum + (i.totals.ttc ?? 0), 0)

  const lastInvoiceDate = contactInvoices.length
    ? new Date(Math.max(...contactInvoices.map((i) => new Date(i.date).getTime())))
    : null

  const [statusFilter, setStatusFilter] = useState("all")
  const [daysFilter, setDaysFilter] = useState("all")

  const filteredInvoices = useMemo(() => {
    const now = Date.now()
    return contactInvoices.filter((i) => {
      const statusOk = statusFilter === "all" ? true : i.status === statusFilter
      const daysOk = daysFilter === "all" ? true : (now - new Date(i.date).getTime()) <= Number(daysFilter) * 24 * 3600 * 1000
      return statusOk && daysOk
    })
  }, [contactInvoices, statusFilter, daysFilter])

  if (!contact) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact introuvable</CardTitle>
            <CardDescription>Le contact demandé n'existe pas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/dashboard/contacts")}>Retour aux contacts</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const addr = `${contact.address.line1}, ${contact.address.city} ${contact.address.zipCode}, ${contact.address.country}`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>{contact.companyName}</CardTitle>
                <Badge variant="secondary" className="capitalize">{contact.partyType}</Badge>
                {contact.isInternalOrg && <Badge variant="outline">Interne</Badge>}
              </div>
              <CardDescription>
                MF: {contact.mf ?? "—"} · ID: {contact.uniqueId ?? "—"} · {contact.contact.phone ?? "—"} · {contact.contact.fax ?? "—"} · {addr}
              </CardDescription>
              {contact.conditionsDeVente && (
                <div className="text-sm text-muted-foreground">Conditions de vente: {contact.conditionsDeVente}</div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/dashboard/contacts/${contact.id}/edit`)}>Edit Contact</Button>
              {(contact.partyType === "customer" || contact.partyType === "both") && (
                <>
                  <Button variant="default" onClick={() => navigate(`/dashboard/invoices/create/standard?selectedContact=${contact.id}`)}>
                    <FileText className="mr-2 h-4 w-4" /> Create Invoice
                  </Button>
                  <Button variant="destructive" onClick={() => navigate(`/dashboard/invoices/create/credit?selectedContact=${contact.id}`)}>
                    <MinusCircle className="mr-2 h-4 w-4" /> Create Credit
                  </Button>
                  <Button variant="secondary" onClick={() => navigate(`/dashboard/invoices/create/debit?selectedContact=${contact.id}`)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Debit
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Metric title="Invoices" value={invoiceCount} />
            <Metric title="Total TTC" value={formatTND(totalTTC)} />
            <Metric title="Outstanding" value={formatTND(outstanding)} />
            <Metric title="Dernière facture" value={lastInvoiceDate ? new Intl.DateTimeFormat().format(lastInvoiceDate) : "—"} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Factures récentes</CardTitle>
          <CardDescription>Filtrer par statut et période</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 pb-4">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="sent">Envoyé</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={daysFilter} onValueChange={(v) => setDaysFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="30">30 jours</SelectItem>
                <SelectItem value="90">90 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Total TTC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length ? (
                  filteredInvoices.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.number}</TableCell>
                      <TableCell>{new Intl.DateTimeFormat().format(new Date(i.date))}</TableCell>
                      <TableCell className="capitalize">{i.type}</TableCell>
                      <TableCell className="capitalize">{i.status}</TableCell>
                      <TableCell className="text-right">{i.totals.ttc !== undefined ? formatTND(i.totals.ttc) : "—"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Aucun résultat.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

// Currency formatting handled via formatTND from lib/utils