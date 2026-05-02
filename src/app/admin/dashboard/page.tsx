'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { LogOut, MapPin, Upload, Plus, X } from 'lucide-react';
import { extractGPSFromImage } from '@/lib/exif';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-black/50 rounded-lg">
      <div className="text-white">Caricamento mappa...</div>
    </div>
  ),
});

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lat: 0,
    lng: 0,
    date: '',
    images: [] as string[],
    youtube_links: [] as string[],
  });
  const [youtubeInput, setYoutubeInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkAuth() {
      if (!supabase) {
        router.push('/admin');
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin');
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin');
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData({ ...formData, lat, lng });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setMessage('Errore: Configurazione Cloudinary mancante');
      return;
    }

    // Extract GPS from first image if coordinates are not set
    let gpsData = null;
    if (files.length > 0 && formData.lat === 0 && formData.lng === 0) {
      try {
        console.log('Tentativo estrazione GPS dalla prima foto');
        gpsData = await extractGPSFromImage(files[0]);
        console.log('GPS Data estratto:', gpsData);
        if (gpsData) {
          setMessage(`Coordinate GPS estratte dalla foto: ${gpsData.lat.toFixed(6)}, ${gpsData.lng.toFixed(6)}`);
        } else {
          console.log('Nessun dato GPS trovato nella foto');
        }
      } catch (error) {
        console.error('Errore durante estrazione GPS:', error);
      }
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls],
        lat: gpsData ? gpsData.lat : prev.lat,
        lng: gpsData ? gpsData.lng : prev.lng
      }));
    } catch (error) {
      setMessage('Errore durante l\'upload delle immagini');
    }
  };

  const addYoutubeLink = () => {
    if (youtubeInput.trim()) {
      setFormData({
        ...formData,
        youtube_links: [...formData.youtube_links, youtubeInput.trim()],
      });
      setYoutubeInput('');
    }
  };

  const removeYoutubeLink = (index: number) => {
    setFormData({
      ...formData,
      youtube_links: formData.youtube_links.filter((_, i) => i !== index),
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (!supabase) {
        setMessage('Errore: Connessione Supabase non disponibile');
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from('trips').insert([formData]);

      if (error) throw error;

      setMessage('Viaggio aggiunto con successo!');
      setFormData({
        title: '',
        description: '',
        lat: 0,
        lng: 0,
        date: '',
        images: [],
        youtube_links: [],
      });
    } catch (error: any) {
      setMessage(error.message || 'Errore durante l\'inserimento');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard Admin</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.includes('successo')
                ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                : 'bg-red-500/20 border border-red-500/50 text-red-200'
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 glass">
            <h2 className="text-xl font-semibold text-white mb-4">Aggiungi Nuovo Viaggio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Titolo</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-black/50 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="bg-black/50 border-white/20 text-white min-h-32"
                />
              </div>

              <div>
                <Label htmlFor="date" className="text-white">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="bg-black/50 border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat" className="text-white">Latitudine</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.lat || ''}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    required
                    className="bg-black/50 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-white">Longitudine</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.lng || ''}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    required
                    className="bg-black/50 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="youtube" className="text-white">Link YouTube</Label>
                <div className="flex gap-2">
                  <Input
                    id="youtube"
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-black/50 border-white/20 text-white"
                  />
                  <Button
                    type="button"
                    onClick={addYoutubeLink}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.youtube_links.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.youtube_links.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-black/30 p-2 rounded text-sm text-white"
                      >
                        <span className="truncate flex-1">{link}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeYoutubeLink(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="images" className="text-white">Foto</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-black/50 border-white/20 text-white"
                  />
                  <Upload className="w-5 h-5 text-white" />
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                {submitting ? 'Caricamento...' : 'Aggiungi Viaggio'}
              </Button>
            </form>
          </Card>

          <Card className="p-6 glass">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Seleziona Posizione
            </h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <Map
                trips={[]}
                onMapClick={handleMapClick}
                center={formData.lat && formData.lng ? [formData.lat, formData.lng] : undefined}
                zoom={formData.lat && formData.lng ? 13 : 6}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Clicca sulla mappa per impostare latitudine e longitudine
            </p>
            {formData.lat !== 0 && formData.lng !== 0 && (
              <div className="mt-2 p-2 bg-green-500/20 border border-green-500/50 rounded text-green-200 text-sm">
                Posizione selezionata: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
