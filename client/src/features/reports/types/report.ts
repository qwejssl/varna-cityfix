export type ReportStatus =
	| 'NEW'
	| 'UNDER_REVIEW'
	| 'IN_PROGRESS'
	| 'RESOLVED'
	| 'REJECTED'

export type ReportCategory =
	| 'ROAD'
	| 'PAVEMENT'
	| 'STREETLIGHT'
	| 'BUILDING'
	| 'WASTE'
	| 'PARK'
	| 'OTHER'

export type VarnaDistrict =
	| 'ASPARUHOVO'
	| 'PRIMORSKI'
	| 'ODESSOS'
	| 'MLADOST'
	| 'VLADISLAV_VARNENCHIK'

export type Report = {
	id: number
	title: string
	description: string
	category: ReportCategory
	district: VarnaDistrict
	address: string
	latitude: number
	longitude: number
	image_url?: string | null
	admin_note?: string | null
	created_by_id: number
	status: ReportStatus
	created_at: string
	updated_at: string
}

export type CreateReportPayload = {
	title: string
	description: string
	category: ReportCategory
	district: VarnaDistrict
	address: string
	latitude: number
	longitude: number
	image_url?: string | null
}

export type UpdateReportPayload = Partial<CreateReportPayload> & {
	admin_note?: string | null
	status?: ReportStatus
}
