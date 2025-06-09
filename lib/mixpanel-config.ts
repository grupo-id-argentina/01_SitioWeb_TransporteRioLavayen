import mixpanel from "mixpanel-browser"

// Variable para controlar si Mixpanel está inicializado
let isInitialized = false
let initializationPromise: Promise<void> | null = null

// Configuración de Mixpanel con el token correcto
export const initMixpanel = (): Promise<void> => {
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve()
      return
    }

    if (isInitialized) {
      resolve()
      return
    }

    try {
      // Configuración con el token correcto
      mixpanel.init("4fde28a4283ffdbe8e8c0b1ae36e6207", {
        debug: false,
        track_pageview: false,
        persistence: "localStorage",
        property_blacklist: [],
        ignore_dnt: true,
        batch_requests: true,
        batch_size: 50,
        batch_flush_interval_ms: 5000,
        request_timeout_ms: 10000,
        loaded: (mixpanel) => {
          console.log("✅ Mixpanel loaded successfully")
          isInitialized = true
          resolve()
        },
        error: (error) => {
          console.error("❌ Mixpanel initialization error:", error)
          isInitialized = false
          reject(error)
        },
      })

      // Timeout de seguridad para la inicialización
      setTimeout(() => {
        if (!isInitialized) {
          console.warn("⚠️ Mixpanel initialization timeout, marking as initialized anyway")
          isInitialized = true
          resolve()
        }
      }, 3000)
    } catch (error) {
      console.error("❌ Error initializing Mixpanel:", error)
      isInitialized = false
      reject(error)
    }
  })

  return initializationPromise
}

// Verificar si Mixpanel está disponible y inicializado
const isMixpanelReady = (): boolean => {
  return typeof window !== "undefined" && typeof mixpanel !== "undefined" && mixpanel.get_config && isInitialized
}

// Mapeo de eventos en inglés a español para Mixpanel
export const eventTranslations: Record<string, string> = {
  // Navegación y páginas
  "Page Viewed": "Página Vista",
  "Navigation Click": "Click de Navegación",
  "Logo Click": "Click en Logo",
  "Menu Toggle": "Toggle de Menú",
  "Theme Toggle": "Cambio de Tema",
  "External Link Click": "Click en Enlace Externo",

  // Calculadora
  "Calculator Page Viewed": "Calculadora - Página Vista",
  "Calculator Deposito Selected": "Calculadora - Depósito Seleccionado",
  "Calculator Zona Selected": "Calculadora - Zona Seleccionada",
  "Calculator Localidad Selected": "Calculadora - Localidad Seleccionada",
  "Calculator Tipo Carga Selected": "Calculadora - Tipo de Carga Seleccionado",
  "Calculator IVA Toggle": "Calculadora - Toggle IVA",
  "Calculator Seguro Toggle": "Calculadora - Toggle Seguro",
  "Calculator Valor Mercaderia Changed": "Calculadora - Valor Mercadería Cambiado",
  "Calculator Calculation Started": "Calculadora - Cálculo Iniciado",
  "Calculator Calculation Completed": "Calculadora - Cálculo Completado",
  "Calculator Calculation Error": "Calculadora - Error en Cálculo",
  "Calculator Form Reset": "Calculadora - Formulario Reiniciado",
  "Calculator Error": "Calculadora - Error",

  // WhatsApp Flow
  "WhatsApp Flow Started": "WhatsApp - Flujo Iniciado",
  "WhatsApp Flow Modal Closed": "WhatsApp - Modal Cerrado",
  "WhatsApp Flow Step Changed": "WhatsApp - Cambio de Paso",
  "WhatsApp Flow Step Navigation": "WhatsApp - Navegación de Pasos",
  "WhatsApp Recipient Selected": "WhatsApp - Destinatario Seleccionado",
  "WhatsApp Form Field Changed": "WhatsApp - Campo de Formulario Cambiado",
  "WhatsApp Form Validation Error": "WhatsApp - Error de Validación",
  "WhatsApp Message Sent": "WhatsApp - Mensaje Enviado",
  "WhatsApp Flow Feedback Selected": "WhatsApp - Feedback Seleccionado",
  "WhatsApp Flow Redirect Started": "WhatsApp - Redirección Iniciada",
  "WhatsApp Flow Redirect Completed": "WhatsApp - Redirección Completada",

  // Formularios
  "Contact Form Submitted": "Formulario de Contacto Enviado",
  "Contact Form Error": "Formulario de Contacto - Error",
  "Partnership Form Submitted": "Formulario de Convenios Enviado",
  "Partnership Form Error": "Formulario de Convenios - Error",
  "Chat Support Submitted": "Chat de Soporte Enviado",
  "Chat Support Error": "Chat de Soporte - Error",
  "Feedback Submitted": "Feedback Enviado",
  "Feedback Error": "Feedback - Error",

  // Interacciones generales
  "Button Click": "Click en Botón",
  "Link Click": "Click en Enlace",
  "Form Field Focus": "Foco en Campo de Formulario",
  "Form Field Blur": "Pérdida de Foco en Campo",
  "Scroll Event": "Evento de Scroll",
  "Section Viewed": "Sección Vista",
  "CTA Click": "Click en Call-to-Action",
  "Service Modal Opened": "Modal de Servicio Abierto",
  "Service Modal Closed": "Modal de Servicio Cerrado",

  // Tiempo y engagement
  "Session Started": "Sesión Iniciada",
  "Session Ended": "Sesión Terminada",
  "Time on Page": "Tiempo en Página",
  "Engagement Event": "Evento de Engagement",
  "Scroll Depth": "Profundidad de Scroll",
  "Page Exit": "Salida de Página",

  // Chat Widget
  "Chat Widget Opened": "Widget de Chat Abierto",
  "Chat Widget Closed": "Widget de Chat Cerrado",
  "Chat Form Submitted": "Formulario de Chat Enviado",
  "Chat Form Reset": "Formulario de Chat Reiniciado",
}

