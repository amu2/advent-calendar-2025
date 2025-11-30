# 📖 Wartungs-Dokumentation: Advent Calendar 2025

## 🎯 Übersicht

Diese Dokumentation erklärt, wie Sie Inhalte, Texte und PDFs Ihres Adventskalenders ändern können.

---

## 📁 Wichtige Dateien und ihre Funktion

### 1. **Content-Dateien (Text & Daten)**

#### `nextjs_space/public/advent_data.json` ⭐ **HAUPTDATEI FÜR INHALTE**

**Zweck:** Enthält ALLE Texte, Titel, Untertitel und Metadaten für alle 27 Tage

**Struktur:**
```json
{
  "metadata": {
    "title": "Advent Calendar 2025",
    "subtitle": "An exceptional algebraic walk through particle physics",
    "author": "Andreas Müller, Kempten University of Applied Sciences",
    "description": "A theoretical physics advent calendar exploring octonions and exceptional algebras"
  },
  "colorScheme": {
    "primary": "#B3001B",
    "secondary": "#FFD700",
    "accent": "#006633"
  },
  "days": [
    {
      "day": 0,
      "date": "2025-11-30",
      "isSpecial": true,
      "title": "Welcome",
      "subtitle": "",
      "content": "Text mit **Markdown** und $\\LaTeX$ Formeln",
      "keyInsight": "",
      "closing": "Abschlusssatz",
      "references": [
        "Autor (Jahr). Titel. Verlag."
      ]
    },
    ...
  ]
}
```

**So ändern Sie Texte:**

1. **Titel ändern:**
   ```json
   "title": "Neuer Titel für Tag 1"
   ```

2. **Untertitel hinzufügen:**
   ```json
   "subtitle": "Ein erklärender Untertitel"
   ```

3. **Haupttext ändern:**
   ```json
   "content": "### Überschrift\n\nIhr Text hier.\n\n**Fett** und *kursiv*.\n\nMath: $E = mc^2$"
   ```
   - Verwenden Sie `\n` für Zeilenumbrüche
   - Verwenden Sie `**text**` für Fettdruck
   - Verwenden Sie `*text*` für Kursivschrift
   - Verwenden Sie `### ` für Überschriften
   - Verwenden Sie `$...$` für Inline-Mathe
   - Verwenden Sie `$$...$$` für Display-Mathe
   - **WICHTIG:** Backslashes müssen doppelt sein: `\\` statt `\`

4. **Key Insights hinzufügen:**
   ```json
   "keyInsight": "Die zentrale Erkenntnis dieses Kapitels"
   ```

5. **Abschlusssatz ändern:**
   ```json
   "closing": "Ein inspirierender Schlusssatz"
   ```

6. **Literaturverweise ändern:**
   ```json
   "references": [
     "Baez, J. C. (2002). The octonions. Bull. Amer. Math. Soc. 39, 145–205.",
     "Günaydin, M., Sierra, G., & Townsend, P. K. (1983). Exceptional supergravity theories."
   ]
   ```

**Spezielle Tage markieren:**
```json
"isSpecial": true  // Macht den Tag golden statt rot
```

**Tage sperren/entsperren:**
```json
"isLocked": true   // Tag ist gesperrt bis zum Datum
"isLocked": false  // Tag ist sofort verfügbar
```

---

### 2. **PDF-Dateien**

#### `nextjs_space/public/pdfs/` ⭐ **ALLE PDF-DATEIEN**

**Namenskonvention (STRIKT):**
```
advent00.pdf  → Tag 30 (November 30)
advent01.pdf  → Tag 1 (Dezember 1)
advent02.pdf  → Tag 2 (Dezember 2)
...
advent24.pdf  → Tag 24 (Dezember 24)
advent25.pdf  → Tag 25 (Dezember 25)
advent31.pdf  → Tag 31 (Dezember 31)
```

**So tauschen Sie PDFs aus:**

1. **Einzelnes PDF ersetzen:**
   ```bash
   # Ersetzen Sie einfach die Datei
   cp ~/meine_neuen_pdfs/advent01.pdf nextjs_space/public/pdfs/advent01.pdf
   ```

2. **Alle PDFs auf einmal ersetzen:**
   ```bash
   # Löschen Sie alte PDFs
   rm nextjs_space/public/pdfs/*.pdf
   
   # Kopieren Sie neue PDFs
   cp ~/meine_neuen_pdfs/*.pdf nextjs_space/public/pdfs/
   ```

3. **PDFs aus LaTeX neu kompilieren:**
   ```bash
   cd working/
   
   # Einzelne Datei kompilieren
   pdflatex -interaction=nonstopmode advent01.tex
   
   # Alle kompilieren (Bash Loop)
   for tex in advent*.tex; do
     pdflatex -interaction=nonstopmode "$tex"
   done
   
   # PDFs ins richtige Verzeichnis kopieren
   cp advent*.pdf ../nextjs_space/public/pdfs/
   ```

**WICHTIG:**
- Dateinamen MÜSSEN exakt `adventXX.pdf` sein (zweistellig!)
- Keine Leerzeichen oder Großbuchstaben
- PDFs müssen im Ordner `public/pdfs/` liegen

---

### 3. **Metadaten & Konfiguration**

#### `nextjs_space/app/layout.tsx` - SEO & Social Media

**Titel & Beschreibung ändern:**
```typescript
export const metadata: Metadata = {
  title: 'Advent Calendar 2025',  // ← Browser-Tab-Titel
  description: 'An exceptional algebraic walk through particle physics',  // ← Google-Beschreibung
  ...
};
```

---

#### `nextjs_space/app/impressum/page.tsx` - Rechtliche Angaben

**Kontaktdaten ändern:**
```tsx
<div className="text-gray-700 leading-relaxed space-y-1">
  <p>Prof. Dr. Andreas Müller</p>
  <p>Hochschule Kempten</p>
  <p>Fakultät für Betriebswirtschaft</p>  {/* ← Ändern Sie hier */}
  <p>Bahnhofstraße 61</p>
  <p>87435 Kempten (Allgäu)</p>
  <p>Deutschland</p>
