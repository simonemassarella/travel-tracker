# Travel Tracker - I Nostri Viaggi

App moderna per tracciare i viaggi fatti insieme, costruita con Next.js 15, Tailwind CSS, Supabase, Cloudinary e YouTube.

## Stack Tecnologico

- **Next.js 15** (App Router) - Framework React
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componenti UI
- **Supabase** - Database & Autenticazione
- **Cloudinary** - Hosting immagini
- **YouTube** - Video embedding
- **react-leaflet** - Mappa interattiva
- **Framer Motion** - Animazioni
- **lucide-react** - Icone

## Configurazione

### 1. Variabili d'Ambiente

Crea un file `.env.local` nella radice del progetto con le seguenti variabili:

```env
NEXT_PUBLIC_SUPABASE_URL=tua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua_chiave_anon_supabase
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tua_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tua_cloudinary_upload_preset
```

### 2. Database Supabase

Esegui lo SQL seguente nell'editor SQL di Supabase per creare la tabella `trips`:

```sql
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  date DATE NOT NULL,
  images TEXT[] DEFAULT '{}',
  youtube_links TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON trips
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON trips
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated update" ON trips
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated delete" ON trips
  FOR DELETE USING (auth.uid() IS NOT NULL);
```

### 3. Configurazione Cloudinary

1. Crea un account su [Cloudinary](https://cloudinary.com/)
2. Crea un upload preset non firmato (unsigned)
3. Copia il cloud name e l'upload preset nelle variabili d'ambiente

### 4. Autenticazione Supabase

1. Vai su Authentication > Providers nella dashboard Supabase
2. Abilita Email provider
3. Crea un utente admin che userai per accedere alla dashboard

## Avvio del Progetto

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) per vedere l'app.

## Funzionalità

### Pagina Principale
- Mappa interattiva a schermo intero con tema scuro (CartoDB Dark Matter)
- Pin personalizzati per ogni viaggio
- Click su un pin apre un Sheet laterale con i dettagli
- Galleria foto ottimizzata con next/image
- Video YouTube integrati

### Area Admin (`/admin`)
- Login con Supabase Auth
- Dashboard per aggiungere nuovi viaggi
- Click sulla mappa per catturare automaticamente latitudine e longitudine
- Upload foto su Cloudinary
- Aggiunta multipla link YouTube

## Struttura del Progetto

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx          # Login admin
│   │   └── dashboard/
│   │       └── page.tsx      # Dashboard admin
│   ├── globals.css           # Stili globali
│   ├── layout.tsx            # Layout principale
│   └── page.tsx              # Home page con mappa
├── components/
│   ├── Map.tsx               # Componente mappa
│   ├── TripDetailsSheet.tsx  # Sheet dettagli viaggio
│   └── ui/                   # Componenti shadcn/ui
├── lib/
│   ├── supabase.ts           # Client Supabase
│   └── utils.ts              # Utility functions
└── types/
    └── trip.ts               # Tipi TypeScript
```

## Deploy su Vercel

1. Push del codice su GitHub
2. Importa il progetto su Vercel
3. Aggiungi le variabili d'ambiente nelle impostazioni Vercel
4. Deploy automatico
