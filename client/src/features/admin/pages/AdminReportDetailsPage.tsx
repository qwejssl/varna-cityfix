import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { updateReport } from '../../reports/api/reportsApi'
import { useReport } from '../../reports/hooks/useReport'
import type { ReportStatus } from '../../reports/types/report'

const statusLabelMap: Record<ReportStatus, string> = {
	NEW: 'New',
	UNDER_REVIEW: 'Under review',
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

export default function AdminReportDetailsPage() {
	const { id } = useParams()
	const reportId = id ? Number(id) : undefined
	const { report, isLoading, error } = useReport(reportId)

	const [selectedStatus, setSelectedStatus] = useState<ReportStatus>('NEW')
	const [adminNote, setAdminNote] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [saveMessage, setSaveMessage] = useState<string | null>(null)

	useEffect(() => {
		if (!report) {
			return
		}

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSelectedStatus(report.status)
		setAdminNote(report.admin_note ?? '')
	}, [report])

	const handleSave = async () => {
		if (!reportId || !report) {
			return
		}

		try {
			setIsSaving(true)
			setSaveMessage(null)

			await updateReport(reportId, {
				title: report.title,
				description: report.description,
				category: report.category,
				district: report.district,
				address: report.address,
				latitude: report.latitude,
				longitude: report.longitude,
				image_url: report.image_url,
				status: selectedStatus,
				admin_note: adminNote.trim() || null,
			})

			setSaveMessage('Report updated successfully.')
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to update report'
			setSaveMessage(message)
		} finally {
			setIsSaving(false)
		}
	}

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
				<p>Loading admin report details...</p>
			</section>
		)
	}

	if (error || !report) {
		return (
			<section className='page-section'>
				<p>{error || 'Failed to load admin report details.'}</p>
			</section>
		)
	}

	const priority = getPriorityFromStatus(report.status)

	return (
		<section className='page-section'>
			<div className='page-hero page-hero-compact'>
				<div>
					<span className='section-kicker'>Admin report details</span>
					<h1>{report.title}</h1>
					<p className='page-hero-text'>
						Review full report information, track processing progress and manage
						the next operational steps.
					</p>
				</div>

				<div className='page-hero-actions'>
					<Link to='/admin/reports' className='secondary-button'>
						Back to reports
					</Link>
				</div>
			</div>

			<div className='details-layout'>
				<div className='details-main'>
					<article className='details-panel'>
						<div className='details-panel-header'>
							<div>
								<span className='report-id'>Report #{report.id}</span>
								<h2>Issue overview</h2>
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
								<span>Priority</span>
								<strong>{priority}</strong>
							</div>
							<div className='details-meta-item'>
								<span>Created by user ID</span>
								<strong>{report.created_by_id}</strong>
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
				</div>

				<aside className='details-side'>
					<article className='details-panel'>
						<h2>Admin actions</h2>

						<div className='form-grid'>
							<div className='form-field form-field-full'>
								<label htmlFor='status'>Status</label>
								<select
									id='status'
									value={selectedStatus}
									onChange={event =>
										setSelectedStatus(event.target.value as ReportStatus)
									}
								>
									<option value='NEW'>New</option>
									<option value='UNDER_REVIEW'>Under review</option>
									<option value='IN_PROGRESS'>In progress</option>
									<option value='RESOLVED'>Resolved</option>
									<option value='REJECTED'>Rejected</option>
								</select>
							</div>

							<div className='form-field form-field-full'>
								<label htmlFor='adminNote'>Internal note</label>
								<textarea
									id='adminNote'
									rows={6}
									value={adminNote}
									onChange={event => setAdminNote(event.target.value)}
									placeholder='Add internal note for this report'
								/>
							</div>
						</div>

						<div className='details-actions'>
							<button
								className='report-action-button report-action-button-primary'
								type='button'
								onClick={handleSave}
								disabled={isSaving}
							>
								{isSaving ? 'Saving...' : 'Save changes'}
							</button>
						</div>

						{saveMessage ? (
							<p className='details-subtext'>{saveMessage}</p>
						) : null}
					</article>

					<article className='details-panel'>
						<h2>Current note</h2>
						<p className='details-subtext'>
							{report.admin_note || 'No internal note has been added yet.'}
						</p>
					</article>
				</aside>
			</div>
		</section>
	)
}
