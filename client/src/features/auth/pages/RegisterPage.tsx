import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi'

type RegisterForm = {
	fullName: string
	email: string
	password: string
	confirmPassword: string
}

const initialForm: RegisterForm = {
	fullName: '',
	email: '',
	password: '',
	confirmPassword: '',
}

export default function RegisterPage() {
	const navigate = useNavigate()
	const [form, setForm] = useState<RegisterForm>(initialForm)
	const [errorMessage, setErrorMessage] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const updateField =
		(field: keyof RegisterForm) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setForm(current => ({ ...current, [field]: event.target.value }))
			if (errorMessage) setErrorMessage('')
			if (successMessage) setSuccessMessage('')
		}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		if (isSubmitting) return

		if (
			!form.fullName.trim() ||
			!form.email.trim() ||
			!form.password.trim() ||
			!form.confirmPassword.trim()
		) {
			setErrorMessage('Please fill in all fields.')
			return
		}

		if (form.password !== form.confirmPassword) {
			setErrorMessage('Passwords do not match.')
			return
		}

		try {
			setIsSubmitting(true)
			setErrorMessage('')
			setSuccessMessage('')

			await registerUser({
				full_name: form.fullName.trim(),
				email: form.email.trim().toLowerCase(),
				password: form.password,
			})

			setSuccessMessage('Registration successful. Redirecting to login...')

			setTimeout(() => {
				navigate('/login')
			}, 1000)
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Registration failed'
			setErrorMessage(errorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className='page-section auth-page'>
			<div className='auth-layout'>
				<form className='auth-card auth-card-main' onSubmit={handleSubmit}>
					<span className='section-kicker'>Create account</span>
					<h1>Register</h1>
					<p className='auth-text'>
						Create an account to submit reports and follow their status.
					</p>

					<div className='form-grid'>
						<div className='form-field form-field-full'>
							<label htmlFor='fullName'>Full name</label>
							<input
								id='fullName'
								value={form.fullName}
								onChange={updateField('fullName')}
								placeholder='Andrei Ivanov'
								disabled={isSubmitting}
							/>
						</div>

						<div className='form-field form-field-full'>
							<label htmlFor='email'>Email</label>
							<input
								id='email'
								type='email'
								value={form.email}
								onChange={updateField('email')}
								placeholder='name@example.com'
								disabled={isSubmitting}
							/>
						</div>

						<div className='form-field'>
							<label htmlFor='password'>Password</label>
							<input
								id='password'
								type='password'
								value={form.password}
								onChange={updateField('password')}
								placeholder='Create password'
								disabled={isSubmitting}
							/>
						</div>

						<div className='form-field'>
							<label htmlFor='confirmPassword'>Confirm password</label>
							<input
								id='confirmPassword'
								type='password'
								value={form.confirmPassword}
								onChange={updateField('confirmPassword')}
								placeholder='Repeat password'
								disabled={isSubmitting}
							/>
						</div>
					</div>

					<div className='auth-actions auth-actions-single'>
						<button
							className='primary-button'
							type='submit'
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Creating account...' : 'Create account'}
						</button>
					</div>

					{errorMessage ? (
						<p className='auth-helper auth-helper-error'>{errorMessage}</p>
					) : null}

					{successMessage ? (
						<p className='auth-helper auth-helper-success'>{successMessage}</p>
					) : null}

					<p className='auth-helper'>
						Already have an account? <Link to='/login'>Login</Link>
					</p>
				</form>

				<aside className='auth-card auth-card-side'>
					<h2>Why register</h2>
					<ul className='auth-feature-list'>
						<li>Track your submitted reports in one dashboard.</li>
						<li>Edit reports when more details are needed.</li>
						<li>Follow progress from submission to resolution.</li>
					</ul>
				</aside>
			</div>
		</section>
	)
}
