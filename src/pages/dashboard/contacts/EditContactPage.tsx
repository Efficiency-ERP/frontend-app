import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useContactsStore } from "./store-context"
import type { ContactEntity, PartyType } from "./types"

export default function EditContactPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { contacts, updateContact } = useContactsStore()
  const contact = contacts.find((c) => c.id === id)

  const [companyName, setCompanyName] = useState("")
  const [partyType, setPartyType] = useState<PartyType | undefined>(undefined)
  const [mf, setMf] = useState("")
  const [uniqueId, setUniqueId] = useState("")
  const [line1, setLine1] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("Tunisie")
  const [phone, setPhone] = useState("+216 ")
  const [fax, setFax] = useState("")
  const [conditionsDeVente, setConditions] = useState("")

  useEffect(() => {
    if (!contact) return
    setCompanyName(contact.companyName)
    setPartyType(contact.partyType)
    setMf(contact.mf ?? "")
    setUniqueId(contact.uniqueId ?? "")
    setLine1(contact.address.line1)
    setCity(contact.address.city)
    setZipCode(contact.address.zipCode)
    setCountry(contact.address.country)
    setPhone(contact.contact.phone ?? "+216 ")
    setFax(contact.contact.fax ?? "")
    setConditions(contact.conditionsDeVente ?? "")
  }, [contact])

  function validate(): string | null {
    if (!companyName.trim()) return "Nom de société est requis"
    if (!partyType) return "Type est requis"
    return null
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) return alert(err)
    const patch: Partial<ContactEntity> = {
      companyName: companyName.trim(),
      partyType,
      mf: mf.trim() || null,
      uniqueId: uniqueId.trim() || null,
      address: { line1, city, zipCode, country },
      contact: { phone: phone.trim() || null, fax: fax.trim() || null },
      conditionsDeVente: conditionsDeVente.trim() || null,
    }
    if (id) updateContact(id, patch)
    navigate("/dashboard/contacts")
  }

  if (!contact) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact introuvable</CardTitle>
            <CardDescription>Impossible d'éditer ce contact.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/dashboard/contacts")}>Retour</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier le contact</CardTitle>
          <CardDescription>Mettre à jour les informations</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={onSubmit}>
            <section className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Nom de société *</Label>
                <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="partyType">Type *</Label>
                <Select value={partyType ?? ""} onValueChange={(v: string) => setPartyType(v as PartyType)}>
                  <SelectTrigger id="partyType"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="mf">MF</Label>
                <Input id="mf" value={mf} onChange={(e) => setMf(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="uniqueId">Identifiant unique</Label>
                <Input id="uniqueId" value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} />
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="line1">Adresse</Label>
                <Input id="line1" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Ligne 1" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zipCode">Code postal</Label>
                <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Pays</Label>
                <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">Num Télé</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+216 .. .. .. .." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fax">Num Fax</Label>
                <Input id="fax" value={fax} onChange={(e) => setFax(e.target.value)} />
              </div>
            </section>

            <section className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="conditions">Conditions de vente</Label>
                <Input id="conditions" value={conditionsDeVente} onChange={(e) => setConditions(e.target.value)} />
              </div>
            </section>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate(`/dashboard/contacts/${id}`)}>Cancel</Button>
              <Button type="submit">Save & Close</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}