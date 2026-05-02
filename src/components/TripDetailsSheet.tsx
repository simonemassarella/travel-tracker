'use client';

import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Trip } from '@/types/trip';
import { Calendar, MapPin, Play, X } from 'lucide-react';

interface TripDetailsSheetProps {
  trip: Trip | null;
  open: boolean;
  onClose: () => void;
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function VideoPlayer({ youtubeLinks }: { youtubeLinks: string[] }) {
  if (!youtubeLinks || youtubeLinks.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Play className="w-5 h-5 text-red-500" />
        Video
      </h3>
      <div className="space-y-4">
        {youtubeLinks.map((link, index) => {
          const videoId = extractYouTubeId(link);
          if (!videoId) return null;
          return (
            <div key={index} className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TripDetailsSheet({ trip, open, onClose }: TripDetailsSheetProps) {
  if (!trip) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[600px] overflow-y-auto bg-black/80 backdrop-blur-xl border-white/10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold text-white">
                {trip.title}
              </SheetTitle>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(trip.date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {trip.lat.toFixed(4)}, {trip.lng.toFixed(4)}
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">{trip.description}</p>

            {trip.images && trip.images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Foto</h3>
                <div className="grid grid-cols-2 gap-3">
                  {trip.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden rounded-xl border-0">
                        <div className="relative aspect-square">
                          <img
                            src={image}
                            alt={`${trip.title} - foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <VideoPlayer youtubeLinks={trip.youtube_links} />
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
