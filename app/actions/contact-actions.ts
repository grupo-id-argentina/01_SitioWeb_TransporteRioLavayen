"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { headers } from "next/headers"
import type {
  ContactoData,
  CotizacionData,
  ChatSoporteData,
  FeedbackClienteData,
  SolicitudConvenioData,
  WhatsAppContactoData,
  ExperienciaUsuarioData,
} from "@/lib/supabase"

// Función para generar session_id único
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Función para obtener información del cliente
async function getClientInfo() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const forwarded = headersList.get("x-forwarded-for")
  const realIp = headersList.get("x-real-ip")

  // Extraer información del User Agent
  const getDeviceType = (ua: string) => {
    if (/tablet|ipad/i.test(ua)) return "tablet"
    if (/mobile|phone|android|iphone/i.test(ua)) return "mobile"
    return "desktop"
  }

  const getBrowser = (ua: string) => {
    if (ua.includes("Chrome")) return "Chrome"
    if (ua.includes("Firefox")) return "Firefox"
    if (ua.includes("Safari")) return "Safari"
    if (ua.includes("Edge")) return "Edge"
    return "Unknown"
  }

  const getOS = (ua: string) => {
    if (ua.includes("Windows")) return "Windows"
    if (ua.includes("Mac")) return "macOS"
    if (ua.includes("Linux")) return "Linux"
    if (ua.includes("Android")) return "Android"
    if (ua.includes("iOS")) return "iOS"
    return "Unknown"
  }

  return {
    dispositivo: getDeviceType(userAgent),
    navegador: getBrowser(userAgent),
    sistema_operativo: getOS(userAgent),
    ip_address: forwarded?.split(",")[0] || realIp || "unknown",
  }
}

export async function submitContactForm(formData: FormData) {
  try {
    console.log("🔄 Iniciando envío de formulario de contacto...")

    const supabase = getSupabaseServerClient()

    // Extraer datos del formulario
    const contactData: ContactoData = {
      nombre: formData.get("name") as string,
      email: formData.get("email") as string,
      telefono: formData.get("phone") as string,
      empresa: (formData.get("company") as string) || undefined,
      mensaje: formData.get("message") as string,
      tipo_consulta: (formData.get("subject") as string) || "general",
    }

    console.log("📝 Datos del formulario:", contactData)

    // Validar datos requeridos
    if (!contactData.nombre || !contactData.email || !contactData.mensaje) {
      return {
        success: false,
        message: "Por favor, completa todos los campos requeridos.",
      }
    }

    // Insertar en Supabase
    const { data: result, error } = await supabase.from("contactos").insert(contactData).select().single()

    if (error) {
      console.error("❌ Error de Supabase:", error)
      throw error
    }

    console.log("✅ Contacto guardado exitosamente:", result?.id)

    return {
      success: true,
      message: "Tu mensaje ha sido enviado exitosamente. Te contactaremos pronto.",
      data: result,
    }
  } catch (error) {
    console.error("❌ Error al enviar formulario de contacto:", error)
    return {
      success: false,
      message: "Ha ocurrido un error al enviar tu mensaje. Por favor, inténtalo más tarde.",
    }
  }
}

