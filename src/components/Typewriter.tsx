/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  staticText: string;
  dynamicWords: string[];
  align?: 'start' | 'center';
  key?: React.Key;
}

export default function Typewriter({
  staticText,
  dynamicWords,
  align = 'start',
}: TypewriterProps) {
  const [translatedWords, setTranslatedWords] = useState<string[]>(dynamicWords);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  const sourcesRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Keep state updated if original dynamicWords prop changes
  useEffect(() => {
    setTranslatedWords(dynamicWords);
  }, [dynamicWords]);

  // Set up MutationObservers to listen for visual translations on hidden spans
  useEffect(() => {
    const observers: MutationObserver[] = [];

    sourcesRef.current.forEach((el, idx) => {
      if (!el) return;

      const updateWord = () => {
        if (el) {
          const text = el.textContent || dynamicWords[idx];
          setTranslatedWords((prev) => {
            const next = [...prev];
            next[idx] = text;
            return next;
          });
        }
      };

      // Initial read to grab present content
      updateWord();

      const observer = new MutationObserver(updateWord);
      observer.observe(el, { characterData: true, childList: true, subtree: true });
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [dynamicWords]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentList = translatedWords.length > 0 ? translatedWords : dynamicWords;
    const fullWord = currentList[wordIndex % currentList.length] || '';

    if (!isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(fullWord.substring(0, displayedText.length + 1));
        setSpeed(100);
      }, speed);

      if (displayedText === fullWord && fullWord !== '') {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200); // Wait 2.2s on complete word
      }
    } else {
      timer = setTimeout(() => {
        setDisplayedText(fullWord.substring(0, displayedText.length - 1));
        setSpeed(50);
      }, speed);

      if (displayedText === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % currentList.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, wordIndex, translatedWords, dynamicWords, speed]);

  const alignmentClasses = align === 'center' ? 'items-center text-center' : 'items-start text-start';

  return (
    <div className={`flex flex-col ${alignmentClasses}`}>
      {/* Hidden container optimized for browser auto-translators like Google Translate */}
      <div className="absolute opacity-0 pointer-events-none w-px h-px overflow-hidden select-none" aria-hidden="true">
        {dynamicWords.map((word, idx) => (
          <span
            key={idx}
            ref={(el) => {
              sourcesRef.current[idx] = el;
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <span className="block">{staticText}</span>
      <span
        className="font-serif italic text-brand-darkgray relative block min-h-[1.15em] leading-normal mt-1"
        translate="no"
      >
        {displayedText || '\u200B'}
        <span className="typing-cursor"></span>
      </span>
    </div>
  );
}
