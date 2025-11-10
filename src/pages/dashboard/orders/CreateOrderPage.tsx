import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useContactsStore } from "@/pages/dashboard/contacts/store-context"
import { useArticlesStore } from "@/pages/dashboard/articles/store-context"
import { usePMESelection } from "@/context/pme-context"
import { useInvoicesStore } from "@/pages/dashboard/invoices/store-context"
import type { OrderEntity } from "@/pages/dashboard/invoices/types"

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultType = searchParams.get("type") === "customer" ? "customer" : "supplier"
  const { contacts } = useContactsStore()
  const { articles } = useArticlesStore()
  const { selectedOrgId, selectedOrgName } = usePMESelection()
  const { addOrder } = useInvoicesStore()

  const suppliers = useMemo(() => contacts.filter((c) => c.partyType !== "customer"), [contacts])
  const customers = useMemo(() => contacts.filter((c) => c.partyType !== "supplier"), [contacts])

  const [orderType, setOrderType] = useState<"supplier" | "customer">(defaultType === "customer" ? "customer" : "supplier")
  const [number, setNumber] = useState<string>(() => `BC-${Math.floor(Math.random() * 10000)}`)
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0,10))
  const [counterpartyId, setCounterpartyId] = useState<string>("")
  const [lines, setLines] = useState<Array<{ id: string; code: string; designation: string; unit: string | null; quantity: number; unitPrice?: number }>>([])
  const [errors, setErrors] = useState<string>("")

  const addFreeformLine = () => {
    setLines((prev) => [...prev, { id: `ol-${Date.now()}`, code: "", designation: "", unit: null, quantity: 1, unitPrice: 0 }])
  }
  const addLineFromArticle = (articleId: string) => {
    const a = articles.find((x) => x.id === articleId)
    if (!a) return
    setLines((prev) => [...prev, { id: `ol-${Date.now()}`, code: a.code, designation: a.designation, unit: a.unit, quantity: 1, unitPrice: a.unitPricePuht }])
  }

  const save = () => {
    setErrors("")
    if (selectedOrgId === "all") {
      setErrors("Sélectionnez d'abord une PME émettrice via le sélecteur global.")
      return
    }
    if (!counterpartyId) {
      setErrors("Sélectionnez une contrepartie.")
      return
    }
    if (lines.length < 1) {
      setErrors("Ajoutez au moins une ligne.")
      return
    }
    const o: OrderEntity = {
      id: `ord-${Date.now()}`,
      number,
      date,
      organizationId: selectedOrgId,
      counterpartyId,
      type: orderType,
      lines,
      status: "draft",
    }
    addOrder(o)
    navigate(`/dashboard/orders/${o.id}`)
  }

  const list = orderType === "supplier" ? suppliers : customers

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer Bon de Commande {number ? `— ${number}` : ""}</CardTitle>
          <CardDescription>Choisir type et contrepartie</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors && <div className="text-red-600 text-sm">{errors}</div>}
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
              <Label>Type *</Label>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as "supplier" | "customer")}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">Fournisseur</SelectItem>
                  <SelectItem value="customer">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Contrepartie *</Label>
              <Select value={counterpartyId} onValueChange={(v) => setCounterpartyId(v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder={orderType === 'supplier' ? 'Fournisseur' : 'Client'} /></SelectTrigger>
                <SelectContent>
                  {list.map((c) => (<SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>))}
                </SelectContent>
              </Select>
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
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Select onValueChange={(v) => addLineFromArticle(v)}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Ajouter depuis article" /></SelectTrigger>
                <SelectContent>
                  {articles.map((a) => (<SelectItem key={a.id} value={a.id}>{a.code} — {a.designation}</SelectItem>))}
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
                    <th className="p-2">PUHT</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((ln, idx) => (
                    <tr key={ln.id} className="border-t">
                      <td className="p-2"><Input value={ln.code} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, code: e.target.value } : x))} /></td>
                      <td className="p-2"><Input value={ln.designation} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, designation: e.target.value } : x))} /></td>
                      <td className="p-2 w-24"><Input type="number" value={ln.quantity} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, quantity: Number(e.target.value || 0) } : x))} /></td>
                      <td className="p-2"><Input value={ln.unit ?? ""} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, unit: e.target.value } : x))} /></td>
                      <td className="p-2 w-32"><Input type="number" value={ln.unitPrice ?? 0} onChange={(e) => setLines((prev) => prev.map((x, i) => i === idx ? { ...x, unitPrice: Number(e.target.value || 0) } : x))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={save}>Enregistrer</Button>
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/invoices")}>Annuler</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}