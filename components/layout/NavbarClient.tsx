'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, MessageCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Wordmark } from './Wordmark'

export interface NavCategoria {
  name: string
  slug: string
}

/* La barra se compacta al bajar, pero NO desaparece: en un catálogo la
   navegación es la herramienta principal, no un adorno del hero.
   Tampoco tiene animación de entrada — está desde el primer cuadro.

   ALTURA: en escritorio va en UNA sola fila y mide 68 px, por debajo del
   tope de 80 px. Antes eran dos filas y 124 px, que se comían el 15 % de
   la pantalla.

   Por qué las categorías cambian de sitio según el ancho: dos filas de
   áreas táctiles de 44 px no caben en 80 px, así que o se rompe el tope
   o se rompe la accesibilidad. En escritorio no hace falta elegir —caben
   en la misma fila—, y en móvil el tope no aplica y los 44 px sí. */

export function NavbarClient({
  categorias,
  whatsappHref,
}: {
  categorias: NavCategoria[]
  whatsappHref: string
}) {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    /* Listener pasivo y con guard: solo cambia el estado al cruzar el
       umbral, no en cada píxel de scroll. */
    const onScroll = () => {
      const pasado = window.scrollY > 40
      setCompact(prev => (prev === pasado ? prev : pasado))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const enlaceCategoria =
    'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-brand-ink-soft transition-[background-color,color] duration-[var(--t-quick)] hover:bg-brand-surface hover:text-brand-ink'

  return (
    <header
      /* Nombrada para anclarla durante las transiciones de página (fase 13):
         el contenido se mueve, la barra no. */
      style={{ viewTransitionName: 'site-header' }}
      className="sticky top-0 z-50 border-b border-brand-border bg-white/95 backdrop-blur-sm"
    >
      <Container>
        {/* Fila única en escritorio: marca, categorías, búsqueda y la única acción */}
        <div
          className="flex items-center gap-3 transition-[padding] duration-[var(--t-swift)] ease-out sm:gap-4"
          style={{
            paddingBlock: compact ? '0.5rem' : '0.75rem',
          }}
        >
          <Link
            href="/"
            aria-label="ECOMPUTO — ir al inicio"
            /* min-h-11: el área táctil llega a 44 px aunque el texto mida 19.
               Se amplía con padding, no agrandando la tipografía. */
            className="flex min-h-11 shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
          >
            <Wordmark compact={compact} />
          </Link>

          {/* Categorías, en la misma fila desde lg. Se ocultan al compactar
              para devolver altura a la página. */}
          <nav
            aria-label="Categorías"
            className="hidden min-w-0 lg:flex lg:items-center"
            style={{
              opacity: compact ? 0 : 1,
              pointerEvents: compact ? 'none' : 'auto',
              transition: 'opacity var(--t-quick) var(--ease-out)',
            }}
          >
            <ul className="flex items-center gap-0.5">
              {categorias.map(c => (
                <li key={c.slug}>
                  <Link href={`/categoria/${c.slug}`} className={enlaceCategoria}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Búsqueda visible, no un icono de lupa escondido: es la
              herramienta que más se usa en una tienda. */}
          <form action="/productos" className="relative min-w-0 flex-1">
            <label htmlFor="buscar" className="sr-only">
              Buscar equipos
            </label>
            <Search
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink-mute"
            />
            <input
              id="buscar"
              name="q"
              type="search"
              autoComplete="off"
              placeholder="Buscar equipo o para qué lo necesitas"
              className="h-11 w-full rounded-md border border-brand-border bg-brand-surface pl-9 pr-3 text-sm text-brand-ink placeholder:text-brand-ink-faint transition-[border-color,background-color] duration-[var(--t-quick)] focus:border-brand-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/25"
            />
          </form>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-brand-accent px-3 text-sm font-semibold text-white transition-[transform,background-color] duration-[var(--t-quick)] ease-out hover:bg-brand-accent-hover active:scale-[var(--press)] sm:px-4"
          >
            <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
            <span className="hidden sm:inline">Asesórame</span>
            <span className="sr-only sm:hidden">Asesórame por WhatsApp</span>
          </a>
        </div>

        {/* Categorías en móvil y tablet: fila propia deslizable, en lugar de
            esconderse en un menú. El tope de 80 px es de escritorio. */}
        <nav
          aria-label="Categorías"
          className="grid transition-[grid-template-rows,opacity] duration-[var(--t-swift)] ease-out lg:hidden"
          style={{
            gridTemplateRows: compact ? '0fr' : '1fr',
            opacity: compact ? 0 : 1,
          }}
        >
          <div className="overflow-hidden">
            <ul className="-mx-1 flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categorias.map(c => (
                <li key={c.slug} className="shrink-0">
                  <Link href={`/categoria/${c.slug}`} className={enlaceCategoria}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li className="shrink-0">
                <Link
                  href="/productos"
                  className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-brand-accent transition-[background-color] duration-[var(--t-quick)] hover:bg-brand-accent-soft"
                >
                  Ver todo
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  )
}
