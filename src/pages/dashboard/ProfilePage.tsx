import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/context/user-context"

export default function ProfilePage() {
  const { user, tenant } = useUser()
  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>User information independent from tenant selection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold flex items-center gap-2">
                {user.name}
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
              </div>
              <div className="text-muted-foreground">{user.email}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tenant</CardTitle>
          <CardDescription>Group one layer above users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Tenant Name</div>
              <div>{tenant.name}</div>
            </div>
            <div>
              <div className="font-medium">Tenant ID</div>
              <div>{tenant.id}</div>
            </div>
            <div>
              <div className="font-medium">Membership</div>
              <div>Role: {user.role}</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-xs text-muted-foreground">Profile is global and does not depend on PME selection.</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Theme and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Theme</div>
              <div>Use the toggle in the header</div>
            </div>
            <div>
              <div className="font-medium">Notifications</div>
              <div>Coming soon</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}