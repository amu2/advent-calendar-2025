#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
convert_tex_to_json.py

Automatically converts advent*.tex files to advent_data.json
for the Next.js Advent Calendar project.

Usage:
    python3 convert_tex_to_json.py

This script:
1. Reads all advent*.tex files in the current directory
2. Extracts content from \AdventSheetTwoCol macro
3. Converts LaTeX markup to HTML
4. Generates public/advent_data.json
"""

import os
import re
import json
from typing import Dict, List, Any, Optional
from datetime import datetime


class LatexToJsonConverter:
    """Converts LaTeX Advent files to JSON format."""
    
    def __init__(self):
        self.metadata = {
            "year": 2025,
            "theme": "An Exceptional Algebraic Walk Through Particle Physics",
            "subtitle": "100 years after Heisenberg's matrix mechanics",
            "author": "Andreas Müller, Kempten University of Applied Sciences",
            "email": "andreas.mueller@hs-kempten.de",
            "description": "A journey through octonions, exceptional algebras, and the structure of particle physics"
        }
        
        self.color_scheme = {
            "adventRed": "#B3001B",
            "adventBlue": "#003366",
            "adventGreen": "#006633",
            "adventGold": "#B59410",
            "background": "#FEFEFE",
            "text": "#1A1A1A"
        }
    
    def extract_macro_params(self, content: str) -> Optional[Dict[str, str]]:
        """
        Extracts parameters from \AdventSheetTwoCol macro.
        
        Expected format:
        \AdventSheetTwoCol
          {param1} % Date
          {param2} % unused
          {param3} % Main title
          {param4} % Subtitle
          {param5} % Key Insight
          { param6 } % body (two columns)
        """
        # Find the \AdventSheetTwoCol macro
        pattern = r'\\AdventSheetTwoCol\s*'
        match = re.search(pattern, content)
        if not match:
            return None
        
        # Extract 6 parameters
        params = []
        pos = match.end()
        
        for i in range(6):
            # Skip whitespace and comments
            while pos < len(content) and (content[pos].isspace() or content[pos] == '%'):
                if content[pos] == '%':
                    # Skip comment line
                    while pos < len(content) and content[pos] != '\n':
                        pos += 1
                pos += 1
            
            if pos >= len(content) or content[pos] != '{':
                return None
            
            # Extract parameter (handle nested braces)
            brace_count = 0
            start = pos + 1
            pos += 1
            
            while pos < len(content):
                if content[pos] == '{':
                    brace_count += 1
                elif content[pos] == '}':
                    if brace_count == 0:
                        params.append(content[start:pos].strip())
                        pos += 1
                        break
                    brace_count -= 1
                pos += 1
        
        if len(params) != 6:
            return None
        
        return {
            'date': params[0],
            'unused': params[1],
            'title': params[2],
            'subtitle': params[3],
            'key_insight': params[4],
            'body': params[5]
        }
    
    def convert_latex_to_html(self, latex: str) -> str:
        """
        Converts LaTeX markup to HTML.
        Preserves math mode ($$...$$) unchanged.
        """
        html = latex
        
        # Remove comments
        html = re.sub(r'%.*?$', '', html, flags=re.MULTILINE)
        
        # Remove \AdventInitial{X}{...} decorative elements
        html = re.sub(r'\\AdventInitial\{.\}\{(.+?)\}', r'\1', html)
        
        # Convert sections
        html = re.sub(r'\\section\*\{(.+?)\}', r'<h3>\1</h3>', html)
        html = re.sub(r'\\subsection\*\{(.+?)\}', r'<h4>\1</h4>', html)
        html = re.sub(r'\\subsubsection\*\{(.+?)\}', r'<h5>\1</h5>', html)
        
        # Convert text formatting
        html = re.sub(r'\\textbf\{(.+?)\}', r'<strong>\1</strong>', html)
        html = re.sub(r'\\emph\{(.+?)\}', r'<em>\1</em>', html)
        html = re.sub(r'\\textit\{(.+?)\}', r'<em>\1</em>', html)
        
        # Convert lists
        html = re.sub(r'\\begin\{itemize\}', r'<ul>', html)
        html = re.sub(r'\\end\{itemize\}', r'</ul>', html)
        html = re.sub(r'\\begin\{enumerate\}', r'<ol>', html)
        html = re.sub(r'\\end\{enumerate\}', r'</ol>', html)
        html = re.sub(r'\\item\s+', r'<li>', html)
        
        # Convert quotes/environments
        html = re.sub(r'\\begin\{quote\}', r'<blockquote>', html)
        html = re.sub(r'\\end\{quote\}', r'</blockquote>', html)
        
        # Convert description lists
        html = re.sub(r'\\begin\{dl\}', r'<dl>', html)
        html = re.sub(r'\\end\{dl\}', r'</dl>', html)
        html = re.sub(r'\\begin\{description\}', r'<dl>', html)
        html = re.sub(r'\\end\{description\}', r'</dl>', html)
        html = re.sub(r'\\item\[(.+?)\]', r'<dt>\1</dt><dd>', html)
        
        # Convert math environments (preserve as-is)
        # Already in correct format for KaTeX
        
        # Split into paragraphs
        paragraphs = html.split('\n\n')
        formatted_paragraphs = []
        
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            # Skip if already HTML tag
            if para.startswith('<'):
                formatted_paragraphs.append(para)
            else:
                # Wrap in <p> if not empty and doesn't start with HTML
                if para and not any(para.startswith(tag) for tag in ['<h', '<ul', '<ol', '<dl', '<blockquote']):
                    formatted_paragraphs.append(f'<p>{para}</p>')
                else:
                    formatted_paragraphs.append(para)
        
        html = '\n'.join(formatted_paragraphs)
        
        # Clean up excessive whitespace
        html = re.sub(r'\n{3,}', '\n\n', html)
        html = re.sub(r'  +', ' ', html)
        
        return html
    
    def extract_references(self, content: str) -> List[Dict[str, str]]:
        """
        Extracts bibliography references from LaTeX content.
        Looks for \bibitem or direct citation patterns.
        """
        references = []
        
        # Pattern: Look for citations in the body
        # Common pattern: AuthorYear followed by description
        cite_pattern = r'([A-Z][a-zA-Z]+\d{4})\s*([A-Z].*?)(?=\n\n|[A-Z][a-zA-Z]+\d{4}|$)'
        
        # Find thebibliography environment
        bib_match = re.search(r'\\begin\{thebibliography\}.*?\\end\{thebibliography\}', content, re.DOTALL)
        if bib_match:
            bib_content = bib_match.group(0)
            # Extract bibitem entries
            bibitem_pattern = r'\\bibitem\{(.+?)\}\s*(.+?)(?=\\bibitem|\\end\{thebibliography\})'
            for match in re.finditer(bibitem_pattern, bib_content, re.DOTALL):
                key = match.group(1).strip()
                text = match.group(2).strip()
                text = re.sub(r'%.*?$', '', text, flags=re.MULTILINE)  # Remove comments
                text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
                references.append({"key": key, "text": text})
        
        # Fallback: Extract from direct citations in text
        if not references:
            for match in re.finditer(cite_pattern, content, re.DOTALL):
                key = match.group(1)
                text = match.group(2).strip()
                # Clean up
                text = re.sub(r'\n', ' ', text)
                text = re.sub(r'\s+', ' ', text)
                if len(text) > 20:  # Reasonable length for a citation
                    references.append({"key": key, "text": text})
        
        return references
    
    def determine_day_type(self, day: int, date_str: str) -> tuple:
        """
        Determines the type and special status of a day.
        Returns (type, special)
        """
        # Parse date
        if 'November' in date_str:
            return ("Vorwoche (November 30)", "Prologue")
        elif 'December 1' in date_str or 'December 8' in date_str or \
             'December 15' in date_str or 'December 22' in date_str:
            sunday_num = [1, 8, 15, 22].index(day) + 1 if day in [1, 8, 15, 22] else 0
            return ("Adventssonntag (Doppelblatt)", f"{sunday_num}. Advent – Doppelblatt")
        elif 'December 6' in date_str:
            return ("Werktag/Nikolaus", "Nikolaus")
        elif 'December 24' in date_str:
            return ("Heiligabend", "Christmas Eve")
        elif 'December 25' in date_str:
            return ("Weihnachten", "Christmas")
        elif 'December 31' in date_str:
            return ("Silvester", "New Year's Eve")
        else:
            return ("Werktag", "")
    
    def parse_tex_file(self, filepath: str) -> Optional[Dict[str, Any]]:
        """
        Parses a single .tex file and extracts day data.
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            return None
        
        # Extract day number from filename
        filename = os.path.basename(filepath)
        day_match = re.match(r'advent(\d+)\.tex', filename)
        if not day_match:
            return None
        
        day_num = int(day_match.group(1))
        
        # Extract macro parameters
        params = self.extract_macro_params(content)
        if not params:
            print(f"Warning: Could not extract parameters from {filename}")
            return None
        
        # Convert date
        date_str = params['date'].strip()
        
        # Map day number to actual date
        if day_num == 0:
            day_num = 30
            date = "2025-11-30"
            date_display = "November 30, 2025"
        elif day_num == 31:
            date = "2025-12-31"
            date_display = "December 31, 2025"
        else:
            date = f"2025-12-{day_num:02d}"
            date_display = f"December {day_num}, 2025"
        
        # Convert content
        title = self.convert_latex_to_html(params['title'])
        subtitle = self.convert_latex_to_html(params['subtitle'])
        key_insight = self.convert_latex_to_html(params['key_insight'])
        body_html = self.convert_latex_to_html(params['body'])
        
        # Extract closing (last sentence/paragraph)
        closing_match = re.search(r'\}\s*%\s*end\s*#6\s*(.+?)%\s*#7', content, re.DOTALL)
        closing = ""
        if closing_match:
            closing = closing_match.group(1).strip()
            closing = self.convert_latex_to_html(closing)
        
        # Extract references
        references = self.extract_references(content)
        
        # Determine type and special
        day_type, special = self.determine_day_type(day_num, date_str)
        
        # Build day data
        day_data = {
            "day": day_num,
            "date": date,
            "dateDisplay": date_display,
            "title": title.strip(),
            "subtitle": subtitle.strip(),
            "keyInsight": key_insight.strip(),
            "content": body_html,
            "closing": closing,
            "type": day_type,
            "special": special,
            "centralFormula": "",  # Can be extracted if needed
            "dependencies": "",    # Can be extracted if needed
            "isLocked": day_num > 8,  # Current date simulation
            "references": references,
            "intro": ""  # Could extract intro paragraph if needed
        }
        
        return day_data
    
    def convert_all(self, directory: str = '.') -> Dict[str, Any]:
        """
        Converts all advent*.tex files in the directory.
        """
        # Find all advent*.tex files
        tex_files = []
        for filename in os.listdir(directory):
            if filename.startswith('advent') and filename.endswith('.tex'):
                if re.match(r'advent\d+\.tex', filename):
                    tex_files.append(os.path.join(directory, filename))
        
        tex_files.sort()
        print(f"Found {len(tex_files)} advent*.tex files")
        
        # Parse all files
        days = []
        for filepath in tex_files:
            print(f"Processing {os.path.basename(filepath)}...")
            day_data = self.parse_tex_file(filepath)
            if day_data:
                days.append(day_data)
        
        # Sort by day number
        days.sort(key=lambda d: d['day'])
        
        # Build final JSON structure
        result = {
            "metadata": self.metadata,
            "colorScheme": self.color_scheme,
            "days": days
        }
        
        return result
    
    def save_json(self, data: Dict[str, Any], output_path: str):
        """
        Saves the converted data to JSON file.
        """
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"\n✅ Successfully wrote {output_path}")
            print(f"   Total days: {len(data['days'])}")
        except Exception as e:
            print(f"❌ Error writing {output_path}: {e}")


def main():
    """
    Main entry point.
    """
    print("=" * 60)
    print("LaTeX to JSON Converter for Advent Calendar")
    print("=" * 60)
    print()
    
    converter = LatexToJsonConverter()
    
    # Convert all files
    data = converter.convert_all('.')
    
    # Save to public/advent_data.json
    output_path = 'public/advent_data.json'
    converter.save_json(data, output_path)
    
    print()
    print("=" * 60)
    print("✅ Conversion complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Review public/advent_data.json")
    print("2. Test the website locally: yarn dev")
    print("3. Commit and push to GitHub")
    print()


if __name__ == '__main__':
    main()
