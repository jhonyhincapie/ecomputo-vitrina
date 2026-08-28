import Link from 'next/link'
import { MessageCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ProductImage } from '@/components/ui/ProductImage'
import { Choreography } from './Choreography'
import { getProducts, getSettings } from '@/lib/catalog'

/* El hero.

   La tesis del negocio en una pantalla: quince años de oficio, ahora sin
   depender de que el cliente pase por la puerta. La trayectoria es el
   activo — no la carencia — así que abre el titular, no el pie.

   Debajo, las tres señales que sustituyen a la vitrina física. */

const señales = [
  {
    Icono: ShieldCheck,
    dato: 'Garantía de 12 meses',
    nota: 'En todos los equipos, por escrito y sin letra pequeña',
  },
  {
    Icono: Truck,
    dato: 'Envíos a todo el país',
    nota: 'Asegurado y rastreable, despachado desde Medellín',
  },
  {
    Icono: RotateCcw,
    dato: '5 días para retractarte',
    nota: 'El derecho que da la ley, respetado sin discutir',
  },
]

function precioCOP(v: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol',
  }).format(v)
}

export async function Hero() {
  const [destacados, ajustes] = await Promise.all([
    getProducts({ featuredOnly: true, limit: 4 }),
    getSettings(['whatsapp_number']),
  ])

  /* Se prefiere un destacado que tenga foto: el hero es el peor sitio
     para estrenar el marcador de imagen ausente. */
  const producto =
    destacados.data.find(p => p.image_url) ?? destacados.data[0] ?? null

  const numero =
    ajustes.data.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK || ''
  const mensaje = encodeURIComponent(
    'Hola, no tengo claro qué equipo me sirve. ¿Me ayudan a elegir?'
  )
  const asesoriaHref = numero ? `https://wa.me/${numero}?text=${mensaje}` : '/productos'

  return (
    <section className="border-b border-brand-border bg-brand-surface">
      <Container>
        <Choreography>
          <div className="grid items-center gap-8 py-12 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-20">
            <div className="[&>*]:will-change-[transform,opacity]">
              <p
                data-paso="1"
                className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-brand-accent"
              >
                {/* TODO(jhony): confirmar el año exacto de fundación para
                    poder decir «desde 20XX», que convence más que «más de».
                    Hasta entonces no se inventa una cifra. */}
                Comercializadora ECOMPUTO · más de 15 años
              </p>

              <h1
                data-paso="2"
                className="mt-4 text-balance font-heading text-[clamp(2.25rem,5.5vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-brand-ink"
              >
                Quince años asesorando en Medellín. Ahora, en toda Colombia.
              </h1>

              <p
                data-paso="3"
                className="mt-5 max-w-[52ch] text-lg leading-relaxed text-brand-ink-soft"
              >
                Cerramos el local para llegar más lejos, con el mismo trato de siempre:
                encuentra aquí el equipo que necesitas y hablamos por WhatsApp antes de
                que compres.
              </p>

              <div data-paso="4" className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/productos"
                  className="inline-flex min-h-12 items-center rounded-md bg-brand-accent px-6 text-sm font-semibold text-white transition-[transform,background-color] duration-[var(--t-quick)] ease-out hover:bg-brand-accent-hover active:scale-[var(--press)]"
                >
                  Ver catálogo
                </Link>
                <a
                  href={asesoriaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-md border border-brand-border-strong bg-white px-6 text-sm font-semibold text-brand-ink shadow-[var(--shadow-rest)] transition-[transform,box-shadow] duration-[var(--t-swift)] ease-out hover:-translate-y-[var(--lift-1)] hover:shadow-[var(--shadow-lift)] active:scale-[var(--press)]"
                >
                  <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                  Ayúdenme a elegir
                </a>
              </div>
            </div>

            {/* El equipo, tratado como objeto de catálogo y no como adorno.

                El min-w-0 del div no es cosmético: sin él, el item de la
                retícula se niega a bajar de su ancho intrínseco —el nombre
                del equipo más el precio— y en móvil arrastra la página
                entera a 427 px, con barra de desplazamiento lateral.
                Medido en el navegador, no supuesto. */}
            {producto && (
              <div data-paso="5" className="min-w-0 md:justify-self-end">
                <Link
                  href={`/producto/${producto.slug}`}
                  className="group block overflow-hidden rounded-lg border border-brand-border bg-white shadow-[var(--shadow-rest)] transition-[transform,box-shadow] duration-[var(--t-swift)] ease-out hover:-translate-y-[var(--lift-1)] hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-surface-2">
                    <ProductImage
                      src={producto.image_url}
                      alt={producto.name}
                      sizes="(min-width: 768px) 42vw, 90vw"
                      priority
                      etiqueta={producto.name}
                      className="object-contain p-6 transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-4 border-t border-brand-border p-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-brand-ink-faint">
                        Destacado
                      </p>
                      <p className="mt-1 truncate font-heading font-bold text-brand-ink">
                        {producto.name.trim()}
                      </p>
                      {typeof producto.stock === 'number' && producto.stock > 0 && (
                        <p className="mt-1 text-xs font-semibold text-brand-ok">
                          {producto.stock} disponibles
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-heading text-xl font-extrabold tabular-nums tracking-[-0.02em] text-brand-ink">
                      {precioCOP(producto.price)}
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </Choreography>
      </Container>

      {/* Sin vitrina física, esto es lo que responde «¿y si me roban?».
          Por eso va aquí arriba y no enterrado en el pie. */}
      <div className="border-t border-brand-border bg-white">
        <Container>
          <ul className="grid gap-px sm:grid-cols-[1.15fr_1fr_0.95fr]">
            {señales.map(({ Icono, dato, nota }) => (
              <li key={dato} className="flex gap-3 py-5 sm:pr-6">
                <Icono
                  size={20}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-brand-accent"
                />
                <div>
                  <p className="font-heading text-sm font-bold text-brand-ink">{dato}</p>
                  <p className="mt-0.5 text-sm leading-snug text-brand-ink-soft">{nota}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  )
}
