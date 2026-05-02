export interface GeocodingResult {
  lat: number;
  lng: number;
  display_name?: string;
}

export async function geocodeLocation(country: string, city: string): Promise<GeocodingResult | null> {
  if (!country && !city) {
    return null;
  }

  try {
    const query = [city, country].filter(Boolean).join(', ');
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TravelTracker/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        display_name: result.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error('Errore durante geocoding:', error);
    return null;
  }
}
