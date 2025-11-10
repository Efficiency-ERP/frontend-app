import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useArticlesStore } from "./store-context"

export default function ArticleSummaryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { articles, invoices } = useArticlesStore()

  const article = useMemo(() => articles.find((a) => a.id === id), [articles, id])
  const articleLines = useMemo(() => invoices.filter((l) => l.articleId === id), [invoices, id])

  const totalUsage = articleLines.length
  const lastInvoiceDate = articleLines.length
    ? new Date(Math.max(...articleLines.map((l) => new Date(l.date).getTime())))
    : null

  const [qty, setQty] = useState<number>(1)

  if (!article) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Article introuvable</CardTitle>
            <CardDescription>L'article demandé n'existe pas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/dashboard/articles")}>Retour aux articles</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stockStatus = article.type === "product" && article.stock.onHand < article.stock.minStock ? "Below Min" : "OK"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>{article.code} — {article.designation}</CardTitle>
              <Badge variant="secondary" className="capitalize">{article.type}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/dashboard/articles/${article.id}/edit`)}>Edit</Button>
            </div>
          </div>
          <CardDescription>Détails article, stock et consignation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Détails</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Unité</div><div>{article.unit ?? "—"}</div>
                <div>PUHT</div><div>{article.unitPricePuht.toFixed(2)} TND</div>
                <div>Prix transfert</div><div>{article.transferPrice.toFixed(2)} TND</div>
                <div>TVA</div><div>{article.vatRate}%</div>
                <div>DC</div><div>{article.dcRate}%</div>
              </div>
            </div>

            {article.type === "product" && (
              <div className="space-y-2">
                <h4 className="font-semibold">Stock</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>En stock</div><div>{article.stock.onHand}</div>
                  <div>Stock min.</div><div>{article.stock.minStock}</div>
                  <div>Statut</div><div>{stockStatus}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {article.type === "product" && article.consignment.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Consignation</CardTitle>
            <CardDescription>Configurée par type d'emballage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm">Quantité (article)</span>
              <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value || 0))} className="w-32" />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Emballage</TableHead>
                  <TableHead>Unités / Article</TableHead>
                  <TableHead>Qté consignation</TableHead>
                  <TableHead>Dépôt unitaire</TableHead>
                  <TableHead>Total dépôt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {article.consignment.packaging.map((p) => {
                  const qtyPackages = qty * p.unitsPerArticle
                  const depositTotal = qtyPackages * p.depositValue
                  return (
                    <TableRow key={`${article.id}-${p.type}`}>
                      <TableCell>{p.type}</TableCell>
                      <TableCell>{p.unitsPerArticle}</TableCell>
                      <TableCell>{qtyPackages}</TableCell>
                      <TableCell>{p.depositValue.toFixed(2)} TND</TableCell>
                      <TableCell>{depositTotal.toFixed(2)} TND</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Utilisation</CardTitle>
          <CardDescription>Basé sur des lignes factures simulées</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>Total utilisé</div><div>{totalUsage}</div>
            <div>Dernière facture</div><div>{lastInvoiceDate ? lastInvoiceDate.toLocaleDateString() : "—"}</div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facture</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Base prix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articleLines.slice(0, 10).map((l) => (
                <TableRow key={`${l.invoiceId}-${l.articleId}`}>
                  <TableCell>{l.invoiceNumber}</TableCell>
                  <TableCell>{new Date(l.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{l.type}</TableCell>
                  <TableCell>{l.quantity}</TableCell>
                  <TableCell>{l.priceBasis === "PUHT" ? "PUHT" : "Transfert"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}