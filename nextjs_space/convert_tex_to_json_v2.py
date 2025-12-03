#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Robust LaTeX to JSON Converter for Advent Calendar
Version 2.0 - Production Ready

Fixes:
- Proper comment filtering (% lines)
- Complete section title parsing
- Full LaTeX→HTML conversion
- Quote environment handling
"""

import os
import re
import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime


class RobustLatexConverter:
    """Production-ready LaTeX to JSON converter."""
    
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

    def remove_comments(self, text: str) -> str:
        """Remove LaTeX comments (% lines) BEFORE any other processing."""
        lines = text.split('\n')
        cleaned_lines = []
        for line in lines:
            # Find the first unescaped %
            idx = 0
            while idx < len(line):
                if line[idx] == '%':
                    # Check if it's escaped
                    if idx == 0 or line[idx-1] != '\\':
                        # This is a comment, truncate the line here
                        line = line[:idx]
                        break
                idx += 1
            # Only add non-empty lines
            if line.strip():
                cleaned_lines.append(line)
        return '\n'.join(cleaned_lines)

    def extract_macro_params(self, content: str) -> Optional[Dict[str, str]]:
        """
        Extract parameters from \AdventSheetTwoCol{...}{...}{...}{...}{...}{...}{...}
        Handles nested braces correctly.
        """
        # First remove all comments
        content = self.remove_comments(content)
        
        # Find the macro
        macro_pattern = r'\\AdventSheetTwoCol'
        match = re.search(macro_pattern, content)
        if not match:
            return None
        
        start_pos = match.end()
        params = []
        
        # Extract 7 parameters
        for i in range(7):
            # Skip whitespace
            while start_pos < len(content) and content[start_pos].isspace():
                start_pos += 1
            
            if start_pos >= len(content) or content[start_pos] != '{':
                return None
            
            # Find matching closing brace
            brace_count = 0
            param_start = start_pos + 1
            pos = start_pos
            
            while pos < len(content):
                if content[pos] == '{':
                    brace_count += 1
                elif content[pos] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        params.append(content[param_start:pos].strip())
                        start_pos = pos + 1
                        break
                pos += 1
        
        if len(params) != 7:
            return None
        
        return {
            'intro': params[0],
            'day_type': params[1],
            'day_special': params[2],
            'central_formula': params[3],
            'dependencies': params[4],
            'body': params[5],
            'closing': params[6]
        }

    def parse_section_title(self, text: str) -> Tuple[str, str]:
        """
        Parse \section*{...} and return (title, remaining_text).
        Handles complex titles with $...$, subscripts, etc.
        """
        pattern = r'\\section\*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}'
        match = re.search(pattern, text)
        if match:
            title = match.group(1).strip()
            remaining = text[match.end():].strip()
            return title, remaining
        return "", text

    def latex_to_html(self, text: str) -> str:
        """
        Convert LaTeX markup to HTML.
        Comprehensive conversion including all common commands.
        """
        if not text:
            return ""
        
        # Remove leading/trailing whitespace
        text = text.strip()
        
        # Convert simple math expressions with subscripts to Unicode
        # Handles: G$_2$, F$_4$, $G_2$, $F_4$, etc.
        subscript_map = {'0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
                        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'}
        
        # Pattern 1: G$_2$ or F$_4$ (letter outside math mode)
        def replace_math_subscript_1(match):
            letter = match.group(1)
            num = match.group(2)
            return letter + subscript_map.get(num, num)
        text = re.sub(r'([A-Za-z])\$_\{?(\d+)\}?\$', replace_math_subscript_1, text)
        
        # Pattern 2: $G_2$ or $F_4$ (letter inside math mode)
        def replace_math_subscript_2(match):
            letter = match.group(1)
            num = match.group(2)
            return letter + subscript_map.get(num, num)
        text = re.sub(r'\$([A-Za-z])_\{?(\d+)\}?\$', replace_math_subscript_2, text)
        
        # Pattern 3: Just $_2$ (subscript only)
        def replace_math_subscript_3(match):
            num = match.group(1)
            return subscript_map.get(num, num)
        text = re.sub(r'\$_\{?(\d+)\}?\$', replace_math_subscript_3, text)
        
        # Convert $^N$ (inline math superscripts) to Unicode
        superscript_map = {'0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
                          '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
                          '+': '⁺', '-': '⁻'}
        def replace_math_superscript(match):
            content = match.group(1)
            return ''.join(superscript_map.get(c, c) for c in content)
        text = re.sub(r'\$\^\{?(\d+)\}?\$', replace_math_superscript, text)
        
        # Convert \textbf{} to <strong>
        text = re.sub(r'\\textbf\{([^}]+)\}', r'<strong>\1</strong>', text)
        
        # Convert \emph{} to <em>
        text = re.sub(r'\\emph\{([^}]+)\}', r'<em>\1</em>', text)
        
        # Convert \textit{} to <em>
        text = re.sub(r'\\textit\{([^}]+)\}', r'<em>\1</em>', text)
        
        # Convert \textsubscript{} to Unicode subscripts
        def replace_subscript(match):
            content = match.group(1)
            return ''.join(subscript_map.get(c, c) for c in content)
        text = re.sub(r'\\textsubscript\{([^}]+)\}', replace_subscript, text)
        
        # Convert \textsuperscript{} to Unicode superscripts
        def replace_superscript(match):
            content = match.group(1)
            return ''.join(superscript_map.get(c, c) for c in content)
        text = re.sub(r'\\textsuperscript\{([^}]+)\}', replace_superscript, text)
        
        # Convert LaTeX quotes
        text = text.replace('``', '"').replace("''", '"')
        
        # Convert -- and --- to proper dashes
        text = text.replace('---', '—').replace('--', '–')
        
        # Convert \\ to <br>
        text = text.replace('\\\\', '<br>')
        
        # Handle escaped characters
        text = text.replace('\\_', '_')
        text = text.replace('\\&', '&')
        text = text.replace('\\%', '%')
        text = text.replace('\\$', '$')
        
        # Handle special characters with backslash
        text = re.sub(r'\\"([a-zA-Z])', lambda m: {'a': 'ä', 'o': 'ö', 'u': 'ü', 'A': 'Ä', 'O': 'Ö', 'U': 'Ü'}.get(m.group(1), m.group(0)), text)
        
        return text

    def find_matching_brace(self, text: str, start_pos: int) -> int:
        """Find the position of the matching closing brace."""
        if start_pos >= len(text) or text[start_pos] != '{':
            return -1
        
        count = 0
        pos = start_pos
        while pos < len(text):
            if text[pos] == '{':
                count += 1
            elif text[pos] == '}':
                count -= 1
                if count == 0:
                    return pos
            pos += 1
        return -1

    def process_body_content(self, body: str) -> str:
        """
        Process the main body content - OPTIMIZED VERSION.
        Handles sections, lists, quotes, and paragraphs.
        """
        if not body:
            return ""
        
        # Remove comments first
        body = self.remove_comments(body)
        
        html_parts = []
        pos = 0
        max_iterations = 1000  # Safety limit
        iterations = 0
        
        while pos < len(body) and iterations < max_iterations:
            iterations += 1
            
            # Skip whitespace
            while pos < len(body) and body[pos].isspace():
                pos += 1
            
            if pos >= len(body):
                break
            
            # Check for \section*{
            if body[pos:pos+9] == '\\section*':
                # Find the opening brace
                brace_pos = body.find('{', pos)
                if brace_pos > pos:
                    # Find matching closing brace
                    close_brace = self.find_matching_brace(body, brace_pos)
                    if close_brace > 0:
                        title = body[brace_pos+1:close_brace]
                        title_html = self.latex_to_html(title)
                        html_parts.append(f'<h3>{title_html}</h3>')
                        pos = close_brace + 1
                        continue
            
            # Check for \begin{quote}
            if body[pos:pos+13] == '\\begin{quote}':
                end_pos = body.find('\\end{quote}', pos)
                if end_pos > pos:
                    quote_content = body[pos+13:end_pos].strip()
                    quote_html = self.latex_to_html(quote_content)
                    html_parts.append(f'<blockquote>{quote_html}</blockquote>')
                    pos = end_pos + 11
                    continue
            
            # Check for \begin{enumerate}
            if body[pos:pos+17] == '\\begin{enumerate}':
                end_pos = body.find('\\end{enumerate}', pos)
                if end_pos > pos:
                    items_content = body[pos+17:end_pos]
                    # Split by \item
                    items = []
                    item_pos = 0
                    while True:
                        item_start = items_content.find('\\item', item_pos)
                        if item_start < 0:
                            break
                        next_item = items_content.find('\\item', item_start + 5)
                        if next_item < 0:
                            items.append(items_content[item_start+5:].strip())
                            break
                        else:
                            items.append(items_content[item_start+5:next_item].strip())
                            item_pos = next_item
                    
                    html_parts.append('<ol>')
                    for item in items:
                        item_html = self.latex_to_html(item)
                        html_parts.append(f'  <li>{item_html}</li>')
                    html_parts.append('</ol>')
                    pos = end_pos + 15
                    continue
            
            # Check for \begin{itemize}
            if body[pos:pos+15] == '\\begin{itemize}':
                end_pos = body.find('\\end{itemize}', pos)
                if end_pos > pos:
                    items_content = body[pos+15:end_pos]
                    # Split by \item
                    items = []
                    item_pos = 0
                    while True:
                        item_start = items_content.find('\\item', item_pos)
                        if item_start < 0:
                            break
                        next_item = items_content.find('\\item', item_start + 5)
                        if next_item < 0:
                            items.append(items_content[item_start+5:].strip())
                            break
                        else:
                            items.append(items_content[item_start+5:next_item].strip())
                            item_pos = next_item
                    
                    html_parts.append('<ul>')
                    for item in items:
                        item_html = self.latex_to_html(item)
                        html_parts.append(f'  <li>{item_html}</li>')
                    html_parts.append('</ul>')
                    pos = end_pos + 13
                    continue
            
            # Check for display math \[ ... \]
            if body[pos:pos+2] == '\\[':
                end_pos = body.find('\\]', pos + 2)
                if end_pos > pos:
                    math_content = body[pos+2:end_pos].strip()
                    html_parts.append(f'<p>\\[{math_content}\\]</p>')
                    pos = end_pos + 2
                    continue
            
            # Check for display math $$ ... $$
            if body[pos:pos+2] == '$$':
                end_pos = body.find('$$', pos + 2)
                if end_pos > pos:
                    math_content = body[pos+2:end_pos].strip()
                    html_parts.append(f'<p>\\[{math_content}\\]</p>')
                    pos = end_pos + 2
                    continue
            
            # Regular paragraph - find next structural element
            # Look for next structure within reasonable distance
            search_end = min(pos + 5000, len(body))
            next_section = body.find('\\section*', pos + 1, search_end)
            next_begin = body.find('\\begin{', pos + 1, search_end)
            next_math1 = body.find('\\[', pos + 1, search_end)
            next_math2 = body.find('$$', pos + 1, search_end)
            
            # Find the nearest
            next_positions = [p for p in [next_section, next_begin, next_math1, next_math2] if p > 0]
            if next_positions:
                next_pos = min(next_positions)
            else:
                next_pos = len(body)
            
            para = body[pos:next_pos].strip()
            if para:
                para_html = self.latex_to_html(para)
                html_parts.append(f'<p>{para_html}</p>')
            
            pos = next_pos
        
        if iterations >= max_iterations:
            print(f"Warning: Reached max iterations in process_body_content")
        
        return '\n'.join(html_parts)

    def extract_references(self, content: str) -> List[Dict[str, str]]:
        """
        Extract bibliography items from \begin{thebibliography}...\end{thebibliography}
        """
        # Remove comments first
        content = self.remove_comments(content)
        
        # Find bibliography section
        bib_match = re.search(r'\\begin\{thebibliography\}.*?\\end\{thebibliography\}', content, re.DOTALL)
        if not bib_match:
            return []
        
        bib_content = bib_match.group(0)
        
        # Extract individual items
        items = re.findall(r'\\bibitem\{([^}]+)\}\s*([^\\]+(?:\\[^b][^\\]*)*)', bib_content)
        
        references = []
        for key, text in items:
            # Clean up the text
            text = self.latex_to_html(text.strip())
            # Remove any trailing thebibliography commands
            text = re.sub(r'\s*\\end\{thebibliography\}.*$', '', text)
            text = re.sub(r'\s*thebibliography.*$', '', text)
            references.append({
                'key': key.strip(),
                'text': text.strip()
            })
        
        return references

    def get_day_number(self, filename: str) -> int:
        """Extract day number from filename like 'advent03.tex' -> 3"""
        match = re.search(r'advent(\d+)\.tex', filename)
        if match:
            return int(match.group(1))
        return 0

    def get_date_for_day(self, day: int) -> Tuple[str, str]:
        """Get ISO date and display date for a given day number."""
        if day == 0:
            day = 30  # Special case: Day 0 is November 30
        
        if day <= 25:
            iso_date = f"2025-12-{day:02d}"
            display_date = f"December {day}, 2025"
        elif day == 30:
            iso_date = "2025-11-30"
            display_date = "November 30, 2025"
        elif day == 31:
            iso_date = "2025-12-31"
            display_date = "December 31, 2025"
        else:
            # Days 26-29
            iso_date = f"2025-12-{day:02d}"
            display_date = f"December {day}, 2025"
        
        return iso_date, display_date

    def parse_tex_file(self, filepath: str) -> Optional[Dict[str, Any]]:
        """
        Parse a single .tex file and return day data.
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            return None
        
        # Extract macro parameters
        params = self.extract_macro_params(content)
        if not params:
            print(f"Warning: Could not extract macro from {filepath}")
            return None
        
        # Get day number
        day_num = self.get_day_number(os.path.basename(filepath))
        iso_date, display_date = self.get_date_for_day(day_num)
        
        # Extract title from body (first line after comments)
        body_clean = self.remove_comments(params['body'])
        title = ""
        # Try to find title in first section
        title_match = re.search(r'\\section\*\{([^}]+)\}', body_clean)
        if title_match:
            title = self.latex_to_html(title_match.group(1))
        
        # Build day data
        day_data = {
            'day': day_num,
            'date': iso_date,
            'dateDisplay': display_date,
            'title': title or f"Day {day_num}",
            'subtitle': self.latex_to_html(params['day_type']),
            'keyInsight': self.latex_to_html(params['dependencies']),
            'content': self.process_body_content(params['body']),
            'closing': self.latex_to_html(params['closing']),
            'type': params['day_type'],
            'special': params['day_special'],
            'centralFormula': self.latex_to_html(params['central_formula']),
            'dependencies': params['dependencies'],
            'isLocked': day_num > 3,  # Days after today are locked
            'references': self.extract_references(content),
            'intro': self.process_body_content(params['intro'])
        }
        
        return day_data

    def convert_all(self, output_path: str = 'public/advent_data.json'):
        """
        Convert all advent*.tex files to JSON.
        """
        # Find all advent*.tex files
        tex_files = [f for f in os.listdir('.') if re.match(r'advent\d+\.tex', f)]
        tex_files.sort()
        
        print(f"Found {len(tex_files)} .tex files")
        
        days = []
        for tex_file in tex_files:
            print(f"Processing {tex_file}...")
            day_data = self.parse_tex_file(tex_file)
            if day_data:
                days.append(day_data)
                print(f"  ✓ Day {day_data['day']}: {day_data['title']}")
            else:
                print(f"  ✗ Failed to parse {tex_file}")
        
        # Sort by day number
        days.sort(key=lambda x: x['day'])
        
        # Build final JSON structure
        output_data = {
            'metadata': self.metadata,
            'colorScheme': self.color_scheme,
            'days': days
        }
        
        # Write to file
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Successfully wrote {len(days)} days to {output_path}")
        print(f"  File size: {os.path.getsize(output_path)} bytes")


if __name__ == '__main__':
    converter = RobustLatexConverter()
    converter.convert_all()
