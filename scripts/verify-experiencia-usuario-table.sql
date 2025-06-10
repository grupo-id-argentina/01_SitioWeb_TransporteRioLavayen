-- Verificar y crear la tabla experiencia_usuario si no existe

-- Crear la tabla experiencia_usuario
CREATE TABLE IF NOT EXISTS experiencia_usuario (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pagina VARCHAR(255) NOT NULL,
    accion VARCHAR(255) NOT NULL,
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    tiempo_en_pagina INTEGER NOT NULL DEFAULT 0,
    dispositivo VARCHAR(50) NOT NULL,
    navegador VARCHAR(50) NOT NULL,
    sistema_operativo VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    session_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_experiencia_usuario_pagina ON experiencia_usuario(pagina);
CREATE INDEX IF NOT EXISTS idx_experiencia_usuario_calificacion ON experiencia_usuario(calificacion);
CREATE INDEX IF NOT EXISTS idx_experiencia_usuario_created_at ON experiencia_usuario(created_at);
CREATE INDEX IF NOT EXISTS idx_experiencia_usuario_session_id ON experiencia_usuario(session_id);
CREATE INDEX IF NOT EXISTS idx_experiencia_usuario_accion ON experiencia_usuario(accion);

-- Agregar comentarios a la tabla y columnas
COMMENT ON TABLE experiencia_usuario IS 'Tabla para registrar la experiencia de los usuarios en el sitio web';
COMMENT ON COLUMN experiencia_usuario.id IS 'Identificador único de la experiencia';
COMMENT ON COLUMN experiencia_usuario.pagina IS 'Página donde se registró la experiencia';
COMMENT ON COLUMN experiencia_usuario.accion IS 'Acción realizada por el usuario';
COMMENT ON COLUMN experiencia_usuario.calificacion IS 'Calificación del 1 al 5';
COMMENT ON COLUMN experiencia_usuario.comentario IS 'Comentario opcional del usuario';
COMMENT ON COLUMN experiencia_usuario.tiempo_en_pagina IS 'Tiempo en segundos que el usuario estuvo en la página';
COMMENT ON COLUMN experiencia_usuario.dispositivo IS 'Tipo de dispositivo (mobile, tablet, desktop)';
COMMENT ON COLUMN experiencia_usuario.navegador IS 'Navegador utilizado';
COMMENT ON COLUMN experiencia_usuario.sistema_operativo IS 'Sistema operativo del usuario';
COMMENT ON COLUMN experiencia_usuario.ip_address IS 'Dirección IP del usuario';
COMMENT ON COLUMN experiencia_usuario.session_id IS 'ID de sesión único';
COMMENT ON COLUMN experiencia_usuario.created_at IS 'Fecha y hora de creación del registro';

-- Verificar la estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'experiencia_usuario' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Insertar un registro de prueba
INSERT INTO experiencia_usuario (
    pagina,
    accion,
    calificacion,
    comentario,
    tiempo_en_pagina,
    dispositivo,
    navegador,
    sistema_operativo,
    ip_address,
    session_id
) VALUES (
    'test',
    'test_experiencia',
    5,
    'Registro de prueba para verificar funcionamiento',
    120,
    'desktop',
    'Chrome',
    'Windows',
    '127.0.0.1',
    'test_session_' || extract(epoch from now())
) ON CONFLICT DO NOTHING;

-- Verificar que el registro se insertó correctamente
SELECT 
    id,
    pagina,
    accion,
    calificacion,
    comentario,
    tiempo_en_pagina,
    dispositivo,
    navegador,
    sistema_operativo,
    session_id,
    created_at
FROM experiencia_usuario 
WHERE pagina = 'test'
ORDER BY created_at DESC
LIMIT 1;
