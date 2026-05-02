import Link from 'next/link';
import { MapPin, Compass } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-gray-900" />
            <h1 className="text-2xl font-bold text-gray-900">Travel Tracker</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            I tuoi viaggi,<br />
            <span className="text-gray-500">tutto in un posto</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Esplora la mappa interattiva con tutti i tuoi viaggi. Clicca sui pin per vedere foto, video e ricordi di ogni avventura.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Vai alla Mappa
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mappa Interattiva</h3>
              <p className="text-gray-600">Visualizza tutti i tuoi viaggi su una mappa interattiva con pin personalizzati</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Galleria Foto</h3>
              <p className="text-gray-600">Ogni viaggio ha la sua galleria con tutte le foto caricate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Video YouTube</h3>
              <p className="text-gray-600">Aggiungi video YouTube a ogni viaggio per rivivere i momenti</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2026 Travel Tracker. Creato con ❤️</p>
        </div>
      </footer>
    </div>
  );
}
