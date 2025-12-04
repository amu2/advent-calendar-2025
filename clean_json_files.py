#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Clean up HTML in JSON day files.
"""
import json
import re
import glob

def clean_html_content(html: str) -> str:
    """Clean up common HTML issues in content."""
    
    # Remove LaTeX comments
    html = re.sub(r'%[-]+.*?%[-]+', '', html)
    html = re.sub(r'%[-]+', '', html)
    
    # Fix: <p><h3> -> <h3>
    html = re.sub(r'<p>\s*<h(\d)>', r'<h\1>', html)
    
    # Fix: </h3></p> -> </h3>
    html = re.sub(r'</h(\d)>\s*</p>', r'</h\1>', html)
    
    # Fix: <p><ul> -> <ul>
    html = re.sub(r'<p>\s*<ul>', '<ul>', html)
    html = re.sub(r'</ul>\s*</p>', '</ul>', html)
    
    # Fix: <p><ol> -> <ol>
    html = re.sub(r'<p>\s*<ol>', '<ol>', html)
    html = re.sub(r'</ol>\s*</p>', '</ol>', html)
    
    # Fix: <p><dl> -> <dl>
    html = re.sub(r'<p>\s*<dl>', '<dl>', html)
    html = re.sub(r'</dl>\s*</p>', '</dl>', html)
    
    # Fix: <p><dt> -> <dt>
    html = re.sub(r'<p>\s*<dt>', '<dt>', html)
    
    # Fix: </dd></p> -> </dd>
    html = re.sub(r'</dd>\s*</p>', '</dd>', html)
    
    # Fix: <p><li> -> <li>
    html = re.sub(r'<p>\s*<li>', '<li>', html)
    html = re.sub(r'</li>\s*</p>', '</li>', html)
    
    # Fix: <p><blockquote> -> <blockquote>
    html = re.sub(r'<p>\s*<blockquote>', '<blockquote>', html)
    html = re.sub(r'</blockquote>\s*</p>', '</blockquote>', html)
    
    # Fix double closing tags: </p></p> -> </p>
    html = re.sub(r'(</p>)\s*\1+', r'\1', html)
    
    # Fix orphaned references (LaTeX remnants)
    # Pattern: Heisenberg1925\nW.~Heisenberg,
    html = re.sub(r'([A-Z][a-z]+\d{4})\n', r'<p><strong>\1</strong><br>\n', html)
    
    # Fix: ``text'' -> "text"
    html = re.sub(r"``(.*?)''", r'"\1"', html)
    
    # Fix: thebibliography at the end
    html = re.sub(r'\s*thebibliography\s*', '', html)
    
    # Clean up multiple newlines
    html = re.sub(r'\n{3,}', '\n\n', html)
    
    # Trim whitespace
    html = html.strip()
    
    return html

def clean_day_file(filepath: str):
    """Clean a single day JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Clean content field
    if 'content' in data:
        data['content'] = clean_html_content(data['content'])
    
    # Clean intro field
    if 'intro' in data:
        data['intro'] = clean_html_content(data['intro'])
    
    # Clean closing field
    if 'closing' in data:
        data['closing'] = data['closing'].strip()
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Cleaned {filepath}")

def main():
    day_files = glob.glob('public/data/days/day*.json')
    
    for filepath in sorted(day_files):
        try:
            clean_day_file(filepath)
        except Exception as e:
            print(f"✗ Error cleaning {filepath}: {e}")
    
    print(f"\n✅ Cleaned {len(day_files)} day files!")

if __name__ == '__main__':
    main()
