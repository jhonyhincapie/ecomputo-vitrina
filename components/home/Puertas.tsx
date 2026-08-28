import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ProductImage } from '@/components/ui/ProductImage'
import { iconoDeCategoria } from '@/lib/categoryIcons'
import { getCategoriesWithStats, type CategoriaConDatos } from '@/lib/catalog'

/* Las cuatro puertas.

   Composición asimétrica a propósito: la categoría con más inventario
   ocupa el doble y las otras la acompañan. Cuatro celdas idénticas
   comunicarían que todo pesa lo mismo, que es justo lo contrario de lo
   que hace un diseño.

   Cada puerta dice cuántos equipos hay y desde qué precio ANTES de que
   nadie entre. Ese dato va siempre visible, no escondido tras el cursor:
   responde «¿tienen lo que busco?», que es la primera pregunta de quien
   llega, y esconderlo detrás de un hover lo deja fuera del alcance de
   quien navega con el dedo o con teclado. */

const MAX_PUERTAS = 4

function precioCOP(v: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol',
  }).format(v)
}

/* Reparto sobre una retícula de 4 columnas × 2 filas:

     ┌───────────┬───────────┐
     │           │     1     │
     │     0     ├─────┬─────┤
     │           │  2  │  3  │
     └───────────┴─────┴─────┘

   Sin esto, cuatro celdas con el mismo span desbordan a una tercera
   fila y la composición deja de ser asimétrica. */
const REPARTO = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
]

function Puerta({
  cat,
  indice,
}: {
  cat: CategoriaConDatos
  indice: number
}) {
  const Icono = iconoDeCategoria(cat.slug)
  const hayInventario = cat.productos > 0
  const destacada = indice === 0

  /* Cuatro celdas con el mismo icono sobre el mismo gris se leen como una
     plantilla. Mientras no haya foto en todas las categorías, la variación
     la da el tono de la plancha, alternado por posición.

     Solo tonos que ya existen en la paleta: aquí no se inventa un color
     para decorar. */
  const plancha = cat.portada
    ? 'bg-brand-surface-2'
    : indice % 2 === 0
      ? 'bg-brand-surface'
      : 'bg-brand-surface-2'

  return (
    <Link
      href={`/categoria/${cat.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-brand-border bg-white shadow-[var(--shadow-rest)] transition-[transform,box-shadow,border-color] duration-[var(--t-swift)] ease-out hover:-translate-y-[var(--lift-1)] hover:border-brand-border-strong hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent ${
        REPARTO[indice] ?? 'md:col-span-1'
      }`}
    >
      <div
        className={`relative overflow-hidden ${plancha} ${
          destacada ? 'aspect-[16/10] md:aspect-auto md:flex-1' : 'aspect-[16/9]'
        }`}
      >
        {cat.portada ? (
          <ProductImage
            src={cat.portada}
            alt={`${cat.name} disponibles en ECOMPUTO`}
            sizes={destacada ? '(min-width: 768px) 50vw, 92vw' : '(min-width: 768px) 25vw, 92vw'}
            etiqueta={cat.name}
            className="object-contain p-6 transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icono
              size={destacada ? 56 : indice === 1 ? 44 : 34}
              strokeWidth={1.25}
              aria-hidden="true"
              className="text-brand-ink-mute transition-transform duration-[400ms] ease-out group-hover:scale-[1.06]"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-brand-border p-4">
        <div className="min-w-0">
          <p
            className={`font-heading font-bold tracking-[-0.01em] text-brand-ink ${
              destacada ? 'text-xl' : 'text-base'
            }`}
          >
            {cat.name}
          </p>

          {/* El dato que responde la pregunta antes de entrar */}
          {hayInventario ? (
            <p className="mt-0.5 text-sm tabular-nums text-brand-ink-soft">
              {cat.productos} {cat.productos === 1 ? 'equipo' : 'equipos'}
              {cat.desdePrecio !== null && (
                <> · desde {precioCOP(cat.desdePrecio)}</>
              )}
            </p>
          ) : (
            /* Un «0 equipos» ahuyenta. Sin inventario publicado, la puerta
               invita a preguntar — que es como ECOMPUTO ha vendido siempre. */
            <p className="mt-0.5 text-sm text-brand-ink-faint">
              Consúltanos disponibilidad
            </p>
          )}
        </div>

        <ArrowRight
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className="shrink-0 text-brand-ink-mute transition-[transform,color] duration-[var(--t-quick)] ease-out group-hover:translate-x-0.5 group-hover:text-brand-accent"
        />
      </div>
    </Link>
  )
}

export async function Puertas() {
  const { data: categorias } = await getCategoriesWithStats()

  if (categorias.length === 0) return null

  /* La que más inventario tiene manda la composición. Con empate, gana el
     orden que definió el panel admin. */
  const ordenadas = [...categorias]
    .sort((a, b) => b.productos - a.productos || a.order_index - b.order_index)
    .slice(0, MAX_PUERTAS)

  return (
    <section className="bg-white">
      <Container className="py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-[clamp(1.5rem,3.2vw,2.25rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-brand-ink">
              Qué estás buscando
            </h2>
            <p className="mt-2 max-w-[52ch] text-brand-ink-soft">
              Si no lo ves publicado, escríbenos: conseguimos equipos por encargo.
            </p>
          </div>
          <Link
            href="/productos"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-brand-accent transition-[background-color] duration-[var(--t-quick)] hover:bg-brand-accent-soft"
          >
            Ver todo el catálogo
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4 md:grid-rows-2">
          {ordenadas.map((cat, i) => (
            <Puerta key={cat.id} cat={cat} indice={i} />
          ))}
        </div>
      </Container>
    </section>
  )
}
