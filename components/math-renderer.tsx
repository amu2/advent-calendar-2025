'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Import KaTeX dynamically to avoid SSR issues
let katex: any = null;
if (typeof window !== 'undefined') {
  import('katex').then((module) => {
    katex = module.default;
  });
}

interface MathRendererProps {
  content: string;
}

export function MathRenderer({ content }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    const renderMath = async () => {
      if (!katex) {
        const module = await import('katex');
        katex = module.default;
      }

      const container = containerRef.current;
      if (!container) return;

      // Set initial HTML content
      container.innerHTML = content;

      // Render display math (\[ ... \])
      const displayMathRegex = /\\\[(.*?)\\\]/gs;
      let html = container.innerHTML;
      html = html.replace(displayMathRegex, (match, formula) => {
        try {
          return katex.renderToString(formula, {
            displayMode: true,
            throwOnError: false,
          });
        } catch (e) {
          console.error('KaTeX display error:', e);
          return match;
        }
      });

      // Render inline math ($ ... $)
      html = html.replace(/\$([^$]+)\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula, {
            displayMode: false,
            throwOnError: false,
          });
        } catch (e) {
          console.error('KaTeX inline error:', e);
          return match;
        }
      });

      container.innerHTML = html;
    };

    renderMath();
  }, [content]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
        crossOrigin="anonymous"
      />
      <div
        ref={containerRef}
        className="math-content prose prose-lg max-w-none"
      />
    </>
  );
}
