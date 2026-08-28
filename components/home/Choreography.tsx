'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/* Coreografía de entrada del hero.

   Dos reglas que la gobiernan:

   1. Corre UNA VEZ POR SESIÓN. Quien va al catálogo y vuelve a la home
      no debería volver a pagar la animación: a la segunda vez, una
      entrada coreografiada deja de ser un detalle y se convierte en un
      peaje. Se marca en sessionStorage, no en localStorage — mañana,
      en una visita nueva, vuelve a correr.

   2. El contenido está VISIBLE por defecto. La clase solo reproduce la
      animación. Si el JavaScript falla o tarda, el hero se ve completo
      igual; nunca al revés. */

export function Choreography({ children }: { children: ReactNode }) {
  const [animar, setAnimar] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    try {
      if (sessionStorage.getItem('eco:hero-visto')) return
      sessionStorage.setItem('eco:hero-visto', '1')
    } catch {
      /* Almacenamiento bloqueado: se anima igual, es lo de menos. */
    }
    setAnimar(true)
  }, [])

  return <div data-choreograph={animar ? 'on' : undefined}>{children}</div>
}
