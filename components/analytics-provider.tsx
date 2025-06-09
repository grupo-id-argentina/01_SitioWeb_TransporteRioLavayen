"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { initMixpanel, trackEvent } from "@/lib/mixpanel-config"
import { usePageTime, useScrollTracking, useClickTracking, useFormTracking } from "@/hooks/use-analytics"

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const clickData = useClickTracking()
  const formData = useFormTracking()

  // Inicializar Mixpanel
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Inicializar Mixpanel
        initMixpanel()

        // Esperar un poco para asegurar que Mixpanel esté listo
        await new Promise((resolve) => setTimeout(resolve, 100))

        setIsReady(true)

        // Track session start después de que esté listo
        trackEvent("Session Started", {
          session_id: generateSessionId(),
          initial_page: window.location.pathname,
        })
      } catch (error) {
        console.error("Error initializing analytics:", error)
        setIsReady(true) // Continuar aunque haya error
      }
    }

    initializeAnalytics()
  }, [])

  // Solo activar hooks cuando esté listo
  const pageTimeData = usePageTime(isReady)
  const scrollData = useScrollTracking(isReady)

  useEffect(() => {
    if (isReady) {
      //useClickTracking()
      //useFormTracking()
    }
  }, [isReady])

  return <>{children}</>
}

// Generar ID de sesión único
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
