import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/context/user-context'

export default function SettingsPage() {
  const { user, tenant, updateUser, updateTenant } = useUser()
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '')
  const [tenantName, setTenantName] = useState(tenant.name)

  const saveProfile = () => {
    updateUser({ name: name.trim(), email: email.trim(), avatarUrl: avatarUrl.trim() || undefined })
  }

  const saveTenant = () => {
    updateTenant({ name: tenantName.trim() })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={saveProfile}>Save Profile</Button>
            <Button type="button" variant="outline" onClick={() => { setName(user.name); setEmail(user.email); setAvatarUrl(user.avatarUrl ?? '') }}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Settings</CardTitle>
          <CardDescription>Manage your tenant (group above users)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenantName">Tenant Name</Label>
              <Input id="tenantName" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
            </div>
            <div>
              <Label>Tenant ID</Label>
              <Input value={tenant.id} readOnly />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={saveTenant}>Save Tenant</Button>
            <Button type="button" variant="outline" onClick={() => setTenantName(tenant.name)}>Reset</Button>
          </div>
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground">Profile and Tenant settings are global and do not depend on PME selection.</div>
        </CardContent>
      </Card>
    </div>
  )
}