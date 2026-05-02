import { Link, useParams } from 'react-router-dom'
import { useReport } from '../hooks/useReport'
import type { ReportStatus } from '../types/report'

const statusLabelMap: Record<ReportStatus, string> = {
	NEW: 'New',
	VERIFIED: 'Verified',
	IN_PROGRESS: 'In progress',
	RESOLVED: 'Resolved',
	REJECTED: 'Rejected',
}

function formatDate(date: string) {
	return new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
}

export default function ReportDetailsPage() {
	const { id } = useParams()
	const reportId = id ? Number(id) : undefined
	const { report, isLoading, error } = useReport(reportId)

	if (!reportId) {
		return (
			<section className='page-section'>
				<p>Invalid report id.</p>
			</section>
		)
	}

	if (isLoading) {
		return (
			<section className='page-section'>
				<p>Loading report...</p>
			</section>
		)
	}

	if (error || !report) {
		return (
			<section className='page-section'>
				<p>Failed to load report details.</p>
			</section>
		)
	}

	return (
		<section className='page-section'>
			<div className='page-hero page-hero-compact'>
				<div>
					<span className='section-kicker'>Report details</span>
					<h1>{report.title}</h1>
					<p className='page-hero-text'>
						Review the report information, current status and latest progress
						for this city issue.
					</p>
				</div>

				<div className='page-hero-actions'>
					<Link to='/my-reports' className='secondary-button'>
						Back to my reports
					</Link>
					<Link to={`/report/${report.id}/edit`} className='primary-button'>
						Edit report
					</Link>
				</div>
			</div>

			<div className='details-layout'>
				<div className='details-main'>
					<article className='details-panel'>
						<div className='details-panel-header'>
							<div>
								<span className='report-id'>Report #{report.id}</span>
								<h2>Overview</h2>
							</div>
							<span
								className={`status-badge status-${report.status.toLowerCase()}`}
							>
								{statusLabelMap[report.status]}
							</span>
						</div>

						<p className='details-description'>{report.description}</p>

						<div className='details-meta-grid'>
							<div className='details-meta-item'>
								<span>Category</span>
								<strong>{report.category}</strong>
							</div>
							<div className='details-meta-item'>
								<span>District</span>
								<strong>{report.district}</strong>
							</div>
							<div className='details-meta-item'>
								<span>Created</span>
								<strong>{formatDate(report.created_at)}</strong>
							</div>
							<div className='details-meta-item'>
								<span>Updated</span>
								<strong>{formatDate(report.updated_at)}</strong>
							</div>
							<div className='details-meta-item details-meta-item-wide'>
								<span>Address</span>
								<strong>{report.address}</strong>
							</div>
							<div className='details-meta-item'>
								<span>Latitude</span>
								<strong>{report.latitude}</strong>
							</div>
							<div className='details-meta-item'>
								<span>Longitude</span>
								<strong>{report.longitude}</strong>
							</div>
						</div>
					</article>

					<article className='details-panel'>
						<div className='details-panel-header'>
							<div>
								<h2>Current note</h2>
								<p className='details-subtext'>
									Latest information available for this report.
								</p>
							</div>
						</div>

						<p className='details-subtext'>
							{report.admin_note || 'No admin note has been added yet.'}
						</p>
					</article>
				</div>

				<aside className='details-side'>
					{report.image_url ? (
						<article className='details-panel details-image-panel'>
							<h2>Visual reference</h2>
							<div className='details-image-wrap'>
								<img src={report.image_url} alt={report.title} />
							</div>
						</article>
					) : null}

					<article className='details-panel'>
						<h2>Quick actions</h2>
						<div className='details-actions'>
							<Link
								to={`/report/${report.id}/edit`}
								className='report-action-button report-action-button-primary'
							>
								Edit report
							</Link>
							<Link
								to='/map'
								className='report-action-button report-action-button-secondary'
							>
								Open city map
							</Link>
						</div>
					</article>
				</aside>
			</div>
		</section>
	)
}
