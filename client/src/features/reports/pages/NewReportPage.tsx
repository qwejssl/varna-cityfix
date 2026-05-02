import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { geocodeAddress } from '../../map/api/geocodeApi'
import { createReport, uploadReportImage } from '../api/reportsApi'

type FormState = {
	title: string
	category: string
	district: string
	address: string
	latitude: string
	longitude: string
	description: string
}

const initialState: FormState = {
	title: '',
	category: 'PAVEMENT',
	district: 'PRIMORSKI',
	address: '',
	latitude: '',
	longitude: '',
	description: '',
}

export default function NewReportPage() {
	const navigate = useNavigate()
	const { accessToken } = useAuth()

	const [form, setForm] = useState<FormState>(initialState)
	const [message, setMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isFindingCoordinates, setIsFindingCoordinates] = useState(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState('')
	const [isUploadingImage, setIsUploadingImage] = useState(false)
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

	const updateField =
		(field: keyof FormState) =>
		(
			event: React.ChangeEvent<
				HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
			>,
		) => {
			setForm(current => ({ ...current, [field]: event.target.value }))
		}

	const handleFindCoordinates = async () => {
		if (!form.address.trim()) {
			setMessage('Please enter an address first.')
			return
		}

		try {
			setIsFindingCoordinates(true)
			setMessage('')

			const result = await geocodeAddress(form.address.trim())

			setForm(current => ({
				...current,
				latitude: String(result.lat),
				longitude: String(result.lon),
				address: current.address || result.display_name,
			}))

			setMessage('Coordinates updated from the provided address.')
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to find coordinates'
			setMessage(errorMessage)
		} finally {
			setIsFindingCoordinates(false)
		}
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null
		setSelectedFile(file)
		setUploadedImageUrl(null)

		if (!file) {
			setPreviewUrl('')
			return
		}

		const localPreview = URL.createObjectURL(file)
		setPreviewUrl(localPreview)
	}

	const handleUploadImage = async () => {
		if (!selectedFile) {
			setMessage('Please select an image first.')
			return
		}

		if (!accessToken) {
			setMessage('You must be logged in to upload an image.')
			return
		}

		try {
			setIsUploadingImage(true)
			setMessage('')

			const result = await uploadReportImage(selectedFile, accessToken)
			setUploadedImageUrl(result.image_url)

			setMessage('Image uploaded successfully and attached to the report.')
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to upload image'
			setMessage(errorMessage)
		} finally {
			setIsUploadingImage(false)
		}
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		if (
			!form.title.trim() ||
			!form.description.trim() ||
			!form.address.trim() ||
			!form.latitude.trim() ||
			!form.longitude.trim()
		) {
			setMessage('Please fill in all required fields.')
			return
		}

		if (selectedFile && !uploadedImageUrl) {
			setMessage('Please upload the selected image before submitting.')
			return
		}

		try {
			setIsSubmitting(true)
			setMessage('')

			const payload = {
				title: form.title.trim(),
				description: form.description.trim(),
				category: form.category as
					| 'ROAD'
					| 'PAVEMENT'
					| 'STREETLIGHT'
					| 'BUILDING'
					| 'WASTE'
					| 'PARK'
					| 'OTHER',
				district: form.district as
					| 'ASPARUHOVO'
					| 'PRIMORSKI'
					| 'ODESSOS'
					| 'MLADOST'
					| 'VLADISLAV_VARNENCHIK',
				address: form.address.trim(),
				latitude: Number(form.latitude),
				longitude: Number(form.longitude),
				image_url: uploadedImageUrl,
			}

			console.log('SUBMIT_PAYLOAD', payload)

			await createReport(payload)

			setMessage('Report submitted successfully.')

			setTimeout(() => {
				navigate('/my-reports')
			}, 800)
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to submit report'
			setMessage(errorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className='page-section'>
			<div className='page-hero page-hero-compact'>
				<div>
					<span className='section-kicker'>New submission</span>
					<h1>Create Report</h1>
					<p className='page-hero-text'>
						Submit a city issue with clear location details so it can be
						reviewed and tracked more efficiently.
					</p>
				</div>
			</div>

			<div className='create-report-layout'>
				<aside className='side-info-card'>
					<h2>Before you submit</h2>
					<ul className='side-info-list'>
						<li>Use a short and specific title.</li>
						<li>Add the exact address whenever possible.</li>
						<li>Choose the closest matching category and district.</li>
						<li>Include clear details that help review the issue faster.</li>
					</ul>

					<div className='side-info-note'>
						<strong>Tip:</strong>
						<p>
							If the issue affects safety, describe what makes the location
							risky for pedestrians, drivers or residents.
						</p>
					</div>
				</aside>

				<form
					className='report-form report-form-enhanced'
					onSubmit={handleSubmit}
				>
					<div className='form-section'>
						<div className='form-section-heading'>
							<h2>Issue details</h2>
							<p>Basic information about the reported city problem.</p>
						</div>

						<div className='form-grid'>
							<div className='form-field'>
								<label htmlFor='title'>Title</label>
								<input
									id='title'
									value={form.title}
									onChange={updateField('title')}
								/>
							</div>

							<div className='form-field'>
								<label htmlFor='category'>Category</label>
								<select
									id='category'
									value={form.category}
									onChange={updateField('category')}
								>
									<option value='PAVEMENT'>PAVEMENT</option>
									<option value='ROAD'>ROAD</option>
									<option value='STREETLIGHT'>STREETLIGHT</option>
									<option value='BUILDING'>BUILDING</option>
									<option value='WASTE'>WASTE</option>
									<option value='PARK'>PARK</option>
									<option value='OTHER'>OTHER</option>
								</select>
							</div>

							<div className='form-field'>
								<label htmlFor='district'>District</label>
								<select
									id='district'
									value={form.district}
									onChange={updateField('district')}
								>
									<option value='PRIMORSKI'>PRIMORSKI</option>
									<option value='ODESSOS'>ODESSOS</option>
									<option value='MLADOST'>MLADOST</option>
									<option value='VLADISLAV_VARNENCHIK'>
										VLADISLAV_VARNENCHIK
									</option>
									<option value='ASPARUHOVO'>ASPARUHOVO</option>
								</select>
							</div>

							<div className='form-field form-field-full'>
								<label htmlFor='description'>Description</label>
								<textarea
									id='description'
									rows={6}
									placeholder='Describe the issue in detail...'
									value={form.description}
									onChange={updateField('description')}
								/>
								<span className='field-helper'>
									Explain what is damaged, where it is located and why it needs
									attention.
								</span>
							</div>
						</div>
					</div>

					<div className='form-section'>
						<div className='form-section-heading'>
							<h2>Location</h2>
							<p>Provide address and coordinates for more accurate mapping.</p>
						</div>

						<div className='form-grid'>
							<div className='form-field form-field-full'>
								<label htmlFor='address'>Address</label>
								<div className='address-row'>
									<input
										id='address'
										value={form.address}
										onChange={updateField('address')}
										placeholder='Sea Garden, Varna'
									/>
									<button
										type='button'
										className='secondary-button'
										onClick={handleFindCoordinates}
										disabled={isFindingCoordinates}
									>
										{isFindingCoordinates ? 'Finding...' : 'Find coordinates'}
									</button>
								</div>
							</div>

							<div className='form-field'>
								<label htmlFor='latitude'>Latitude</label>
								<input
									id='latitude'
									value={form.latitude}
									onChange={updateField('latitude')}
								/>
							</div>

							<div className='form-field'>
								<label htmlFor='longitude'>Longitude</label>
								<input
									id='longitude'
									value={form.longitude}
									onChange={updateField('longitude')}
								/>
							</div>
						</div>
					</div>

					<div className='form-section'>
						<div className='form-section-heading'>
							<h2>Photo evidence</h2>
							<p>Upload an image to help city staff assess the issue faster.</p>
						</div>

						<div className='form-grid'>
							<div className='form-field form-field-full'>
								<label htmlFor='reportImage'>Image file</label>
								<input
									id='reportImage'
									type='file'
									accept='image/png,image/jpeg,image/webp'
									onChange={handleFileChange}
								/>
								<span className='field-helper'>
									Accepted formats: JPG, PNG, WEBP. Max size: 5 MB.
								</span>
							</div>

							{previewUrl ? (
								<div className='form-field form-field-full'>
									<div className='upload-preview-card'>
										<img
											src={previewUrl}
											alt='Selected preview'
											className='upload-preview-image'
										/>
									</div>
								</div>
							) : null}

							<div className='form-field form-field-full'>
								<div className='upload-actions'>
									<button
										type='button'
										className='secondary-button'
										onClick={handleUploadImage}
										disabled={isUploadingImage || !selectedFile}
									>
										{isUploadingImage ? 'Uploading...' : 'Upload image'}
									</button>

									{uploadedImageUrl ? (
										<span className='upload-success'>
											Image uploaded and attached to the report.
										</span>
									) : null}
								</div>
							</div>
						</div>
					</div>

					<div className='form-submit-bar'>
						<div>
							<strong>Ready to submit?</strong>
							<p>Your report will appear in My Reports after submission.</p>
						</div>
						<button
							type='submit'
							className='primary-button'
							disabled={isSubmitting || isUploadingImage}
						>
							{isSubmitting ? 'Submitting...' : 'Submit report'}
						</button>
					</div>

					{message ? <p className='success-text'>{message}</p> : null}
				</form>
			</div>
		</section>
	)
}
