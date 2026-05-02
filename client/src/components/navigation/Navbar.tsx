import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'

export default function Navbar() {
	const { isAuthenticated, user, logout } = useAuth()

	return (
		<header className='site-header'>
			<div className='container nav-wrapper'>
				<NavLink to='/' className='brand navbar-brand'>
					<img
						src='/logo.png'
						alt='Varna CityFix logo'
						className='navbar-logo'
					/>
					<span>Varna CityFix</span>
				</NavLink>

				<nav className='nav-links'>
					{!isAuthenticated && (
						<>
							<NavLink to='/'>Home</NavLink>
							<NavLink to='/city-map'>City Map</NavLink>
							<NavLink to='/login'>Login</NavLink>
							<NavLink to='/register'>Register</NavLink>
						</>
					)}

					{isAuthenticated && user?.role === 'CITIZEN' && (
						<>
							<NavLink to='/'>Home</NavLink>
							<NavLink to='/city-map'>City Map</NavLink>
							<NavLink to='/report/new'>Create Report</NavLink>
							<NavLink to='/my-reports'>My Reports</NavLink>
							<button className='nav-button' onClick={logout}>
								Logout
							</button>
						</>
					)}

					{isAuthenticated && user?.role === 'ADMIN' && (
						<>
							<NavLink to='/admin/reports'>All Reports</NavLink>
							<button className='nav-button' onClick={logout}>
								Logout
							</button>
						</>
					)}
				</nav>
			</div>
		</header>
	)
}
