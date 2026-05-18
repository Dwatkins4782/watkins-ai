"use client";
import { useState, useEffect } from "react";

/**
 * AUDIT #22: Counter animation hook, extracted from page.tsx for testability and reuse.
 *
 * @param end Target number
 * @param dur Animation duration in ms (default 2000)
 */
export function useCountUp(end: number, dur = 2000): number {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    setStarted(true);
    let value = 0;
    const increment = end / (dur / 16);
    const timer = setInterval(() => {
      value += increment;
      if (value >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(value));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, dur, started]);

  return count;
}
