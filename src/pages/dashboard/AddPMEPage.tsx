import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContactsStore } from "@/pages/dashboard/contacts/store-context"
import type { OrganizationEntity, ContactEntity } from "@/pages/dashboard/contacts/types"

export default function AddPMEPage() {
  const navigate = useNavigate()
  const { addOrganization, addContact } = useContactsStore()

  const [name, setName] = useState("")
  const [mf, setMf] = useState("")
  const [uniqueId, setUniqueId] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("Tunisie")
  const [phone, setPhone] = useState("+216 ")
  const [fax, setFax] = useState("")
  const [conditionsDeVente, setConditions] = useState("")
  const [error, setError] = useState<string>("")

  const save = () => {
    setError("")
    if (!name.trim()) {
      setError("Veuillez renseigner le nom de la PME.")
      return
    }

    const orgId = `org-${Date.now()}`
    const newOrg: OrganizationEntity = { id: orgId, name: name.trim() }
    addOrganization(newOrg)

    const newContact: ContactEntity = {
      id: `c-${Date.now()}`,
      partyType: "both",
      isInternalOrg: true,
      internalOrganizationId: orgId,
      companyName: name.trim(),
      mf: mf.trim() || null,
      uniqueId: uniqueId.trim() || null,
      address: { line1: line1.trim(), city: city.trim(), zipCode: zipCode.trim(), country: country.trim() },
      contact: { phone: phone.trim() || null, fax: fax.trim() || null },
      conditionsDeVente: conditionsDeVente.trim() || null,
    }
    addContact(newContact)

    navigate("/dashboard/contacts")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une PME</CardTitle>
          <CardDescription>Crée une unité interne et un contact associé.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Nom PME *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>MF</Label>
              <Input value={mf} onChange={(e) => setMf(e.target.value)} />
            </div>
            <div>
              <Label>Identifiant unique</Label>
              <Input value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Adresse</Label>
              <Input value={line1} onChange={(e) => setLine1(e.target.value)} />
            </div>
            <div>
              <Label>Ville</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label>Code postal</Label>
              <Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
            <div>
              <Label>Pays</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Téléphone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label>Fax</Label>
              <Input value={fax} onChange={(e) => setFax(e.target.value)} />
            </div>
            <div>
              <Label>Conditions de vente</Label>
              <Input value={conditionsDeVente} onChange={(e) => setConditions(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" onClick={save}>Enregistrer et fermer</Button>
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard/contacts")}>Annuler</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}