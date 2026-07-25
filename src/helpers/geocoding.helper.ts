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

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    { headers: { Accept: 'application/json' } },
  );

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
