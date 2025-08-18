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

export default function Page() {
  const location = useLocation()
  
  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    // Always start with Dashboard
    breadcrumbs.push({
      label: 'Dashboard',
      href: '/dashboard',
      isLast: pathSegments.length === 1
    })
    
    // Add additional segments based on path
    if (pathSegments.length > 1) {
      const currentPage = pathSegments[1]
      
      switch (currentPage) {
        case 'invoices':
          breadcrumbs.push({
            label: 'Invoices',
            href: '/dashboard/invoices',
            isLast: true
          })
          break
        case 'clients':
          breadcrumbs.push({
            label: 'Invoices',
            href: '/dashboard/invoices',
            isLast: false
          })
          breadcrumbs.push({
            label: 'Clients',
            href: '/dashboard/clients',
            isLast: true
          })
          break
        case 'articles':
           breadcrumbs.push({
             label: 'Invoices',
             href: '/dashboard/invoices',
             isLast: false
           })
           breadcrumbs.push({
             label: 'Articles',
             href: '/dashboard/articles',
             isLast: true
           })
           break
        case 'cashflow':
          breadcrumbs.push({
            label: 'Cashflow',
            href: '/dashboard/cashflow',
            isLast: true
          })
          break
        default:
          break
      }
    }
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
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
