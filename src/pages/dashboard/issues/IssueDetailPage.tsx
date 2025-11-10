import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useInvoicesStore } from "@/pages/dashboard/invoices/store-context"

export default function IssueDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { issues } = useInvoicesStore()
  const iss = useMemo(() => issues.find((i) => i.id === id), [issues, id])

  if (!iss) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bon de Sortie introuvable</CardTitle>
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
        <h2 className="text-xl font-semibold">{iss.number} — {new Date(iss.date).toLocaleDateString()}</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails BS</CardTitle>
          <CardDescription>Émetteur, Client, Lignes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Émetteur (PME)</div>
              <div>{iss.organizationId}</div>
            </div>
            <div>
              <div className="font-medium">Client</div>
              <div>{iss.counterpartyId}</div>
            </div>
            <div>
              <div className="font-medium">Références</div>
              <div>Commande: {iss.reference?.orderId ?? "—"}</div>
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
                </tr>
              </thead>
              <tbody>
                {iss.lines.map((ln) => (
                  <tr key={ln.id} className="border-t">
                    <td className="p-2">{ln.code}</td>
                    <td className="p-2">{ln.designation}</td>
                    <td className="p-2 text-center">{ln.quantity}</td>
                    <td className="p-2">{ln.unit ?? ""}</td>
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