"use client";

import { useEffect, useRef } from "react";

type Props = {
  svg: string;
  className?: string;
};

export function SignatureClient({ svg, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const paths = host.querySelectorAll("path");
    paths.forEach((p) => {
      try {
        const length = p.getTotalLength();
        if (!Number.isFinite(length) || length <= 0) return;
        p.style.setProperty("--length", String(length));
        p.style.strokeDasharray = String(length);
        p.style.strokeDashoffset = String(length);
      } catch {
        /* path may not be ready; skip */
      }
    });
  }, [svg]);

  return (
    <div
      ref={ref}
      className={className}
      role="img"
      aria-label="Allekirjoitus: Oskari Alamäki"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
