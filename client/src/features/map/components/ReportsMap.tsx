import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import type { Report } from '../../reports/types/report'

const varnaCenter: [number, number] = [43.2141, 27.9147]

type ReportsMapProps = {
	reports: Report[]
}

const reportMarkerIcon = L.divIcon({
	className: 'custom-report-marker',
	html: `<div class="custom-report-marker__pin"></div>`,
	iconSize: [22, 22],
	iconAnchor: [11, 22],
	popupAnchor: [0, -20],
})

function getShiftedPosition(
	latitude: number,
	longitude: number,
	index: number,
): [number, number] {
	const offsetStep = 0.00018
	const angle = (index % 8) * (Math.PI / 4)
	const radius = Math.floor(index / 8) + 1

	const shiftedLat = latitude + Math.sin(angle) * offsetStep * radius
	const shiftedLng = longitude + Math.cos(angle) * offsetStep * radius

	return [shiftedLat, shiftedLng]
}

export default function ReportsMap({ reports }: ReportsMapProps) {
	const groupedByCoordinates = new Map<string, number>()

	return (
		<div className='map-wrapper'>
			<MapContainer
				center={varnaCenter}
				zoom={13}
				scrollWheelZoom={true}
				className='leaflet-map'
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>

				{reports.map(report => {
					const coordinateKey = `${report.latitude}-${report.longitude}`
					const duplicateIndex = groupedByCoordinates.get(coordinateKey) ?? 0
					groupedByCoordinates.set(coordinateKey, duplicateIndex + 1)

					const position =
						duplicateIndex === 0
							? ([report.latitude, report.longitude] as [number, number])
							: getShiftedPosition(
									report.latitude,
									report.longitude,
									duplicateIndex,
								)

					return (
						<Marker key={report.id} position={position} icon={reportMarkerIcon}>
							<Popup>
								<div className='map-popup'>
									<h3>{report.title}</h3>
									<p>{report.description}</p>
									<p>
										<strong>Status:</strong> {report.status}
									</p>
									<p>
										<strong>Category:</strong> {report.category}
									</p>
									<p>
										<strong>District:</strong> {report.district}
									</p>
									<p>
										<strong>Address:</strong> {report.address}
									</p>
								</div>
							</Popup>
						</Marker>
					)
				})}
			</MapContainer>
		</div>
	)
}
