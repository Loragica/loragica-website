/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  target: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({
  target,
  suffix = '',
  duration = 2400, // Slowed down nicely to feel extremely premium, spinning over ~2.4 seconds
}: AnimatedCounterProps) {
  const [count, setCount] = useState<string | number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentElem = elementRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const numericTarget = parseFloat(target);
    if (isNaN(numericTarget)) {
      setCount(target);
      return;
    }

    const isFloat = target.includes('.');
    const startTimestamp = performance.now();

    let animationId: number;

    const animate = (now: number) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic: f(t) = 1 - (1 - t)^3
      // Provides high speed initial spin matching the scroll entrance, 
      // decaying into a precise, crystal-clear settling of the final digit
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = numericTarget * easeProgress;

      if (isFloat) {
        setCount(parseFloat(currentVal.toFixed(1)));
      } else {
        setCount(Math.round(currentVal));
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setCount(numericTarget);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [hasStarted, target, duration]);

  return (
    <span ref={elementRef} className="notranslate inline-block min-w-[2ch]" translate="no">
      {count}
      {suffix}
    </span>
  );
}
