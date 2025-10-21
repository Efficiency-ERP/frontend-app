import React, { createContext, useContext, ReactNode } from 'react'
import { Home, FileText, Users, Newspaper, DollarSign } from 'lucide-react'

export interface NavigationItem {
  title: string
  url: string
  icon?: React.ComponentType<any>
  items?: NavigationItem[]
}

export interface NavigationContextType {
  navigationItems: NavigationItem[]
  getNavigationByPath: (path: string) => NavigationItem | null
  getBreadcrumbsForPath: (path: string) => Array<{ label: string; href: string; isLast: boolean }>
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: FileText,
    items: [
      {
        title: "All Invoices",
        url: "/dashboard/invoices",
        icon: FileText,
      },
      {
        title: "Clients",
        url: "/dashboard/clients",
        icon: Users,
      },
      {
        title: "Articles",
        url: "/dashboard/articles",
        icon: Newspaper,
      },
    ],
  },
  {
    title: "Cashflow",
    url: "/dashboard/cashflow",
    icon: DollarSign,
  },
]

function findNavigationItem(items: NavigationItem[], path: string): NavigationItem | null {
  for (const item of items) {
    if (item.url === path) {
      return item
    }
    if (item.items) {
      const found = findNavigationItem(item.items, path)
      if (found) return found
    }
  }
  return null
}

function generateBreadcrumbs(path: string): Array<{ label: string; href: string; isLast: boolean }> {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard", isLast: false }
  ]

  if (path === "/dashboard") {
    breadcrumbs[0].isLast = true
    return breadcrumbs
  }

  const pathSegments = path.split('/').filter(Boolean)
  
  if (pathSegments.includes('invoices')) {
    breadcrumbs.push({ label: "Invoices", href: "/dashboard/invoices", isLast: false })
  }
  
  if (pathSegments.includes('clients')) {
    if (!pathSegments.includes('invoices')) {
      breadcrumbs.push({ label: "Invoices", href: "/dashboard/invoices", isLast: false })
    }
    breadcrumbs.push({ label: "Clients", href: "/dashboard/clients", isLast: true })
  } else if (pathSegments.includes('articles')) {
    if (!pathSegments.includes('invoices')) {
      breadcrumbs.push({ label: "Invoices", href: "/dashboard/invoices", isLast: false })
    }
    breadcrumbs.push({ label: "Articles", href: "/dashboard/articles", isLast: true })
  } else if (pathSegments.includes('cashflow')) {
    breadcrumbs.push({ label: "Cashflow", href: "/dashboard/cashflow", isLast: true })
  } else if (pathSegments.includes('invoices') && pathSegments.length === 2) {
    breadcrumbs[breadcrumbs.length - 1].isLast = true
  }

  return breadcrumbs
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const getNavigationByPath = (path: string): NavigationItem | null => {
    return findNavigationItem(navigationItems, path)
  }

  const getBreadcrumbsForPath = (path: string) => {
    return generateBreadcrumbs(path)
  }

  const value: NavigationContextType = {
    navigationItems,
    getNavigationByPath,
    getBreadcrumbsForPath,
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}