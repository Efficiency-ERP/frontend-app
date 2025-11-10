import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import LoginPage from '@/pages/LoginPage';	
import DashboardLayout from '@/layouts/DashboardLayout';
import RootLayout from '@/layouts/RootLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import AddPMEPage from '@/pages/dashboard/AddPMEPage';
import AllInvoicesPage from '@/pages/dashboard/invoices/AllInvoicesPage';
import CreateInvoiceChooserPage from '@/pages/dashboard/invoices/CreateInvoiceChooserPage';
import CreateInvoiceFormPage from '@/pages/dashboard/invoices/CreateInvoiceFormPage';
import InvoiceDetailPage from '@/pages/dashboard/invoices/InvoiceDetailPage';
import InvoicesProvider from '@/pages/dashboard/invoices/store';
import CreateDeliveryPage from '@/pages/dashboard/deliveries/CreateDeliveryPage';
import DeliveryDetailPage from '@/pages/dashboard/deliveries/DeliveryDetailPage';
import CreateOrderPage from '@/pages/dashboard/orders/CreateOrderPage';
import OrderDetailPage from '@/pages/dashboard/orders/OrderDetailPage';
import CreateIssuePage from '@/pages/dashboard/issues/CreateIssuePage';
import IssueDetailPage from '@/pages/dashboard/issues/IssueDetailPage';
import ContactsProvider from '@/pages/dashboard/contacts/store';
import ListContactsPage from '@/pages/dashboard/contacts/ListContactsPage';
import AddContactPage from '@/pages/dashboard/contacts/AddContactPage';
import ContactSummaryPage from '@/pages/dashboard/contacts/ContactSummaryPage';
import EditContactPage from '@/pages/dashboard/contacts/EditContactPage';
import ArticlesProvider from '@/pages/dashboard/articles/store';
import ListArticlesPage from '@/pages/dashboard/articles/ListArticlesPage';
import AddArticlePage from '@/pages/dashboard/articles/AddArticlePage';
import ArticleSummaryPage from '@/pages/dashboard/articles/ArticleSummaryPage';
import EditArticlePage from '@/pages/dashboard/articles/EditArticlePage';
import PMEProvider from '@/context/PMEProvider';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import LogsProvider from '@/context/LogsContext';
import LogsPage from '@/pages/dashboard/LogsPage';
// Removed legacy dashboard contacts pages

function Router() {

  const router = createBrowserRouter([
        {
			path: '/login',
			element: (
				<RootLayout>
					<LoginPage />
				</RootLayout>
			),
		},
        {
            path: '/dashboard',
            element: (
              <ContactsProvider>
                <PMEProvider>
                  <ArticlesProvider>
                    <InvoicesProvider>
                      <LogsProvider>
                        <DashboardLayout />
                      </LogsProvider>
                    </InvoicesProvider>
                  </ArticlesProvider>
                </PMEProvider>
              </ContactsProvider>
            ),
            children: [
                {
                index: true,
                element: <DashboardHome />
                },
                { path: 'invoices', element: <AllInvoicesPage /> },
                { path: 'invoices/create', element: <CreateInvoiceChooserPage /> },
                { path: 'invoices/create/:type', element: <CreateInvoiceFormPage /> },
                { path: 'invoices/:id', element: <InvoiceDetailPage /> },
                { path: 'invoices/:id/edit', element: <CreateInvoiceFormPage /> },
                { path: 'deliveries/create', element: <CreateDeliveryPage /> },
                { path: 'deliveries/:id', element: <DeliveryDetailPage /> },
                { path: 'orders/create', element: <CreateOrderPage /> },
                { path: 'orders/:id', element: <OrderDetailPage /> },
                { path: 'issues/create', element: <CreateIssuePage /> },
                { path: 'issues/:id', element: <IssueDetailPage /> },
                {
                path: 'contacts',
                element: <ListContactsPage />
                },
                {
                path: 'contacts/add',
                element: <AddContactPage />
                },
                {
                path: 'contacts/:id',
                element: <ContactSummaryPage />
                },
                {
                path: 'contacts/:id/edit',
                element: <EditContactPage />
                },
                {
                path: 'articles',
                element: <ListArticlesPage />
                },
                {
                path: 'articles/add',
                element: <AddArticlePage />
                },
                {
                path: 'articles/:id',
                element: <ArticleSummaryPage />
                },
                {
                path: 'articles/:id/edit',
                element: <EditArticlePage />
                },
                {
                path: 'pme',
                element: <h1>PME</h1>
                },
                {
                path: 'pme/add',
                element: <AddPMEPage />
                },
                {
                path: 'settings',
                element: <SettingsPage />
                },
                { path: 'profile', element: <ProfilePage /> },
                { path: 'logs', element: <LogsPage /> },
                {
                path: '*',
                element: <Navigate to={'/dashboard'} />
                },
            ]
        },

        

		{ path: '/*', element: <Navigate to={'/login'} />},
	], { basename: import.meta.env.BASE_URL });

  return (
    <RouterProvider router={router} />
  )
}

export default Router