</div>
```

**E-Mail-Adresse ändern:**
```tsx
<p>E-Mail: <a href="mailto:andreas.mueller@hs-kempten.de" ...>
  andreas.mueller@hs-kempten.de  {/* ← Ändern Sie hier */}
</a></p>
```

---

#### `nextjs_space/app/how-to/page.tsx` - Anleitung/Einführung

**Text der How-to Seite ändern:**
```tsx
const content = `
## How to read this Advent calendar  {/* ← Überschrift */}

Ihr neuer Text hier...  {/* ← Fließtext */}

## Structure of the four weeks  {/* ← Nächste Sektion */}

Weiterer Text...
`;
```

**Markdown-Formatierung verwenden:**
- `##` = Überschrift (H2)
- `**text**` = Fettdruck
- `*text*` = Kursiv
- `$...$` = LaTeX Mathe
- `-` = Aufzählungsliste

---

### 4. **Visuelle Anpassungen**

#### `nextjs_space/app/globals.css` - Farben & Schriften

**Hauptfarben ändern:**
```css
:root {
  --color-primary: #B3001B;   /* Rot für Türen */
  --color-gold: #FFD700;      /* Gold für Titel */
  --color-green: #006633;     /* Grün für Akzente */
  --color-blue: #003366;      /* Dunkelblau für Überschriften */
}
```

**Schriftgröße im Modal ändern:**
```css
.advent-content {
  font-family: "Times New Roman", Times, serif;
  font-size: 1rem;  /* ← Ändern Sie hier (z.B. 1.1rem) */
  line-height: 1.65;
}
```

---

#### `nextjs_space/lib/date-utils.ts` - Testdatum ändern

**Simulation-Datum ändern (für Testzwecke):**
```typescript
export function isDayUnlocked(dayDate: string): boolean {
  const simulatedDate = new Date('2025-12-08');  // ← Ändern Sie hier
  ...
}
```

**Simulation deaktivieren (Live-Modus):**
```typescript
export function isDayUnlocked(dayDate: string): boolean {
  const today = new Date();  // ← Verwenden Sie echtes Datum
  ...
}
```

---

### 5. **Audio-Dateien**

#### `nextjs_space/public/sounds/`

**Verfügbare Sounds:**
```
background-music.mp3        → Hintergrundmusik (spielt einmal beim Laden)
door-open.mp3              → Sound beim Öffnen einer Tür
sleigh-bells.mp3           → (Optional, nicht verwendet)
```

**So ersetzen Sie Sounds:**
```bash
# Kopieren Sie Ihre neuen MP3-Dateien
cp ~/meine_sounds/neue-musik.mp3 nextjs_space/public/sounds/background-music.mp3
cp ~/meine_sounds/neuer-door-sound.mp3 nextjs_space/public/sounds/door-open.mp3
```

**WICHTIG:** Dateinamen müssen exakt gleich bleiben!

---

## 🔧 Workflow: Änderungen vornehmen

### Schritt 1: Lokale Änderungen

```bash
# 1. Navigieren Sie zum Projektordner
cd /pfad/zu/ihrem/advent-kalender

# 2. Ändern Sie die gewünschten Dateien
nano nextjs_space/public/advent_data.json  # Texte ändern
# ODER
cp ~/neue_pdfs/*.pdf nextjs_space/public/pdfs/  # PDFs ersetzen

# 3. Testen Sie lokal
cd nextjs_space
yarn dev  # Startet Dev-Server auf http://localhost:3000
```

### Schritt 2: Build erstellen

```bash
cd nextjs_space

# Production Build
yarn build

# Test des Production Builds
yarn start
```

### Schritt 3: Git Commit

```bash
git add .
git commit -m "Texte für Tag 5 aktualisiert"
git push origin main
```

---

## 📝 Häufige Änderungen - Checkliste

### ✅ **Neuen Tag hinzufügen**

1. **PDF erstellen:**
   - Erstellen Sie `advent26.pdf` in `public/pdfs/`

