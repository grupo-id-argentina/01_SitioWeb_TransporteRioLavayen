"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/mixpanel-config"

// Hook para tracking de tiempo en página
export const usePageTime = (isReady = true) => {
  const startTime = useRef<number>(Date.now())
  const pathname = usePathname()
  const [timeSpent, setTimeSpent] = useState(0)
  const hasTrackedPageView = useRef(false)

  useEffect(() => {
    if (!isReady) return

    startTime.current = Date.now()
    hasTrackedPageView.current = false

    // Track page view solo una vez cuando esté listo
    const trackPageView = () => {
      if (!hasTrackedPageView.current && isReady) {
        trackEvent("Page Viewed", {
          page: pathname,
          page_title: typeof document !== "undefined" ? document.title : "",
        })
        hasTrackedPageView.current = true
      }
    }

    // Delay para asegurar que Mixpanel esté listo
    const pageViewTimer = setTimeout(trackPageView, 200)

    const interval = setInterval(() => {
      const currentTime = Date.now() - startTime.current
      setTimeSpent(currentTime)
    }, 1000)

    const handleBeforeUnload = () => {
      if (!isReady) return
      const totalTime = Date.now() - startTime.current
      trackEvent("Time on Page", {
        page: pathname,
        time_on_page: Math.round(totalTime / 1000),
        engagement_score: calculateEngagementScore(totalTime),
      })
    }

    const handleVisibilityChange = () => {
      if (!isReady || document.visibilityState !== "hidden") return
      const totalTime = Date.now() - startTime.current
      trackEvent("Page Exit", {
        page: pathname,
        time_on_page: Math.round(totalTime / 1000),
        exit_type: "visibility_change",
      })
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      clearTimeout(pageViewTimer)
      clearInterval(interval)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      if (isReady) {
        const totalTime = Date.now() - startTime.current
        trackEvent("Session Ended", {
          page: pathname,
          time_on_page: Math.round(totalTime / 1000),
        })
      }
    }
  }, [pathname, isReady])

  return { timeSpent: Math.round(timeSpent / 1000) }
}

// Hook para tracking de scroll
export const useScrollTracking = (isReady = true) => {
  const [scrollDepth, setScrollDepth] = useState(0)
  const maxScrollRef = useRef(0)
  const pathname = usePathname()
  const trackedMilestones = useRef(new Set<number>())

  useEffect(() => {
    if (!isReady) return

    // Reset milestones para nueva página
    trackedMilestones.current.clear()
    maxScrollRef.current = 0

    const handleScroll = () => {
      if (!isReady) return

      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      setScrollDepth(scrollPercent)

      if (scrollPercent > maxScrollRef.current) {
        maxScrollRef.current = scrollPercent

        // Track scroll milestones
        const milestones = [25, 50, 75, 100]
        for (const milestone of milestones) {
          if (scrollPercent >= milestone && !trackedMilestones.current.has(milestone)) {
            trackedMilestones.current.add(milestone)
            trackEvent("Scroll Depth", {
              page: pathname,
              scroll_depth: milestone,
              milestone: `${milestone}%`,
            })
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname, isReady])

  return { scrollDepth, maxScroll: maxScrollRef.current }
}

// Hook para tracking de clicks globales
export const useClickTracking = (isReady = true) => {
  const pathname = usePathname()

  useEffect(() => {
    if (!isReady) return

    const handleClick = (event: MouseEvent) => {
      if (!isReady) return

      const target = event.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const elementText = target.textContent?.trim().substring(0, 100) || ""
      const elementId = target.id || ""
      const elementClass = typeof target.className === "string" ? target.className : ""
      const href = target.getAttribute("href") || ""

      // Determinar tipo de elemento
      let elementType = tagName
      if (tagName === "a") elementType = "link"
      else if (tagName === "button") elementType = "button"
      else if (target.closest("button")) elementType = "button"
      else if (target.closest("a")) elementType = "link"
      else if (["input", "select", "textarea"].includes(tagName)) elementType = "form_field"

      // Track click
      trackEvent("Button Click", {
        page: pathname,
        element_type: elementType,
        element_text: elementText,
        element_id: elementId,
        element_class: elementClass,
        href: href,
        click_position: `${event.clientX},${event.clientY}`,
        tag_name: tagName,
      })

      // Track specific interactions
      if (tagName === "a" && href) {
        const isExternal = href.startsWith("http") && !href.includes(window.location.hostname)
        trackEvent(isExternal ? "External Link Click" : "Link Click", {
          page: pathname,
          link_text: elementText,
          link_url: href,
          is_external: isExternal,
        })
      }

      // Track navigation clicks
      const classString = typeof elementClass === "string" ? elementClass : ""
      if (target.closest("nav") || classString.includes("nav")) {
        trackEvent("Navigation Click", {
          page: pathname,
          nav_item: elementText,
          nav_url: href,
        })
      }

      // Track CTA clicks
      if (
        classString.includes("cta") ||
        elementText.toLowerCase().includes("contacto") ||
        elementText.toLowerCase().includes("calcular") ||
        elementText.toLowerCase().includes("enviar")
      ) {
        trackEvent("CTA Click", {
          page: pathname,
          cta_text: elementText,
          cta_type: determineCTAType(elementText),
        })
      }
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [pathname, isReady])
}

// Hook para tracking de formularios
export const useFormTracking = (isReady = true) => {
  const pathname = usePathname()

  useEffect(() => {
    if (!isReady) return

    const handleFocus = (event: FocusEvent) => {
      if (!isReady) return

      const target = event.target as HTMLElement
      if (["input", "select", "textarea"].includes(target.tagName.toLowerCase())) {
        trackEvent("Form Field Focus", {
          page: pathname,
          field_name: target.getAttribute("name") || target.getAttribute("id") || "",
          field_type: target.getAttribute("type") || target.tagName.toLowerCase(),
          form_name: target.closest("form")?.getAttribute("name") || "unknown",
        })
      }
    }

    const handleBlur = (event: FocusEvent) => {
      if (!isReady) return

      const target = event.target as HTMLInputElement
      if (["input", "select", "textarea"].includes(target.tagName.toLowerCase())) {
        trackEvent("Form Field Blur", {
          page: pathname,
          field_name: target.getAttribute("name") || target.getAttribute("id") || "",
          field_type: target.getAttribute("type") || target.tagName.toLowerCase(),
          has_value: target.value.length > 0,
          value_length: target.value.length,
        })
      }
    }

    document.addEventListener("focus", handleFocus, true)
    document.addEventListener("blur", handleBlur, true)

    return () => {
      document.removeEventListener("focus", handleFocus, true)
      document.removeEventListener("blur", handleBlur, true)
    }
  }, [pathname, isReady])
}

// Funciones auxiliares
const calculateEngagementScore = (timeSpent: number): number => {
  // Calcular puntuación de engagement basada en tiempo
  const minutes = timeSpent / (1000 * 60)
  if (minutes < 0.5) return 1
  if (minutes < 2) return 2
  if (minutes < 5) return 3
  if (minutes < 10) return 4
  return 5
}

const determineCTAType = (text: string): string => {
  const lowerText = text.toLowerCase()
  if (lowerText.includes("calcul")) return "calculator"
  if (lowerText.includes("contact")) return "contact"
  if (lowerText.includes("enviar") || lowerText.includes("submit")) return "submit"
  if (lowerText.includes("whatsapp")) return "whatsapp"
  if (lowerText.includes("cotiz")) return "quote"
  return "other"
}
