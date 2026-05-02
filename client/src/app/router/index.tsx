import { createBrowserRouter } from 'react-router-dom'
import AdminRoute from '../../guards/AdminRoute'
import ProtectedRoute from '../../guards/ProtectedRoute'
import AdminLayout from '../../layouts/AdminLayout'
import MainLayout from '../../layouts/MainLayout'

import AdminReportDetailsPage from '../../features/admin/pages/AdminReportDetailsPage'
import AdminReportsPage from '../../features/admin/pages/AdminReportsPage'
import LoginPage from '../../features/auth/pages/LoginPage'
import RegisterPage from '../../features/auth/pages/RegisterPage'
import CityMapPage from '../../features/map/pages/CityMapPage'
import HomePage from '../../features/reports/pages/HomePage'
import MyReportsPage from '../../features/reports/pages/MyReportsPage'
import NewReportPage from '../../features/reports/pages/NewReportPage'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: 'city-map', element: <CityMapPage /> },
			{ path: 'login', element: <LoginPage /> },
			{ path: 'register', element: <RegisterPage /> },
			{
				path: 'report/new',
				element: (
					<ProtectedRoute>
						<NewReportPage />
					</ProtectedRoute>
				),
			},
			{
				path: 'my-reports',
				element: (
					<ProtectedRoute>
						<MyReportsPage />
					</ProtectedRoute>
				),
			},
		],
	},
	{
		path: '/admin',
		element: (
			<AdminRoute>
				<AdminLayout />
			</AdminRoute>
		),
		children: [
			{ path: 'reports', element: <AdminReportsPage /> },
			{ path: 'reports/:id', element: <AdminReportDetailsPage /> },
		],
	},
])
