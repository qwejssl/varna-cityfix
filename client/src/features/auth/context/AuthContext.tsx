import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react'

export type UserRole = 'CITIZEN' | 'ADMIN'

export type AuthUser = {
	id: number
	fullName: string
	email: string
	role: UserRole
}

type LoginInput = {
	user: AuthUser
	accessToken: string
}

type AuthContextType = {
	user: AuthUser | null
	accessToken: string | null
	isAuthenticated: boolean
	login: (payload: LoginInput) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_USER_STORAGE_KEY = 'varna-cityfix-auth-user'
const AUTH_TOKEN_STORAGE_KEY = 'varna-cityfix-access-token'

function getInitialUser(): AuthUser | null {
	try {
		const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)
		return storedUser ? (JSON.parse(storedUser) as AuthUser) : null
	} catch {
		localStorage.removeItem(AUTH_USER_STORAGE_KEY)
		return null
	}
}

function getInitialToken(): string | null {
	try {
		return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
	} catch {
		localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
		return null
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(getInitialUser)
	const [accessToken, setAccessToken] = useState<string | null>(getInitialToken)

	const login = ({ user, accessToken }: LoginInput) => {
		setUser(user)
		setAccessToken(accessToken)
		localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
		localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken)
	}

	const logout = () => {
		setUser(null)
		setAccessToken(null)
		localStorage.removeItem(AUTH_USER_STORAGE_KEY)
		localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
	}

	const value = useMemo(
		() => ({
			user,
			accessToken,
			isAuthenticated: !!user && !!accessToken,
			login,
			logout,
		}),
		[user, accessToken],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used inside AuthProvider')
	}

	return context
}
