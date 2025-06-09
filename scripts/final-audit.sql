-- Auditoría final del MVP - Verificar todas las tablas y datos

-- 1. Verificar estructura de tablas principales
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN (
        'contactos', 
        'solicitudes_convenios', 
        'cotizaciones', 
        'feedback_clientes', 
        'chat_soporte', 
        'whatsapp_contactos'
    )
ORDER BY table_name, ordinal_position;

-- 2. Verificar que las tablas existan y tengan datos de prueba
SELECT 
    'contactos' as tabla,
    COUNT(*) as total_registros
FROM contactos
UNION ALL
SELECT 
    'solicitudes_convenios' as tabla,
    COUNT(*) as total_registros
FROM solicitudes_convenios
UNION ALL
SELECT 
    'cotizaciones' as tabla,
    COUNT(*) as total_registros
FROM cotizaciones
UNION ALL
SELECT 
    'feedback_clientes' as tabla,
    COUNT(*) as total_registros
FROM feedback_clientes
UNION ALL
SELECT 
    'chat_soporte' as tabla,
    COUNT(*) as total_registros
FROM chat_soporte
UNION ALL
SELECT 
    'whatsapp_contactos' as tabla,
    COUNT(*) as total_registros
FROM whatsapp_contactos;

-- 3. Verificar índices importantes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
    AND tablename IN (
        'contactos', 
        'solicitudes_convenios', 
        'cotizaciones', 
        'feedback_clientes', 
        'chat_soporte', 
        'whatsapp_contactos'
    )
ORDER BY tablename, indexname;

-- 4. Verificar permisos de las tablas
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
    AND table_name IN (
        'contactos', 
        'solicitudes_convenios', 
        'cotizaciones', 
        'feedback_clientes', 
        'chat_soporte', 
        'whatsapp_contactos'
    )
ORDER BY table_name, privilege_type;

-- 5. Verificar que los campos de array funcionen correctamente
SELECT 
    id,
    nombre_empresa,
    servicios_interes,
    array_length(servicios_interes, 1) as cantidad_servicios
FROM solicitudes_convenios 
WHERE servicios_interes IS NOT NULL
LIMIT 5;

-- 6. Verificar registros recientes (últimas 24 horas)
SELECT 
    'contactos' as tabla,
    COUNT(*) as registros_recientes
FROM contactos 
WHERE created_at >= NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
    'solicitudes_convenios' as tabla,
    COUNT(*) as registros_recientes
FROM solicitudes_convenios 
WHERE created_at >= NOW() - INTERVAL '24 hours'
UNION ALL
SELECT 
    'feedback_clientes' as tabla,
    COUNT(*) as registros_recientes
FROM feedback_clientes 
WHERE created_at >= NOW() - INTERVAL '24 hours';
