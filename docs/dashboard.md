# Dashboard Overview

This document summarizes the dashboard pages and the layout structure used in the app.

## Routes

The dashboard is routed under `/dashboard` with the following child routes:

- `/dashboard` — `DashboardHome` component (`src/pages/dashboard/DashboardHome.tsx`)
- `/dashboard/invoices` — placeholder page `<h1>INVOICE</h1>`
- `/dashboard/clients` — placeholder page `<h1>CLIENTS</h1>`
- `/dashboard/articles` — placeholder page `<h1>ARTICLES</h1>`
- `/dashboard/pme` — placeholder page `<h1>PME</h1>`
- `/dashboard/pme/add` — `AddPMEPage` (new)
- `/dashboard/settings` — `SettingsPage`
- `/dashboard/*` — redirects to `/dashboard`

Source: `src/routes/routing.tsx`.

## Navigation

The sidebar navigation is driven by `NavigationContext`:

- Dashboard (`/dashboard`)
- Invoices (`/dashboard/invoices`)
  - All Invoices (`/dashboard/invoices`)
- Clients (`/dashboard/clients`)
- Articles (`/dashboard/articles`)
- Settings (`/dashboard/settings`)

PME is not listed in the sidebar. Access “Add PME” via the TeamSwitcher in the header.

Source: `src/context/NavigationContext.tsx`.

## Breadcrumbs

Breadcrumbs are generated from the current path via `getBreadcrumbsForPath`:

- Root: Dashboard.
- Invoices: Dashboard › Invoices.
- Invoice: Dashboard › Invoices > # Invoice Id.
- Clients: Dashboard › Clients.
- Articles: Dashboard › Articles.
- Settings: Dashboard › Settings.

Source: `src/context/NavigationContext.tsx`.

## Layout Structure

`DashboardLayout` (`src/layouts/DashboardLayout.tsx`) composes the dashboard page:

- Wrapper: `SidebarProvider`.
- Sidebar: `<AppSidebar variant="inset" />` with:
  - Header: App logo (replaces TeamSwitcher).
  - Content: `NavMain` bound to `navigationItems`.
  - Footer: `NavUser`. Sidebar is collapsible in icon mode.
- Header (top bar):
  - `SidebarTrigger` to toggle the sidebar.
  - Vertical `Separator`.
  - `TeamSwitcher` appears before the breadcrumb.
  - `Breadcrumb` built from `getBreadcrumbsForPath(location.pathname)` and rendered via `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`/`BreadcrumbPage`, and `BreadcrumbSeparator`.
  - TeamSwitcher “Add PME” action navigates to `/dashboard/pme/add`.
  - `ThemeToggle` button toggling `document.documentElement` class between `light` and `dark`.
- Main content:
  - `<Outlet />` renders the matched child route component.

## Files

- `src/layouts/DashboardLayout.tsx` — Defines the layout structure.
- `src/components/app-sidebar.tsx` — Sidebar composition (team switcher, navigation, user).
- `src/components/nav-main.tsx` — Renders navigation tree and sub-items with active state.
- `src/context/NavigationContext.tsx` — Navigation items and breadcrumb generation.
- `src/pages/dashboard/DashboardHome.tsx` — Dashboard index page.
- `src/routes/routing.tsx` — Route configuration (includes `/dashboard/settings`).
- `src/components/theme-toggle.tsx` — Theme switching logic.