# GitHub Actions Workflow reparieren

## Problem
Der GitHub Token hat keine `workflow` Berechtigung, daher muss die Workflow-Datei manuell auf GitHub geändert werden.

## Lösung (3 Schritte)

### Schritt 1: Auf GitHub gehen
1. Öffnen Sie: https://github.com/amu2/advent-calendar-2025
2. Klicken Sie auf `.github/workflows/deploy.yml`
3. Klicken Sie auf das Stift-Symbol (Edit)

### Schritt 2: Inhalt ersetzen
Ersetzen Sie den **gesamten Inhalt** mit:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'yarn'
    
    - run: yarn install --frozen-lockfile
    
    - name: Build
      run: |
        yarn build
        touch out/.nojekyll
    
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
        force_orphan: true
```

### Schritt 3: Speichern
1. Klicken Sie "Commit changes"
2. Wählen Sie "Commit directly to the main branch"
3. Klicken Sie "Commit changes"

## Was passiert dann?
Nach dem Speichern startet GitHub Actions automatisch und:
1. Installiert yarn dependencies mit `yarn.lock`
2. Baut die Website
3. Deployt zu gh-pages

## Status prüfen
Gehen Sie zu: https://github.com/amu2/advent-calendar-2025/actions

Der Workflow sollte jetzt erfolgreich durchlaufen!
