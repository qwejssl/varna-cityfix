export default function Footer() {
	return (
		<footer className='site-footer'>
			<div className='container footer-grid'>
				<div className='footer-brand-block'>
					<h3 className='footer-brand'>Varna CityFix</h3>
					<p className='footer-text'>
						Civic issue reporting platform for Varna, Bulgaria. Report damaged
						pavement, broken streetlights, waste problems, unsafe public spaces
						and other urban issues in one place.
					</p>
					<p className='footer-text footer-highlight'>
						Built as a modern citizen-first reporting experience with clear
						status tracking and faster communication.
					</p>
				</div>

				<div className='footer-column'>
					<h4>Contact</h4>
					<ul className='footer-list'>
						<li>Municipal Support Center</li>
						<li>8 Osmi Primorski Polk Blvd, Varna</li>
						<li>Email: support@varnacityfix.bg</li>
						<li>Phone: +359 52 820 111</li>
					</ul>
				</div>

				<div className='footer-column'>
					<h4>Working hours</h4>
					<ul className='footer-list'>
						<li>Monday – Friday: 08:30 – 17:30</li>
						<li>Saturday: 09:00 – 13:00</li>
						<li>Sunday: Closed</li>
						<li>Emergency hazards should be reported by phone.</li>
					</ul>
				</div>

				<div className='footer-column'>
					<h4>Useful information</h4>
					<ul className='footer-list'>
						<li>Create a report with location and description</li>
						<li>Track status changes from your account</li>
						<li>Use City Map to explore reported issues</li>
						<li>My Reports shows your submitted cases</li>
					</ul>
				</div>
			</div>

			<div className='container footer-bottom'>
				<p>© 2026 Varna CityFix. Prototype for civic engagement in Varna.</p>
				<p>Designed for clearer reporting, visibility and urban response.</p>
			</div>
		</footer>
	)
}
