import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'

export default function AdminLayout() {
	return (
		<div className='app-shell admin-shell'>
			<Navbar />
			<main className='main-content container'>
				<Outlet />
			</main>
		</div>
	)
}
