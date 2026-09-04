'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  formula: string;
  block?: boolean;
  className?: string;
}

export default function MathFormula({ formula, block = false, className = '' }: MathFormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return formula;
    }
  }, [formula, block]);

  return (
    <span
      className={`inline-block font-serif ${block ? 'my-2 text-center block w-full overflow-x-auto py-1' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
