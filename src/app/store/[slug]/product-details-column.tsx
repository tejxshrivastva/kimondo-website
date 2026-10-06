"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function ProductDetailsColumn({ children, className }: Props) {
  const colRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (!isHovered) return;

    const el = colRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const next = Math.max(0, Math.min(maxScroll, el.scrollTop + e.deltaY));
      if (
        (el.scrollTop <= 0 && e.deltaY < 0) ||
        (el.scrollTop >= maxScroll && e.deltaY > 0)
      ) {
        return;
      }

      e.preventDefault();
      el.scrollTop = next;
      setScrollTop(next);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isHovered]);

  return (
    <div
      ref={colRef}
      className={`lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto scrollbar-none ${className || ""}`}
      style={{ scrollbarWidth: "none" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}
