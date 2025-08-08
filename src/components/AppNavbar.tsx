import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Building2, Plus, Settings, User, LogOut } from "lucide-react"
import { useState } from "react"

import { SidebarTrigger } from "./ui/sidebar"

function AppNavbar() {
  const [selectedPME, setSelectedPME] = useState("all")
  const PMEs = [
              { id: 'pme1', name: 'PME 1' },
              { id: 'pme2', name: 'PME 2' }
            ]
  
  const notifications = [
    {
      id: 1,
      title: "New invoice created",
      message: "Invoice #INV-001 has been generated for PME 1",
      time: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "Payment received",
      message: "Payment of €1,250 received from Client ABC",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      title: "Invoice overdue",
      message: "Invoice #INV-045 is now 5 days overdue",
      time: "3 hours ago",
      read: true
    }
  ]
  
  const unreadCount = notifications.filter(notif => !notif.read).length

  const handleAddPME = () => {
    console.log("Add PME function triggered")
    // TODO: Implement add PME functionality
  }

  const handlePMEChange = (value: string) => {
    if (value === "add") {
      handleAddPME()
    } else {
      setSelectedPME(value)
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-background border-b border-border">

      <SidebarTrigger />
      {/* Left side - PME Selector */}
      <div className="flex items-center gap-4">
        <Select value={selectedPME} onValueChange={handlePMEChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select PME" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                All PMEs
              </div>
            </SelectItem>
            <SelectItem value="add">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add PME
              </div>
            </SelectItem>
            {PMEs.map(pme => (
              <SelectItem key={pme.id} value={pme.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {pme.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Center - Logo/Brand (optional) */}
      <div className="flex-1 flex justify-center">
        <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
      </div>

      {/* Right side - Notifications and Avatar */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Notifications</p>
                <p className="text-xs leading-none text-muted-foreground">
                  You have {unreadCount} unread notifications
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 space-y-1">
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              <span className="w-full text-sm">View all notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default AppNavbar