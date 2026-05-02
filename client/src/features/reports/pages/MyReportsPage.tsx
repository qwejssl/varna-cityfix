import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyReports } from '../hooks/useMyReports'
import type { ReportStatus } from '../types/report'

const statusLabelMap: Record<ReportStatus, string> = {
	NEW: 'New',
	UNDER_REVIEW: 'Under review',
	IN_PROGRESS: 'In progress',
	RESOLVED: 'Resolved',
	REJECTED: 'Rejected',
}

type FilterValue = 'ALL' | ReportStatus

function formatDate(date: string) {
	return new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
}

export default function MyReportsPage() {
	const { reports, isLoading, error } = useMyReports()
	const [selectedStatus, setSelectedStatus] = useState<FilterValue>('ALL')

	const filteredReports = useMemo(() => {
		if (selectedStatus === 'ALL') {
			return reports
		}

		return reports.filter(report => report.status === selectedStatus)
	}, [reports, selectedStatus])

	const totalReports = reports.length
	const activeReports = reports.filter(
		report =>
			report.status === 'NEW' ||
			report.status === 'UNDER_REVIEW' ||
			report.status === 'IN_PROGRESS',
	).length
	const resolvedReports = reports.filter(
		report => report.status === 'RESOLVED',
	).length
	const newestReport = reports[0]

	if (isLoading) {
		return (
			<section className='page-section'>
				<p>Loading your reports...</p>
			</section>
		)
	}

	if (error) {
		return (
			<section className='page-section'>
				<p>{error}</p>
			</section>
		)
	}

	return (
		<section className='page-section'>
			<div className='page-hero page-hero-compact'>
				<div>
					<span className='section-kicker'>Citizen dashboard</span>
					<h1>My Reports</h1>
					<p className='page-hero-text'>
						Track submitted reports, review their current status and open each
						issue for more details or edits.
					</p>
				</div>
				<div className='page-hero-actions'>
					<Link to='/report/new' className='primary-button'>
						Create report
					</Link>
				</div>
			</div>

			<section className='summary-grid'>
				<article className='summary-card'>
					<span className='summary-label'>Total reports</span>
					<strong>{totalReports}</strong>
					<p>All issues submitted from your account.</p>
				</article>

				<article className='summary-card'>
					<span className='summary-label'>Active cases</span>
					<strong>{activeReports}</strong>
					<p>Reports that still require review or action.</p>
				</article>

				<article className='summary-card'>
					<span className='summary-label'>Resolved</span>
					<strong>{resolvedReports}</strong>
					<p>Issues already completed by the city team.</p>
				</article>

				<article className='summary-card summary-card-accent'>
					<span className='summary-label'>Latest activity</span>
					<strong>
						{newestReport ? newestReport.title : 'No reports yet'}
					</strong>
					<p>
						{newestReport
							? `${formatDate(newestReport.created_at)} · ${statusLabelMap[newestReport.status]}`
							: 'No recent activity'}
					</p>
				</article>
			</section>

			<section className='toolbar-card'>
				<div className='toolbar-copy'>
					<h2>Reports overview</h2>
					<p>Filter and review recent submissions in one place.</p>
				</div>

				<div className='toolbar-actions'>
					<button
						className={`filter-chip ${selectedStatus === 'ALL' ? 'filter-chip-active' : ''}`}
						type='button'
						onClick={() => setSelectedStatus('ALL')}
					>
						All
					</button>
					<button
						className={`filter-chip ${selectedStatus === 'NEW' ? 'filter-chip-active' : ''}`}
						type='button'
						onClick={() => setSelectedStatus('NEW')}
					>
						New
					</button>
					<button
						className={`filter-chip ${selectedStatus === 'UNDER_REVIEW' ? 'filter-chip-active' : ''}`}
						type='button'
						onClick={() => setSelectedStatus('UNDER_REVIEW')}
					>
						Under review
					</button>
					<button
						className={`filter-chip ${selectedStatus === 'IN_PROGRESS' ? 'filter-chip-active' : ''}`}
						type='button'
						onClick={() => setSelectedStatus('IN_PROGRESS')}
					>
						In progress
					</button>
					<button
						className={`filter-chip ${selectedStatus === 'RESOLVED' ? 'filter-chip-active' : ''}`}
						type='button'
						onClick={() => setSelectedStatus('RESOLVED')}
					>
						Resolved
					</button>
				</div>
			</section>

			{!filteredReports.length ? (
				<section className='details-panel'>
					<h2>No reports found</h2>
					<p className='details-subtext'>
						There are no reports for the selected filter yet.
					</p>
				</section>
			) : (
				<section className='reports-grid reports-grid-enhanced'>
					{filteredReports.map(report => (
						<article
							className='report-card report-card-enhanced'
							key={report.id}
						>
							<div className='report-card-top'>
								<div>
									<span className='report-id'>Report #{report.id}</span>
									<h3>{report.title}</h3>
								</div>
								<span
									className={`status-badge status-${report.status.toLowerCase()}`}
								>
									{statusLabelMap[report.status]}
								</span>
							</div>

							<p className='report-card-description'>{report.description}</p>

							<ul className='report-meta report-meta-enhanced'>
								<li>
									<strong>Category:</strong> {report.category}
								</li>
								<li>
									<strong>District:</strong> {report.district}
								</li>
								<li>
									<strong>Address:</strong> {report.address}
								</li>
								<li>
									<strong>Created:</strong> {formatDate(report.created_at)}
								</li>
							</ul>

							<div className='report-card-actions'>
								<Link
									to={`/report/${report.id}`}
									className='report-action-button report-action-button-secondary'
								>
									View details
								</Link>
								<Link
									to={`/report/${report.id}/edit`}
									className='report-action-button report-action-button-primary'
								>
									Edit
								</Link>
							</div>
						</article>
					))}
				</section>
			)}
		</section>
	)
}
