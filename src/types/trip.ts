export interface Trip {
  id: string;
  title: string;
  description: string;
  country?: string;
  city?: string;
  lat: number;
  lng: number;
  date: string;
  images: string[];
  youtube_links: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TripFormData {
  title: string;
  description: string;
  country?: string;
  city?: string;
  lat: number;
  lng: number;
  date: string;
  images: string[];
  youtube_links: string[];
}
