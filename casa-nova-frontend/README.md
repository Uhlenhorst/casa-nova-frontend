# Casa Nova Frontend

Statische Website (HTML/CSS/JS) für Casa Nova Ristorante. Holt Mittagstisch
und Spezialkarte live vom Backend, alles andere ist fertig eingebautes HTML.

## Vor dem Hochladen: Backend-Adresse eintragen

1. Öffne `assets/js/config.js`.
2. Trag dort die Render-URL deines Backends ein (siehe README im
   `casa-nova-backend`-Repo), z. B.:
   ```js
   const API_BASE = "https://casa-nova-backend.onrender.com";
   ```

## Einrichtung auf Render

1. Auf [github.com](https://github.com) ein neues, leeres Repository
   `casa-nova-frontend` anlegen und alle Dateien aus diesem Ordner hochladen
   (Add file → Upload files – bitte die Ordnerstruktur `assets/` und
   `admin/` mit hochladen, nicht nur einzelne Dateien).
2. Auf [render.com](https://render.com) → **New** → **Static Site**.
3. Das GitHub-Repo `casa-nova-frontend` verbinden.
4. Einstellungen:
   - **Build Command:** leer lassen
   - **Publish Directory:** `.` (ein Punkt, steht für den Hauptordner)
5. Auf **Create Static Site** klicken.
6. Nach dem Deploy testen: die von Render vergebene URL öffnen, die Seite
   sollte erscheinen.

## Eigene Domain (casa-nova-hamburg.de) verbinden

Genau wie bei ig-uhlenhorst.de:

1. Im Render Static-Site-Projekt unter **Settings → Custom Domains** die
   Domain `casa-nova-hamburg.de` (und `www.casa-nova-hamburg.de`)
   hinzufügen. Render zeigt dir dann die nötigen DNS-Einträge an (meist ein
   CNAME).
2. Bei [IONOS](https://ionos.de) einloggen → Domains & SSL →
   `casa-nova-hamburg.de` → DNS-Einstellungen → die von Render angezeigten
   Einträge eintragen.
3. Das kann bis zu 24 Stunden dauern, meistens geht's aber deutlich
   schneller.

## Backoffice

Erreichbar unter `/admin/login.html` (also z. B.
`https://casa-nova-hamburg.de/admin/login.html`).

- Benutzername: `Milla`
- Passwort: wie besprochen

Dort lassen sich Mittagstisch und Spezialkarte (S1–S10) direkt im Browser
bearbeiten – kein Programmieren nötig.

## Struktur

```
index.html                 Home
speisen-getraenke.html     Links zu den PDF-Karten
mittagstisch.html          Live-Mittagstisch (aus dem Backend)
spezialkarte.html          Live-Spezialkarte S1–S10 (aus dem Backend)
kontakt.html                Adresse, Öffnungszeiten, Social Links
impressum.html
datenschutz.html
admin/login.html           Backoffice-Login
admin/dashboard.html       Backoffice-Bearbeitung
assets/css/style.css       Gesamtes Design
assets/js/                 Config, Live-Daten laden, Backoffice-Logik
assets/images/             Fotos + Logo
assets/pdf/                Speisekarte & Getränkekarte
```
