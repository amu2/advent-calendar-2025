'use client';

import { useEffect, useRef } from 'react';

interface MathRendererProps {
  content: string;
}

export function MathRenderer({ content }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    const renderMath = async () => {
      const katex = (await import('katex')).default;
      const container = containerRef.current;
      if (!container) return;

      let html = content;

      // Display math \[ ... \]
      html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            displayMode: true,
            throwOnError: false,
          });
        } catch (e) {
          return `<span class="math-error">\\[${formula}\\]</span>`;
        }
      });

      // Inline math $ ... $
      html = html.replace(/\$([^$]+)\$/g, (_, formula) => {
        try {
          return katex.renderToString(formula.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch (e) {
          return `<span class="math-error">$${formula}$</span>`;
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
        crossOrigin="anonymous"
      />
      <div ref={containerRef} className="math-content" />
    </>
  );
}
