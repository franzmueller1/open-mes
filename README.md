# Müller MES - Manufacturing Execution System

🚀 **[Live Demo](https://mueller-mes.vercel.app)** | Keine Anmeldung erforderlich!

Ein modernes Manufacturing Execution System (MES) mit Supabase-Integration für effiziente Produktionsverwaltung.

## Features

- **Dashboard** - Echtzeit-Übersicht über Produktion, Maschinen und Qualitätskontrolle
- **Produktverwaltung** - Verwaltung von Produktmodellen und Komponenten
- **Maschinenverwaltung** - Überwachung von Maschinenstatus und Wartung
- **Produktionsmanagement** - Planung und Verfolgung von Produktionsaufträgen
- **Qualitätskontrolle** - Durchführung und Dokumentation von Qualitätsprüfungen
- **Mitarbeiterverwaltung** - Verwaltung von Benutzern und Rollen
- **Materialverwaltung** - Bestandskontrolle und Verbrauchsverfolgung
- **Reporting** - Export von Berichten in verschiedenen Formaten
- **Demo-Modus** - Testen Sie das System ohne Registrierung

## Technologie-Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Realtime, Auth)
- **Charts**: Chart.js, Recharts
- **State Management**: Zustand, React Query
- **UI Components**: Lucide Icons, Framer Motion

## Voraussetzungen

- Node.js 18+ und npm/yarn
- Supabase-Account (kostenlos unter [supabase.com](https://supabase.com))

## Installation

### 1. Repository klonen

```bash
git clone https://github.com/franzmueller1/mueller-mes.git
cd mueller-mes
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Supabase-Projekt einrichten

1. Erstellen Sie ein neues Projekt auf [supabase.com](https://supabase.com)
2. Navigieren Sie zu **Settings → API** und kopieren Sie:
   - Project URL
   - Anon/Public Key

### 4. Umgebungsvariablen konfigurieren

Kopieren Sie `.env.example` zu `.env`:

```bash
cp .env.example .env
```

Bearbeiten Sie `.env` und fügen Sie Ihre Supabase-Credentials ein:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Datenbank einrichten

#### Option A: Über Supabase Dashboard

1. Öffnen Sie den SQL Editor in Ihrem Supabase-Projekt
2. Führen Sie die SQL-Dateien in dieser Reihenfolge aus:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_demo_data.sql`

#### Option B: Über Supabase CLI

```bash
# Supabase CLI installieren
npm install -g supabase

# Mit Projekt verbinden
supabase link --project-ref your-project-ref

# Migrationen ausführen
supabase db push
```

### 6. Demo-Benutzer erstellen

Der Demo-Benutzer wird automatisch beim ersten Demo-Login erstellt:
- Email: `demo@mes-system.com`
- Passwort: `demo123456`

### 7. Anwendung starten

```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) verfügbar.

## Verwendung

### Anmeldung

1. **Neues Konto erstellen**: Klicken Sie auf "Jetzt registrieren"
2. **Mit bestehendem Konto anmelden**: Verwenden Sie Ihre Credentials
3. **Demo-Modus**: Klicken Sie auf "Demo-Zugang testen"

### Benutzerrollen

- **Admin**: Vollzugriff auf alle Funktionen
- **Manager**: Verwaltung von Produktion und Ressourcen
- **Operator**: Durchführung von Produktionen und Qualitätsprüfungen
- **Viewer**: Nur Lesezugriff
- **Demo**: Eingeschränkter Zugriff (keine Änderungen möglich)

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mes-system)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/mes-system)

### Manuelles Deployment

```bash
# Build erstellen
npm run build

# Preview
npm run preview
```

Der `dist` Ordner kann auf jedem statischen Hosting-Service deployed werden.

## Entwicklung

### Projektstruktur

```
mes-system/
├── src/
│   ├── components/     # Wiederverwendbare Komponenten
│   ├── contexts/       # React Context Provider
│   ├── hooks/          # Custom React Hooks
│   ├── lib/           # Bibliotheken und Utilities
│   ├── pages/         # Seiten-Komponenten
│   ├── styles/        # Globale Styles
│   └── utils/         # Hilfsfunktionen
├── supabase/
│   └── migrations/    # Datenbank-Migrationen
└── public/           # Statische Assets
```

### Verfügbare Scripts

```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Production Build erstellen
npm run preview      # Production Build preview
npm run lint         # Code linting
npm run test         # Tests ausführen
```

## API-Dokumentation

Die Anwendung nutzt Supabase's automatisch generierte REST API. Die API-Dokumentation ist verfügbar unter:
`https://your-project.supabase.co/rest/v1/`

## Sicherheit

- Row Level Security (RLS) ist für alle Tabellen aktiviert
- Demo-Benutzer haben nur Lesezugriff
- Authentifizierung über Supabase Auth
- Umgebungsvariablen für sensitive Daten

## Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die [Dokumentation](https://github.com/yourusername/mes-system/wiki)
2. Erstellen Sie ein [Issue](https://github.com/yourusername/mes-system/issues)
3. Kontaktieren Sie uns unter support@mes-system.com

## Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details

## Mitwirkende

Beiträge sind willkommen! Pull Requests und Issues sind erwünscht.

---

Müller MES - Professionelle Produktionsverwaltung