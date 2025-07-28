import { createBrowserRouter, Navigate, RouterProvider, Outlet } from 'react-router-dom';
import { RouteProvider } from '@/providers/route-provider'; 

import LoginPage from '@/pages/LoginPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';

const AppWrapper = () => (
  <RouteProvider>
    <Outlet />
  </RouteProvider>
);

function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppWrapper />,
      children: [
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'dashboard',
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
              element: <Navigate to="/dashboard" replace />
            },
          ]
        },
        { 
          path: '*', 
          element: <Navigate to="/login" replace />
        },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default Router;