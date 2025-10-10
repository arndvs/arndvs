"use client"

import { useState, useEffect, useRef } from "react"
import { CodeXml } from "lucide-react"

const nameVariations = [
  { text: "Aaron Davis", style: "normal" },
  { text: "arndvs.com", style: "binary" },
]

const glitchChars = "!<>-_\\/[]{}—=+*^?#________"

export function GlitchName() {
  const [isHovering, setIsHovering] = useState(false)
  const [currentText, setCurrentText] = useState("Aaron Davis")
  const [displayText, setDisplayText] = useState("Aaron Davis")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const identityIndexRef = useRef(0)

  const scrambleText = (target: string, progress: number) => {
    return target
      .split("")
      .map((char, index) => {
        if (char === " ") return " "
        if (index < progress) return target[index]
        return glitchChars[Math.floor(Math.random() * glitchChars.length)]
      })
      .join("")
  }

  useEffect(() => {
    if (isHovering) {
      let progress = 0
      const targetIndex = (identityIndexRef.current + 1) % nameVariations.length
      const target = nameVariations[targetIndex].text

      glitchIntervalRef.current = setInterval(() => {
        progress += 1
        if (progress <= target.length) {
          setDisplayText(scrambleText(target, progress))
        } else {
          setCurrentText(target)
          setDisplayText(target)
          identityIndexRef.current = targetIndex
          if (glitchIntervalRef.current) {
            clearInterval(glitchIntervalRef.current)
          }
        }
      }, 50)

      intervalRef.current = setInterval(() => {
        const nextIndex = (identityIndexRef.current + 1) % nameVariations.length
        const nextTarget = nameVariations[nextIndex].text
        let nextProgress = 0

        if (glitchIntervalRef.current) {
          clearInterval(glitchIntervalRef.current)
        }

        glitchIntervalRef.current = setInterval(() => {
          nextProgress += 1
          if (nextProgress <= nextTarget.length) {
            setDisplayText(scrambleText(nextTarget, nextProgress))
          } else {
            setCurrentText(nextTarget)
            setDisplayText(nextTarget)
            identityIndexRef.current = nextIndex
            if (glitchIntervalRef.current) {
              clearInterval(glitchIntervalRef.current)
            }
          }
        }, 50)
      }, 2000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current)

      let progress = 0
      const target = "Aaron Davis"

      glitchIntervalRef.current = setInterval(() => {
        progress += 1
        if (progress <= target.length) {
          setDisplayText(scrambleText(target, progress))
        } else {
          setCurrentText(target)
          setDisplayText(target)
          identityIndexRef.current = 0
          if (glitchIntervalRef.current) {
            clearInterval(glitchIntervalRef.current)
          }
        }
      }, 50)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (glitchIntervalRef.current) clearInterval(glitchIntervalRef.current)
    }
  }, [isHovering])

  return (
    <>
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
        }
      `}</style>
      <div
        className="flex items-center gap-2 cursor-pointer select-none group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CodeXml className={`transition-all duration-300 ${isHovering ? "rotate-180 text-primary" : ""}`} />
        <span
          className={`text-lg font-semibold tracking-tight transition-all duration-200 ${
            isHovering ? "text-primary" : ""
          }`}
          style={{
            fontFamily: "monospace",
          }}
        >
          {displayText}
        </span>
      </div>
    </>
  )
}
