# Supabase Datenbank Setup

## Automatisches Setup (Empfohlen)

### Option 1: Alles auf einmal ausführen

1. Öffnen Sie Ihr Supabase-Projekt: https://supabase.com/dashboard/project/fafbfyixmwnqmzqpfcgt

2. Gehen Sie zu **SQL Editor** (links in der Sidebar)

3. Klicken Sie auf **New query**

4. Kopieren Sie den GESAMTEN Inhalt der folgenden Dateien IN DIESER REIHENFOLGE in den Editor:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql` 
   - `003_demo_data.sql`

5. Klicken Sie auf **Run** (oder drücken Sie Ctrl+Enter)

### Option 2: Schritt für Schritt

Wenn Sie Fehler erhalten, führen Sie die Dateien einzeln aus:

#### Schritt 1: Schema erstellen
1. SQL Editor öffnen
2. Inhalt von `001_initial_schema.sql` einfügen
3. Run klicken
4. Warten bis "Success" angezeigt wird

#### Schritt 2: RLS Policies
1. New query erstellen
2. Inhalt von `002_rls_policies.sql` einfügen
3. Run klicken
4. Warten bis "Success" angezeigt wird

#### Schritt 3: Demo-Daten
1. New query erstellen
2. Inhalt von `003_demo_data.sql` einfügen
3. Run klicken
4. Warten bis "Success" angezeigt wird

## Überprüfung

Nach dem Setup sollten Sie folgende Tabellen sehen unter **Table Editor**:
- ✅ products (4 Einträge)
- ✅ machines (5 Einträge)
- ✅ employees (5 Einträge)
- ✅ materials (5 Einträge)
- ✅ components (4 Einträge)
- ✅ productions (4 Einträge)
- ✅ quality_checks (3 Einträge)
- ✅ material_consumption (3 Einträge)
- ✅ maintenance_records (2 Einträge)
- ✅ error_reports (2 Einträge)

## Demo-Benutzer erstellen

Der Demo-Benutzer wird automatisch beim ersten Klick auf "Demo-Zugang testen" erstellt.

Falls Sie ihn manuell erstellen möchten:

1. Gehen Sie zu **Authentication** → **Users**
2. Klicken Sie auf **Add user** → **Create new user**
3. Eingaben:
   - Email: `demo@mes-system.com`
   - Password: `demo123456`
   - Auto Confirm User: ✅ aktivieren
4. **Create user** klicken

## Troubleshooting

### Fehler: "relation already exists"
- Die Tabellen existieren bereits
- Lösung: Löschen Sie zuerst alle Tabellen oder verwenden Sie ein neues Projekt

### Fehler: "permission denied"
- RLS ist bereits aktiviert
- Lösung: Fahren Sie mit dem nächsten Schritt fort

### Fehler: "duplicate key value"
- Demo-Daten existieren bereits
- Lösung: Das ist OK, die App funktioniert trotzdem

## Testen

1. Öffnen Sie die App: http://localhost:3001
2. Klicken Sie auf "Demo-Zugang testen"
3. Sie sollten das Dashboard mit Daten sehen!

## Support

Bei Problemen:
1. Überprüfen Sie die Browser-Konsole (F12)
2. Überprüfen Sie die Supabase-Logs unter **Logs** → **API logs**
3. Stellen Sie sicher, dass die .env Datei korrekt ist