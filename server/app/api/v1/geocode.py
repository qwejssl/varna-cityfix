from fastapi import APIRouter, HTTPException, Query
import httpx

from app.schemas.geocode import GeocodeResponse

router = APIRouter(prefix="/geocode", tags=["Geocoding"])


@router.get("", response_model=GeocodeResponse)
async def geocode_address(address: str = Query(..., min_length=3)):
    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": f"{address}, Varna, Bulgaria",
        "format": "jsonv2",
        "limit": 1,
        "addressdetails": 1,
    }

    headers = {
        "User-Agent": "VarnaCityFix/1.0 (student diploma project)",
        "Accept-Language": "en",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()

        if not data:
            raise HTTPException(status_code=404, detail="Address not found")

        result = data[0]

        return GeocodeResponse(
            lat=float(result["lat"]),
            lon=float(result["lon"]),
            display_name=result["display_name"],
        )

    except httpx.RequestError:
        raise HTTPException(status_code=502, detail="Geocoding service unavailable")
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=502, detail="Geocoding request failed")