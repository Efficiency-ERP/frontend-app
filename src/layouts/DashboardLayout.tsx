import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Outlet, useLocation, Link } from "react-router-dom"
import { useNavigation } from "@/context/NavigationContext"
import { TeamSwitcher } from "@/components/team-switcher"
import { useContactsStore } from "@/pages/dashboard/contacts/store-context"
import { useInvoicesStore } from "@/pages/dashboard/invoices/store-context"

export default function Page() {
  const location = useLocation()
  const { getBreadcrumbsForPath } = useNavigation()
  const baseCrumbs = getBreadcrumbsForPath(location.pathname)
  const { contacts } = useContactsStore()
  const { invoices } = useInvoicesStore()

  let breadcrumbs = baseCrumbs
  const segments = location.pathname.split('/').filter(Boolean)
  if (segments[0] === 'dashboard' && segments[1] === 'contacts') {
    // Build Contacts-specific breadcrumbs
    const contactsCrumbs = [
      { label: 'Dashboard', href: '/dashboard', isLast: false },
      { label: 'Contact', href: '/dashboard/contacts', isLast: segments.length === 2 },
    ]
    if (segments.length === 3 && segments[2] !== 'add') {
      const id = segments[2]
      const found = contacts.find((c) => c.id === id)
      contactsCrumbs.push({ label: found?.companyName ?? 'Contact', href: `/dashboard/contacts/${id}`, isLast: true })
      breadcrumbs = contactsCrumbs
    } else if (segments.length === 3 && segments[2] === 'add') {
      contactsCrumbs.push({ label: 'Add Contact', href: '/dashboard/contacts/add', isLast: true })
      breadcrumbs = contactsCrumbs
    } else if (segments.length === 4 && segments[3] === 'edit') {
      const id = segments[2]
      const found = contacts.find((c) => c.id === id)
      contactsCrumbs.push({ label: found?.companyName ?? 'Contact', href: `/dashboard/contacts/${id}` , isLast: false })
      contactsCrumbs.push({ label: 'Edit Contact', href: `/dashboard/contacts/${id}/edit`, isLast: true })
      breadcrumbs = contactsCrumbs
    }
  }

  // Articles-specific breadcrumbs
  if (segments[0] === 'dashboard' && segments[1] === 'articles') {
    const articlesCrumbs = [
      { label: 'Dashboard', href: '/dashboard', isLast: false },
      { label: 'Articles', href: '/dashboard/articles', isLast: segments.length === 2 },
    ]
    if (segments.length === 3 && segments[2] !== 'add') {
      const id = segments[2]
      articlesCrumbs.push({ label: id, href: `/dashboard/articles/${id}`, isLast: true })
      breadcrumbs = articlesCrumbs
    } else if (segments.length === 3 && segments[2] === 'add') {
      articlesCrumbs.push({ label: 'Add Article', href: '/dashboard/articles/add', isLast: true })
      breadcrumbs = articlesCrumbs
    } else if (segments.length === 4 && segments[3] === 'edit') {
      const id = segments[2]
      articlesCrumbs.push({ label: id, href: `/dashboard/articles/${id}`, isLast: false })
      articlesCrumbs.push({ label: 'Edit Article', href: `/dashboard/articles/${id}/edit`, isLast: true })
      breadcrumbs = articlesCrumbs
    }
  }

  // Invoices-specific breadcrumbs
  if (segments[0] === 'dashboard' && segments[1] === 'invoices') {
    const invCrumbs = [
      { label: 'Dashboard', href: '/dashboard', isLast: false },
      { label: 'Invoices', href: '/dashboard/invoices', isLast: segments.length === 2 },
    ]
    if (segments.length === 3 && segments[2] === 'create') {
      invCrumbs.push({ label: 'Create', href: '/dashboard/invoices/create', isLast: true })
      breadcrumbs = invCrumbs
    } else if (segments.length === 4 && segments[2] === 'create') {
      const type = segments[3]
      invCrumbs.push({ label: 'Create', href: '/dashboard/invoices/create', isLast: false })
      invCrumbs.push({ label: type, href: `/dashboard/invoices/create/${type}`, isLast: true })
      breadcrumbs = invCrumbs
    } else if (segments.length === 3) {
      const id = segments[2]
      const found = invoices.find((i) => i.id === id)
      const label = found?.number ?? id
      invCrumbs.push({ label, href: `/dashboard/invoices/${id}`, isLast: true })
      breadcrumbs = invCrumbs
    } else if (segments.length === 4 && segments[3] === 'edit') {
      const id = segments[2]
      const found = invoices.find((i) => i.id === id)
      const label = found?.number ?? id
      invCrumbs.push({ label, href: `/dashboard/invoices/${id}`, isLast: false })
      invCrumbs.push({ label: 'Edit', href: `/dashboard/invoices/${id}/edit`, isLast: true })
      breadcrumbs = invCrumbs
    }
  }
  
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="mr-2">
              <TeamSwitcher />
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    {index > 0 && (
                      <BreadcrumbSeparator className="hidden sm:block" />
                    )}
                    <BreadcrumbItem className={index === 0 ? "hidden sm:block" : ""}>
                       {crumb.isLast ? (
                         <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                       ) : (
                         <BreadcrumbLink asChild>
                           <Link to={crumb.href}>
                             {crumb.label}
                           </Link>
                         </BreadcrumbLink>
                       )}
                     </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
