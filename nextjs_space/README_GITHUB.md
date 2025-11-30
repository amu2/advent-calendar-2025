# 🎄 Mathematischer Advent-Kalender 2025
## Theory of Exceptional: 100 Jahre nach Heisenberg

Ein interaktiver digitaler Advent-Kalender, der die Reise von Heisenbergs Matrix-Mechanik zu oktonionic physics und exzeptionellen Strukturen erkundet.

---

## 📖 Über das Projekt

Dieser Advent-Kalender präsentiert **27 wissenschaftliche Türchen** (30. November bis 31. Dezember 2025), die eine kohärente Erzählung von den Grundlagen der Quantenmechanik bis zur modernen Teilchenphysik entwickeln.

### Themen-Highlights:

- **30. November (1. Advent):** First Light – Octonions, G₂ und Triality
- **4. Dezember:** Heptagon-Operator Σ mit drei Eigenwerten
- **5. Dezember:** Radius-Operator R und Fermionmassen
- **7. Dezember (2. Advent):** Operator-Toolbox
- **14. Dezember (3. Advent):** CKM und PMNS Mischungsmatrizen
- **21. Dezember (4. Advent):** AQFT-Variante & F₄-Potential
- **24. Dezember:** Meta-Wow / Big Picture
- **31. Dezember:** Farewell to the parameter zoo

---

## ✨ Features

- 🎨 **Festliches Design** mit Schnee-Animation
- 🔒 **Datumsbasierte Freischaltung** (Simulation: 8. Dezember 2025)
- 🎵 **Sound-Effekte** beim Öffnen der Türchen
- 📄 **PDF-Downloads** für jedes Türchen
- 🧮 **LaTeX-Rendering** mit KaTeX für mathematische Formeln
- 📱 **Responsive Design** für Desktop und Mobile
- 🌟 **Dynamischer Header** mit Adventssonntagen-Dekoration
- ⭐ **Sterne-System**: Tag 7→2★, Tag 14→3★, Tag 21→4★, Tag 31→🎆

---

## 🛠️ Technologie-Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animationen:** Framer Motion
- **Math Rendering:** KaTeX
- **Deployment:** GitHub Pages (Static Export)
- **Sprache:** TypeScript

---

## 🚀 Lokale Entwicklung

```bash
# Dependencies installieren
yarn install

# Development Server starten
yarn dev

# Im Browser öffnen
http://localhost:3000
```

---

## 📦 Production Build

```bash
# Build für GitHub Pages erstellen
./build-github-pages.sh

# Output-Verzeichnis
./out/
```

---

## 📁 Projekt-Struktur

```
.
├── app/
│   ├── page.tsx           # Hauptseite mit Kalender-Grid
│   ├── layout.tsx         # Root-Layout
│   ├── impressum/         # Impressum-Seite
│   └── globals.css        # Globale Styles
├── components/
│   ├── advent-door.tsx    # Einzelnes Türchen
│   ├── content-modal.tsx  # Modal mit Tagesinhalt
│   ├── snowflakes.tsx     # Schnee-Animation
│   ├── math-renderer.tsx  # LaTeX-Rendering
│   └── ui/                # shadcn/ui Komponenten
├── public/
│   ├── advent_data.json   # Kalender-Daten (27 Tage)
│   ├── pdfs/              # 27 PDF-Dateien
│   └── sounds/            # Sound-Effekte
└── lib/
    ├── types.ts           # TypeScript Typen
    └── date-utils.ts      # Datums-Utilities
```

---

## 📊 Kalender-Daten

Alle Inhalte sind in `/public/advent_data.json` gespeichert:

```json
{
  "days": [
    {
      "day": 30,
      "date": "November 30, 2025",
      "title": "First Light: Octonions, G₂ and Triality",
      "subtitle": "100 years after Heisenberg's matrix mechanics",
      "intro": "<p>...</p>",
      "content": "...",
      "references": "...",
      "pdfPath": "/pdfs/advent30.pdf"
    }
  ]
}
```

---

## 🎓 Wissenschaftliche Grundlagen

Der Kalender basiert auf zwei umfassenden Papers:

1. **Paper A:** "The Octonionic Symmetry Atlas and Parameter Reduction"
   - Algebraische Grundlagen (Octonions, Albert Algebra H₃(O))
   - F₄ Symmetrie und Triality
   - Parameter-Reduktion im Standard Model

2. **Paper B:** "Heptagon and Radius Operators"
   - Spektralanalyse des Heptagon-Operators Σ
   - Fermion-Massformeln über Radius-Operator R
   - Numerische Vorhersagen

---

## 📝 Lizenz

Alle Inhalte © 2025 Andreas Müller, Hochschule Kempten

---

## 👤 Autor

**Prof. Dr. Andreas Müller**  
Hochschule Kempten  
Fakultät Betriebswirtschaft  
📧 andreas.mueller@hs-kempten.de

---

## 🎁 Credits

- **Entwicklung:** DeepAgent AI (Abacus.AI)
- **Design:** Festive Christmas Theme
- **Mathematik:** KaTeX Library
- **Animationen:** Framer Motion
- **UI Components:** shadcn/ui

---

## 🌐 Live Demo

🔗 [Advent-Kalender besuchen](https://IHR-USERNAME.github.io/advent-kalender-2025/)

---

## 🎄 Frohe Weihnachten!

Viel Freude beim Erkunden der exzeptionellen Strukturen der Teilchenphysik! ✨

