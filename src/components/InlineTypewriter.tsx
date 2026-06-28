/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface InlineTypewriterProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before start
  className?: string;
  cursorColor?: string;
}

export default function InlineTypewriter({
  text,
  speed = 100,
  delay = 300,
  className = '',
  cursorColor = 'currentColor',
}: InlineTypewriterProps) {
  const [translatedText, setTranslatedText] = useState(text);
  const [typedCount, setTypedCount] = useState(0);
  const [startTyping, setStartTyping] = useState(false);
  
  const containerRef = useRef<HTMLSpanElement>(null);
  const sourceRef = useRef<HTMLSpanElement>(null);

  // Keep state updated if original text prop changes
  useEffect(() => {
    setTranslatedText(text);
  }, [text]);

  // Set up MutationObserver to listen for visual translations on the hidden span
  useEffect(() => {
    const el = sourceRef.current;
    if (!el) return;

    const updateWord = () => {
      if (el) {
        const currentContent = el.textContent || text;
        setTranslatedText(currentContent);
      }
    };

    updateWord();

    const observer = new MutationObserver(updateWord);
    observer.observe(el, { characterData: true, childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [text]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartTyping(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentElem = containerRef.current;
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
    if (!startTyping) return;

    let timer: NodeJS.Timeout;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedCount((prev) => {
          if (prev >= translatedText.length) {
            clearInterval(interval);
            return translatedText.length;
          }
          return prev + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => {
      clearTimeout(startTimer);
    };
  }, [startTyping, translatedText, speed, delay]);

  const visibleText = translatedText.substring(0, typedCount);
  const invisibleText = translatedText.substring(typedCount);

  return (
    <>
      {/* Hidden container optimized for browser auto-translators like Google Translate */}
      <span
        ref={sourceRef}
        className="absolute opacity-0 pointer-events-none w-px h-px overflow-hidden select-none"
        aria-hidden="true"
      >
        {text}
      </span>

      <span
        ref={containerRef}
        className={`inline-relative ${className}`}
        id="inline-typewriter-container"
        translate="no"
      >
        <span>{visibleText}</span>
        {/* Blinking cursor is placed immediately after the visible text so it follows the typed position */}
        {startTyping && (
          <span
            className="typing-cursor"
            style={{ backgroundColor: cursorColor }}
            aria-hidden="true"
          />
        )}
        {/* Invisible text keeps the dimensions intact to prevent any layout/wrapping shifts on mobile/desktop */}
        <span className="opacity-0 select-none pointer-events-none" aria-hidden="true">
          {invisibleText}
        </span>
      </span>
    </>
  );
}
