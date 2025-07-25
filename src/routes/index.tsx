import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

function Router() {

  const router = createBrowserRouter([
		{
			path: '/',
			element: <h1 className='bg-blue-500'>hello world</h1>,
		},
		
		{ path: '/*', element: <Navigate to={'/'} />},
	]);

  return (
    <RouterProvider router={router} />
  )
}

export default Router