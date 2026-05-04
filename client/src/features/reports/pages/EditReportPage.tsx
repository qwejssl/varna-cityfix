import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { geocodeAddress } from '../../map/api/geocodeApi'
import { updateReport } from '../api/reportsApi'
import { useReport } from '../hooks/useReport'
import type { Report, ReportCategory, VarnaDistrict } from '../types/report'

const categoryOptions: ReportCategory[] = [
	'ROAD',
	'PAVEMENT',
	'STREETLIGHT',
	'BUILDING',
	'WASTE',
	'PARK',
	'OTHER',
]

const districtOptions: VarnaDistrict[] = [
	'ASPARUHOVO',
	'PRIMORSKI',
	'ODESSOS',
	'MLADOST',
	'VLADISLAV_VARNENCHIK',
]

function isEditableStatus(status: Report['status']) {
	// разрешаем редактировать только в статусе NEW
	return status === 'NEW'
}

export default function EditReportPage() {
	const { id } = useParams<{ id: string }>()
	const reportId = id ? Number(id) : undefined
	const { report, isLoading, error } = useReport(reportId)
	const { user } = useAuth()
	const navigate = useNavigate()

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState<ReportCategory>('PAVEMENT')
	const [district, setDistrict] = useState<VarnaDistrict>('PRIMORSKI')
	const [address, setAddress] = useState('')
	const [latitude, setLatitude] = useState(43.2141)
	const [longitude, setLongitude] = useState(27.9147)
	const [imageUrl, setImageUrl] = useState<string>('')

	const [isDetectingCoords, setIsDetectingCoords] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [formError, setFormError] = useState('')
	const [infoMessage, setInfoMessage] = useState('')

	useEffect(() => {
		if (!report) return
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTitle(report.title)
		setDescription(report.description)
		setCategory(report.category)
		setDistrict(report.district)
		setAddress(report.address)
		setLatitude(report.latitude)
		setLongitude(report.longitude)
		setImageUrl(report.image_url ?? '')
	}, [report])

	if (!reportId) {
		return <p className='error-text'>Invalid report id.</p>
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
				<p className='error-text'>{error ?? 'Report not found.'}</p>
			</section>
		)
	}

	const isOwner = user && user.id === report.created_by_id
	const editable = isOwner && isEditableStatus(report.status)

	if (!isOwner) {
		return (
			<section className='page-section'>
				<p className='error-text'>You can only edit your own reports.</p>
			</section>
		)
	}

	if (!editable) {
		return (
			<section className='page-section'>
				<p className='error-text'>
					This report cannot be edited because its status is {report.status}.
				</p>
				<Link to={`/report/${report.id}`} className='secondary-link'>
					← Back to report details
				</Link>
			</section>
		)
	}

	const handleDetectCoordinates = async () => {
		if (address.trim().length < 3) {
			setFormError('Please enter a more detailed address first.')
			return
		}

		try {
			setIsDetectingCoords(true)
			setFormError('')
			setInfoMessage('')

			const result = await geocodeAddress(address)
			setLatitude(result.lat)
			setLongitude(result.lon)
			setInfoMessage(`Coordinates updated: ${result.display_name}`)
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to detect coordinates.'
			setFormError(message)
		} finally {
			setIsDetectingCoords(false)
		}
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSubmitting(true)
		setFormError('')
		setInfoMessage('')

		if (title.trim().length < 5) {
			setFormError('Title must contain at least 5 characters.')
			setIsSubmitting(false)
			return
		}

		if (description.trim().length < 10) {
			setFormError('Description must contain at least 10 characters.')
			setIsSubmitting(false)
			return
		}

		try {
			await updateReport(report.id, {
				title,
				description,
				category,
				district,
				address,
				latitude,
				longitude,
				image_url: imageUrl || null,
				// created_by_id убран — на бэке это поле не должно обновляться из формы
			})

			setInfoMessage('Report updated successfully.')
			setTimeout(() => {
				navigate(`/report/${report.id}`)
			}, 800)
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to update report.'
			setFormError(message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className='page-section'>
			<Link to={`/report/${report.id}`} className='secondary-link'>
				← Back to report details
			</Link>

			<h1>Edit Report</h1>
			<p>You can edit this report while its status is NEW.</p>

			<form className='report-form' onSubmit={handleSubmit}>
				<div className='form-grid'>
					<div className='form-field'>
						<label htmlFor='title'>Title</label>
						<input
							id='title'
							type='text'
							value={title}
							onChange={e => setTitle(e.target.value)}
							required
						/>
					</div>

					<div className='form-field'>
						<label htmlFor='category'>Category</label>
						<select
							id='category'
							value={category}
							onChange={e => setCategory(e.target.value as ReportCategory)}
						>
							{categoryOptions.map(c => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>

					<div className='form-field'>
						<label htmlFor='district'>District</label>
						<select
							id='district'
							value={district}
							onChange={e => setDistrict(e.target.value as VarnaDistrict)}
						>
							{districtOptions.map(d => (
								<option key={d} value={d}>
									{d}
								</option>
							))}
						</select>
					</div>

					<div className='form-field form-field-full'>
						<label htmlFor='address'>Address</label>
						<div className='address-row'>
							<input
								id='address'
								type='text'
								value={address}
								onChange={e => setAddress(e.target.value)}
								required
							/>
							<button
								type='button'
								className='secondary-button'
								onClick={handleDetectCoordinates}
								disabled={isDetectingCoords}
							>
								{isDetectingCoords ? 'Detecting...' : 'Find coordinates'}
							</button>
						</div>
					</div>

					<div className='form-field'>
						<label htmlFor='latitude'>Latitude</label>
						<input
							id='latitude'
							type='number'
							step='0.0001'
							value={latitude}
							onChange={e => setLatitude(Number(e.target.value))}
							required
						/>
					</div>

					<div className='form-field'>
						<label htmlFor='longitude'>Longitude</label>
						<input
							id='longitude'
							type='number'
							step='0.0001'
							value={longitude}
							onChange={e => setLongitude(Number(e.target.value))}
							required
						/>
					</div>

					<div className='form-field form-field-full'>
						<label htmlFor='image_url'>Image URL (optional)</label>
						<input
							id='image_url'
							type='text'
							value={imageUrl}
							onChange={e => setImageUrl(e.target.value)}
						/>
					</div>

					<div className='form-field form-field-full'>
						<label htmlFor='description'>Description</label>
						<textarea
							id='description'
							rows={6}
							value={description}
							onChange={e => setDescription(e.target.value)}
							required
						/>
					</div>
				</div>

				{infoMessage && <p className='success-text'>{infoMessage}</p>}
				{formError && <p className='error-text'>{formError}</p>}

				<div className='form-actions'>
					<button
						className='primary-button'
						type='submit'
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Saving...' : 'Save changes'}
					</button>
				</div>
			</form>
		</section>
	)
}
