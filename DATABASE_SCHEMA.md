# Schema Database Supabase

## Tabella: trips

```sql
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  country TEXT,
  city TEXT,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  date DATE NOT NULL,
  images TEXT[] DEFAULT '{}',
  youtube_links TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita RLS (Row Level Security)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Politica per permettere letture pubbliche
CREATE POLICY "Allow public read access" ON trips
  FOR SELECT USING (true);

-- Politica per permettere inserimenti solo agli utenti autenticati
CREATE POLICY "Allow authenticated insert" ON trips
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politica per permettere aggiornamenti solo agli utenti autenticati
CREATE POLICY "Allow authenticated update" ON trips
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Politica per permettere eliminazioni solo agli utenti autenticati
CREATE POLICY "Allow authenticated delete" ON trips
  FOR DELETE USING (auth.uid() IS NOT NULL);
```

## Aggiunta Colonne Country e City (se la tabella esiste già)

Se la tabella `trips` esiste già, esegui questo SQL per aggiungere le nuove colonne:

```sql
ALTER TABLE trips ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS city TEXT;
```

## Variabili d'Ambiente Richieste

Aggiungi le seguenti variabili al file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua_chiave_anon_supabase
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tua_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tua_cloudinary_upload_preset
```

## Istruzioni per Cloudinary

1. Crea un account su [Cloudinary](https://cloudinary.com/)
2. Crea un upload preset non firmato (unsigned) per permettere l'upload dal client
3. Copia il cloud name e l'upload preset nelle variabili d'ambiente
