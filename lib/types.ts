/* Modelo de datos del catálogo.
   Refleja el esquema real de la base que ya usa el sitio en producción.
   V2 lee de ahí; no lo modifica. */

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  order_index: number
}

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string | null
  category?: Category
  price: number
  description: string | null
  /** Texto libre: "16GB", "16 GB DDR4" y "RAM 16" conviven aquí */
  specs: Record<string, string>
  image_url: string | null
  images: string[]
  features: string[]
  colors: string[]
  /** null = disponible sin control de existencias */
  stock: number | null
  rating: number | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

/* --------------------------------------------------------------------
   Capacidad normalizada.

   `specs` es texto libre, así que no se puede comparar un equipo con
   otro ni alimentar el banco de carga. Estos tres números sí.
   Se derivan del texto cuando se puede; lo que no se pueda leer queda
   en null, nunca en un valor inventado.
   -------------------------------------------------------------------- */

export interface Capacity {
  /** Memoria en gigabytes */
  ramGb: number | null
  /** Índice de procesador. 100 = referencia alta del catálogo */
  cpuIndex: number | null
  /** Índice de gráfica. 100 = referencia alta del catálogo */
  gpuIndex: number | null
}

export type ProductWithCapacity = Product & { capacity: Capacity }

/** Resultado de una consulta al catálogo. Nunca lanza: si algo falla,
    devuelve datos vacíos y el motivo, para que la página no se caiga. */
export interface CatalogResult<T> {
  data: T
  error: string | null
}
