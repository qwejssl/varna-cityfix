import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
	const { login } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		if (isSubmitting) return

		if (!email.trim() || !password.trim()) {
			setErrorMessage('Please enter email and password.')
			return
		}

		try {
			setIsSubmitting(true)
			setErrorMessage('')

			const normalizedEmail = email.trim().toLowerCase()
			const result = await loginUser(normalizedEmail, password)

			login({
				accessToken: result.access_token,
				user: {
					id: result.user_id,
					fullName: result.full_name,
					email: result.email,
					role: result.role,
				},
			})

			navigate(result.role === 'ADMIN' ? '/admin/reports' : '/my-reports')
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Login failed'
			setErrorMessage(errorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section className='page-section auth-page'>
			<div className='auth-layout'>
				<form className='auth-card auth-card-main' onSubmit={handleSubmit}>
					<span className='section-kicker'>Access account</span>
					<h1>Login</h1>
					<p className='auth-text'>
						Sign in to track your reports, create new submissions and access the
						city issue dashboard.
					</p>

					<div className='auth-form-placeholder'>
						<div className='form-field'>
							<label htmlFor='email'>Email</label>
							<input
								id='email'
								type='email'
								placeholder='name@example.com'
								value={email}
								onChange={event => {
									setEmail(event.target.value)
									if (errorMessage) setErrorMessage('')
								}}
								disabled={isSubmitting}
							/>
						</div>

						<div className='form-field'>
							<label htmlFor='password'>Password</label>
							<input
								id='password'
								type='password'
								placeholder='Enter your password'
								value={password}
								onChange={event => {
									setPassword(event.target.value)
									if (errorMessage) setErrorMessage('')
								}}
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
							{isSubmitting ? 'Logging in...' : 'Login'}
						</button>
					</div>

					{errorMessage ? (
						<p className='auth-helper auth-helper-error'>{errorMessage}</p>
					) : null}

					<p className='auth-helper'>
						No account yet? <Link to='/register'>Register</Link>
					</p>
				</form>

				<aside className='auth-card auth-card-side'>
					<h2>What you can do</h2>
					<ul className='auth-feature-list'>
						<li>Create reports with location and description.</li>
						<li>Track issue statuses from your account.</li>
						<li>Access role-based citizen and admin flows.</li>
					</ul>
				</aside>
			</div>
		</section>
	)
}
