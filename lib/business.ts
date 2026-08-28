/* =====================================================================
   Datos del negocio.

   Todo lo que el sitio afirma sobre ECOMPUTO sale de aquí, en un solo
   sitio, para que nadie escriba un teléfono o un NIT a mano dentro de un
   componente y luego quede desactualizado en cuatro pantallas distintas.

   Lo que todavía no sabemos vale `null`. Los componentes omiten lo que
   sea null en vez de mostrar un hueco o, peor, un dato inventado: en un
   negocio sin local, cada dato verificable es una prueba de existencia,
   y uno falso destruye justo lo que viene a construir.
   ===================================================================== */

export interface DatosNegocio {
  nombre: string
  /** Razón social completa, como aparece en la factura */
  razonSocial: string | null
  nit: string | null
  /** Año de fundación. Con él, «desde 2009» sustituye a «más de 15 años». */
  fundacion: number | null
  ciudad: string
  whatsapp: string | null
  telefono: string | null
  email: string | null
  /** Texto libre: «Lunes a viernes, 8:00 a 18:00» */
  horario: string | null
  /** Perfil de Google donde viven las reseñas verificables */
  googleMaps: string | null
}

export const NEGOCIO: DatosNegocio = {
  nombre: 'ECOMPUTO',

  // TODO(jhony): razón social exacta como aparece en la factura electrónica.
  razonSocial: null,

  // TODO(jhony): NIT con dígito de verificación. Sin local físico, el NIT
  // pasa a ser la prueba de existencia legal más importante del pie.
  nit: null,

  // TODO(jhony): año exacto de fundación. Hoy el sitio dice «más de 15 años»
  // porque no lo tenemos; una fecha concreta convence bastante más.
  fundacion: null,

  ciudad: 'Medellín',

  // Vienen de la tabla `settings`; estos son el respaldo si esa consulta falla.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK ?? null,
  email: 'admin@ecomputo.com',

  // TODO(jhony): ¿queda una línea fija o de atención tras cerrar el local?
  telefono: null,

  // TODO(jhony): horario de atención por WhatsApp. Decirlo evita la
  // sensación de escribir al vacío, que es lo que frena a mucha gente.
  horario: null,

  // El perfil existe: el sitio actual ya enlazaba a él. Sus reseñas son la
  // prueba social más fuerte disponible ahora que no hay vitrina.
  // TODO(jhony): confirmar la URL corta del perfil para enlazarla aquí.
  googleMaps: null,
}

/** Años de trayectoria, si conocemos el año de fundación. */
export function añosDeTrayectoria(): number | null {
  if (!NEGOCIO.fundacion) return null
  return new Date().getFullYear() - NEGOCIO.fundacion
}

/** Enlace de WhatsApp con un mensaje ya escrito. */
export function whatsappHref(mensaje: string, numero?: string | null): string {
  const n = numero || NEGOCIO.whatsapp
  if (!n) return '/productos'
  return `https://wa.me/${n}?text=${encodeURIComponent(mensaje)}`
}
