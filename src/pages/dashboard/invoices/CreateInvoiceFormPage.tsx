import { useMemo, useState, useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useContactsStore } from "@/pages/dashboard/contacts/store-context"
import { useArticlesStore } from "@/pages/dashboard/articles/store-context"
import { usePMESelection } from "@/context/pme-context"
import { useInvoicesStore } from "./store-context"
import type { InvoiceEntity, InvoiceLine } from "./types"

export default function CreateInvoiceFormPage() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { contacts } = useContactsStore()
  const { articles } = useArticlesStore()
  const { selectedOrgId, selectedOrgName } = usePMESelection()
  const { addInvoice } = useInvoicesStore()

  const isStandard = type === "standard" || type === "interco"
  const isCredit = type === "credit"
  const isDebit = type === "debit"
  const displayTypeLabel = isCredit ? "Avoir" : isDebit ? "Doit" : "Facture Standard"

  const [counterpartyId, setCounterpartyId] = useState<string>("")
  const [counterpartyKind] = useState<"contact" | "organization">("contact")
  const [number, setNumber] = useState<string>(() => `INV-${Math.floor(Math.random() * 10000)}`)
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0,10))
  const [dueDate, setDueDate] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [lines, setLines] = useState<InvoiceLine[]>([])
  const [errors, setErrors] = useState<string>("")
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const selected = searchParams.get("selectedContact")
    if (selected) {
      setCounterpartyId(selected)
    }
  }, [searchParams])

  const selectableContacts = useMemo(() => {
    return contacts.filter((c) => (isStandard || isCredit || isDebit) ? c.partyType !== "supplier" : true)
  }, [contacts, isStandard, isCredit, isDebit])

  // INTERCO handled as regular invoices by selecting internal contacts from the list

  const addFreeformLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: `ln-${Date.now()}`,
        articleId: null,
        code: "",
        designation: "",
        unit: null,
        quantity: isCredit ? -1 : 1,
        unitPricePuht: 0,
        vatRate: 19,
        dcRate: 1,
      },
    ])
  }

  const addLineFromArticle = (articleId: string) => {
    const a = articles.find((x) => x.id === articleId)
    if (!a) return
    setLines((prev) => [
      ...prev,
      {
        id: `ln-${Date.now()}`,
        articleId: a.id,
        code: a.code,
        designation: a.designation,
        unit: a.unit,
        quantity: isCredit ? -1 : 1,
        unitPricePuht: a.unitPricePuht,
        vatRate: a.vatRate,
        dcRate: a.dcRate,
      },
    ])
  }

  const handleSave = () => {
    setErrors("")
    if (selectedOrgId === "all") {
      setErrors("Sélectionnez d'abord une PME émettrice via le sélecteur global.")
      return
    }
    if (!counterpartyId) {
      setErrors("Sélectionnez un client/contrepartie.")
      return
    }
    if (lines.length < 1) {
      setErrors("Ajoutez au moins une ligne.")
      return
    }
    const inv: InvoiceEntity = {
      id: `inv-${Date.now()}`,
      number,
      date,
      dueDate: isStandard ? dueDate || undefined : undefined,
      organizationId: selectedOrgId,
      counterpartyKind,
      counterpartyId,
      type: isCredit ? "credit" : isDebit ? "debit" : "standard",
      status: "draft",
      lines,
      consignments: [],
      totals: {},
      references: {},
      notes,
    }

    // Auto-generate consignments from article configs
    for (const ln of lines) {
      const a = ln.articleId ? articles.find((x) => x.id === ln.articleId) : null
      if (a && a.type === "product" && a.consignment.enabled) {
        for (const p of a.consignment.packaging) {
          const qty = (ln.quantity || 0) * p.unitsPerArticle
          inv.consignments.push({ packagingType: p.type, unitsPerArticle: p.unitsPerArticle, quantity: qty, depositValue: p.depositValue, total: qty * p.depositValue, sourceLineId: ln.id })
        }
      }
    }

    addInvoice(inv)
    navigate(`/dashboard/invoices/${inv.id}`)
  }

  const inlineAddMinimalContact = () => {
    const returnTo = type ? `/dashboard/invoices/create/${type}` : "/dashboard/invoices/create/standard"
    navigate("/dashboard/contacts/add", { state: { returnTo } })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Créer {displayTypeLabel}
            {number ? ` — ${number}` : ""}
          </CardTitle>
          <CardDescription>Formulaire structuré comme le papier (brouillon)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors && <div className="text-red-600 text-sm">{errors}</div>}

          {/* Header block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Émetteur (PME)</Label>
              <div className="text-sm mt-2">
                {selectedOrgId === 'all' ? (
                  <span className="text-muted-foreground">Aucune PME sélectionnée</span>
                ) : (
                  <span className="font-medium">{selectedOrgName}</span>
                )}
              </div>
            </div>
            <div>
              <Label>Contrepartie *</Label>
              <div className="flex gap-2">
                <Select value={counterpartyId} onValueChange={(v) => { setCounterpartyId(v) }}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Client / Fournisseur" /></SelectTrigger>
                  <SelectContent>
                    {selectableContacts.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" type="button" onClick={inlineAddMinimalContact}>+ New Contact</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Numéro *</Label>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} />
              </div>
              <div>
                <Label>Date *</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              {isStandard && (
                <div>
                  <Label>Échéance</Label>
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              )}
            </div>
          </div>

          {/* Lines table */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Select onValueChange={(v) => addLineFromArticle(v)}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Ajouter depuis article" /></SelectTrigger>
                <SelectContent>
                  {articles.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.code} — {a.designation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" type="button" onClick={addFreeformLine}>Freeform line</Button>
            </div>

            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Désignation</th>
                    <th className="p-2">Qté</th>
                    <th className="p-2">Unité</th>
                    <>
                      <th className="p-2">PUHT</th>
                      <th className="p-2">TVA</th>
                      <th className="p-2">DC</th>
                      <th className="p-2">MTTC</th>
                    </>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((ln, idx) => (
                    <tr key={ln.id} className="border-t">
                      <td className="p-2"><Input value={ln.code} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, code: e.target.value } : x))} /></td>
                      <td className="p-2"><Input value={ln.designation} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, designation: e.target.value } : x))} /></td>
                      <td className="p-2 w-24"><Input type="number" value={ln.quantity} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, quantity: Number(e.target.value || 0) } : x))} /></td>
                      <td className="p-2"><Input value={ln.unit ?? ""} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, unit: e.target.value } : x))} /></td>
                      <>
                        <td className="p-2 w-32">
                          <Input
                            type="number"
                            value={ln.unitPricePuht}
                            onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, unitPricePuht: Number(e.target.value || 0) } : x))}
                          />
                        </td>
                        <td className="p-2 w-24">
                          <Input
                            type="number"
                            value={ln.vatRate}
                            onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, vatRate: Number(e.target.value || 0) } : x))}
                          />
                        </td>
                        <td className="p-2 w-24">
                          <Input
                            type="number"
                            value={ln.dcRate}
                            onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, dcRate: Number(e.target.value || 0) } : x))}
                          />
                        </td>
                        <td className="p-2 w-28 text-right">{/* MTTC computed in details */}</td>
                      </>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {/* Consignment (auto) */}
          <div className="space-y-2">
            <details>
              <summary className="cursor-pointer">Consignation (auto-générée)</summary>
              <p className="text-xs text-muted-foreground">Calculée depuis la configuration des articles. Hors HT/TVA/DC.</p>
            </details>
          </div>

          {/* Footer actions */}
          <div className="flex gap-2">
            <Button type="button" onClick={handleSave}>Enregistrer</Button>
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/invoices")}>Annuler</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}