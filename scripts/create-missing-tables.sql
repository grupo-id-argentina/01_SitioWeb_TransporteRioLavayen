-- Script para crear las tablas faltantes en Supabase
-- Base de datos: 01_SitioWeb_TransporteRioLavayen

-- Tabla para guardar los contactos de WhatsApp (envío a otro contacto)
CREATE TABLE IF NOT EXISTS public.whatsapp_contactos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cotizacion_id character varying NOT NULL,
  nombre_completo character varying NOT NULL,
  numero_whatsapp character varying NOT NULL,
  session_id character varying,
  origen character varying,
  destino character varying,
  costo_estimado numeric,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT whatsapp_contactos_pkey PRIMARY KEY (id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_whatsapp_contactos_cotizacion_id ON public.whatsapp_contactos(cotizacion_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contactos_numero ON public.whatsapp_contactos(numero_whatsapp);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contactos_created_at ON public.whatsapp_contactos(created_at);

-- Tabla para tracking de eventos de Mixpanel (respaldo local)
CREATE TABLE IF NOT EXISTS public.mixpanel_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_name character varying NOT NULL,
  properties jsonb,
  session_id character varying,
  user_id character varying,
  timestamp_event timestamp with time zone DEFAULT now(),
  sent_to_mixpanel boolean DEFAULT false,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT mixpanel_events_pkey PRIMARY KEY (id)
);

-- Índices para la tabla de eventos de Mixpanel
CREATE INDEX IF NOT EXISTS idx_mixpanel_events_event_name ON public.mixpanel_events(event_name);
CREATE INDEX IF NOT EXISTS idx_mixpanel_events_session_id ON public.mixpanel_events(session_id);
CREATE INDEX IF NOT EXISTS idx_mixpanel_events_sent ON public.mixpanel_events(sent_to_mixpanel);
CREATE INDEX IF NOT EXISTS idx_mixpanel_events_timestamp ON public.mixpanel_events(timestamp_event);

-- Tabla para logs de errores del sistema
CREATE TABLE IF NOT EXISTS public.system_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  log_level character varying NOT NULL DEFAULT 'info',
  component character varying NOT NULL,
  message text NOT NULL,
  error_details jsonb,
  session_id character varying,
  user_agent character varying,
  ip_address character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT system_logs_pkey PRIMARY KEY (id)
);

-- Índices para logs del sistema
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_component ON public.system_logs(component);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at);

-- Comentarios para documentar las tablas
COMMENT ON TABLE public.whatsapp_contactos IS 'Almacena los contactos de WhatsApp cuando se envía cotización a otro contacto';
COMMENT ON TABLE public.mixpanel_events IS 'Respaldo local de eventos enviados a Mixpanel para debugging y recuperación';
COMMENT ON TABLE public.system_logs IS 'Logs del sistema para debugging y monitoreo';

-- Verificar que las tablas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('whatsapp_contactos', 'mixpanel_events', 'system_logs')
ORDER BY tablename;
