#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Konvertiert adventXX.tex zu JSON (1:1 kompatibel mit advent_data.json)"""

import re, json, sys
from pathlib import Path

def find_advent_args(tex):
    """Extrahiert 7 Argumente von \\AdventSheetTwoCol{...}{...}"""
    m = re.search(r'\\AdventSheetTwoCol', tex)
    if not m:
        return None
    
    def skip_ws(s, i):
        while i < len(s) and (s[i].isspace() or s[i] == '%'):
            if s[i] == '%':
                while i < len(s) and s[i] != '\n': i += 1
            i += 1
        return i
    
    args, i = [], m.end()
    for _ in range(7):
        i = skip_ws(tex, i)
        if i >= len(tex) or tex[i] != '{': return None
        depth, start, i = 0, i+1, i+1
        while i < len(tex):
            if tex[i] == '{': depth += 1
            elif tex[i] == '}':
                if depth == 0:
                    args.append(tex[start:i].strip())
                    i += 1
                    break
                depth -= 1
            i += 1
    return args if len(args) == 7 else None

def tex2html(tex):
    """LaTeX → HTML (vereinfacht)"""
    # Math schützen
    math = []
    def save(m):
        math.append(m.group(0))
        return f"<<<M{len(math)-1}>>>"
    tex = re.sub(r'\$([^\$]+)\$', save, tex)
    tex = re.sub(r'\\\[(.+?)\\\]', save, tex, flags=re.DOTALL)
    
    # LaTeX-Makros
    tex = re.sub(r'\\AdventInitial\{(.)\}\{([^}]*)\}', r'\1\2', tex)
    tex = re.sub(r'\\section\*?\{([^}]+)\}', r'<h3>\1</h3>', tex)
    tex = re.sub(r'\\begin\{itemize\}', '<ul>', tex)
    tex = re.sub(r'\\end\{itemize\}', '</ul>', tex)
    tex = re.sub(r'\\begin\{enumerate\}', '<ol>', tex)
    tex = re.sub(r'\\end\{enumerate\}', '</ol>', tex)
    tex = re.sub(r'\\item\s+', '<li>', tex)
    tex = re.sub(r'\\textbf\{([^}]+)\}', r'<strong>\1</strong>', tex)
    tex = re.sub(r'\\emph\{([^}]+)\}', r'<em>\1</em>', tex)
    tex = re.sub(r'\\\\', '<br>', tex)
    
    # Paragraphen
    paras = [p.strip() for p in tex.split('\n\n') if p.strip()]
    html = []
    for p in paras:
        if p.startswith('<h3>') or p.startswith('<ul>') or p.startswith('<ol>'):
            html.append(p)
        else:
            html.append(f'<p>{p}</p>')
    
    result = '\n'.join(html)
    # Math wieder einsetzen
    for i, m in enumerate(math):
        result = result.replace(f'<<<M{i}>>>', m)
    
    return result.strip()

def extract_refs(tex):
    """Extrahiert References aus \\begin{thebibliography}"""
    m = re.search(r'\\begin\{thebibliography\}\{[^}]*\}(.+?)\\end\{thebibliography\}', tex, re.DOTALL)
    if not m: return []
    refs = []
    for item in re.split(r'\\bibitem\{', m.group(1))[1:]:
        km = re.match(r'([^}]+)\}', item)
        if km:
            key = km.group(1)
            text = tex2html(item[len(key)+1:].strip())
            refs.append({"key": key, "text": text})
    return refs

def parse_file(path):
    """Parst adventXX.tex → JSON-Eintrag"""
    tex = path.read_text(encoding='utf-8')
    
    # Tag aus Dateiname
    m = re.search(r'advent(\d+)', path.stem)
    if not m or m.group(1) == '00': return None
    day = int(m.group(1))
    
    args = find_advent_args(tex)
    if not args: return None
    
    _, _, title, subtitle, insight, body, closing = args
    
    # Intro/Content trennen
    split = re.search(r'\\section\*?\{', body)
    if split:
        intro = tex2html(body[:split.start()].strip())
        content = tex2html(body[split.start():].strip())
    else:
        intro = ""
        content = tex2html(body.strip())
    
    refs = extract_refs(tex)
    
    # KRITISCH: special, centralFormula, dependencies als STRINGS!
    return {
        "day": day,
        "date": f"2025-12-{day:02d}",
        "dateDisplay": f"December {day}, 2025",
        "title": title.strip(),
        "subtitle": subtitle.strip(),
        "keyInsight": insight.strip(),
        "content": content,
        "closing": closing.strip(),
        "type": "standard",
        "special": "",  # STRING statt bool!
        "centralFormula": "",  # STRING
        "dependencies": "",  # STRING statt Array!
        "isLocked": False,
        "references": refs,
        "intro": intro
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Verwendung: python3 tex2json_fixed.py advent01.tex advent02.tex ...")
        sys.exit(1)
    
    entries = []
    for arg in sys.argv[1:]:
        for p in sorted(Path().glob(arg)):
            print(f"→ {p.name}...", end=" ")
            try:
                e = parse_file(p)
                if e:
                    entries.append(e)
                    print(f"✓ Tag {e['day']}")
                else:
                    print("⚠ übersprungen")
            except Exception as ex:
                print(f"❌ {ex}")
    
    entries.sort(key=lambda x: x["day"])
    
    # NUR days-Array ausgeben (für Copy-Paste)
    print(f"\n✅ {len(entries)} Einträge konvertiert")
    print("\n--- KOPIERE AB HIER (nur 'days'-Array) ---\n")
    print(json.dumps(entries, indent=2, ensure_ascii=False))
