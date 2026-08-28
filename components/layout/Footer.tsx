import Link from 'next/link'
import { MessageCircle, Mail, Phone, Clock, ShieldCheck, RotateCcw, Truck } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { getCategories, getSettings } from '@/lib/catalog'
import { NEGOCIO, whatsappHref, añosDeTrayectoria } from '@/lib/business'

/* El pie de página.

   No es un cementerio de enlaces: es donde va quien está a punto de
   comprar y quiere comprobar que del otro lado hay un negocio. Sin local
   físico eso pesa más, así que el orden lo decide una sola pregunta —
   «¿existen de verdad?»— y no la costumbre.

   Orden: quiénes somos y cómo hablarnos · qué respaldamos · qué vendemos.
   Lo que no sabemos (NIT, razón social, horario) se omite en vez de
   rellenarse. Ver lib/business.ts. */

const respaldos = [
  {
    Icono: ShieldCheck,
    titulo: 'Garantía de 12 meses',
    detalle: 'En todos los equipos. La tramitamos nosotros, no te mandamos a otra ciudad.',
  },
  {
    Icono: RotateCcw,
    titulo: '5 días para retractarte',
    detalle: 'El plazo que da el Estatuto del Consumidor en compras a distancia.',
  },
  {
    Icono: Truck,
    titulo: 'Envío asegurado',
    detalle: 'A todo el país, con guía para que sigas tu pedido.',
  },
]

export async function Footer() {
  const [cats, ajustes] = await Promise.all([
    getCategories(),
    getSettings(['whatsapp_number']),
  ])

  const numero = ajustes.data.whatsapp_number || NEGOCIO.whatsapp
  const años = añosDeTrayectoria()
  const trayectoria = años ? `${años} años` : 'Más de 15 años'

  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-surface">
      {/* Respaldo: lo que sustituye a poder entrar a reclamar a un local */}
      <div className="border-b border-brand-border bg-white">
        <Container>
          <ul className="grid gap-6 py-8 sm:grid-cols-[1.15fr_1fr_0.95fr]">
            {respaldos.map(({ Icono, titulo, detalle }) => (
              <li key={titulo} className="flex gap-3">
                <Icono
                  size={20}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-brand-accent"
                />
                <div>
                  <p className="font-heading text-sm font-bold text-brand-ink">{titulo}</p>
                  <p className="mt-0.5 text-sm leading-snug text-brand-ink-soft">{detalle}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Quiénes somos */}
          <div>
            <p className="font-heading text-lg font-extrabold tracking-[-0.03em] text-brand-ink">
              {NEGOCIO.nombre}
              <span aria-hidden="true" className="text-brand-accent">
                .
              </span>
            </p>
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-brand-ink-soft">
              {trayectoria} vendiendo tecnología desde {NEGOCIO.ciudad}. Hoy atendemos a
              todo el país por WhatsApp, con la misma asesoría de siempre.
            </p>

            {NEGOCIO.googleMaps && (
              <a
                href={NEGOCIO.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-accent hover:underline"
              >
                Ver nuestras reseñas en Google
              </a>
            )}
          </div>

          {/* Cómo hablarnos — el mostrador */}
          <nav aria-label="Contacto">
            <h2 className="font-heading text-sm font-bold text-brand-ink">
              Hablemos
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {numero && (
                <li>
                  <a
                    href={whatsappHref(
                      'Hola, quiero información sobre sus equipos.',
                      numero
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-brand-ink-soft transition-colors duration-[var(--t-quick)] hover:text-brand-accent"
                  >
                    <MessageCircle size={15} strokeWidth={2} aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
              )}
              {NEGOCIO.email && (
                <li>
                  <a
                    href={`mailto:${NEGOCIO.email}`}
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-brand-ink-soft transition-colors duration-[var(--t-quick)] hover:text-brand-accent"
                  >
                    <Mail size={15} strokeWidth={2} aria-hidden="true" />
                    {NEGOCIO.email}
                  </a>
                </li>
              )}
              {NEGOCIO.telefono && (
                <li>
                  <a
                    href={`tel:${NEGOCIO.telefono.replace(/\s/g, '')}`}
                    className="inline-flex min-h-11 items-center gap-2 text-sm text-brand-ink-soft transition-colors duration-[var(--t-quick)] hover:text-brand-accent"
                  >
                    <Phone size={15} strokeWidth={2} aria-hidden="true" />
                    {NEGOCIO.telefono}
                  </a>
                </li>
              )}
              {NEGOCIO.horario && (
                <li className="flex min-h-11 items-center gap-2 text-sm text-brand-ink-soft">
                  <Clock size={15} strokeWidth={2} aria-hidden="true" />
                  {NEGOCIO.horario}
                </li>
              )}
            </ul>
          </nav>

          {/* Qué vendemos */}
          <nav aria-label="Catálogo">
            <h2 className="font-heading text-sm font-bold text-brand-ink">
              Catálogo
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {cats.data.slice(0, 4).map(c => (
                <li key={c.id}>
                  <Link
                    href={`/categoria/${c.slug}`}
                    className="inline-flex min-h-11 items-center text-sm text-brand-ink-soft transition-colors duration-[var(--t-quick)] hover:text-brand-accent"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/productos"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-accent hover:underline"
                >
                  Ver todo
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>

      {/* Identidad legal: la prueba de que hay una empresa detrás */}
      <div className="border-t border-brand-border">
        <Container>
          <div className="flex flex-col gap-1 py-6 text-xs text-brand-ink-faint sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()}{' '}
              {NEGOCIO.razonSocial ?? `Comercializadora ${NEGOCIO.nombre}`}
              {NEGOCIO.nit && <> · NIT {NEGOCIO.nit}</>}
            </p>
            <p>Envíos a toda Colombia desde {NEGOCIO.ciudad}</p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
