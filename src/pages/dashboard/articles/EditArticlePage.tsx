import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useArticlesStore } from "./store-context"
import { usePMESelection } from "@/context/pme-context"
import type { ArticleEntity, ArticleType, ConsignmentPackaging, PackagingType } from "./types"

export default function EditArticlePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { articles, updateArticle } = useArticlesStore()
  const { selectedOrgId, selectedOrgName } = usePMESelection()
  const article = articles.find((a) => a.id === id)

  const [type, setType] = useState<ArticleType | undefined>(undefined)
  const [code, setCode] = useState("")
  const [designation, setDesignation] = useState("")

  const [unit, setUnit] = useState("")
  const [onHand, setOnHand] = useState<number>(0)
  const [minStock, setMinStock] = useState<number>(0)

  const [unitPricePuht, setPuht] = useState<number>(0)
  const [transferPrice, setTransfer] = useState<number>(0)
  const [vatRate, setVat] = useState<number>(19)
  const [dcRate, setDc] = useState<number>(1)

  const [consEnabled, setConsEnabled] = useState<boolean>(false)
  const [packaging, setPackaging] = useState<ConsignmentPackaging[]>([])
  const [errors, setErrors] = useState<string>("")

  useEffect(() => {
    if (!article) return
    setType(article.type)
    setCode(article.code)
    setDesignation(article.designation)
    setUnit(article.unit ?? "")
    setOnHand(article.stock.onHand)
    setMinStock(article.stock.minStock)
    setPuht(article.unitPricePuht)
    setTransfer(article.transferPrice)
    setVat(article.vatRate)
    setDc(article.dcRate)
    setConsEnabled(article.consignment.enabled)
    setPackaging(article.consignment.packaging)
  }, [article])

  const updatePackagingRow = (idx: number, patch: Partial<ConsignmentPackaging>) => {
    setPackaging((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }
  const addPackagingRow = () => {
    setPackaging((rows) => [...rows, { type: "BOUTEILLE", unitsPerArticle: 0, depositValue: 0 }])
  }
  const removePackagingRow = (idx: number) => {
    setPackaging((rows) => rows.filter((_, i) => i !== idx))
  }

  const save = () => {
    setErrors("")
    if (!id) {
      setErrors("Identifiant article manquant.")
      return
    }
    if (!article) {
      setErrors("Article introuvable.")
      return
    }
    if (!type || !code.trim() || !designation.trim()) {
      setErrors("Veuillez remplir les champs requis (type, code, désignation).")
      return
    }
    if (type === "product" && !unit.trim()) {
      setErrors("Veuillez renseigner l'unité pour le produit.")
      return
    }
    if (consEnabled && packaging.length < 1) {
      setErrors("La consignation est activée: au moins une ligne d'emballage est requise.")
      return
    }
    const allowed = ["BOUTEILLE", "PALETTE", "CASIER"]
    if (consEnabled) {
      for (const p of packaging) {
        const t = (p.type || "").toString().toUpperCase()
        if (!allowed.includes(t)) {
          setErrors("Type d'emballage invalide. Utilisez BOUTEILLE, PALETTE, ou CASIER.")
          return
        }
      }
    }

    const patch: Partial<ArticleEntity> = {
      type,
      code: code.trim(),
      designation: designation.trim(),
      organizationId: selectedOrgId === 'all' ? (article.organizationId ?? null) : selectedOrgId,
      unit: type === "product" ? unit.trim() : null,
      unitPricePuht: Number(unitPricePuht),
      transferPrice: Number(transferPrice || 0),
      vatRate: Number(vatRate || 0),
      dcRate: Number(dcRate || 0),
      stock: {
        onHand: type === "product" ? Number(onHand || 0) : 0,
        minStock: type === "product" ? Number(minStock || 0) : 0,
      },
      consignment: {
        enabled: type === "product" ? consEnabled : false,
        packaging: type === "product" ? packaging.map((p) => ({
          type: (p.type || "").toString().toUpperCase() as PackagingType,
          unitsPerArticle: Number(p.unitsPerArticle || 0),
          depositValue: Number(p.depositValue || 0),
        })) : [],
      },
    }

    updateArticle(id, patch)
    navigate(`/dashboard/articles/${id}`)
  }

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'article</CardTitle>
          <CardDescription>Produits et services — données locales uniquement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors && <div className="text-red-600 text-sm">{errors}</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Type *</Label>
              <Select onValueChange={(v: string) => setType(v as ArticleType)}>
                <SelectTrigger className="w-full"><SelectValue placeholder={type} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Produit</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Code *</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div>
              <Label>Désignation *</Label>
              <Input value={designation} onChange={(e) => setDesignation(e.target.value)} />
            </div>
          </div>

          {selectedOrgName && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>PME sélectionnée</Label>
                <div className="text-sm mt-2">{selectedOrgName}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>PUHT *</Label>
              <Input type="number" value={unitPricePuht} onChange={(e) => setPuht(Number(e.target.value))} />
            </div>
            <div>
              <Label>Prix transfert</Label>
              <Input type="number" value={transferPrice} onChange={(e) => setTransfer(Number(e.target.value))} />
            </div>
            <div>
              <Label>TVA %</Label>
              <Input type="number" value={vatRate} onChange={(e) => setVat(Number(e.target.value))} />
            </div>
            <div>
              <Label>DC %</Label>
              <Input type="number" value={dcRate} onChange={(e) => setDc(Number(e.target.value))} />
            </div>
          </div>

          {type === "product" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Unité *</Label>
                  <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
                </div>
                <div>
                  <Label>Stock (Qté) ≥ 0</Label>
                  <Input type="number" value={onHand} onChange={(e) => setOnHand(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Stock minimal ≥ 0</Label>
                  <Input type="number" value={minStock} onChange={(e) => setMinStock(Number(e.target.value))} />
                </div>
              </div>
              {onHand < minStock && (
                <div className="text-yellow-600 text-sm">Alerte: le stock actuel est inférieur au stock minimal.</div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input id="cons-toggle" type="checkbox" checked={consEnabled} onChange={(e) => setConsEnabled(e.target.checked)} />
                  <Label htmlFor="cons-toggle">Activer la consignation</Label>
                </div>
                {consEnabled && (
                  <div className="space-y-3">
                    {packaging.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div>
                          <Label>Type d'emballage (texte)</Label>
                          <Input value={row.type} onChange={(e) => updatePackagingRow(idx, { type: e.target.value as PackagingType })} />
                        </div>
                        <div>
                          <Label>Unités par article ≥ 0</Label>
                          <Input type="number" value={row.unitsPerArticle} onChange={(e) => updatePackagingRow(idx, { unitsPerArticle: Number(e.target.value) })} />
                        </div>
                        <div>
                          <Label>Valeur dépôt ≥ 0</Label>
                          <Input type="number" value={row.depositValue} onChange={(e) => updatePackagingRow(idx, { depositValue: Number(e.target.value) })} />
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="destructive" onClick={() => removePackagingRow(idx)}>Supprimer</Button>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addPackagingRow}>Ajouter une ligne d'emballage</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="button" onClick={save}>Enregistrer</Button>
            <Button type="button" variant="outline" onClick={() => navigate(`/dashboard/articles/${id}`)}>Annuler</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}