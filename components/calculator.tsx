"use client"

import { useState, useEffect, useCallback } from "react"
import { Truck, CableIcon as CalcIcon, Send, SmilePlus, Meh, Frown, User, Building, Check } from "lucide-react"
import { trackEvent } from "@/lib/mixpanel-config"
import { saveCotizacion, registrarFeedbackCalculadora, saveWhatsAppContact } from "@/app/actions/contact-actions"

// Importar JSON
import depositosJson from "@/data/depositos.json"
import parametrosJson from "@/data/parametros.json"
import distanciasCacheJson from "@/data/distancias-cache.json"

type Deposito = {
  Id_Deposito: string
  Nombre: string
  Direccion: string
  WhatsApp_Administracion_Casa_Central: string
  WhatsApp_Logistica_Casa_Central: string
  Latitud: number
  Longitud: number
  Nueva?: boolean
}

type Parametro = {
  Parametro: string
  Valor: number
  Consumo_Combustible_Litros_Km: number
  Precio_Combustible: number
  Costo_Km: number
  Margen_Ganancia: number
}

type FeedbackType = "happy" | "neutral" | "sad" | null

// Función para generar session_id único
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function Calculator() {
  // Estado para controlar si el componente está listo para tracking
  const [isTrackingReady, setIsTrackingReady] = useState(false)
  const [sessionId] = useState(() => generateSessionId())

  // Definimos las zonas y tipos de carga reales
  const zonas = ["1", "2", "3", "4", "5"]
  const tiposCarga = [
    "BULTO MINIMO (MAXIMO 20 KG)",
    "DE 21 KG A 100 KG",
    "DE 101 KG A 300 KG",
    "DE 301 KG A 500 KG",
    "DE 501 KG A 1000 KG",
    "DE 1001 KG A 1500 KG",
    "DE 1501 KG A 2000 KG",
    "DE 2001 KG A 2500 KG",
    "DE 2501 KG A 3000 KG",
    "DE 3001 KG EN ADELANTE",
    "METROS CUBICOS",
    "METROS CUBICOS MUDANZA",
  ]

  // Datos de los depósitos
  const depositos: Deposito[] = depositosJson.Lista_de_Depositos
  const parametros: Parametro[] = parametrosJson

  // Localidades reales por zonas
  const localidadesPorZona: Record<string, Array<{ nombre: string; lat: number; lng: number }>> = {
    "1": [
      { nombre: "LA ESPERANZA", lat: -24.223864609703025, lng: -64.83666012581583 },
      { nombre: "EL PIQUETE", lat: -24.17909272413544, lng: -64.67819610787207 },
      { nombre: "CHALICAN", lat: -24.070030285460785, lng: -64.8060769067121 },
      { nombre: "PUESTO VIEJO", lat: -24.48206947415188, lng: -64.9668051357245 },
      { nombre: "EL BORDO", lat: -24.659996626426764, lng: -65.10208541183816 },
      { nombre: "METAN", lat: -25.496248768250506, lng: -64.9710481660466 },
      { nombre: "YALA", lat: -24.12222758446989, lng: -65.40179965760319 },
      { nombre: "REYES", lat: -24.168506022171105, lng: -65.36626504510419 },
      { nombre: "CAMPO SANTO", lat: -24.681145270851232, lng: -65.10404121370553 },
      { nombre: "FRAILE PINTADO", lat: -23.943686480366484, lng: -64.80327276235155 },
      { nombre: "GRAL GUEMES", lat: -24.67377359552907, lng: -65.04710074006934 },
      { nombre: "LIBERTADOR GENERAL SAN MARTIN", lat: -23.8, lng: -64.7833 },
      { nombre: "LOS LAPACHOS", lat: -23.81482510316964, lng: -64.79246245862812 },
      { nombre: "ROSARIO DE LA FRONTERA", lat: -25.797258383817375, lng: -64.96873969293675 },
      { nombre: "ROSARIO DE LERMA", lat: -24.9776017918111, lng: -65.57947085876567 },
      { nombre: "SALTA", lat: -24.79137674950297, lng: -65.41599201442627 },
      { nombre: "LOZANO", lat: -24.083268286567062, lng: -65.40280118345997 },
      { nombre: "JUJUY", lat: -24.190464705311587, lng: -65.29268069602813 },
      { nombre: "PERICO", lat: -24.37551546137973, lng: -65.1177106100916 },
      { nombre: "PALPALA", lat: -24.257846397486336, lng: -65.2083880918654 },
      { nombre: "EL CARMEN", lat: -24.387691800685953, lng: -65.25808501119432 },
      { nombre: "MONTERRICO", lat: -24.442302672930754, lng: -65.16141537207724 },
      { nombre: "SAN PEDRO", lat: -24.23180329789856, lng: -64.86733976299968 },
      { nombre: "SAN ANTONIO", lat: -24.440896173773638, lng: -65.16102913397965 },
    ],
    "2": [
      { nombre: "COLONIA SANTA ROSA", lat: -23.393441825432056, lng: -64.42614508033033 },
      { nombre: "EMBARCACION", lat: -23.20476325389449, lng: -64.09086718619484 },
      { nombre: "HUMAHUACA", lat: -23.205688498222166, lng: -65.34742896557725 },
      { nombre: "ORAN", lat: -23.135882748914753, lng: -64.32363839347943 },
      { nombre: "TILCARA", lat: -23.576640674829942, lng: -65.393280261792 },
      { nombre: "HUACALERA", lat: -23.43840226047926, lng: -65.3488820893022 },
      { nombre: "MAIMARA", lat: -23.624893526391844, lng: -65.40882404167668 },
      { nombre: "SANTA CLARA", lat: -24.30938466993379, lng: -64.66135762695116 },
      { nombre: "CERRILLOS", lat: -24.90334055117552, lng: -65.4875738156951 },
      { nombre: "EL CARRIL", lat: -25.07348563188166, lng: -65.49179686002672 },
      { nombre: "YUTO", lat: -23.644678070876733, lng: -64.47368265095011 },
      { nombre: "PICHANAL", lat: -23.31388408843679, lng: -64.20703417549286 },
      { nombre: "URUNDEL", lat: -23.558390493141154, lng: -64.39726881395781 },
      { nombre: "TUMBAYA", lat: -23.857548848054286, lng: -65.46726187518584 },
      { nombre: "VOLCAN", lat: -23.91700007280245, lng: -65.4642334888327 },
      { nombre: "UQUIA", lat: -23.304077858395846, lng: -65.3581845688357 },
      { nombre: "PURMAMARCA", lat: -23.74627933573311, lng: -65.49920517676837 },
      { nombre: "TABACAL", lat: -23.255781878755897, lng: -64.24454915205327 },
      { nombre: "YRIGOYEN", lat: -23.244070585705984, lng: -64.27703028113629 },
      { nombre: "VAQUEROS", lat: -24.69486896799523, lng: -65.41084917790579 },
      { nombre: "CAMPO QUIJANO", lat: -24.910433149017496, lng: -65.63570584593033 },
    ],
    "3": [
      { nombre: "ABRA PAMPA", lat: -22.722500668820256, lng: -65.6948027193767 },
      { nombre: "AGUAS BLANCAS", lat: -22.735117570638188, lng: -64.35415508672922 },
      { nombre: "TRES CRUCES", lat: -22.918228892818632, lng: -65.58805867162472 },
      { nombre: "METAN", lat: -22.918273045565662, lng: -65.58799771851997 },
      { nombre: "EL GALPON", lat: -25.380944426918138, lng: -64.65353616788032 },
      { nombre: "GENERAL MOSCONI", lat: -22.59718453603045, lng: -63.81243408882682 },
      { nombre: "TARTAGAL", lat: -22.516372614228306, lng: -63.793385412775876 },
    ],
    "4": [
      { nombre: "LA QUIACA", lat: -22.10430461824834, lng: -65.59664008241191 },
      { nombre: "POCITOS", lat: -24.36914931870774, lng: -66.99030421401939 },
      { nombre: "SALVADOR MAZZA", lat: -22.01089675581919, lng: -63.678981764855166 },
      { nombre: "PALMA SOLA", lat: -23.979415051003198, lng: -64.30452912868085 },
      { nombre: "J V GONZALEZ", lat: -23.977344732105806, lng: -64.30402606205416 },
      { nombre: "CAFAYATE", lat: -26.072427478564602, lng: -65.97595977926392 },
    ],
  }

  // Estado para formulario
  const [depositoSeleccionado, setDepositoSeleccionado] = useState("")
  const [zonaSeleccionada, setZonaSeleccionada] = useState("")
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState("")
  const [tipoCargaSeleccionado, setTipoCargaSeleccionado] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [incluirIVA, setIncluirIVA] = useState(false)
  const [deseaSeguro, setDeseaSeguro] = useState(false)
  const [valorMercaderia, setValorMercaderia] = useState(0)

  // Estados para resultados
  const [distancia, setDistancia] = useState<number | null>(null)
  const [costoFinal, setCostoFinal] = useState<number | null>(null)
  const [cotizacionGenerada, setCotizacionGenerada] = useState(false)
  const [cotizacionId, setCotizacionId] = useState("")

  // Estados para manejo del formulario
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [cantidadError, setCantidadError] = useState("")

  // Estados para el flujo de envío por WhatsApp
  const [mostrarModalWhatsApp, setMostrarModalWhatsApp] = useState(false)
  const [pasoActual, setPasoActual] = useState(1)
  const [destinatarioSeleccionado, setDestinatarioSeleccionado] = useState<"administracion" | "otro" | null>(null)
  const [nombreUsuario, setNombreUsuario] = useState("")
  const [whatsappUsuario, setWhatsappUsuario] = useState("")
  const [errorModal, setErrorModal] = useState("")
  const [feedbackSeleccionado, setFeedbackSeleccionado] = useState<FeedbackType>(null)
  const [contadorRedireccion, setContadorRedireccion] = useState(3)
  const [redireccionando, setRedireccionando] = useState(false)
  const [cargandoWhatsApp, setCargandoWhatsApp] = useState(false)

  // Inicializar tracking después de que el componente esté montado
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTrackingReady(true)
      // Track page view de la calculadora
      trackEvent("Calculator Page Viewed", {
        page: "calculator",
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [sessionId])

  // Reset del formulario cuando cambia la zona
  useEffect(() => {
    setLocalidadSeleccionada("")
    setTipoCargaSeleccionado("")
    setCantidad(1)
  }, [zonaSeleccionada])

  // Reset del formulario cuando cambia el tipo de carga
  useEffect(() => {
    if (tipoCargaSeleccionado) {
      const rango = obtenerRangoPeso(tipoCargaSeleccionado)
      setCantidad(rango.min)
      setCantidadError("")
    } else {
      setCantidad(1)
    }
  }, [tipoCargaSeleccionado])

  // Contador para redirección
  useEffect(() => {
    if (redireccionando && contadorRedireccion > 0) {
      const timer = setTimeout(() => {
        setContadorRedireccion(contadorRedireccion - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (redireccionando && contadorRedireccion === 0) {
      // Track redirection completion
      if (isTrackingReady) {
        trackEvent("WhatsApp Flow Redirect Completed", {
          cotizacion_id: cotizacionId,
          feedback_selected: feedbackSeleccionado,
        })
      }
      window.location.href = "/"
    }
  }, [redireccionando, contadorRedireccion, cotizacionId, feedbackSeleccionado, isTrackingReady])

  // Función para calcular distancia real usando coordenadas
  const calcularDistanciaReal = (origenLat: number, origenLon: number, destinoLat: number, destinoLon: number) => {
    // Primero verificar si existe en caché
    const clave = `${origenLat},${origenLon},${destinoLat},${destinoLon}`
    if (clave in distanciasCacheJson) {
      return distanciasCacheJson[clave as keyof typeof distanciasCacheJson]
    }

    // Calcular distancia usando fórmula de Haversine
    const R = 6371 // Radio de la Tierra en km
    const dLat = ((destinoLat - origenLat) * Math.PI) / 180
    const dLon = ((destinoLon - origenLon) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origenLat * Math.PI) / 180) *
        Math.cos((destinoLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distancia = R * c

    // Aplicar factor de corrección para rutas terrestres (aproximadamente 1.3x la distancia directa)
    return Math.round(distancia * 1.3)
  }

  // Tarifas base reales por tipo de carga y zona
  const obtenerTarifaBase = (tipoCarga: string, zona: string) => {
    const tarifasBase: Record<string, Record<string, number>> = {
      "BULTO DE 1 KILO A 10 KILOS": { "1": 13308.75, "2": 15970.5, "3": 18632.25, "4": 21294 },
      "BULTO DE 11 KILO A 20 KILOS": { "1": 26617.5, "2": 31941, "3": 37264.5, "4": 42588 },
      "DE 21 KILOS A 100 KILOS": { "1": 395.816, "2": 562.884, "3": 638.183, "4": 1037.378 },
      "DE 101 KILOS A 300 KILOS": { "1": 197.254, "2": 281.463, "3": 319.091, "4": 775.57 },
      "DE 301 KILOS A 500 KILOS": { "1": 150.993, "2": 215.182, "3": 238.954, "4": 521.287 },
      "DE 501 KILOS A 1000 KILOS": { "1": 145.164, "2": 206.924, "3": 228.651, "4": 371.747 },
      "DE 1001 KILOS A 1500 KILOS": { "1": 139.397, "2": 198.618, "3": 220.034, "4": 357.62 },
      "DE 1501 KILOS A 2000 KILOS": { "1": 99.916, "2": 156.886, "3": 166.024, "4": 311.152 },
      "DE 2001 KILOS A 2500 KILOS": { "1": 95.817, "2": 137.603, "3": 159.672, "4": 278.102 },
      "DE 2501 KILOS A 3000 KILOS": { "1": 93.189, "2": 133.046, "3": 154.237, "4": 259.104 },
      "DE 3001 KILOS EN ADELANTE": { "1": 90.572, "2": 130.409, "3": 144.168, "4": 234.654 },
      "METROS CUBICOS": { "1": 38697.296, "2": 48126.036, "3": 54994.396, "4": 90544.24 },
      "METROS CUBICOS MUDANZA": { "1": 51873.957, "2": 63246.409, "3": 82080.874, "4": 149148.445 },
      "EQUIPO COMPLETO": { "1": 0, "2": 0, "3": 0, "4": 0 },
    }

    return tarifasBase[tipoCarga]?.[zona] || 0
  }

  // Función para calcular el costo final real
  const calcularCostoFinal = (
    tipoCarga: string,
    distancia: number,
    zona: string,
    localidad: string,
    incluirIVA: boolean,
    deseaSeguro: boolean,
    cantidad: number,
    valorMercaderia: number,
  ) => {
    if (!tipoCarga || !distancia || !zona || !localidad || isNaN(cantidad) || isNaN(valorMercaderia)) {
      return null
    }

    const tarifaBase = obtenerTarifaBase(tipoCarga, zona)
    const margenGanancia = parametros[0]?.Margen_Ganancia || 0.4286

    // Costo base con margen
    let costoBase = tarifaBase * (1 + margenGanancia)

    // Factor de distancia (para distancias muy largas)
    if (distancia > 1000) {
      costoBase *= 1 + (distancia - 1000) * 0.0002
    }

    // Aplicar cantidad (excepto para bulto mínimo)
    if (tipoCarga !== "BULTO MINIMO (MAXIMO 20 KG)") {
      costoBase *= Math.max(cantidad, 1)
    }

    // Aplicar IVA si corresponde
    if (incluirIVA) {
      costoBase *= 1.21
    }

    // Aplicar seguro de carga si corresponde (0.8% del valor declarado)
    const seguroCarga = deseaSeguro ? Math.max(valorMercaderia, 0) * 0.008 : 0
    costoBase += seguroCarga

    return Math.round(costoBase)
  }

  // Función para generar una cotización real
  const generarCotizacion = async () => {
    // Validar cantidad según el tipo de carga
    if (tipoCargaSeleccionado) {
      const rango = obtenerRangoPeso(tipoCargaSeleccionado)
      if (cantidad < rango.min || (rango.max !== null && cantidad > rango.max)) {
        setCantidadError(`El valor debe estar entre ${rango.min} y ${rango.max || "∞"}`)
        return
      }
    }

    if (
      !depositoSeleccionado ||
      !zonaSeleccionada ||
      !localidadSeleccionada ||
      !tipoCargaSeleccionado ||
      isNaN(cantidad) ||
      (deseaSeguro && isNaN(valorMercaderia))
    ) {
      setError("Por favor complete todos los campos requeridos con valores válidos.")
      if (isTrackingReady) {
        trackEvent("Calculator Error", {
          error_type: "invalid_fields",
          deposito: depositoSeleccionado,
          zona: zonaSeleccionada,
          localidad: localidadSeleccionada,
          tipo_carga: tipoCargaSeleccionado,
          cantidad,
          valor_mercaderia: valorMercaderia,
        })
      }
      return
    }

    setCargando(true)
    setError("")
    setCantidadError("")

    // Track calculation start
    if (isTrackingReady) {
      trackEvent("Calculator Calculation Started", {
        deposito: depositoSeleccionado,
        zona: zonaSeleccionada,
        localidad: localidadSeleccionada,
        tipo_carga: tipoCargaSeleccionado,
        cantidad: cantidad,
        incluir_iva: incluirIVA,
        desea_seguro: deseaSeguro,
        valor_mercaderia: valorMercaderia,
      })
    }

    try {
      // Obtener información del depósito seleccionado
      const deposito = depositos.find((d) => d.Nombre === depositoSeleccionado)

      if (!deposito) {
        throw new Error("Depósito no encontrado")
      }

      // Obtener coordenadas de la localidad seleccionada
      const localidadData = localidadesPorZona[zonaSeleccionada]?.find((loc) => loc.nombre === localidadSeleccionada)

      if (!localidadData) {
        throw new Error("Localidad no encontrada")
      }

      // Calcular distancia real
      const distanciaCalculada = calcularDistanciaReal(
        deposito.Latitud,
        deposito.Longitud,
        localidadData.lat,
        localidadData.lng,
      )

      setDistancia(distanciaCalculada)

      // Calcular costo final real
      const costo = calcularCostoFinal(
        tipoCargaSeleccionado,
        distanciaCalculada,
        zonaSeleccionada,
        localidadSeleccionada,
        incluirIVA,
        deseaSeguro,
        cantidad,
        valorMercaderia,
      )

      setCostoFinal(costo)

      // Generar ID de cotización único
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000)
      const id = `COT-${timestamp}-${random}`
      setCotizacionId(id)

      // Guardar cotización en Supabase
      const cotizacionData = {
        origen: depositoSeleccionado,
        destino: `${localidadSeleccionada} (Zona ${zonaSeleccionada})`,
        peso: cantidad,
        dimensiones: {
          tipo_carga: tipoCargaSeleccionado,
          cantidad: cantidad,
          incluye_iva: incluirIVA,
          incluye_seguro: deseaSeguro,
          valor_mercaderia: valorMercaderia,
        },
        tipo_envio: "estandar",
        precio_estimado: costo,
        tiempo_estimado: "2-5",
        estado: "enviado",
      }

      // Simular tiempo de cálculo para mejor UX
      setTimeout(async () => {
        setCotizacionGenerada(true)
        setCargando(false)

        // Guardar en Supabase
        try {
          await saveCotizacion(cotizacionData)
        } catch (error) {
          console.warn("Error al guardar cotización:", error)
        }

        // Track successful calculation
        if (isTrackingReady) {
          trackEvent("Calculator Calculation Completed", {
            cotizacion_id: id,
            deposito: depositoSeleccionado,
            zona: zonaSeleccionada,
            localidad: localidadSeleccionada,
            tipo_carga: tipoCargaSeleccionado,
            cantidad: cantidad,
            distancia: distanciaCalculada,
            costo_final: costo,
            incluir_iva: incluirIVA,
            desea_seguro: deseaSeguro,
            valor_mercaderia: valorMercaderia,
          })
        }

        // NUEVO: Abrir directamente el modal de WhatsApp después de 1 segundo
        setTimeout(() => {
          iniciarEnvioWhatsAppDirecto()
        }, 1000)
      }, 800)
    } catch (err) {
      console.error(err)
      setError("Ha ocurrido un error al generar la cotización. Por favor, inténtelo nuevamente.")
      setCargando(false)

      // Track calculation error
      if (isTrackingReady) {
        trackEvent("Calculator Calculation Error", {
          error: err instanceof Error ? err.message : "Unknown error",
          deposito: depositoSeleccionado,
          zona: zonaSeleccionada,
          localidad: localidadSeleccionada,
          tipo_carga: tipoCargaSeleccionado,
        })
      }
    }
  }

  // Función para iniciar el envío directo a administración
  const iniciarEnvioWhatsAppDirecto = () => {
    setMostrarModalWhatsApp(true)
    setPasoActual(1)
    setDestinatarioSeleccionado("administracion")
    setErrorModal("")
    setFeedbackSeleccionado(null)
    setRedireccionando(false)
    setContadorRedireccion(3)

    // Track WhatsApp flow start (direct)
    if (isTrackingReady) {
      trackEvent("WhatsApp Flow Started", {
        cotizacion_id: cotizacionId,
        costo_final: costoFinal,
        deposito: depositoSeleccionado,
        zona: zonaSeleccionada,
        localidad: localidadSeleccionada,
        flow_type: "direct_to_admin",
      })
    }

    // Enviar directamente a administración y pasar al paso de feedback
    setTimeout(() => {
      enviarPorWhatsAppAdministracion()
      setPasoActual(3)

      if (isTrackingReady) {
        trackEvent("WhatsApp Flow Step Changed", {
          cotizacion_id: cotizacionId,
          from_step: 1,
          to_step: 3,
          recipient_type: "administracion",
          flow_type: "direct",
        })
      }
    }, 500)
  }

  // Función para resetear el formulario
  const resetearFormulario = () => {
    setDepositoSeleccionado("")
    setZonaSeleccionada("")
    setLocalidadSeleccionada("")
    setTipoCargaSeleccionado("")
    setCantidad(1)
    setIncluirIVA(false)
    setDeseaSeguro(false)
    setValorMercaderia(0)
    setDistancia(null)
    setCostoFinal(null)
    setCotizacionGenerada(false)
    setCotizacionId("")
    setError("")
    setCantidadError("")

    // Track form reset
    if (isTrackingReady) {
      trackEvent("Calculator Form Reset", {})
    }
  }

  // Función para obtener el rango de peso según el tipo de carga
  const obtenerRangoPeso = (tipoCarga: string) => {
    const rangos: Record<string, { min: number; max: number | null }> = {
      "BULTO MINIMO (MAXIMO 20 KG)": { min: 1, max: 20 },
      "DE 21 KG A 100 KG": { min: 21, max: 100 },
      "DE 101 KG A 300 KG": { min: 101, max: 300 },
      "DE 301 KG A 500 KG": { min: 301, max: 500 },
      "DE 501 KG A 1000 KG": { min: 501, max: 1000 },
      "DE 1001 KG A 1500 KG": { min: 1001, max: 1500 },
      "DE 1501 KG A 2000 KG": { min: 1501, max: 2000 },
      "DE 2001 KG A 2500 KG": { min: 2001, max: 2500 },
      "DE 2501 KG A 3000 KG": { min: 2501, max: 3000 },
      "DE 3001 KG EN ADELANTE": { min: 3001, max: null },
      "METROS CUBICOS": { min: 1, max: null },
      "METROS CUBICOS MUDANZA": { min: 1, max: null },
    }

    return rangos[tipoCarga] || { min: 1, max: null }
  }

  // Función para validar la cantidad al cambiar
  const validarCantidad = (value: string) => {
    const numValue = value === "" ? 0 : Number.parseInt(value)
    setCantidad(numValue)

    if (tipoCargaSeleccionado) {
      const rango = obtenerRangoPeso(tipoCargaSeleccionado)
      if (numValue < rango.min || (rango.max !== null && numValue > rango.max)) {
        setCantidadError(`El valor debe estar entre ${rango.min} y ${rango.max || "∞"}`)
      } else {
        setCantidadError("")
      }
    }
  }

  // Función para iniciar el flujo de WhatsApp
  const iniciarEnvioWhatsApp = () => {
    setMostrarModalWhatsApp(true)
    setPasoActual(1)
    setDestinatarioSeleccionado(null)
    setNombreUsuario("")
    setWhatsappUsuario("")
    setErrorModal("")
    setFeedbackSeleccionado(null)
    setRedireccionando(false)
    setContadorRedireccion(5)

    // Track WhatsApp flow start
    if (isTrackingReady) {
      trackEvent("WhatsApp Flow Started", {
        cotizacion_id: cotizacionId,
        costo_final: costoFinal,
        deposito: depositoSeleccionado,
        zona: zonaSeleccionada,
        localidad: localidadSeleccionada,
      })
    }
  }

  // Función para seleccionar destinatario
  const seleccionarDestinatario = (tipo: "administracion" | "otro") => {
    setDestinatarioSeleccionado(tipo)

    // Track recipient selection
    if (isTrackingReady) {
      trackEvent("WhatsApp Recipient Selected", {
        cotizacion_id: cotizacionId,
        recipient_type: tipo,
        paso: 1,
      })
    }

    if (tipo === "administracion") {
      // Si es administración, enviar directamente y pasar al paso 3
      enviarPorWhatsAppAdministracion()
      setPasoActual(3)

      // Track step progression
      if (isTrackingReady) {
        trackEvent("WhatsApp Flow Step Changed", {
          cotizacion_id: cotizacionId,
          from_step: 1,
          to_step: 3,
          recipient_type: tipo,
          skipped_step: 2,
        })
      }
    } else {
      // Si es otro contacto, ir al paso 2 para pedir datos
      setPasoActual(2)

      // Track step progression
      if (isTrackingReady) {
        trackEvent("WhatsApp Flow Step Changed", {
          cotizacion_id: cotizacionId,
          from_step: 1,
          to_step: 2,
          recipient_type: tipo,
        })
      }
    }
  }

  // Función para enviar a administración
  const enviarPorWhatsAppAdministracion = () => {
    const numeroAdministracion = "+5493888446213"

    const mensaje = encodeURIComponent(
      `🚚 *SOLICITUD DE COTIZACIÓN* 🚚
ID: ${cotizacionId}

📦 *DETALLES DEL ENVÍO:*
• Tipo de carga: ${tipoCargaSeleccionado}
• Cantidad: ${cantidad}
• Origen: ${depositoSeleccionado}
• Destino: ${localidadSeleccionada} (Zona ${zonaSeleccionada})
• Distancia aproximada: ${distancia} km

💰 *OPCIONES ADICIONALES:*
${incluirIVA ? "✅ Cliente solicita IVA incluido (21%)" : "❌ Cliente NO solicita IVA"}
${deseaSeguro ? `🛡️ Cliente solicita seguro - Valor declarado: $${valorMercaderia.toLocaleString()}` : "❌ Cliente NO solicita seguro"}

⏰ *Cotización válida por 48 horas*

*Por favor, proporcionar precio exacto y confirmar disponibilidad y tiempos de entrega.*

_Generado desde calculadora web - ${new Date().toLocaleString()}_`,
    )

    // Track WhatsApp message sent to administration
    if (isTrackingReady) {
      trackEvent("WhatsApp Message Sent", {
        cotizacion_id: cotizacionId,
        recipient_type: "administracion",
        whatsapp_number: numeroAdministracion,
        costo_final: costoFinal,
        deposito: depositoSeleccionado,
        zona: zonaSeleccionada,
        localidad: localidadSeleccionada,
        tipo_carga: tipoCargaSeleccionado,
        cantidad: cantidad,
        incluir_iva: incluirIVA,
        desea_seguro: deseaSeguro,
        valor_mercaderia: valorMercaderia,
        distancia: distancia,
        flow_type: "direct",
      })
    }

    window.open(`https://wa.me/${numeroAdministracion.replace(/\D/g, "")}?text=${mensaje}`, "_blank")
  }

  // Función para enviar a otro contacto
  const enviarPorWhatsAppOtroContacto = useCallback(() => {
    // Validar datos
    if (!nombreUsuario.trim()) {
      setErrorModal("Por favor ingrese su nombre completo")

      // Track validation error
      if (isTrackingReady) {
        trackEvent("WhatsApp Form Validation Error", {
          cotizacion_id: cotizacionId,
          field: "nombre",
          error_message: "Nombre requerido",
          paso: 2,
        })
      }
      return
    }

    const cleanWhatsapp = whatsappUsuario.replace(/\D/g, "")
    if (!cleanWhatsapp || cleanWhatsapp.length < 10) {
      setErrorModal("Por favor ingrese un número de WhatsApp válido de al menos 10 dígitos")
      // Track validation error
      if (isTrackingReady) {
        trackEvent("WhatsApp Form Validation Error", {
          cotizacion_id: cotizacionId,
          field: "whatsapp",
          error_message: "WhatsApp inválido - debe tener al menos 10 dígitos",
          whatsapp_length: cleanWhatsapp.length,
          paso: 2,
        })
      }
      return
    }

    setCargandoWhatsApp(true)

    // Guardar contacto de WhatsApp en Supabase
    try {
      saveWhatsAppContact({
        cotizacionId: cotizacionId,
        nombreCompleto: nombreUsuario,
        numeroWhatsapp: `+549${cleanWhatsapp}`,
        origen: depositoSeleccionado,
        destino: `${localidadSeleccionada} (Zona ${zonaSeleccionada})`,
        costoEstimado: costoFinal || 0,
        metadata: {
          tipo_carga: tipoCargaSeleccionado,
          cantidad: cantidad,
          incluye_iva: incluirIVA,
          incluye_seguro: deseaSeguro,
          valor_mercaderia: valorMercaderia,
          distancia: distancia,
        },
      })
        .then(() => {
          // Track WhatsApp message sent to other contact
          if (isTrackingReady) {
            trackEvent("WhatsApp Message Sent", {
              cotizacion_id: cotizacionId,
              recipient_type: "otro",
              whatsapp_number: `+549${cleanWhatsapp}`,
              costo_final: costoFinal,
              deposito: depositoSeleccionado,
              zona: zonaSeleccionada,
              localidad: localidadSeleccionada,
              tipo_carga: tipoCargaSeleccionado,
              cantidad: cantidad,
              incluir_iva: incluirIVA,
              desea_seguro: deseaSeguro,
              valor_mercaderia: valorMercaderia,
              distancia: distancia,
              usuario_nombre: nombreUsuario,
              usuario_whatsapp: `+549${cleanWhatsapp}`,
            })
          }

          // Track step progression to feedback
          if (isTrackingReady) {
            trackEvent("WhatsApp Flow Step Changed", {
              cotizacion_id: cotizacionId,
              from_step: 2,
              to_step: 3,
              recipient_type: "otro",
              usuario_nombre: nombreUsuario,
              usuario_whatsapp: `+549${cleanWhatsapp}`,
            })
          }

          const mensaje = encodeURIComponent(
            `Hola ${nombreUsuario}! Aquí está la cotización ${cotizacionId} que solicitaste:

📦 Tipo de carga: ${tipoCargaSeleccionado}
📍 Origen: ${depositoSeleccionado}
📍 Destino: ${localidadSeleccionada} (Zona ${zonaSeleccionada})
📏 Distancia: ${distancia} km
⚖️ Cantidad: ${cantidad}
💰 Costo total: ${costoFinal !== null ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(costoFinal) : "N/A"}
${incluirIVA ? "✅ IVA incluido" : "❌ Sin IVA"}
${deseaSeguro ? `🛡️ Seguro incluido (Valor: $${valorMercaderia.toLocaleString()})` : "❌ Sin seguro"}

Para más información, contacta a TRANSPORTE RIO LAVAYEN al +5493888446213`,
          )

          // Avanzar al paso 3
          setPasoActual(3)
          setCargandoWhatsApp(false)

          // Abrir WhatsApp
          window.open(`https://wa.me/549${cleanWhatsapp}?text=${mensaje}`, "_blank")
        })
        .catch((error) => {
          console.warn("Error al guardar contacto WhatsApp:", error)
          setErrorModal("Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.")
          setCargandoWhatsApp(false)
        })
    } catch (error) {
      console.warn("Error al guardar contacto WhatsApp:", error)
      setErrorModal("Hubo un problema al procesar tu solicitud. Por favor intenta nuevamente.")
      setCargandoWhatsApp(false)
    }
  }, [
    nombreUsuario,
    whatsappUsuario,
    cotizacionId,
    depositoSeleccionado,
    localidadSeleccionada,
    zonaSeleccionada,
    costoFinal,
    tipoCargaSeleccionado,
    cantidad,
    incluirIVA,
    deseaSeguro,
    valorMercaderia,
    distancia,
    isTrackingReady,
  ])

  // Función para seleccionar feedback
  const seleccionarFeedback = async (tipo: FeedbackType) => {
    setFeedbackSeleccionado(tipo)

    // Track feedback selection
    if (isTrackingReady) {
      trackEvent("WhatsApp Flow Feedback Selected", {
        cotizacion_id: cotizacionId,
        feedback_type: tipo,
        recipient_type: destinatarioSeleccionado,
        costo_final: costoFinal,
        deposito: depositoSeleccionado,
        zona: zonaSeleccionada,
        localidad: localidadSeleccionada,
        paso: 3,
      })

      // Track redirection start
      trackEvent("WhatsApp Flow Redirect Started", {
        cotizacion_id: cotizacionId,
        feedback_selected: tipo,
        countdown_seconds: 5,
      })
    }

    // Registrar feedback en Supabase
    if (tipo) {
      try {
        await registrarFeedbackCalculadora({
          tipo: tipo,
          cotizacion_id: cotizacionId,
          pagina_origen: "calculadora",
        })
      } catch (error) {
        console.warn("Error al registrar feedback:", error)
      }
    }

    // Después de registrar feedback en Supabase, disparar el widget global
    if (tipo) {
      // Disparar widget de feedback global después de completar el flujo
      setTimeout(() => {
        const event = new CustomEvent("showFeedbackWidget", {
          detail: { trigger: "whatsapp_flow_completed" },
        })
        window.dispatchEvent(event)
      }, 2000)
    }

    // Iniciar redirección
    setRedireccionando(true)
  }

  // Función para cerrar modal
  const cerrarModal = () => {
    setMostrarModalWhatsApp(false)

    // Track modal close
    if (isTrackingReady) {
      trackEvent("WhatsApp Flow Modal Closed", {
        cotizacion_id: cotizacionId,
        current_step: pasoActual,
        recipient_selected: destinatarioSeleccionado,
        feedback_selected: feedbackSeleccionado,
        completed: feedbackSeleccionado !== null,
      })
    }
  }

  // Track navigation between steps
  const navegarPaso = (nuevoPaso: number) => {
    const pasoAnterior = pasoActual
    setPasoActual(nuevoPaso)

    // Track step navigation
    if (isTrackingReady) {
      trackEvent("WhatsApp Flow Step Navigation", {
        cotizacion_id: cotizacionId,
        from_step: pasoAnterior,
        to_step: nuevoPaso,
        navigation_type: nuevoPaso > pasoAnterior ? "forward" : "backward",
      })
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {!cotizacionGenerada ? (
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-primary-500 to-accent-400 py-6 px-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <CalcIcon className="mr-2 h-6 w-6" />
              Cotizar Ahora
            </h2>
            <p>Complete el formulario para obtener una cotización real</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 animate-slide-down">
                <p>{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="animate-slide-up">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Origen y Destino</h3>

                <div className="mb-4">
                  <label htmlFor="deposito" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Depósito de origen *
                  </label>
                  <select
                    id="deposito"
                    value={depositoSeleccionado}
                    onChange={(e) => {
                      setDepositoSeleccionado(e.target.value)
                      setZonaSeleccionada("")
                      setLocalidadSeleccionada("")
                      setTipoCargaSeleccionado("")
                      if (isTrackingReady) {
                        trackEvent("Calculator Deposito Selected", {
                          deposito: e.target.value,
                        })
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                    required
                  >
                    <option value="">Seleccione un depósito</option>
                    {depositos.map((deposito, index) => (
                      <option
                        key={index}
                        value={deposito.Nombre}
                        className={deposito.Nueva ? "bg-red-50 font-bold" : ""}
                      >
                        {deposito.Nueva ? `🆕 ${deposito.Nombre}` : deposito.Nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="zona" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Zona de destino *
                  </label>
                  <select
                    id="zona"
                    value={zonaSeleccionada}
                    onChange={(e) => {
                      setZonaSeleccionada(e.target.value)
                      setLocalidadSeleccionada("")
                      setTipoCargaSeleccionado("")
                      if (isTrackingReady) {
                        trackEvent("Calculator Zona Selected", {
                          zona: e.target.value,
                        })
                      }
                    }}
                    disabled={!depositoSeleccionado}
                    className={`w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200 ${
                      !depositoSeleccionado ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    required
                  >
                    <option value="">Seleccione una zona</option>
                    {zonas.map((zona) => (
                      <option key={zona} value={zona}>
                        Zona {zona}
                      </option>
                    ))}
                  </select>
                </div>

                {zonaSeleccionada && (
                  <div className="mb-4 animate-slide-down">
                    <label htmlFor="localidad" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Localidad de destino *
                    </label>
                    <select
                      id="localidad"
                      value={localidadSeleccionada}
                      onChange={(e) => {
                        setLocalidadSeleccionada(e.target.value)
                        setTipoCargaSeleccionado("")
                        if (isTrackingReady) {
                          trackEvent("Calculator Localidad Selected", {
                            zona: zonaSeleccionada,
                            localidad: e.target.value,
                          })
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                      required
                    >
                      <option value="">Seleccione una localidad</option>
                      {localidadesPorZona[zonaSeleccionada]?.map((localidad) => (
                        <option key={localidad.nombre} value={localidad.nombre}>
                          {localidad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Detalles de la Carga</h3>

                <div className="mb-4">
                  <label htmlFor="tipoCarga" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de carga *
                  </label>
                  <select
                    id="tipoCarga"
                    value={tipoCargaSeleccionado}
                    onChange={(e) => {
                      setTipoCargaSeleccionado(e.target.value)
                      if (isTrackingReady) {
                        trackEvent("Calculator Tipo Carga Selected", {
                          tipo_carga: e.target.value,
                        })
                      }
                    }}
                    disabled={!localidadSeleccionada}
                    className={`w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200 ${
                      !localidadSeleccionada ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    required
                  >
                    <option value="">Seleccione tipo de carga</option>
                    {tiposCarga.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                {tipoCargaSeleccionado && (
                  <div className="mb-4 animate-slide-down">
                    <label htmlFor="cantidad" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      id="cantidad"
                      value={cantidad === 0 || isNaN(cantidad) ? "" : cantidad}
                      onChange={(e) => validarCantidad(e.target.value)}
                      min={obtenerRangoPeso(tipoCargaSeleccionado).min}
                      max={obtenerRangoPeso(tipoCargaSeleccionado).max || undefined}
                      className={`w-full px-4 py-2 border ${
                        cantidadError ? "border-red-500" : "border-gray-300 dark:border-secondary-600"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200`}
                      required
                    />
                    {cantidadError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{cantidadError}</p>}
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Rango permitido: {obtenerRangoPeso(tipoCargaSeleccionado).min}
                      {obtenerRangoPeso(tipoCargaSeleccionado).max !== null
                        ? ` a ${obtenerRangoPeso(tipoCargaSeleccionado).max}`
                        : " en adelante"}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="incluirIVA"
                      checked={incluirIVA}
                      onChange={(e) => {
                        setIncluirIVA(e.target.checked)
                        if (isTrackingReady) {
                          trackEvent("Calculator IVA Toggle", {
                            incluir_iva: e.target.checked,
                          })
                        }
                      }}
                      disabled={!tipoCargaSeleccionado}
                      className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                        !tipoCargaSeleccionado ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    />
                    <label
                      htmlFor="incluirIVA"
                      className={`ml-2 block text-gray-700 dark:text-gray-300 ${
                        !tipoCargaSeleccionado ? "opacity-50" : ""
                      }`}
                    >
                      Incluir IVA (21%)
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="deseaSeguro"
                      checked={deseaSeguro}
                      onChange={(e) => {
                        setDeseaSeguro(e.target.checked)
                        if (isTrackingReady) {
                          trackEvent("Calculator Seguro Toggle", {
                            desea_seguro: e.target.checked,
                          })
                        }
                      }}
                      disabled={!tipoCargaSeleccionado}
                      className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                        !tipoCargaSeleccionado ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    />
                    <label
                      htmlFor="deseaSeguro"
                      className={`ml-2 block text-gray-700 dark:text-gray-300 ${
                        !tipoCargaSeleccionado ? "opacity-50" : ""
                      }`}
                    >
                      Solicitar Seguro de Carga (0.8% del valor)
                    </label>
                  </div>
                </div>

                {deseaSeguro && (
                  <div className="mb-4 animate-slide-down">
                    <label htmlFor="valorMercaderia" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Valor declarado (ARS) *
                    </label>
                    <input
                      type="number"
                      id="valorMercaderia"
                      value={valorMercaderia === 0 || isNaN(valorMercaderia) ? "" : valorMercaderia}
                      onChange={(e) => {
                        const value = e.target.value
                        setValorMercaderia(value === "" ? 0 : Number.parseFloat(value))
                        if (isTrackingReady) {
                          trackEvent("Calculator Valor Mercaderia Changed", {
                            valor_mercaderia: value === "" ? 0 : Number.parseFloat(value),
                          })
                        }
                      }}
                      min={0}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white transition-all duration-200"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={generarCotizacion}
                disabled={cargando || !tipoCargaSeleccionado || !!cantidadError || (deseaSeguro && !valorMercaderia)}
                className={`bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-8 rounded-md flex items-center justify-center min-w-[200px] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  cargando ? "opacity-75" : ""
                }`}
              >
                {cargando ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    <span>Calculando...</span>
                  </div>
                ) : (
                  <>
                    <CalcIcon className="mr-2 h-5 w-5" />
                    <span>Calcular Envío</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-green-500 to-green-700 py-6 px-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <CalcIcon className="mr-2 h-6 w-6" />
              Cotización Generada
            </h2>
            <p>ID de Cotización: {cotizacionId}</p>
          </div>

          <div className="p-6">
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6 animate-slide-down">
              <p className="text-green-800 dark:text-green-300 font-medium">
                ¡Cotización generada exitosamente! Válida por 48 horas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6 relative">
              {/* Overlay de desenfoque cuando se muestra el modal */}
              {mostrarModalWhatsApp && (
                <div className="absolute inset-0 bg-white/70 dark:bg-secondary-800/70 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Enviando cotización...</p>
                  </div>
                </div>
              )}

              <div className="animate-slide-up">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Detalles del Envío</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-2 font-medium dark:text-gray-300">Depósito de origen:</td>
                      <td className="dark:text-gray-300">{depositoSeleccionado}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium dark:text-gray-300">Destino:</td>
                      <td className="dark:text-gray-300">
                        {localidadSeleccionada} (Zona {zonaSeleccionada})
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium dark:text-gray-300">Distancia Aproximada:</td>
                      <td className="dark:text-gray-300">{distancia} km</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium dark:text-gray-300">Tipo de carga:</td>
                      <td className="dark:text-gray-300">{tipoCargaSeleccionado}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium dark:text-gray-300">Cantidad:</td>
                      <td className="dark:text-gray-300">{cantidad}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Detalles del Costo</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-2 font-medium dark:text-gray-300">Incluye IVA:</td>
                      <td className="dark:text-gray-300">{incluirIVA ? "Sí (21%)" : "No"}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium dark:text-gray-300">Seguro de carga:</td>
                      <td className="dark:text-gray-300">{deseaSeguro ? "Sí (0.8%)" : "No"}</td>
                    </tr>
                    {deseaSeguro && (
                      <tr>
                        <td className="py-2 font-medium dark:text-gray-300">Valor declarado:</td>
                        <td className="dark:text-gray-300">ARS ${valorMercaderia.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr className="border-t border-gray-200 dark:border-secondary-600">
                      <td className="py-3 font-bold text-lg dark:text-white">Estado:</td>
                      <td className="py-3 font-bold text-lg text-orange-600 dark:text-orange-400">
                        Enviado a Administración
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="py-2 text-sm text-gray-500 dark:text-gray-400 italic">
                        El precio exacto será proporcionado por Administración vía WhatsApp
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "400ms" }}
            >
              <button
                onClick={iniciarEnvioWhatsApp}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition-all duration-200 transform hover:scale-105"
              >
                <Send className="mr-2 h-5 w-5" />
                <span>Reenviar o Enviar a Otro</span>
              </button>

              <button
                onClick={resetearFormulario}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition-all duration-300 transform hover:scale-105"
              >
                <Truck className="mr-2 h-5 w-5" />
                <span>Nueva Cotización</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para el flujo de WhatsApp */}
      {mostrarModalWhatsApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md mx-4 animate-slide-up">
            {/* Indicador de pasos */}
            <div className="flex items-center justify-center mb-6">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${pasoActual === 1 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"} font-bold`}
              >
                1
              </div>
              <div className={`h-1 w-12 ${pasoActual >= 2 ? "bg-primary-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${pasoActual === 2 ? "bg-primary-600 text-white" : pasoActual > 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"} font-bold`}
              >
                {pasoActual > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <div className={`h-1 w-12 ${pasoActual >= 3 ? "bg-primary-600" : "bg-gray-200"}`}></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${pasoActual === 3 ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"} font-bold`}
              >
                3
              </div>
            </div>

            {/* Paso 1: Solo mostrar si no es flujo directo */}
            {pasoActual === 1 && destinatarioSeleccionado !== "administracion" && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-4 dark:text-white text-center">
                  ¿A quién deseas enviar la cotización?
                </h3>

                <div className="grid grid-cols-1 gap-4 mt-6">
                  <button
                    onClick={() => seleccionarDestinatario("administracion")}
                    className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105"
                  >
                    <Building className="h-12 w-12 mb-2" />
                    <span className="font-medium text-lg">ADMINISTRACIÓN TRANSPORTE RIO LAVAYEN</span>
                  </button>

                  <button
                    onClick={() => seleccionarDestinatario("otro")}
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105"
                  >
                    <User className="h-12 w-12 mb-2" />
                    <span className="font-medium text-lg">A OTRO CONTACTO</span>
                  </button>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={cerrarModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Nuevo: Paso 1 para flujo directo */}
            {pasoActual === 1 && destinatarioSeleccionado === "administracion" && (
              <div className="animate-fade-in text-center">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Enviando cotización...</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Tu cotización está siendo enviada a Administración de Transporte Río Lavayen
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
                </div>
              </div>
            )}

            {/* Paso 2: Datos de contacto (solo si eligió "otro contacto") */}
            {pasoActual === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-4 dark:text-white text-center">Datos para contacto</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                  Para enviar la cotización, necesitamos los datos de contacto:
                </p>

                {errorModal && (
                  <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-3 py-2 rounded mb-4">
                    <p className="text-sm">{errorModal}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="nombreUsuario" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="nombreUsuario"
                      value={nombreUsuario}
                      onChange={(e) => {
                        setNombreUsuario(e.target.value)
                        // Track user input
                        if (isTrackingReady) {
                          trackEvent("WhatsApp Form Field Changed", {
                            cotizacion_id: cotizacionId,
                            field: "nombre",
                            has_value: e.target.value.trim().length > 0,
                            value_length: e.target.value.trim().length,
                            paso: 2,
                          })
                        }
                      }}
                      placeholder="Ingrese su nombre completo"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="whatsappUsuario"
                      className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
                    >
                      WhatsApp *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 dark:border-secondary-600 bg-gray-50 dark:bg-secondary-600 text-gray-500 dark:text-gray-300 rounded-l-md">
                        +549
                      </span>
                      <input
                        type="tel"
                        id="whatsappUsuario"
                        value={whatsappUsuario}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                          setWhatsappUsuario(value)
                          // Track user input
                          if (isTrackingReady) {
                            trackEvent("WhatsApp Form Field Changed", {
                              cotizacion_id: cotizacionId,
                              field: "whatsapp",
                              has_value: value.length > 0,
                              value_length: value.length,
                              is_valid: value.length >= 10,
                              paso: 2,
                            })
                          }
                        }}
                        placeholder="1123456789"
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Ingrese característica + número (ej: 11 1234 5678)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => navegarPaso(1)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={enviarPorWhatsAppOtroContacto}
                    disabled={!nombreUsuario.trim() || !whatsappUsuario.trim() || cargandoWhatsApp}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    {cargandoWhatsApp ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Agradecimiento y feedback */}
            {pasoActual === 3 && (
              <div className="animate-fade-in text-center">
                <h3 className="text-xl font-bold mb-4 dark:text-white">¡Gracias por cotizar con nosotros!</h3>

                {!feedbackSeleccionado ? (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      ¿Cómo calificarías el funcionamiento de nuestra calculadora?
                    </p>

                    <div className="flex justify-center gap-6 mb-6">
                      <button
                        onClick={() => seleccionarFeedback("happy")}
                        className="flex flex-col items-center p-4 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-200"
                      >
                        <SmilePlus className="h-12 w-12 text-green-600 mb-2" />
                        <span className="text-sm font-medium dark:text-white">Excelente</span>
                      </button>

                      <button
                        onClick={() => seleccionarFeedback("neutral")}
                        className="flex flex-col items-center p-4 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors duration-200"
                      >
                        <Meh className="h-12 w-12 text-yellow-600 mb-2" />
                        <span className="text-sm font-medium dark:text-white">Regular</span>
                      </button>

                      <button
                        onClick={() => seleccionarFeedback("sad")}
                        className="flex flex-col items-center p-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                      >
                        <Frown className="h-12 w-12 text-red-600 mb-2" />
                        <span className="text-sm font-medium dark:text-white">Mejorable</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="flex justify-center mb-4">
                        {feedbackSeleccionado === "happy" && <SmilePlus className="h-16 w-16 text-green-600" />}
                        {feedbackSeleccionado === "neutral" && <Meh className="h-16 w-16 text-yellow-600" />}
                        {feedbackSeleccionado === "sad" && <Frown className="h-16 w-16 text-red-600" />}
                      </div>
                      <p className="text-lg font-medium dark:text-white mb-2">¡Gracias por tu feedback!</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Serás redirigido al inicio en {contadorRedireccion} segundos...
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 dark:bg-secondary-700 rounded-lg p-6 border border-gray-200 dark:border-secondary-600 animate-fade-in transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Estas son las ubicaciones que abarca cada zona</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            ZONA 1 &#10145; LA ESPERANZA, EL PIQUETE, CHALICAN, PUESTO VIEJO, EL BORDO, METAN, YALA, REYES, CAMPO SANTO,
            FRAILE PINTADO, GRAL GUEMES, LIBERTADOR GENERAL SAN MARTIN, LOS LAPACHOS, ROSARIO DE LA FRONTERA, ROSARIO DE
            LERMA, SALTA, LOZANO, JUJUY, PERICO, PALPALA, EL CARMEN, MONTERRICO, SAN PEDRO, SAN ANTONIO
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            ZONA 2 &#10145; COLONIA SANTA ROSA, EMBARCACION, HUMAHUACA, ORAN, TILCARA, HUACALERA, MAIMARA, SANTA CLARA,
            CERRILLOS, EL CARRIL, YUTO, PICHANAL, URUNDEL, TUMBAYA, VOLCAN, UQUIA, PURMAMARCA, TABACAL, YRIGOYEN,
            VAQUEROS, CAMPO QUIJANO
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            ZONA 3 &#10145; ABRA PAMPA, AGUAS BLANCAS, TRES CRUCES, METAN, EL GALPON, GENERAL MOSCONI, TARTAGAL
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            ZONA 4 &#10145; LA QUIACA, POCITOS, SALVADOR MAZZA, PALMA SOLA, J V GONZALEZ, CAFAYATE
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            ZONA 5 &#128245; ¡AÚN NO DISPONIBLE! &#128245;
          </li>
        </ul>
      </div>

      <div className="mt-8 bg-gray-50 dark:bg-secondary-700 rounded-lg p-6 border border-gray-200 dark:border-secondary-600 animate-fade-in transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Información Importante</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            Las cotizaciones son válidas por 48 horas y están sujetas a confirmación de disponibilidad.
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            Los precios varian segun la opcion del cliente.
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            Para cargas especiales o de gran volumen, contáctese con Administración para una cotización personalizada.
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            El seguro de carga es opcional pero recomendado para proteger su mercadería.
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
            Los tiempos de entrega varían según la distancia y condiciones climáticas.
          </li>
        </ul>
      </div>
    </div>
  )
}
