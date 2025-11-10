import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInvoicesStore } from "./store-context"
import { formatTND } from "@/lib/utils"

export default function InvoiceDetailPage() {
  const { id: routeId, invoiceId } = useParams()
  const id = routeId || invoiceId || "unknown"
  const navigate = useNavigate()
  const { invoices } = useInvoicesStore()
  const inv = useMemo(() => invoices.find((i) => i.id === id), [invoices, id])

  const handleDownloadPDF = () => {
    // Use browser print to export PDF with print stylesheet matching template layout
    window.print()
  }

  if (!inv) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Facture introuvable</CardTitle>
            <CardDescription>Le document demandé n'existe pas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/dashboard/invoices")}>Retour aux factures</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{inv.number} — {new Date(inv.date).toLocaleDateString()}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/dashboard/invoices/${inv.id}/edit`)}>Edit</Button>
          <Button onClick={handleDownloadPDF}>Download PDF</Button>
        </div>
      </div>

      {/* Paper-like layout blocks */}
      <Card>
        <CardHeader>
          <CardTitle>En-tête</CardTitle>
          <CardDescription>Émetteur, Client, Références</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Émetteur (PME)</div>
              <div>{inv.organizationId}</div>
            </div>
            <div>
              <div className="font-medium">Client/Contrepartie</div>
              <div>{inv.counterpartyId}</div>
            </div>
            <div>
              <div className="font-medium">Références</div>
              <div>Commande: {inv.references?.orderId ?? "—"} · BL: {inv.references?.deliveryId ?? "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lignes</CardTitle>
          <CardDescription>Colonnes selon type de facture</CardDescription>
        </CardHeader>
        <CardContent>
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
                {inv.lines.map((ln) => (
                  <tr key={ln.id} className="border-t">
                    <td className="p-2">{ln.code}</td>
                    <td className="p-2">{ln.designation}</td>
                    <td className="p-2 text-center">{ln.quantity}</td>
                    <td className="p-2">{ln.unit ?? ""}</td>
                    <>
                        <td className="p-2">{formatTND(ln.unitPricePuht)}</td>
                      <td className="p-2">{ln.vatRate}%</td>
                      <td className="p-2">{ln.dcRate}%</td>
                      <td className="p-2 text-right">{/* MTTC row total omitted here; sum in totals */}</td>
                    </>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Consignment block */}
      <Card>
        <CardHeader>
          <CardTitle>Consignation</CardTitle>
          <CardDescription>Bloc distinct, hors HT/TVA/DC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left">Emballage</th>
                  <th className="p-2">Unités/Article</th>
                  <th className="p-2">Quantité</th>
                  <th className="p-2">Dépôt unitaire</th>
                  <th className="p-2">Total dépôt</th>
                </tr>
              </thead>
              <tbody>
                {inv.consignments.map((c) => (
                  <tr key={`${inv.id}-${c.sourceLineId}-${c.packagingType}`} className="border-t">
                    <td className="p-2">{c.packagingType}</td>
                    <td className="p-2 text-center">{c.unitsPerArticle}</td>
                    <td className="p-2 text-center">{c.quantity}</td>
                    <td className="p-2">{formatTND(c.depositValue)}</td>
                    <td className="p-2">{formatTND(c.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Totals block */}
      <Card>
        <CardHeader>
          <CardTitle>Totals</CardTitle>
          <CardDescription>HT/TVA/DC/TTC ou transfert</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>HT</div><div className="text-right">{inv.totals.htSubtotal !== undefined ? formatTND(inv.totals.htSubtotal) : "—"}</div>
              <div>TVA</div><div className="text-right">{formatTND(Object.values(inv.totals.vatByRate || {}).reduce((a,b)=>a+b,0))}</div>
              <div>DC</div><div className="text-right">{formatTND(Object.values(inv.totals.dcByRate || {}).reduce((a,b)=>a+b,0))}</div>
              <div>TTC</div><div className="text-right">{inv.totals.ttc !== undefined ? formatTND(inv.totals.ttc) : "—"}</div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}