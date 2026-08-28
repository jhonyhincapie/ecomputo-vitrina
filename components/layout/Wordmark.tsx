/* ============================================================
   WORDMARK PROVISIONAL

   El logo solo existe hoy como PNG con el navy incorporado, así que
   sobre fondo blanco se vería como un rectángulo azul pegado. Hasta
   que llegue una versión sin fondo (idealmente SVG), la marca se
   compone con tipografía.

   PARA REEMPLAZARLO: este es el único archivo que hay que tocar.
   Cambia el contenido por el <Image> o el <svg> del logo real y
   conserva las dimensiones para no mover la barra.
   ============================================================ */

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className="flex select-none items-baseline gap-[0.15em] font-heading font-extrabold leading-none tracking-[-0.03em] text-brand-ink transition-[font-size] duration-[var(--t-swift)] ease-out"
      style={{ fontSize: compact ? '1.0625rem' : '1.1875rem' }}
    >
      ECOMPUTO
      {/* El punto hace de marca mientras no haya símbolo. Es lo único
          que lleva acento en toda la barra. */}
      <span aria-hidden="true" className="text-brand-accent">
        .
      </span>
    </span>
  )
}
