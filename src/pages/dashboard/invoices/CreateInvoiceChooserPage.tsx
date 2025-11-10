import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, MinusCircle, PlusCircle, ClipboardList, Truck, PackageOpen } from "lucide-react"

export default function CreateInvoiceChooserPage() {
  const navigate = useNavigate()
  const go = (type: string) => navigate(`/dashboard/invoices/create/${type}`)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un document</CardTitle>
          <CardDescription>Choisissez le type de facture ou document lié</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button variant="default" onClick={() => go("standard")}>
            <FileText className="mr-2 h-4 w-4" /> Standard Invoice
          </Button>
          {/* INTERCO is treated as a regular invoice with specific counterparty */}
          <Button variant="destructive" onClick={() => go("credit")}>
            <MinusCircle className="mr-2 h-4 w-4" /> Credit (Avoir)
          </Button>
          <Button variant="secondary" onClick={() => go("debit")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Debit (Doit)
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/orders/create?type=supplier")}>
            <ClipboardList className="mr-2 h-4 w-4" /> Supplier Order (Bon de Commande)
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/deliveries/create")}>
            <Truck className="mr-2 h-4 w-4" /> Customer Delivery (Bon de Livraison)
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/issues/create")}>
            <PackageOpen className="mr-2 h-4 w-4" /> Warehouse Issue (Bon de Sortie)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}