'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseTypewriterOptions {
  /** Array of lines to type out sequentially */
  lines: string[]
  /** Milliseconds per character (default: 40) */
  speed?: number
  /** Milliseconds delay between lines (default: 600) */
  lineDelay?: number
  /** Milliseconds before first character (default: 0) */
  startDelay?: number
  /** Whether the typewriter is enabled (default: true) */
  enabled?: boolean
}

interface UseTypewriterReturn {
  /** Lines currently displayed — includes partially typed current line */
  displayedLines: string[]
  /** Index of the line currently being typed (-1 if not started) */
  currentLineIndex: number
  /** True when all lines have been fully typed */
  isComplete: boolean
}

/**
 * useTypewriter — Character-by-character typing animation.
 *
 * Types out an array of strings one character at a time, with configurable
 * speed and delays between lines. Returns the current display state so
 * the component can render partial text + a blinking cursor.
 *
 * Usage:
 * ```tsx
 * const { displayedLines, isComplete } = useTypewriter({
 *   lines: ['$ sudo hire_me --force', '[██████████] 100% LOADED'],
 *   speed: 40,
 *   lineDelay: 600,
 * })
 * ```
 */
export function useTypewriter({
  lines,
  speed = 40,
  lineDelay = 600,
  startDelay = 0,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [completedLines, setCompletedLines] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [started, setStarted] = useState(false)

  // Start after initial delay
  useEffect(() => {
    if (!enabled || started) return

    const timer = setTimeout(() => {
      setStarted(true)
      setCurrentLineIndex(0)
      setCurrentCharIndex(0)
    }, startDelay)

    return () => clearTimeout(timer)
  }, [enabled, startDelay, started])

  // Type characters
  useEffect(() => {
    if (!started || isComplete || currentLineIndex < 0) return
    if (currentLineIndex >= lines.length) {
      setIsComplete(true)
      return
    }

    const currentLine = lines[currentLineIndex]

    // Line fully typed — move to next line after delay
    if (currentCharIndex >= currentLine.length) {
      const timer = setTimeout(() => {
        setCompletedLines((prev) => [...prev, currentLine])
        const nextIndex = currentLineIndex + 1
        if (nextIndex >= lines.length) {
          setIsComplete(true)
        } else {
          setCurrentLineIndex(nextIndex)
          setCurrentCharIndex(0)
        }
      }, lineDelay)

      return () => clearTimeout(timer)
    }

    // Type next character
    const timer = setTimeout(() => {
      setCurrentCharIndex((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [started, isComplete, currentLineIndex, currentCharIndex, lines, speed, lineDelay])

  // Build displayed lines
  const buildDisplayedLines = useCallback((): string[] => {
    if (!started) return []

    const result = [...completedLines]

    // Add partially typed current line
    if (currentLineIndex >= 0 && currentLineIndex < lines.length && !isComplete) {
      result.push(lines[currentLineIndex].slice(0, currentCharIndex))
    }

    return result
  }, [started, completedLines, currentLineIndex, currentCharIndex, lines, isComplete])

  return {
    displayedLines: buildDisplayedLines(),
    currentLineIndex,
    isComplete,
  }
}

export default useTypewriter