// Mapeo de propiedades en inglés a español
export const propertyTranslations: Record<string, string> = {
  // Información de página
  page: "página",
  page_title: "título_página",
  page_url: "url_página",
  referrer: "referente",
  user_agent: "agente_usuario",
  screen_resolution: "resolución_pantalla",
  viewport_size: "tamaño_viewport",

  // Información de usuario
  session_id: "id_sesión",
  user_id: "id_usuario",
  timestamp: "marca_tiempo",
  device_type: "tipo_dispositivo",
  browser: "navegador",
  os: "sistema_operativo",

  // Calculadora
  cotizacion_id: "id_cotización",
  deposito: "depósito",
  zona: "zona",
  localidad: "localidad",
  tipo_carga: "tipo_carga",
  cantidad: "cantidad",
  costo_final: "costo_final",
  distancia: "distancia",
  incluir_iva: "incluir_iva",
  desea_seguro: "desea_seguro",
  valor_mercaderia: "valor_mercadería",

  // WhatsApp
  recipient_type: "tipo_destinatario",
  whatsapp_number: "número_whatsapp",
  usuario_nombre: "nombre_usuario",
  usuario_whatsapp: "whatsapp_usuario",
  feedback_type: "tipo_feedback",
  paso: "paso",
  from_step: "paso_origen",
  to_step: "paso_destino",

  // Interacciones
  element_type: "tipo_elemento",
  element_text: "texto_elemento",
  element_id: "id_elemento",
  element_class: "clase_elemento",
  click_position: "posición_click",
  scroll_depth: "profundidad_scroll",
  time_on_page: "tiempo_en_página",
  engagement_score: "puntuación_engagement",

  // Formularios
  form_name: "nombre_formulario",
  field_name: "nombre_campo",
  field_value: "valor_campo",
  validation_error: "error_validación",
  form_completion_time: "tiempo_completado_formulario",

  // Errores
  error_type: "tipo_error",
  error_message: "mensaje_error",
  error_code: "código_error",
}

// Función para traducir eventos
export const translateEvent = (eventName: string): string => {
  return eventTranslations[eventName] || eventName
}

// Función para traducir propiedades
export const translateProperties = (properties: Record<string, any>): Record<string, any> => {
  const translatedProperties: Record<string, any> = {}

  for (const [key, value] of Object.entries(properties)) {
    const translatedKey = propertyTranslations[key] || key
    translatedProperties[translatedKey] = value
  }

  return translatedProperties
}

// Cola de eventos para cuando Mixpanel no esté listo
let eventQueue: Array<{ eventName: string; properties: Record<string, any> }> = []

// Función para procesar la cola de eventos
const processEventQueue = () => {
  if (!isMixpanelReady() || eventQueue.length === 0) {
    return
  }

  const eventsToProcess = [...eventQueue]
  eventQueue = []

  eventsToProcess.forEach(({ eventName, properties }) => {
    try {
      const translatedEvent = translateEvent(eventName)
      const translatedProperties = translateProperties(properties)

      // Agregar información de contexto
      const contextProperties = {
        ...translatedProperties,
        marca_tiempo: new Date().toISOString(),
        procesado_desde_cola: true,
      }

      if (typeof window !== "undefined") {
        contextProperties.url_página = window.location.href
        contextProperties.título_página = document.title
        contextProperties.referente = document.referrer || ""
        contextProperties.agente_usuario = navigator.userAgent
        contextProperties.resolución_pantalla = `${screen.width}x${screen.height}`
        contextProperties.tamaño_viewport = `${window.innerWidth}x${window.innerHeight}`
        contextProperties.tipo_dispositivo =
          window.innerWidth < 768 ? "móvil" : window.innerWidth < 1024 ? "tablet" : "escritorio"
      }

      mixpanel.track(translatedEvent, contextProperties)
      console.log(`✅ Processed from queue: ${translatedEvent}`)
    } catch (error) {
      console.error("❌ Error processing queued event:", eventName, error)
    }
  })
}

