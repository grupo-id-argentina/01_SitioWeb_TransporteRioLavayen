"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact-actions"

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError("")

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Ha ocurrido un error al enviar su mensaje. Por favor, inténtelo más tarde.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50 dark:bg-secondary-900 transition-colors duration-300" id="contacto">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-white">Realiza tu consulta ¡Ahora mismo!</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Estamos listos para atender sus consultas y resolver cualquier duda sobre nuestros servicios de transporte y
            logística.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
          <div className="w-full xl:w-1/2">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 dark:text-white" id="contacto-form">
                Formulario de Consulta
              </h3>

              {submitted ? (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 border border-green-400 text-white px-4 py-3 rounded-lg mb-4 shadow-lg animate-fade-in">
                  <p className="text-sm sm:text-base">
                    ¡Mensaje enviado con éxito! Nos pondremos en contacto con usted a la brevedad.
                  </p>
                </div>
              ) : (
                <form action={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base"
                      >
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base"
                      >
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base"
                      >
                        Teléfono/WhatsApp *
                      </label>
                      <div className="flex">
                        <div className="flex items-center px-3 py-2 sm:py-3 bg-gray-100 dark:bg-gray-600 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                          +549
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="1123456789"
                          maxLength={10}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                            e.target.value = value
                          }}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Ingrese 10 dígitos sin el 0 ni el 15 (ej: 1123456789)
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="subject"
                        className="block text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base"
                      >
                        Asunto *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200 text-sm sm:text-base"
                        required
                      >
                        <option value="">Seleccione un asunto</option>
                        <option value="cotizacion">Solicitar cotización</option>
                        <option value="seguimiento">Seguimiento de envío</option>
                        <option value="reclamo">Reclamo</option>
                        <option value="informacion">Información general</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="message"
                        className="block text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base"
                      >
                        Mensaje *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200 resize-none text-sm sm:text-base"
                        required
                      ></textarea>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 border border-red-400 text-white px-4 py-3 rounded-lg mb-4 shadow-lg">
                      <p className="text-sm sm:text-base">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-400 hover:from-primary-600 hover:to-accent-500 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2" />
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Enviar mensaje</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="w-full xl:w-1/2">
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 h-full">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 dark:text-white">Información de Contacto</h3>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-400 p-2 sm:p-3 rounded-full text-white shadow-lg mr-3 flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-white text-sm sm:text-base">Dirección Principal:</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      LA URBANA S/N EX PQUE. IND. SAN PEDRO DE JUJUY
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-400 p-2 sm:p-3 rounded-full text-white shadow-lg mr-3 flex-shrink-0">
                    <Phone className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-white text-sm sm:text-base">Teléfono/WhatsApp:</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">+54 9 3888 571363 (Administración)</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-400 p-2 sm:p-3 rounded-full text-white shadow-lg mr-3 flex-shrink-0">
                    <Mail className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-white text-sm sm:text-base">Correo electrónico:</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      tteriolavayensanpedro@gmail.com (Administración)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <h4 className="font-medium mb-3 dark:text-white text-sm sm:text-base">Otras Sucursales:</h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-400 p-1.5 sm:p-2 rounded-full text-white shadow-md mr-2 flex-shrink-0">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white text-sm sm:text-base">Rosario - Santa Fe</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">CALLE NETRI 1460</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-400 p-1.5 sm:p-2 rounded-full text-white shadow-md mr-2 flex-shrink-0">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white text-sm sm:text-base">Córdoba Capital</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                        AVENIDA 11 DE SEPTIEMBRE 300
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-400 p-1.5 sm:p-2 rounded-full text-white shadow-md mr-2 flex-shrink-0">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white text-sm sm:text-base">CABA - Buenos Aires</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">MONTEAGUDO 663</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div>
                      <li className="flex items-start relative">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full text-white shadow-md mr-2 flex-shrink-0 animate-pulse">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium dark:text-white">Orán - Salta</p>
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                              ¡NUEVA!
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">SARMIENTO 419</p>
                        </div>
                      </li>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div>
                      <li className="flex items-start relative">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full text-white shadow-md mr-2 flex-shrink-0 animate-pulse">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium dark:text-white">La Quiaca - Jujuy</p>
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                              ¡NUEVA!
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            PROLONGACIÓN ENTRE RÍOS - Bº SANTA CLARA
                          </p>
                        </div>
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