export async function submitConvenioForm(formData: FormData) {
  try {
    console.log("🔄 Iniciando envío de formulario de convenio...")

    // Log de todos los campos recibidos
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    const supabase = getSupabaseServerClient()

    // Procesar servicios de interés (convertir de JSON string a array)
    let serviciosInteres: string[] = []
    try {
      const serviciosStr = formData.get("services") as string
      if (serviciosStr) {
        serviciosInteres = JSON.parse(serviciosStr)
      }
    } catch (e) {
      console.error("Error al parsear servicios:", e)
    }

    const convenioData: SolicitudConvenioData = {
      nombre_empresa: formData.get("companyName") as string,
      contacto_nombre: formData.get("contactName") as string,
      contacto_email: formData.get("email") as string,
      contacto_telefono: formData.get("phone") as string,
      tipo_empresa: formData.get("businessType") as string,
      volumen_mensual: formData.get("monthlyVolume") as string,
      servicios_interes: serviciosInteres,
      mensaje: formData.get("message") as string,
      estado: "pendiente",
    }

    console.log("📋 Datos procesados para convenio:", convenioData)

    // Validación más estricta
    if (
      !convenioData.nombre_empresa?.trim() ||
      !convenioData.contacto_nombre?.trim() ||
      !convenioData.contacto_email?.trim() ||
      !convenioData.mensaje?.trim()
    ) {
      console.log("❌ Validación fallida - campos requeridos faltantes")
      return {
        success: false,
        message: "Por favor, completa todos los campos requeridos (empresa, contacto, email y mensaje).",
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(convenioData.contacto_email)) {
      return {
        success: false,
        message: "Por favor, ingresa un email válido.",
      }
    }

    const { data: result, error } = await supabase.from("solicitudes_convenios").insert(convenioData).select().single()

    if (error) {
      console.error("❌ Error de Supabase en convenios:", error)
      console.error("❌ Detalles del error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      throw error
    }

    console.log("✅ Solicitud de convenio guardada exitosamente:", result?.id)

    return {
      success: true,
      message: "Tu solicitud de convenio ha sido enviada exitosamente. Te contactaremos pronto.",
      data: result,
    }
  } catch (error) {
    console.error("❌ Error al enviar solicitud de convenio:", error)
    return {
      success: false,
      message: "Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo más tarde.",
    }
  }
}

export async function submitChatSupport(formData: FormData) {
  try {
    const supabase = getSupabaseServerClient()
    const sessionId = generateSessionId()

    // Crear mensaje del chat con todos los datos del formulario
    const mensaje = `
Nuevo mensaje de soporte:
- Nombre: ${formData.get("firstName")} ${formData.get("lastName")}
- Email: ${formData.get("email")}
- Empresa: ${formData.get("company") || "No especificada"}
- Cargo: ${formData.get("position") || "No especificado"}
- WhatsApp: ${formData.get("whatsapp")}
- Mensaje: ${formData.get("message")}
    `.trim()

    const chatData: ChatSoporteData = {
      session_id: sessionId,
      mensaje: mensaje,
      tipo: "soporte_tecnico",
      metadata: {
        nombre: formData.get("firstName"),
        apellido: formData.get("lastName"),
        email: formData.get("email"),
        empresa: formData.get("company"),
        cargo: formData.get("position"),
        whatsapp: formData.get("whatsapp"),
        mensaje_original: formData.get("message"),
      },
    }

    console.log("📝 Datos del chat soporte:", chatData)

    const { error } = await supabase.from("chat_soporte").insert(chatData)

    if (error) {
      console.error("❌ Error en chat soporte:", error)
      throw error
    }

    console.log("✅ Chat soporte guardado exitosamente")

    return { success: true, message: "Mensaje de soporte enviado con éxito" }
  } catch (error) {
    console.error("Error al guardar chat soporte:", error)
    return { success: false, message: "Error al enviar el mensaje de soporte" }
  }
}

export async function submitFeedback(formData: FormData) {
  try {
    const supabase = getSupabaseServerClient()

    const feedbackData: FeedbackClienteData = {
      tipo_feedback: "feedback_general",
      calificacion: Number.parseInt(formData.get("rating") as string),
      comentario: formData.get("feedback") as string,
      email_cliente: formData.get("email") as string,
      pagina_origen: (formData.get("pagina_origen") as string) || "contacto",
      metadata: {
        nombre: formData.get("name"),
      },
    }

    console.log("📝 Datos del feedback:", feedbackData)

    const { error } = await supabase.from("feedback_clientes").insert(feedbackData)

    if (error) {
      console.error("❌ Error en feedback:", error)
      throw error
    }

    console.log("✅ Feedback guardado exitosamente")

    return { success: true, message: "Feedback enviado con éxito" }
  } catch (error) {
    console.error("Error al guardar feedback:", error)
    return { success: false, message: "Error al enviar el feedback" }
  }
}

// Nueva función para guardar experiencia de usuario
export async function submitExperienciaUsuario(formData: FormData) {
  try {
    console.log("🔄 Iniciando registro de experiencia de usuario...")

    const supabase = getSupabaseServerClient()
    const clientInfo = await getClientInfo()

    const experienciaData: ExperienciaUsuarioData = {
      pagina: formData.get("pagina") as string,
      accion: formData.get("accion") as string,
      calificacion: Number.parseInt(formData.get("calificacion") as string),
      comentario: (formData.get("comentario") as string) || undefined,
      tiempo_en_pagina: Number.parseInt(formData.get("tiempo_en_pagina") as string) || 0,
      dispositivo: clientInfo.dispositivo,
      navegador: clientInfo.navegador,
      sistema_operativo: clientInfo.sistema_operativo,
      ip_address: clientInfo.ip_address,
      session_id: (formData.get("session_id") as string) || generateSessionId(),
    }

    console.log("📝 Datos de experiencia de usuario:", experienciaData)

    // Validar datos requeridos
    if (!experienciaData.pagina || !experienciaData.accion || !experienciaData.calificacion) {
      return {
        success: false,
        message: "Datos incompletos para registrar la experiencia.",
      }
    }

    const { data: result, error } = await supabase.from("experiencia_usuario").insert(experienciaData).select().single()

    if (error) {
      console.error("❌ Error al guardar experiencia de usuario:", error)
      throw error
    }

    console.log("✅ Experiencia de usuario guardada exitosamente:", result?.id)

    return {
      success: true,
      message: "Experiencia registrada exitosamente",
      data: result,
    }
  } catch (error) {
    console.error("❌ Error al registrar experiencia de usuario:", error)
    return {
      success: false,
      message: "Error al registrar la experiencia",
    }
  }
}

export async function saveCotizacion(cotizacionData: any) {
  try {
    const supabase = getSupabaseServerClient()

    const data: CotizacionData = {
      origen: cotizacionData.origen,
      destino: cotizacionData.destino,
      peso: cotizacionData.peso,
      dimensiones: cotizacionData.dimensiones,
      tipo_envio: cotizacionData.tipo_envio,
      precio_estimado: cotizacionData.precio_estimado,
      tiempo_estimado: cotizacionData.tiempo_estimado?.toString(),
      email_cliente: cotizacionData.email_cliente,
      telefono_cliente: cotizacionData.telefono_cliente,
      nombre_cliente: cotizacionData.nombre_cliente,
      empresa_cliente: cotizacionData.empresa_cliente,
      estado: "pendiente",
    }

    console.log("📝 Datos de la cotización:", data)

    const { data: result, error } = await supabase.from("cotizaciones").insert(data).select().single()

    if (error) {
      console.error("❌ Error al guardar cotización:", error)
      throw error
    }

    console.log("✅ Cotización guardada exitosamente:", result?.id)

    return {
      success: true,
      message: "Cotización guardada exitosamente",
      data: result,
    }
  } catch (error) {
    console.error("❌ Error al guardar cotización:", error)
    return {
      success: false,
      message: "Error al procesar la cotización",
    }
  }
}

// Función para guardar contactos de WhatsApp
export async function saveWhatsAppContact(contactData: {
  cotizacionId: string
  nombreCompleto: string
  numeroWhatsapp: string
  origen: string
  destino: string
  costoEstimado: number
  metadata?: any
}) {
  try {
    const supabase = getSupabaseServerClient()

    const whatsappContactData: WhatsAppContactoData = {
      cotizacion_id: contactData.cotizacionId,
      nombre_completo: contactData.nombreCompleto,
      numero_whatsapp: contactData.numeroWhatsapp,
      origen: contactData.origen,
      destino: contactData.destino,
      costo_estimado: contactData.costoEstimado,
      metadata: contactData.metadata || {},
    }

    console.log("📝 Datos del contacto WhatsApp:", whatsappContactData)

    const { data: result, error } = await supabase
      .from("whatsapp_contactos")
      .insert(whatsappContactData)
      .select()
      .single()

    if (error) {
      console.error("❌ Error al guardar contacto WhatsApp:", error)
      throw error
    }

    console.log("✅ Contacto WhatsApp guardado exitosamente:", result?.id)

    return {
      success: true,
      message: "Contacto WhatsApp guardado exitosamente",
      data: result,
    }
  } catch (error) {
    console.error("❌ Error al guardar contacto WhatsApp:", error)
    return {
      success: false,
      message: "Error al guardar el contacto",
    }
  }
}

// Función simplificada para registrar feedback desde la calculadora
export async function registrarFeedbackCalculadora(feedbackData: {
  tipo: "happy" | "neutral" | "sad"
  cotizacion_id?: string
  pagina_origen?: string
}) {
  try {
    const supabase = getSupabaseServerClient()

    const calificacionMap = {
      happy: 5,
      neutral: 3,
      sad: 1,
    }

    const data: FeedbackClienteData = {
      tipo_feedback: "calculadora_feedback",
      calificacion: calificacionMap[feedbackData.tipo],
      pagina_origen: feedbackData.pagina_origen || "calculadora",
      metadata: {
        cotizacion_id: feedbackData.cotizacion_id,
        tipo_emoji: feedbackData.tipo,
      },
    }

    console.log("📝 Datos del feedback calculadora:", data)

    const { error } = await supabase.from("feedback_clientes").insert(data)

    if (error) {
      console.error("❌ Error al registrar feedback de calculadora:", error)
      return { success: false }
    }

    console.log("✅ Feedback calculadora guardado exitosamente")
    return { success: true }
  } catch (error) {
    console.error("❌ Error al registrar feedback de calculadora:", error)
    return { success: false }
  }
}