// Función wrapper para track con traducción automática y manejo de errores mejorado
export const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
  try {
    // Si Mixpanel no está listo, agregar a la cola
    if (!isMixpanelReady()) {
      console.warn("⚠️ Mixpanel not ready, queuing event:", eventName)
      eventQueue.push({ eventName, properties })

      // Intentar inicializar si no está listo
      if (!isInitialized) {
        try {
          await initMixpanel()
          // Procesar cola después de inicializar
          setTimeout(processEventQueue, 100)
        } catch (error) {
          console.error("❌ Failed to initialize Mixpanel:", error)
        }
      }
      return
    }

    const translatedEvent = translateEvent(eventName)
    const translatedProperties = translateProperties(properties)

    // Agregar información de contexto automáticamente
    const contextProperties = {
      ...translatedProperties,
      marca_tiempo: new Date().toISOString(),
    }

    // Solo agregar propiedades del navegador si estamos en el cliente
    if (typeof window !== "undefined") {
      contextProperties.url_página = window.location.href
      contextProperties.título_página = document.title
      contextProperties.referente = document.referrer || ""
      contextProperties.agente_usuario = navigator.userAgent
      contextProperties.resolución_pantalla = `${screen.width}x${screen.height}`
      contextProperties.tamaño_viewport = `${window.innerWidth}x${window.innerHeight}`
      contextProperties.tipo_dispositivo =
        window.innerWidth < 768 ? "móvil" : window.innerWidth < 1024 ? "tablet" : "escritorio"
    }

    // Enviar evento a Mixpanel con timeout
    const trackPromise = new Promise<void>((resolve, reject) => {
      try {
        mixpanel.track(translatedEvent, contextProperties)
        resolve()
      } catch (error) {
        reject(error)
      }
    })

    // Timeout de 2 segundos para el tracking
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Mixpanel track timeout")), 2000)
    })

    await Promise.race([trackPromise, timeoutPromise])
    console.log(`✅ Tracked: ${translatedEvent}`)
  } catch (error) {
    console.error("❌ Error tracking event:", eventName, error)

    // Agregar a la cola para reintento
    eventQueue.push({ eventName, properties })
  }
}

// Función para identificar usuario con manejo de errores
export const identifyUser = async (userId: string, properties: Record<string, any> = {}) => {
  if (!isMixpanelReady()) {
    console.warn("⚠️ Mixpanel not ready for user identification")
    return
  }

  try {
    const translatedProperties = translateProperties(properties)

    const identifyPromise = new Promise<void>((resolve, reject) => {
      try {
        mixpanel.identify(userId)
        mixpanel.people.set(translatedProperties)
        resolve()
      } catch (error) {
        reject(error)
      }
    })

    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Mixpanel identify timeout")), 2000)
    })

    await Promise.race([identifyPromise, timeoutPromise])
    console.log(`✅ User identified: ${userId}`)
  } catch (error) {
    console.error("❌ Error identifying user:", error)
  }
}

// Función para establecer propiedades del usuario con manejo de errores
export const setUserProperties = async (properties: Record<string, any>) => {
  if (!isMixpanelReady()) {
    console.warn("⚠️ Mixpanel not ready for setting user properties")
    return
  }

  try {
    const translatedProperties = translateProperties(properties)

    const setPropsPromise = new Promise<void>((resolve, reject) => {
      try {
        mixpanel.people.set(translatedProperties)
        resolve()
      } catch (error) {
        reject(error)
      }
    })

    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Mixpanel set properties timeout")), 2000)
    })

    await Promise.race([setPropsPromise, timeoutPromise])
    console.log(`✅ User properties set`)
  } catch (error) {
    console.error("❌ Error setting user properties:", error)
  }
}

// Función para resetear usuario con manejo de errores
export const resetUser = async () => {
  if (!isMixpanelReady()) {
    console.warn("⚠️ Mixpanel not ready for user reset")
    return
  }

  try {
    const resetPromise = new Promise<void>((resolve, reject) => {
      try {
        mixpanel.reset()
        resolve()
      } catch (error) {
        reject(error)
      }
    })

    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Mixpanel reset timeout")), 2000)
    })

    await Promise.race([resetPromise, timeoutPromise])
    console.log("✅ User reset")
  } catch (error) {
    console.error("❌ Error resetting user:", error)
  }
}

// Procesar cola de eventos cada 5 segundos
if (typeof window !== "undefined") {
  setInterval(processEventQueue, 5000)
}

export { mixpanel }
