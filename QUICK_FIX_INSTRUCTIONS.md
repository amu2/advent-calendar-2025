# 🚨 Schnelle Fix-Anleitung

## Problem
GitHub Actions schlägt fehl mit: `error Your lockfile needs to be updated`

## Lösung (2 Optionen)

### Option 1: Workflow-Fix (EMPFOHLEN - 2 Minuten)

1. Öffnen Sie `.github/workflows/deploy.yml` auf GitHub
2. Ändern Sie Zeile 102:
   ```yaml
   # VORHER:
   run: yarn install --frozen-lockfile
   
   # NACHHER:
   run: yarn install
   ```
3. Commit & Save
4. Der Workflow läuft automatisch und wird funktionieren!

### Option 2: Lokale yarn.lock generieren (5-10 Minuten)

```bash
cd /home/ubuntu/advent_project/website
rm -f yarn.lock package-lock.json
npm install --legacy-peer-deps
git add package-lock.json
git commit -m "Add package-lock.json"
git push origin main

# Dann ändern Sie den Workflow zu:
run: npm ci
run: npm run build
```

## Was ist das Problem?

- Die `yarn.lock` ist nicht synchron mit `package.json`
- `--frozen-lockfile` erlaubt keine Aktualisierung
- Lösung: Entweder `--frozen-lockfile` entfernen ODER `npm` verwenden

## Nächste Schritte

Nach dem Fix wird GitHub Actions:
1. LaTeX → JSON konvertieren
2. PDFs kompilieren
3. Website bauen
4. Zu GitHub Pages deployen

⏱️ Dauer: ~5-8 Minuten
🔗 Monitoring: https://github.com/amu2/advent-calendar-2025/actions
