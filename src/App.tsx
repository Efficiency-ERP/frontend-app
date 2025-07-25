import './App.css'

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

function App() {

  const router = createBrowserRouter([
		{
			path: '/',
			element: <h1 className='bg-blue-400'>HI</h1>,
		},
		
		{ path: '/*', element: <Navigate to={'/'} />},
	]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
