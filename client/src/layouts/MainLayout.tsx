import { Outlet } from 'react-router-dom'
import Footer from '../components/navigation/Footer'
import Navbar from '../components/navigation/Navbar'

export default function MainLayout() {
	return (
		<div className='app-shell'>
			<Navbar />
			<main className='main-content container'>
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}
