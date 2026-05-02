import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ReportStatus } from '../../reports/types/report'
import { useAdminReports } from '../hooks/useAdminReports'

const statusLabelMap: Record<ReportStatus, string> = {
	NEW: 'New',
	UNDER_REVIEW: 'Under review',
	IN_PROGRESS: 'In progress',
	RESOLVED: 'Resolved',
	REJECTED: 'Rejected',
}

type FilterValue = 'ALL' | 'OPEN' | 'HIGH_PRIORITY' | ReportStatus

function formatDate(date: string) {
	return new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})
}

function getPriorityFromStatus(
	status: ReportStatus,
): 'High' | 'Medium' | 'Low' {
	if (status === 'NEW' || status === 'REJECTED') {
		return 'High'
	}

	if (status === 'UNDER_REVIEW' || status === 'IN_PROGRESS') {
		return 'Medium'
	}

	return 'Low'
}

export default function AdminReportsPage() {
	const { reports, isLoading, error } = useAdminReports()
	const [selectedFilter, setSelectedFilter] = useState<FilterValue>('ALL')

	const filteredReports = useMemo(() => {
		if (selectedFilter === 'ALL') {
			return reports
		}

		if (selectedFilter === 'OPEN') {
			return reports.filter(
				report =>
					report.status === 'NEW' ||
					report.status === 'UNDER_REVIEW' ||
					report.status === 'IN_PROGRESS',
			)
		}

		if (selectedFilter === 'HIGH_PRIORITY') {
			return reports.filter(
				report => getPriorityFromStatus(report.status) === 'High',
			)
		}

		return reports.filter(report => report.status === selectedFilter)
	}, [reports, selectedFilter])

	const incomingCount = reports.filter(report => report.status === 'NEW').length
	const reviewCount = reports.filter(
		report => report.status === 'UNDER_REVIEW',
	).length
	const inProgressCount = reports.filter(
		report => report.status === 'IN_PROGRESS',
	).length
	const resolvedCount = reports.filter(
		report => report.status === 'RESOLVED',
	).length

	if (isLoading) {
		return (
			<section className='page-section'>
				<p>Loading admin reports...</p>
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
					<span className='section-kicker'>Admin dashboard</span>
					<h1>Issue Management</h1>
					<p className='page-hero-text'>
						Review incoming city reports, track operational workload and update
						issue statuses across districts.
					</p>
				</div>
			</div>

			<section className='summary-grid'>
				<article className='summary-card'>
					<span className='summary-label'>Incoming</span>
					<strong>{incomingCount}</strong>
					<p>New reports waiting for first review.</p>
				</article>

				<article className='summary-card'>
					<span className='summary-label'>Under review</span>
					<strong>{reviewCount}</strong>
					<p>Cases currently being checked and validated.</p>
				</article>

				<article className='summary-card'>
					<span className='summary-label'>In progress</span>
					<strong>{inProgressCount}</strong>
					<p>Issues already accepted for operational action.</p>
				</article>

				<article className='summary-card summary-card-accent'>
					<span className='summary-label'>Resolved</span>
					<strong>{resolvedCount}</strong>
					<p>Completed reports updated in the current dataset.</p>
				</article>
			</section>

			<section className='toolbar-card'>
				<div className='toolbar-copy'>
					<h2>Operations queue</h2>
					<p>Prioritize incoming requests and monitor report handling.</p>
				</div>

				<div className='toolbar-actions'>
					<button
						className={`filter-chip ${selectedFilter === 'ALL' ? 'filter-chip-active' : ''}`}
						type='button'
						onClick={() => setSelectedFilter('ALL')}
					>
						All
					</button>

					<button
						className={`filter-chip ${selectedFilter === 'HIGH_PRIORITY' ? 'filter-chip-active' : ''}`}
						type='button'
						onClick={() => setSelectedFilter('HIGH_PRIORITY')}
					>
						High priority
					</button>

					<button
						className={`filter-chip ${selectedFilter === 'OPEN' ? 'filter-chip-active' : ''}`}
						type='button'
						onClick={() => setSelectedFilter('OPEN')}
					>
						Open issues
					</button>
				</div>
			</section>

			<section className='admin-table-card'>
				{!filteredReports.length ? (
					<div className='details-panel'>
						<h2>No reports found</h2>
						<p className='details-subtext'>
							There are no reports matching the selected filter.
						</p>
					</div>
				) : (
					<table className='reports-table admin-table'>
						<thead>
							<tr>
								<th>Issue</th>
								<th>District</th>
								<th>Category</th>
								<th>Status</th>
								<th>Priority</th>
								<th>Created</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{filteredReports.map(report => {
								const priority = getPriorityFromStatus(report.status)

								return (
									<tr key={report.id}>
										<td>
											<div className='admin-issue-cell'>
												<strong>{report.title}</strong>
												<span>Report #{report.id}</span>
											</div>
										</td>
										<td>{report.district}</td>
										<td>{report.category}</td>
										<td>
											<span
												className={`status-badge status-${report.status.toLowerCase()}`}
											>
												{statusLabelMap[report.status]}
											</span>
										</td>
										<td>
											<span
												className={`priority-badge priority-${priority.toLowerCase()}`}
											>
												{priority}
											</span>
										</td>
										<td>{formatDate(report.created_at)}</td>
										<td>
											<Link
												to={`/admin/reports/${report.id}`}
												className='report-action-button report-action-button-secondary'
											>
												Open
											</Link>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				)}
			</section>
		</section>
	)
}
