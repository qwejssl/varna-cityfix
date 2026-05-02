import { Link } from 'react-router-dom'

export default function HomePage() {
	return (
		<section className='page-section home-page'>
			<div className='home-hero'>
				<div className='home-hero-content'>
					<span className='eyebrow'>Varna, Bulgaria</span>
					<h1>
						Report city problems faster and help improve everyday urban life.
					</h1>
					<p className='home-hero-text'>
						Varna CityFix helps citizens report broken pavement, dangerous
						buildings, damaged streetlights, waste issues and other public
						infrastructure problems with clear descriptions, exact locations and
						transparent status updates.
					</p>

					<div className='hero-actions'>
						<Link to='/report/new' className='primary-button'>
							Create report
						</Link>
						<Link to='/city-map' className='secondary-button'>
							Explore city map
						</Link>
					</div>

					<div className='hero-stats'>
						<div className='hero-stat-card'>
							<strong>Fast reporting</strong>
							<span>Submit issues in a few simple steps</span>
						</div>
						<div className='hero-stat-card'>
							<strong>Clear tracking</strong>
							<span>Follow report status from new to resolved</span>
						</div>
						<div className='hero-stat-card'>
							<strong>City-focused</strong>
							<span>Built for local urban issues in Varna</span>
						</div>
					</div>
				</div>

				<div className='hero-banner-card'>
					<div className='hero-banner-overlay'>
						<span className='hero-banner-label'>Featured visual</span>
						<h2>Safer streets start with faster reporting. </h2>
						<p>
							Help the city identify damaged pavement, broken streetlights and
							unsafe public spaces before small issues become bigger problems.
						</p>
					</div>
				</div>
			</div>

			<div className='home-section-grid'>
				<article className='info-card info-card-accent'>
					<h3>How it works</h3>
					<ol className='info-steps'>
						<li>Describe the issue clearly and choose a category.</li>
						<li>Add location details, address and coordinates.</li>
						<li>Track updates and manage your reports from one place.</li>
					</ol>
				</article>

				<article className='info-card'>
					<h3>What you can report</h3>
					<div className='issue-tags'>
						<span>Road damage</span>
						<span>Pavement problems</span>
						<span>Streetlights</span>
						<span>Buildings</span>
						<span>Waste</span>
						<span>Parks</span>
						<span>Other urban issues</span>
					</div>
				</article>
			</div>

			<div className='home-content-grid'>
				<section className='content-panel'>
					<div className='section-heading'>
						<span className='section-kicker'>Why use it</span>
						<h2>A simpler way to connect citizens with city issues</h2>
					</div>
					<div className='feature-grid'>
						<article className='feature-card'>
							<h3>Structured reporting</h3>
							<p>
								Categories, districts and exact addresses make reports easier to
								review and act on.
							</p>
						</article>
						<article className='feature-card'>
							<h3>Visible progress</h3>
							<p>
								Citizens can see whether a report is new, under review, in
								progress, resolved or rejected.
							</p>
						</article>
						<article className='feature-card'>
							<h3>Map-based context</h3>
							<p>
								Location-aware reporting helps identify clusters of issues
								across neighborhoods in Varna.
							</p>
						</article>
						<article className='feature-card'>
							<h3>Citizen-friendly interface</h3>
							<p>
								The platform is designed to be easy to use even for quick
								reports from a phone or laptop.
							</p>
						</article>
					</div>
				</section>

				<aside className='content-panel content-panel-soft'>
					<div className='section-heading'>
						<span className='section-kicker'>Quick overview</span>
						<h2>Common reporting scenarios</h2>
					</div>

					<div className='mini-list'>
						<div className='mini-list-item'>
							<strong>Broken streetlight</strong>
							<p>
								Unsafe dark areas near crossings, schools or residential blocks.
							</p>
						</div>
						<div className='mini-list-item'>
							<strong>Damaged pavement</strong>
							<p>Cracked tiles, holes and uneven walking surfaces.</p>
						</div>
						<div className='mini-list-item'>
							<strong>Waste accumulation</strong>
							<p>
								Overflowing bins, illegal dumping or unsanitary public areas.
							</p>
						</div>
						<div className='mini-list-item'>
							<strong>Unsafe building zone</strong>
							<p>
								Falling facade elements, damaged fences or dangerous access
								points.
							</p>
						</div>
					</div>
				</aside>
			</div>

			<section className='cta-panel'>
				<div>
					<span className='section-kicker'>Get started</span>
					<h2>
						See a problem in the city? Report it while the details are fresh.
					</h2>
					<p>
						Clear reports with accurate location data help create faster review
						and better follow-up.
					</p>
				</div>

				<div className='cta-panel-actions'>
					<Link to='/report/new' className='primary-button'>
						Report an issue
					</Link>
					<Link to='/my-reports' className='secondary-button'>
						Open my reports
					</Link>
				</div>
			</section>
		</section>
	)
}
