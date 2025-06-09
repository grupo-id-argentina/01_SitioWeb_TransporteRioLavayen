"use client"

import type React from "react"

import { useState } from "react"
import { Star, Send, CheckCircle } from "lucide-react"
import { submitFeedback } from "@/app/actions/contact-actions"

interface ShareExperienceProps {
  onClose?: () => void
  paginaOrigen?: string
}

export function ShareExperience({ onClose, paginaOrigen = "general" }: ShareExperienceProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError("Por favor, selecciona una calificación")
      return
    }

    if (!feedback.trim()) {
      setError("Por favor, comparte tu experiencia")
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
        setTimeout(() => {
          onClose?.()
        }, 2000)
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

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Gracias por tu feedback!</h3>
          <p className="text-gray-600">Tu experiencia nos ayuda a mejorar nuestros servicios.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Comparte tu experiencia</h3>
        <p className="text-gray-600">Tu opinión nos ayuda a mejorar nuestros servicios</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating con estrellas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Calificación *</label>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`p-1 transition-colors ${
                  star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star className="h-8 w-8 fill-current" />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">
            {rating > 0 && (
              <>
                {rating === 1 && "Muy malo"}
                {rating === 2 && "Malo"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bueno"}
                {rating === 5 && "Excelente"}
              </>
            )}
          </p>
        </div>

        {/* Comentario */}
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Cuéntanos tu experiencia *
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="¿Qué te pareció nuestro servicio? ¿Cómo podemos mejorar?"
            required
          />
        </div>

        {/* Nombre (opcional) */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre (opcional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Tu nombre"
          />
        </div>

        {/* Email (opcional) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email (opcional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="tu@email.com"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex space-x-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Enviando...</span>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                <span>Enviar feedback</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
