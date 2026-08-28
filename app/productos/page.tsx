import { Container } from '@/components/ui/Container'
import { getProducts } from '@/lib/catalog'

/* PLACEHOLDER — el catálogo real se construye en la fase 08.
   Existe para que la búsqueda de la barra no lleve a un 404 y para
   comprobar que la capa de datos responde contra el catálogo real. */

export const metadata = {
  title: 'Catálogo',
}

export default async function ProductosPage({
  searchParams,
}: PageProps<'/productos'>) {
  const { q } = await searchParams
  const termino = typeof q === 'string' ? q : ''

  const { data: productos, error } = await getProducts()

  const visibles = termino
    ? productos.filter(p =>
        p.name.toLowerCase().includes(termino.toLowerCase())
      )
    : productos

  return (
    <Container className="py-12 md:py-16">
      <h1 className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-brand-ink">
        {termino ? `Resultados para «${termino}»` : 'Catálogo'}
      </h1>

      <p className="mt-3 max-w-[60ch] text-brand-ink-soft">
        Esta página es provisional: el catálogo con filtros por uso se construye más
        adelante. Por ahora comprueba que los datos llegan del inventario real.
      </p>

      {error && (
        <p className="mt-6 rounded-md border border-brand-border bg-brand-surface p-4 text-sm text-brand-ink-soft">
          No pudimos cargar el catálogo en este momento. Escríbenos por WhatsApp y te
          decimos qué tenemos disponible.
        </p>
      )}

      {!error && visibles.length === 0 && (
        <p className="mt-6 rounded-md border border-brand-border bg-brand-surface p-4 text-sm text-brand-ink-soft">
          {termino
            ? `No encontramos equipos que coincidan con «${termino}». Pregúntanos por WhatsApp: a veces conseguimos por encargo.`
            : 'Todavía no hay equipos publicados.'}
        </p>
      )}

      <ul className="mt-8 flex flex-col gap-3">
        {visibles.map(p => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-brand-border bg-white p-4 shadow-[var(--shadow-rest)]"
          >
            <div className="min-w-0">
              <p className="font-heading font-bold text-brand-ink">{p.name}</p>
              <p className="text-sm text-brand-ink-soft">
                {p.capacity.ramGb ? `${p.capacity.ramGb} GB` : 'Especificaciones sin cargar'}
              </p>
            </div>
            <span className="font-heading text-xl font-extrabold tabular-nums tracking-[-0.02em] text-brand-ink">
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0,
                currencyDisplay: 'narrowSymbol',
              }).format(p.price)}
            </span>
          </li>
        ))}
      </ul>
    </Container>
  )
}
