import { supabaseRead } from './supabase'
import type {
  Capacity,
  CatalogResult,
  Category,
  Product,
  ProductWithCapacity,
} from './types'

/* =====================================================================
   Puerta única a los datos del catálogo.

   Ningún componente habla con Supabase directamente. Si mañana cambia
   el origen —otra base, una API, un archivo— se cambia este archivo y
   el resto del sitio no se entera.

   Ninguna función lanza. Una tienda no se cae porque la red falle:
   devuelve vacío, deja el motivo en `error` y la página muestra su
   estado correspondiente.
   ===================================================================== */

const PRODUCT_FIELDS =
  'id, name, slug, category_id, price, description, specs, image_url, images, features, colors, stock, rating, is_featured, is_active, created_at'

function fail<T>(fallback: T, e: unknown, contexto: string): CatalogResult<T> {
  const motivo = e instanceof Error ? e.message : String(e)
  console.error(`[catalog] ${contexto}: ${motivo}`)
  return { data: fallback, error: motivo }
}

/* ---------------------------------------------------------------------
   Normalización de capacidad.

   `specs` llega como texto libre del proveedor. Estas funciones intentan
   leer un número; lo que no se pueda interpretar queda en null. Nunca se
   inventa un valor: un dato inventado en un banco de carga es peor que
   un dato ausente, porque el cliente lo toma por cierto.
   --------------------------------------------------------------------- */

function findSpec(specs: Record<string, string>, claves: string[]): string | null {
  const entradas = Object.entries(specs || {})
  for (const [k, v] of entradas) {
    const clave = k.toLowerCase()
    if (claves.some(c => clave.includes(c))) return String(v)
  }
  return null
}

export function parseRamGb(specs: Record<string, string>): number | null {
  const texto = findSpec(specs, ['ram', 'memoria'])
  if (!texto) return null
  const m = texto.match(/(\d+)\s*g/i)
  return m ? Number(m[1]) : null
}

/* Índices de referencia. Se amplían a medida que entran equipos nuevos;
   son deliberadamente pocos y explícitos, no una heurística que adivine. */
const CPU_INDEX: Array<[RegExp, number]> = [
  [/ryzen\s*9|i9|ultra\s*9/i, 100],
  [/ryzen\s*7|i7|ultra\s*7/i, 88],
  [/ryzen\s*5|i5|ultra\s*5/i, 72],
  [/ryzen\s*3|i3/i, 52],
  [/celeron|pentium|athlon/i, 32],
]

const GPU_INDEX: Array<[RegExp, number]> = [
  [/rtx\s*40[6-9]0|rtx\s*50[0-9]0/i, 100],
  [/rtx\s*4050|rtx\s*30[6-9]0/i, 80],
  [/rtx\s*3050|gtx\s*16/i, 62],
  [/radeon\s*graphics|iris\s*xe/i, 32],
  [/uhd|integrada|integrated/i, 22],
]

function matchIndex(texto: string | null, tabla: Array<[RegExp, number]>): number | null {
  if (!texto) return null
  for (const [re, valor] of tabla) if (re.test(texto)) return valor
  return null
}

export function deriveCapacity(product: Product): Capacity {
  const specs = product.specs || {}
  const cpuTexto = findSpec(specs, ['procesador', 'cpu', 'processor'])
  const gpuTexto = findSpec(specs, ['gráfica', 'grafica', 'gpu', 'video'])

  return {
    ramGb: parseRamGb(specs),
    cpuIndex: matchIndex(cpuTexto, CPU_INDEX),
    gpuIndex: matchIndex(gpuTexto, GPU_INDEX),
  }
}

function withCapacity(p: Product): ProductWithCapacity {
  return { ...p, capacity: deriveCapacity(p) }
}

/* ---------------------------------------------------------------------
   Consultas
   --------------------------------------------------------------------- */

export async function getCategories(): Promise<CatalogResult<Category[]>> {
  try {
    const { data, error } = await supabaseRead
      .from('categories')
      .select('*')
      .order('order_index')

    if (error) throw new Error(error.message)
    return { data: (data as Category[]) || [], error: null }
  } catch (e) {
    return fail<Category[]>([], e, 'getCategories')
  }
}

export async function getProducts(opciones?: {
  categorySlug?: string
  featuredOnly?: boolean
  limit?: number
}): Promise<CatalogResult<ProductWithCapacity[]>> {
  try {
    let q = supabaseRead
      .from('products')
      .select(PRODUCT_FIELDS)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (opciones?.featuredOnly) q = q.eq('is_featured', true)
    if (opciones?.limit) q = q.limit(opciones.limit)

    const { data, error } = await q
    if (error) throw new Error(error.message)

    let productos = ((data as Product[]) || []).map(withCapacity)

    /* El filtro por categoría se resuelve aquí y no en la consulta
       porque `products` guarda category_id, no el slug. */
    if (opciones?.categorySlug) {
      const cats = await getCategories()
      const cat = cats.data.find(c => c.slug === opciones.categorySlug)
      productos = cat ? productos.filter(p => p.category_id === cat.id) : []
    }

    return { data: productos, error: null }
  } catch (e) {
    return fail<ProductWithCapacity[]>([], e, 'getProducts')
  }
}

export async function getProductBySlug(
  slug: string
): Promise<CatalogResult<ProductWithCapacity | null>> {
  try {
    const { data, error } = await supabaseRead
      .from('products')
      .select(PRODUCT_FIELDS)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return { data: data ? withCapacity(data as Product) : null, error: null }
  } catch (e) {
    return fail<ProductWithCapacity | null>(null, e, `getProductBySlug(${slug})`)
  }
}

/* ---------------------------------------------------------------------
   Categorías con lo que hace falta para las «cuatro puertas»: cuántos
   equipos hay, desde qué precio arrancan y una foto de portada.

   Responde «¿tienen lo que busco?» antes de que nadie entre a mirar.
   --------------------------------------------------------------------- */

export interface CategoriaConDatos extends Category {
  productos: number
  desdePrecio: number | null
  portada: string | null
}

export async function getCategoriesWithStats(): Promise<
  CatalogResult<CategoriaConDatos[]>
> {
  try {
    const [cats, prods] = await Promise.all([getCategories(), getProducts()])
    const error = cats.error || prods.error

    const datos = cats.data.map(c => {
      const suyos = prods.data.filter(p => p.category_id === c.id)
      const precios = suyos.map(p => p.price).filter(n => Number.isFinite(n))
      /* La portada es la foto del producto más reciente con imagen: el
         catálogo se ve solo, sin pedir un activo aparte por categoría. */
      const conFoto = suyos.find(p => p.image_url)

      return {
        ...c,
        productos: suyos.length,
        desdePrecio: precios.length ? Math.min(...precios) : null,
        portada: conFoto?.image_url ?? null,
      }
    })

    return { data: datos, error }
  } catch (e) {
    return fail<CategoriaConDatos[]>([], e, 'getCategoriesWithStats')
  }
}

/** Ajustes del sitio (número de WhatsApp, textos del hero...). */
export async function getSettings(
  claves: string[]
): Promise<CatalogResult<Record<string, string>>> {
  try {
    const { data, error } = await supabaseRead
      .from('settings')
      .select('key, value')
      .in('key', claves)

    if (error) throw new Error(error.message)

    const mapa = Object.fromEntries(
      ((data as Array<{ key: string; value: string | null }>) || []).map(r => [
        r.key,
        r.value || '',
      ])
    )
    return { data: mapa, error: null }
  } catch (e) {
    return fail<Record<string, string>>({}, e, 'getSettings')
  }
}
