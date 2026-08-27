interface ReverseGeocodingAddress {
  road?: string;
  pedestrian?: string;
  footway?: string;
  path?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  town?: string;
  city?: string;
  municipality?: string;
}

interface ReverseGeocodingResponse {
  name?: string;
  display_name?: string;
  address?: ReverseGeocodingAddress;
}

interface PlaceSearchResponseItem {
  display_name?: string;
  lat?: string;
  lon?: string;
}

export interface PlaceSearchResult {
  label: string;
  lat: number;
  lng: number;
}

/** Busca lugares por nombre para poder seleccionarlos en el mapa. */
export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<PlaceSearchResult[]> {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 3) return [];

  const params = new URLSearchParams({
    format: 'jsonv2',
    q: normalizedQuery,
    limit: '6',
    addressdetails: '1',
    countrycodes: 'pe',
    'accept-language': 'es',
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) return [];

  const data = (await response.json()) as PlaceSearchResponseItem[];

  return data.flatMap((item) => {
    const lat = Number(item.lat);
    const lng = Number(item.lon);
    const label = item.display_name?.trim();

    return label && Number.isFinite(lat) && Number.isFinite(lng) ? [{ label, lat, lng }] : [];
  });
}

/** Obtiene un nombre legible para una coordenada usando geocodificación inversa. */
export async function reverseGeocodePlaceName(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: latitude.toFixed(6),
    lon: longitude.toFixed(6),
    zoom: '18',
    addressdetails: '1',
    'accept-language': 'es',
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as ReverseGeocodingResponse;
  const address = data.address;
  const street = address?.road || address?.pedestrian || address?.footway || address?.path;
  const locality =
    address?.suburb ||
    address?.neighbourhood ||
    address?.city_district ||
    address?.town ||
    address?.city ||
    address?.municipality;

  const readableAddress = [street, address?.house_number, locality]
    .filter(Boolean)
    .join(', ')
    .trim();

  return data.name?.trim() || readableAddress || data.display_name?.trim() || null;
}
