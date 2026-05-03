# Varna CityFix Client

Frontend for Varna CityFix — a civic issue reporting platform for Varna, Bulgaria.

## Stack

- React
- TypeScript
- Vite
- React Router
- Leaflet / React Leaflet

## Features

- Public home page and city map
- User registration and login
- Protected report creation and editing
- Personal reports page
- Admin reports dashboard
- Report details pages
- Image upload support through the backend API

## Environment variables

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

## Install and run

```bash
npm install
npm run dev
```

The client runs by default on:

```txt
http://127.0.0.1:5173
```

or

```txt
http://localhost:5173
```

## Expected backend

The frontend expects the backend API to be running locally on:

```txt
http://127.0.0.1:8000
```

## Main routes

- `/` — Home page
- `/city-map` — City map with reports
- `/login` — Login
- `/register` — Registration
- `/report/new` — Create report
- `/my-reports` — Current user reports
- `/admin/reports` — Admin reports list

## Smoke check

After startup, verify:

1. Home page opens.
2. City map loads.
3. Registration works.
4. Login works.
5. Reports list loads.
6. New report creation works.
7. Image upload works.
8. Admin routes work for admin users.

## Notes

- The project uses `VITE_API_URL` for API requests.
- Make sure the backend CORS configuration allows the frontend origin.
