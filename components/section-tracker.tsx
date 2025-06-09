"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/mixpanel-config"

interface SectionTrackerProps {
  sectionName: string
  children: React.ReactNode
  threshold?: number
}

export function SectionTracker({ sectionName, children, threshold = 0.5 }: SectionTrackerProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasBeenViewed = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenViewed.current) {
            hasBeenViewed.current = true
            trackEvent("Section Viewed", {
              page: pathname,
              section_name: sectionName,
              intersection_ratio: entry.intersectionRatio,
              viewport_position: entry.boundingClientRect.top,
            })
          }
        })
      },
      {
        threshold,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [sectionName, pathname, threshold])

  return (
    <div ref={sectionRef} data-section={sectionName}>
      {children}
    </div>
  )
}
