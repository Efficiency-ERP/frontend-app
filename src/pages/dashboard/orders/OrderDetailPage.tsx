import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInvoicesStore } from "@/pages/dashboard/invoices/store-context"

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders } = useInvoicesStore()
  const ord = useMemo(() => orders.find((o) => o.id === id), [orders, id])

  if (!ord) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bon de Commande introuvable</CardTitle>
            <CardDescription>Le document demandé n'existe pas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/dashboard/invoices")}>Retour</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{ord.number} — {new Date(ord.date).toLocaleDateString()}</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails BC</CardTitle>
          <CardDescription>Émetteur, Contrepartie, Lignes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Émetteur (PME)</div>
              <div>{ord.organizationId}</div>
            </div>
            <div>
              <div className="font-medium">Contrepartie</div>
              <div>{ord.counterpartyId}</div>
            </div>
            <div>
              <div className="font-medium">Type</div>
              <div className="capitalize">{ord.type}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lignes</CardTitle>
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
                  <th className="p-2">PUHT</th>
                </tr>
              </thead>
              <tbody>
                {ord.lines.map((ln) => (
                  <tr key={ln.id} className="border-t">
                    <td className="p-2">{ln.code}</td>
                    <td className="p-2">{ln.designation}</td>
                    <td className="p-2 text-center">{ln.quantity}</td>
                    <td className="p-2">{ln.unit ?? ""}</td>
                    <td className="p-2">{(ln.unitPrice ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}