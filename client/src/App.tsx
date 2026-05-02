import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/navigation/Footer'
import Navbar from './components/navigation/Navbar'
import AdminReportDetailsPage from './features/admin/pages/AdminReportDetailsPage'
import AdminReportsPage from './features/admin/pages/AdminReportsPage'
import { AuthProvider } from './features/auth/context/AuthContext'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import CityMapPage from './features/map/pages/CityMapPage'
import EditReportPage from './features/reports/pages/EditReportPage'
import HomePage from './features/reports/pages/HomePage'
import MyReportsPage from './features/reports/pages/MyReportsPage'
import NewReportPage from './features/reports/pages/NewReportPage'
import ReportDetailsPage from './features/reports/pages/ReportDetailsPage'
import AdminRoute from './guards/AdminRoute'
import ProtectedRoute from './guards/ProtectedRoute'

function AppShell() {
	return (
		<div className='app-shell'>
			<Navbar />

			<main className='main-content container'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/city-map' element={<CityMapPage />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/report/:id' element={<ReportDetailsPage />} />

					<Route
						path='/report/new'
						element={
							<ProtectedRoute>
								<NewReportPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path='/report/:id/edit'
						element={
							<ProtectedRoute>
								<EditReportPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path='/my-reports'
						element={
							<ProtectedRoute>
								<MyReportsPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path='/admin/reports'
						element={
							<AdminRoute>
								<AdminReportsPage />
							</AdminRoute>
						}
					/>

					<Route
						path='/admin/reports/:id'
						element={
							<AdminRoute>
								<AdminReportDetailsPage />
							</AdminRoute>
						}
					/>
				</Routes>
			</main>

			<Footer />
		</div>
	)
}

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppShell />
			</AuthProvider>
		</BrowserRouter>
	)
}
