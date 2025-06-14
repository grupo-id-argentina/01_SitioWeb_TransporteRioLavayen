"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import type {
  ContactoData,
  CotizacionData,
  ChatSoporteData,
  FeedbackClienteData,
  SolicitudConvenioData,
  WhatsAppContactoData,
} from "@/lib/supabase"

// Función para generar session_id único
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function submitContactForm(formData: FormData) {
  try {
    console.log("🔄 Iniciando envío de formulario de contacto...")

    const supabase = getSupabaseServerClient()

    // Extraer y limpiar datos del formulario
    const rawPhone = formData.get("phone") as string
    const cleanPhone = rawPhone ? rawPhone.replace(/\D/g, "") : ""

    const contactData: ContactoData = {
      nombre: (formData.get("name") as string)?.trim(),
      email: (formData.get("email") as string)?.trim(),
      telefono: cleanPhone ? `+549${cleanPhone}` : undefined,
      empresa: (formData.get("company") as string)?.trim() || undefined,
      mensaje: (formData.get("message") as string)?.trim(),
      tipo_consulta: (formData.get("subject") as string)?.trim() || "general",
    }

    console.log("📝 Datos del formulario:", contactData)

    // Validar datos requeridos
    if (!contactData.nombre || !contactData.email || !contactData.mensaje) {
      return {
        success: false,
        message: "Por favor, completa todos los campos requeridos.",
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactData.email)) {
      return {
        success: false,
        message: "Por favor, ingresa un email válido.",
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

    // Limpiar y procesar teléfono
    const rawPhone = formData.get("phone") as string
    const cleanPhone = rawPhone ? rawPhone.replace(/\D/g, "") : ""

    const convenioData: SolicitudConvenioData = {
      nombre_empresa: (formData.get("companyName") as string)?.trim(),
      contacto_nombre: (formData.get("contactName") as string)?.trim(),
      contacto_email: (formData.get("email") as string)?.trim(),
      contacto_telefono: cleanPhone ? `+549${cleanPhone}` : undefined,
      tipo_empresa: (formData.get("businessType") as string)?.trim(),
      volumen_mensual: (formData.get("monthlyVolume") as string)?.trim(),
      servicios_interes: serviciosInteres,
      mensaje: (formData.get("message") as string)?.trim(),
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

    // Extraer y limpiar datos
    const firstName = (formData.get("firstName") as string)?.trim()
    const lastName = (formData.get("lastName") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const company = (formData.get("company") as string)?.trim()
    const position = (formData.get("position") as string)?.trim()
    const rawWhatsapp = formData.get("whatsapp") as string
    const cleanWhatsapp = rawWhatsapp ? rawWhatsapp.replace(/\D/g, "") : ""
    const message = (formData.get("message") as string)?.trim()

    // Validar campos requeridos
    if (!firstName || !lastName || !email || !cleanWhatsapp || !message) {
      return {
        success: false,
        message: "Por favor complete todos los campos requeridos.",
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Por favor ingrese un email válido.",
      }
    }

    // Validar WhatsApp (debe tener al menos 10 dígitos)
    if (cleanWhatsapp.length < 10) {
      return {
        success: false,
        message: "Por favor ingrese un número de WhatsApp válido de al menos 10 dígitos.",
      }
    }

    // Crear mensaje del chat con todos los datos del formulario
    const mensajeCompleto = `
Nuevo mensaje de soporte:
- Nombre: ${firstName} ${lastName}
- Email: ${email}
- Empresa: ${company || "No especificada"}
- Cargo: ${position || "No especificado"}
- WhatsApp: +549${cleanWhatsapp}
- Mensaje: ${message}
    `.trim()

    const chatData: ChatSoporteData = {
      session_id: sessionId,
      mensaje: mensajeCompleto,
      tipo: "soporte_tecnico",
      metadata: {
        nombre: firstName,
        apellido: lastName,
        email: email,
        empresa: company,
        cargo: position,
        whatsapp: `+549${cleanWhatsapp}`,
        mensaje_original: message,
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
  comentario?: string
  email?: string
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
      comentario: feedbackData.comentario,
      email_cliente: feedbackData.email,
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
