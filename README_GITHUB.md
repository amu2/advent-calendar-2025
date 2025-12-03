# TOE Advent Calendar - GitHub Workflow Guide

## 🎯 Ziel

Dieses Repository verwendet **GitHub Actions** für vollautomatisches Deployment:

1. **LaTeX-Dateien** (.tex) sind die einzige Quelle
2. Bei jedem Push zu `main` wird automatisch gebaut und deployed
3. Keine manuellen Build-Schritte notwendig

## 🔄 Workflow

```
Sie bearbeiten:        GitHub Actions macht:              Ergebnis:
advent05.tex     →     LaTeX → JSON              →       Website aktualisiert
app/page.tsx     →     LaTeX → PDF               →       PDFs aktualisiert
                       Next.js Build             →       
                       Deploy zu gh-pages        →       Live nach ~5 Min
```

## 📦 Was GitHub Actions automatisch macht

Siehe `.github/workflows/deploy.yml`:

1. **Python Setup** → `convert_tex_to_json.py` ausführen
2. **TeX Live Installation** → Alle 27 PDFs kompilieren
3. **Node.js Setup** → `yarn install && yarn build`
4. **Deployment** → Zu `gh-pages` Branch

## ✅ Best Practices

### DO:
- Immer `git pull origin main` vor dem Pushen
- Nur Quelldateien (.tex, .tsx, .css) bearbeiten
- GitHub Actions Status überprüfen nach Push

### DON'T:
- Nie `public/advent_data.json` manuell bearbeiten (wird automatisch generiert)
- Nie `gh-pages` Branch manuell berühren (nur für Deployment)
- Nie generierte Dateien committen (PDFs im root, out/, .next/)

## 🔗 Links

- **Website**: https://amu2.github.io/advent-calendar-2025/
- **GitHub Actions**: https://github.com/amu2/advent-calendar-2025/actions
- **GitHub Pages Settings**: https://github.com/amu2/advent-calendar-2025/settings/pages

## 📞 Support

Bei Problemen: Siehe `WORKFLOW.md` oder `README_WORKFLOW.md` für detaillierte Anleitungen.
