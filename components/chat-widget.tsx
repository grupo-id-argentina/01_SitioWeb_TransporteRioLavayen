"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X, Send, User } from "lucide-react"
import { submitChatSupport } from "@/app/actions/contact-actions"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    position: "",
    whatsapp: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Validar campos requeridos
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.whatsapp || !formData.message) {
        setError("Por favor complete todos los campos requeridos.")
        setIsSubmitting(false)
        return
      }

      if (!formData.whatsapp.trim() || formData.whatsapp.length !== 10) {
        setError("Por favor ingrese un número de WhatsApp válido de 10 dígitos.")
        setIsSubmitting(false)
        return
      }

      // Crear FormData para enviar al servidor
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      // Enviar datos al servidor
      const result = await submitChatSupport(formDataToSend)

      if (result.success) {
        console.log("Chat form enviado exitosamente")
        setSubmitted(true)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          position: "",
          whatsapp: "",
          message: "",
        })
      } else {
        setError(result.message || "Error al enviar el mensaje. Inténtelo nuevamente.")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Ha ocurrido un error al enviar su mensaje. Por favor, inténtelo más tarde.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      position: "",
      whatsapp: "",
      message: "",
    })
    setError("")
  }

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className={`
            bg-gradient-to-r from-primary-500 to-accent-400 hover:from-primary-600 hover:to-accent-500
            text-white rounded-full p-4 shadow-lg hover:shadow-xl
            transform transition-all duration-300 hover:scale-110
            animate-bounce-gentle
            ${isOpen ? "scale-0" : "scale-100"}
          `}
        >
          <MessageCircle className="h-6 w-6" />
        </button>

        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          !
        </div>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-6 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-400 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Soporte Técnico</h3>
                  <p className="text-sm opacity-90">En línea</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {!submitted ? (
                <>
                  <div className="mb-4">
                    <div className="bg-gray-100 dark:bg-secondary-700 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        ¡Hola! 👋 Soy el asistente de soporte técnico. ¿En qué puedo ayudarte hoy?
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {error && (
                      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-3 py-2 rounded mb-2">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Nombre *"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Apellido *"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Correo electrónico *"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                      required
                    />

                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Empresa"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                    />

                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Cargo"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                    />

                    <div>
                      <label htmlFor="whatsapp" className="block text-gray-700 dark:text-gray-300 mb-2">
                        WhatsApp *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 dark:border-secondary-600 bg-gray-50 dark:bg-secondary-600 text-gray-500 dark:text-gray-300 rounded-l-md font-medium">
                          +549
                        </span>
                        <input
                          type="tel"
                          id="whatsapp"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                            setFormData((prev) => ({ ...prev, whatsapp: value }))
                          }}
                          placeholder="1123456789"
                          maxLength={10}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-secondary-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                          required
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Ingrese 10 dígitos sin el 0 ni el 15 (ej: 1123456789)
                      </p>
                    </div>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="¿En qué podemos ayudarte? *"
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white resize-none"
                      required
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary-500 to-accent-400 hover:from-primary-600 hover:to-accent-500 text-white py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar mensaje
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">¡Mensaje enviado!</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    Gracias por contactarnos. Nuestro equipo se pondrá en contacto contigo pronto.
                  </p>
                  <button onClick={resetForm} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Enviar otro mensaje
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