2. **Daten hinzufügen:**
   - Öffnen Sie `public/advent_data.json`
   - Fügen Sie neues Objekt zum `days`-Array hinzu:
   ```json
   {
     "day": 26,
     "date": "2025-12-26",
     "isSpecial": false,
     "title": "Titel für Tag 26",
     "subtitle": "",
     "content": "Ihr Text hier",
     "keyInsight": "",
     "closing": "",
     "references": []
   }
   ```

---

### ✅ **Autor-Informationen ändern**

1. **In `public/advent_data.json`:**
   ```json
   "metadata": {
     "author": "Neuer Name, Institution"
   }
   ```

2. **In `app/page.tsx` (E-Mail-Link):**
   ```tsx
   <a href="mailto:neue.email@example.com">
   ```

3. **In `app/impressum/page.tsx` (vollständige Kontaktdaten):**
   ```tsx
   <p>Neuer Name</p>
   <p>Neue Institution</p>
   ...
   ```

---

### ✅ **Farben ändern**

**In `public/advent_data.json`:**
```json
"colorScheme": {
  "primary": "#FF0000",    // Hauptfarbe (Türen)
  "secondary": "#FFAA00", // Sekundärfarbe (Titel)
  "accent": "#00AA00"     // Akzentfarbe (Grün)
}
```

**ODER direkt in den Komponenten:**
- `app/page.tsx` → Hauptseite
- `components/advent-door.tsx` → Türen
- `components/content-modal.tsx` → Modal

---

### ✅ **PDFs neu generieren (aus LaTeX)**

```bash
cd working/

# Alle LaTeX-Dateien kompilieren
for tex in advent*.tex; do
  echo "Kompiliere $tex..."
  pdflatex -interaction=nonstopmode "$tex"
done

# PDFs ins Web-Projekt kopieren
cp advent*.pdf ../nextjs_space/public/pdfs/

# Aufräumen (optional)
rm *.aux *.log *.out *.toc
```

---

## ⚠️ Wichtige Hinweise

### ❌ **NICHT ändern:**

1. **Dateinamen-Konventionen:**
   - PDFs MÜSSEN `adventXX.pdf` heißen (z.B. `advent01.pdf`, nicht `advent1.pdf`)
   - Audio-Dateien nicht umbenennen

2. **JSON-Struktur:**
   - Kein Komma nach letztem Element
   - Alle Strings in `"..."` einschließen
   - Backslashes doppelt: `\\` statt `\`

3. **Ordner-Struktur:**
   ```
   nextjs_space/
   ├── public/
   │   ├── advent_data.json  ← NICHT verschieben
   │   ├── pdfs/             ← NICHT umbenennen
   │   └── sounds/           ← NICHT umbenennen
   └── ...
   ```

### ✅ **Best Practices:**

1. **Backup vor Änderungen:**
   ```bash
   cp public/advent_data.json public/advent_data.json.backup
   ```

2. **JSON validieren:**
   - Verwenden Sie einen Online-Validator: https://jsonlint.com/
   - Oder in VS Code: Rechtsklick → "Format Document"

3. **Testen vor Deploy:**
   ```bash
   yarn dev  # Lokal testen
   yarn build  # Production Build testen
   ```

---

## 🐛 Fehlerbehebung

### Problem: PDF wird nicht angezeigt

**Lösung:**
1. Prüfen Sie Dateiname: `advent01.pdf` (zweistellig!)
2. Prüfen Sie Ordner: `nextjs_space/public/pdfs/`
3. Prüfen Sie Dateigröße: < 10 MB pro PDF

### Problem: Text wird nicht angezeigt

**Lösung:**
1. JSON-Syntax prüfen (https://jsonlint.com/)
2. Backslashes doppeln: `\\LaTeX` statt `\LaTeX`
3. Zeilenumbrüche als `\n` einfügen

### Problem: Formeln werden nicht gerendert

**Lösung:**
1. Inline-Mathe: `$E = mc^2$`
2. Display-Mathe: `$$E = mc^2$$`
3. Backslashes doppeln: `$\\alpha$`

---

## 📞 Schnellreferenz

| **Aufgabe** | **Datei** | **Zeile** |
|-------------|-----------|----------|
| Text ändern | `public/advent_data.json` | → `days[X].content` |
| Titel ändern | `public/advent_data.json` | → `days[X].title` |
| PDF ersetzen | `public/pdfs/adventXX.pdf` | - |
| Autor ändern | `public/advent_data.json` | → `metadata.author` |
| E-Mail ändern | `app/page.tsx` | Zeile 357 |
| Farben ändern | `public/advent_data.json` | → `colorScheme` |
| Impressum | `app/impressum/page.tsx` | Zeile 50-56 |
| How-to Text | `app/how-to/page.tsx` | Zeile 10-69 |
| Sound ersetzen | `public/sounds/*.mp3` | - |

---

## 🎄 Viel Erfolg mit Ihrem Adventskalender!

Bei Fragen: `andreas.mueller@hs-kempten.de`
