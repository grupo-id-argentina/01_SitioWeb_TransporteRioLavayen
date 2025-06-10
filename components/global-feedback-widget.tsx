"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, X, Send, ThumbsUp } from "lucide-react"
import { submitExperienciaUsuario } from "@/app/actions/contact-actions"
import { trackEvent } from "@/lib/mixpanel-config"

interface GlobalFeedbackWidgetProps {
  paginaOrigen?: string
}

export function GlobalFeedbackWidget({ paginaOrigen = "general" }: GlobalFeedbackWidgetProps) {
  const [showWidget, setShowWidget] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comentario, setComentario] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [timeoutTriggered, setTimeoutTriggered] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [startTime] = useState(() => Date.now())

  // Timer para mostrar el widget después de 59 segundos de inactividad
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout
    let lastActivity = Date.now()

    const resetTimer = () => {
      lastActivity = Date.now()
      clearTimeout(inactivityTimer)

      inactivityTimer = setTimeout(() => {
        if (!timeoutTriggered && !showWidget && !submitted) {
          setShowWidget(true)
          setTimeoutTriggered(true)

          // Track timeout trigger
          trackEvent("Widget Experiencia Mostrado por Timeout", {
            pagina_origen: paginaOrigen,
            tiempo_inactividad: 59,
            url_actual: window.location.href,
            session_id: sessionId,
          })
        }
      }, 59000) // 59 segundos
    }

    const handleActivity = () => {
      resetTimer()
    }

    // Eventos que resetean el timer
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    resetTimer()

    return () => {
      clearTimeout(inactivityTimer)
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [timeoutTriggered, showWidget, submitted, paginaOrigen, sessionId])

  // Mostrar widget al final de flujos importantes
  useEffect(() => {
    const handleShowFeedback = (event: CustomEvent) => {
      if (!submitted && !showWidget) {
        setShowWidget(true)

        // Track manual trigger
        trackEvent("Widget Experiencia Mostrado Manualmente", {
          pagina_origen: paginaOrigen,
          trigger_type: event.detail?.trigger || "manual",
          url_actual: window.location.href,
          session_id: sessionId,
        })
      }
    }

    window.addEventListener("showFeedbackWidget" as any, handleShowFeedback)

    return () => {
      window.removeEventListener("showFeedbackWidget" as any, handleShowFeedback)
    }
  }, [submitted, showWidget, paginaOrigen, sessionId])

  const calcularTiempoEnPagina = () => {
    return Math.floor((Date.now() - startTime) / 1000) // en segundos
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Por favor, selecciona una calificación")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("pagina", paginaOrigen)
      formData.append("accion", timeoutTriggered ? "feedback_timeout" : "feedback_manual")
      formData.append("calificacion", rating.toString())
      formData.append("comentario", comentario)
      formData.append("tiempo_en_pagina", calcularTiempoEnPagina().toString())
      formData.append("session_id", sessionId)

      const result = await submitExperienciaUsuario(formData)

      if (result.success) {
        setSubmitted(true)

        // Track successful submission
        trackEvent("Experiencia Usuario Enviada", {
          calificacion: rating,
          pagina: paginaOrigen,
          accion: timeoutTriggered ? "feedback_timeout" : "feedback_manual",
          tiene_comentario: comentario.length > 0,
          tiempo_en_pagina: calcularTiempoEnPagina(),
          trigger_type: timeoutTriggered ? "timeout" : "manual",
          session_id: sessionId,
          url_actual: window.location.href,
        })

        setTimeout(() => {
          setShowWidget(false)
        }, 4000)
      } else {
        setError(result.message || "Error al enviar la experiencia")
      }
    } catch (err) {
      setError("Ha ocurrido un error. Por favor, inténtalo más tarde.")
      console.error("Error al enviar experiencia:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickRating = async (star: number) => {
    setRating(star)

    if (star >= 4) {
      // Para calificaciones altas, enviar directamente
      const formData = new FormData()
      formData.append("pagina", paginaOrigen)
      formData.append("accion", timeoutTriggered ? "feedback_rapido_timeout" : "feedback_rapido_manual")
      formData.append("calificacion", star.toString())
      formData.append("comentario", "Calificación rápida - experiencia positiva")
      formData.append("tiempo_en_pagina", calcularTiempoEnPagina().toString())
      formData.append("session_id", sessionId)

      try {
        const result = await submitExperienciaUsuario(formData)
        if (result.success) {
          setSubmitted(true)

          trackEvent("Experiencia Usuario Rapida", {
            calificacion: star,
            pagina: paginaOrigen,
            accion: timeoutTriggered ? "feedback_rapido_timeout" : "feedback_rapido_manual",
            tiempo_en_pagina: calcularTiempoEnPagina(),
            trigger_type: timeoutTriggered ? "timeout" : "manual",
            session_id: sessionId,
          })

          setTimeout(() => {
            setShowWidget(false)
          }, 3000)
        }
      } catch (error) {
        console.error("Error al enviar calificación rápida:", error)
        setShowForm(true) // Fallback al formulario completo
      }
    } else {
      // Para calificaciones bajas, mostrar formulario completo
      setShowForm(true)
    }
  }

  const closeWidget = () => {
    setShowWidget(false)

    // Track widget close
    trackEvent("Widget Experiencia Cerrado", {
      pagina: paginaOrigen,
      enviado: submitted,
      calificacion_dada: rating > 0,
      trigger_type: timeoutTriggered ? "timeout" : "manual",
      tiempo_en_pagina: calcularTiempoEnPagina(),
      session_id: sessionId,
    })
  }

  if (!showWidget) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      {!showForm ? (
        // Widget inicial compacto
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-2xl border border-gray-200 dark:border-secondary-600 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-full mr-3">
                <ThumbsUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">¿Cómo va tu experiencia?</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {timeoutTriggered ? "Notamos que llevas un tiempo navegando" : "Tu opinión nos importa"}
                </p>
              </div>
            </div>
            <button
              onClick={closeWidget}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-4 animate-fade-in">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm font-semibold mb-1">¡Experiencia enviada!</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                Gracias por ayudarnos a mejorar nuestro servicio
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full animate-progress"
                  style={{ width: "100%", animation: "progress 3s linear forwards" }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`transition-colors ${
                      star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleQuickRating(star)}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 text-xs bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-3 rounded-md transition-all duration-200"
                >
                  Comentar
                </button>
                <button
                  onClick={closeWidget}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 py-2 px-3"
                >
                  Ahora no
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Formulario completo
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-2xl border border-gray-200 dark:border-secondary-600 p-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Comparte tu experiencia</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Calificación * ({rating}/5)
              </label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`transition-colors ${
                      star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
                  {rating === 1 && "Muy mala experiencia"}
                  {rating === 2 && "Mala experiencia"}
                  {rating === 3 && "Experiencia regular"}
                  {rating === 4 && "Buena experiencia"}
                  {rating === 5 && "Excelente experiencia"}
                </p>
              )}
            </div>

            {/* Comentario */}
            <div>
              <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comentario {rating <= 3 ? "*" : "(opcional)"}
              </label>
              <textarea
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                required={rating <= 3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white text-sm"
                placeholder={
                  rating <= 3 ? "Por favor, cuéntanos qué podemos mejorar..." : "¿Qué te gustó más? ¿Alguna sugerencia?"
                }
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors text-sm"
                disabled={isSubmitting}
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || (rating <= 3 && !comentario.trim())}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <Send className="mr-1 h-3 w-3" />
                    <span>Enviar Experiencia</span>
                  </>
                )}
              </button>
            </div>
          </form>
          {submitted && (
            <div className="text-center py-4 animate-fade-in">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-green-600 dark:text-green-400 text-sm font-semibold mb-1">¡Experiencia enviada!</div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                Gracias por ayudarnos a mejorar nuestro servicio
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full animate-progress"
                  style={{ width: "100%", animation: "progress 3s linear forwards" }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Agregar estilos para las animaciones
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes progress {
    from { width: 0%; }
    to { width: 100%; }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  .animate-progress {
    animation: progress 3s linear forwards;
  }
`

// Inyectar estilos si no existen
if (typeof document !== "undefined" && !document.getElementById("feedback-widget-styles")) {
  const styleSheet = document.createElement("style")
  styleSheet.id = "feedback-widget-styles"
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

// Hook para disparar el widget manualmente
export const useFeedbackWidget = () => {
  const showFeedbackWidget = (trigger?: string) => {
    const event = new CustomEvent("showFeedbackWidget", {
      detail: { trigger },
    })
    window.dispatchEvent(event)
  }

  return { showFeedbackWidget }
}
