"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  text: string;
  className?: string;
}

export default function MathRenderer({ text, className = "" }: MathRendererProps) {
  const renderedContent = useMemo(() => {
    if (!text) return "";

    // Split text by block math ($$...$$ or \[...\]) and inline math ($...$ or \(...\))
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g);

    return parts.map((part, idx) => {
      // Block math: $$...$$ or \[...\]
      if (
        (part.startsWith("$$") && part.endsWith("$$")) ||
        (part.startsWith("\\[") && part.endsWith("\\]"))
      ) {
        const math = part.startsWith("$$")
          ? part.slice(2, -2)
          : part.slice(2, -2); // Remove delimiters
        try {
          const html = katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={idx}
              className="my-2 overflow-x-auto overflow-y-hidden max-w-full"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          return <pre key={idx} className="text-red-500 overflow-x-auto">{part}</pre>;
        }
      }

      // Inline math: $...$ or \(...\)
      if (
        (part.startsWith("$") && part.endsWith("$")) ||
        (part.startsWith("\\(") && part.endsWith("\\)"))
      ) {
        const math = part.startsWith("$")
          ? part.slice(1, -1)
          : part.slice(2, -2); // Remove delimiters
        try {
          const html = katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={idx}
              className="inline-block align-middle px-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          return <span key={idx} className="text-red-500">{part}</span>;
        }
      }

      // Plain text
      return <span key={idx}>{part}</span>;
    });
  }, [text]);

  return <span className={`inline-block max-w-full ${className}`}>{renderedContent}</span>;
}
