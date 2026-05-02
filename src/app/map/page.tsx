'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { Trip } from '@/types/trip';
import { supabase } from '@/lib/supabase';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-white text-xl">Caricamento mappa...</div>
    </div>
  ),
});

export default function MapPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    async function fetchTrips() {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized. Please check environment variables.');
          setConfigError(true);
          setLoading(false);
          return;
        }

        console.log('Tentativo di connessione a Supabase...');
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error('Errore nel caricamento dei viaggi:', JSON.stringify(error, null, 2));
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error.details);
        } else {
          console.log('Viaggi caricati con successo:', data);
          setTrips(data || []);
        }
      } catch (error) {
        console.error('Errore generico:', JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-2xl w-full p-8 rounded-2xl glass border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-4">⚠️ Configurazione Richiesta</h1>
          <p className="text-gray-300 mb-6">
            L'app richiede le variabili d'ambiente per funzionare. Crea il file <code className="bg-white/10 px-2 py-1 rounded">.env.local</code> nella cartella del progetto con:
          </p>
          <pre className="bg-black/50 p-4 rounded-lg text-green-400 text-sm mb-6 overflow-x-auto">
            {`NEXT_PUBLIC_SUPABASE_URL=tua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua_chiave_anon_supabase
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tua_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tua_cloudinary_upload_preset`}
          </pre>
          <p className="text-gray-400 text-sm mb-4">
            Dopo aver creato il file, riavvia il server con <code className="bg-white/10 px-2 py-1 rounded">npm run dev</code>
          </p>
          <p className="text-gray-400 text-sm">
            Per maggiori dettagli, consulta il file <code className="bg-white/10 px-2 py-1 rounded">README.md</code> e <code className="bg-white/10 px-2 py-1 rounded">DATABASE_SCHEMA.md</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-white" />
            <span className="text-white font-bold">Travel Tracker</span>
          </div>
        </div>
      </header>

      <div className="pt-20 h-full">
        <Map trips={trips} />
      </div>
    </div>
  );
}
