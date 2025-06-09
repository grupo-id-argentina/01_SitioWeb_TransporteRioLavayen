import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://wvkdjdrkmdbhayguxugt.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2a2RqZHJrbWRiaGF5Z3V4dWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjUwMDAsImV4cCI6MjA2NDk0MTAwMH0.LEG1VFzsbgXWIMkCpDgM6oGlWbNgKWo5V29ZJo08UFw"

// Tipos para las tablas de Supabase
export interface ContactoData {
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  mensaje?: string
  tipo_consulta?: string
}

export interface SolicitudConvenioData {
  nombre_empresa: string
  contacto_nombre: string
  contacto_email: string
  contacto_telefono?: string
  tipo_empresa?: string
  volumen_mensual?: string
  servicios_interes?: string[]
  mensaje?: string
  estado?: string
}

export interface CotizacionData {
  origen: string
  destino: string
  peso?: number
  dimensiones?: any
  tipo_envio?: string
  precio_estimado?: number
  tiempo_estimado?: string
  email_cliente?: string
  telefono_cliente?: string
  nombre_cliente?: string
  empresa_cliente?: string
  estado?: string
}

export interface ChatSoporteData {
  session_id: string
  mensaje: string
  tipo: string
  metadata?: any
}

export interface FeedbackClienteData {
  tipo_feedback: string
  calificacion?: number
  comentario?: string
  email_cliente?: string
  pagina_origen?: string
  metadata?: any
}

export interface WhatsAppContactoData {
  cotizacion_id: string
  nombre_completo: string
  numero_whatsapp: string
  origen: string
  destino: string
  costo_estimado: number
  metadata?: any
}

// Singleton para el cliente de Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null

// Cliente para el lado del cliente (singleton)
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }
  return supabaseInstance
})()

// Cliente para el lado del servidor (Server Actions)
export const getSupabaseServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
