import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import LoginPage from '@/pages/LoginPage';	
import DashboardLayout from '@/layouts/DashboardLayout';
import RootLayout from '@/layouts/RootLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';

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
            element: <DashboardLayout />,
            children: [
                {
                index: true,
                element: <DashboardHome />
                },
                {
                path: 'invoice',
                element: <h1>INVOICE</h1>
                },
                {
                path: '*',
                element: <Navigate to={'/dashboard'} />
                },
            ]
        },
		
		{ path: '/*', element: <Navigate to={'/login'} />},
	]);

  return (
    <RouterProvider router={router} />
  )
}

export default Router