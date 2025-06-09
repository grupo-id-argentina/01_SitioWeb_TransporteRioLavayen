-- Verificar y crear/actualizar tabla de solicitudes_convenios
CREATE TABLE IF NOT EXISTS solicitudes_convenios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_empresa VARCHAR(255) NOT NULL,
  contacto_nombre VARCHAR(255) NOT NULL,
  contacto_email VARCHAR(255) NOT NULL,
  contacto_telefono VARCHAR(50),
  tipo_empresa VARCHAR(100),
  volumen_mensual VARCHAR(100),
  servicios_interes TEXT[],
  mensaje TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_solicitudes_convenios_email ON solicitudes_convenios(contacto_email);
CREATE INDEX IF NOT EXISTS idx_solicitudes_convenios_estado ON solicitudes_convenios(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_convenios_created_at ON solicitudes_convenios(created_at);

-- Agregar comentarios
COMMENT ON TABLE solicitudes_convenios IS 'Solicitudes de convenios corporativos y alianzas estratégicas';
COMMENT ON COLUMN solicitudes_convenios.nombre_empresa IS 'Nombre de la empresa solicitante';
COMMENT ON COLUMN solicitudes_convenios.contacto_nombre IS 'Nombre del contacto principal';
COMMENT ON COLUMN solicitudes_convenios.contacto_email IS 'Email del contacto principal';
COMMENT ON COLUMN solicitudes_convenios.estado IS 'Estado de la solicitud: pendiente, en_proceso, aprobada, rechazada';
