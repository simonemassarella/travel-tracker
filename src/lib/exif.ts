import exifr from 'exifr';

export interface GPSData {
  lat: number;
  lng: number;
}

export async function extractGPSFromImage(file: File): Promise<GPSData | null> {
  try {
    console.log('Tentativo estrazione GPS con exifr...');
    
    const output = await exifr.gps(file);
    
    console.log('EXIF GPS Data:', output);
    
    if (output && output.latitude !== undefined && output.longitude !== undefined) {
      console.log('Coordinate GPS trovate:', output.latitude, output.longitude);
      return { lat: output.latitude, lng: output.longitude };
    } else {
      console.log('Nessun dato GPS trovato');
      return null;
    }
  } catch (error) {
    console.error('Errore durante estrazione GPS con exifr:', error);
    return null;
  }
}
