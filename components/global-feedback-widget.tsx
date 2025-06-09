"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, X, Send, ThumbsUp } from "lucide-react"
import { submitFeedback } from "@/app/actions/contact-actions"
import { trackEvent } from "@/lib/mixpanel-config"

interface GlobalFeedbackWidgetProps {
  paginaOrigen?: string
}

export function GlobalFeedbackWidget({ paginaOrigen = "general" }: GlobalFeedbackWidgetProps) {
  const [showWidget, setShowWidget] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [timeoutTriggered, setTimeoutTriggered] = useState(false)

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
          trackEvent("Feedback Widget Timeout Triggered", {
            pagina_origen: paginaOrigen,
            tiempo_inactividad: 59,
            url_actual: window.location.href,
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
  }, [timeoutTriggered, showWidget, submitted, paginaOrigen])

  // Mostrar widget al final de flujos importantes
  useEffect(() => {
    const handleShowFeedback = (event: CustomEvent) => {
      if (!submitted && !showWidget) {
        setShowWidget(true)

        // Track manual trigger
        trackEvent("Feedback Widget Manual Triggered", {
          pagina_origen: paginaOrigen,
          trigger_type: event.detail?.trigger || "manual",
          url_actual: window.location.href,
        })
      }
    }

    window.addEventListener("showFeedbackWidget" as any, handleShowFeedback)

    return () => {
      window.removeEventListener("showFeedbackWidget" as any, handleShowFeedback)
    }
  }, [submitted, showWidget, paginaOrigen])

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
      formData.append("rating", rating.toString())
      formData.append("feedback", feedback)
      formData.append("name", name)
      formData.append("email", email)
      formData.append("pagina_origen", paginaOrigen)

      const result = await submitFeedback(formData)

      if (result.success) {
        setSubmitted(true)

        // Track successful feedback submission
        trackEvent("Global Feedback Submitted", {
          rating: rating,
          pagina_origen: paginaOrigen,
          has_comment: feedback.length > 0,
          has_name: name.length > 0,
          has_email: email.length > 0,
          trigger_type: timeoutTriggered ? "timeout" : "manual",
          url_actual: window.location.href,
        })

        setTimeout(() => {
          setShowWidget(false)
        }, 3000)
      } else {
        setError(result.message || "Error al enviar el feedback")
      }
    } catch (err) {
      setError("Ha ocurrido un error. Por favor, inténtalo más tarde.")
      console.error("Error al enviar feedback:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeWidget = () => {
    setShowWidget(false)

    // Track widget close
    trackEvent("Feedback Widget Closed", {
      pagina_origen: paginaOrigen,
      submitted: submitted,
      rating_given: rating > 0,
      trigger_type: timeoutTriggered ? "timeout" : "manual",
      url_actual: window.location.href,
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
            <div className="text-center py-2">
              <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">
                ¡Gracias por tu feedback!
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Tu opinión nos ayuda a mejorar</p>
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
                    onClick={() => {
                      setRating(star)
                      if (star >= 4) {
                        // Para calificaciones altas, enviar directamente
                        const formData = new FormData()
                        formData.append("rating", star.toString())
                        formData.append("feedback", "Calificación rápida")
                        formData.append("pagina_origen", paginaOrigen)

                        submitFeedback(formData).then(() => {
                          setSubmitted(true)
                          trackEvent("Quick Feedback Submitted", {
                            rating: star,
                            pagina_origen: paginaOrigen,
                            trigger_type: timeoutTriggered ? "timeout" : "manual",
                          })
                        })
                      } else {
                        // Para calificaciones bajas, mostrar formulario completo
                        setShowForm(true)
                      }
                    }}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Calificación *</label>
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
            </div>

            {/* Comentario */}
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comentario (opcional)
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white text-sm"
                placeholder="¿Qué te pareció? ¿Cómo podemos mejorar?"
              />
            </div>

            {/* Nombre y Email en una fila */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white text-sm"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-secondary-700 dark:text-white text-sm"
                  placeholder="tu@email.com"
                />
              </div>
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
                disabled={isSubmitting || rating === 0}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <Send className="mr-1 h-3 w-3" />
                    <span>Enviar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
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
