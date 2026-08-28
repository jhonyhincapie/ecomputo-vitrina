import type { ReactNode } from 'react'

/* Ancho máximo y gutter fluido. Todo lo que se alinea al borde de la
   página pasa por aquí, para que el margen no se escriba a mano en
   cada sección y luego se desincronice. */

export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-[clamp(1rem,4vw,2.5rem)] ${className}`}
    >
      {children}
    </div>
  )
}
