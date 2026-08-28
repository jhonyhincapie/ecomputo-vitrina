/* Bloque de carga.

   La forma importa más que la animación: un esqueleto sirve cuando tiene
   la silueta de lo que va a llegar, porque entonces el contenido no salta
   al aparecer. Un círculo girando en medio de la pantalla no dice nada y
   además obliga a redibujar todo cuando termina.

   `motion-safe:` en vez de `animate-pulse` a secas: quien pidió menos
   movimiento ve el bloque quieto, que sigue comunicando «aquí viene algo».

   Los datos vienen de Supabase, así que esto no es decorativo: si ese
   servicio va lento, sin esqueleto la página se queda en blanco. */

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md bg-brand-surface-2 motion-safe:animate-pulse ${className}`}
    />
  )
}
