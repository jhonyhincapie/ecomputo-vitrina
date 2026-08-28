import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'

/* Estado de carga de la home.

   Copia la silueta real: hero a dos columnas con la tarjeta del equipo a
   la derecha, tira de respaldo, y las cuatro puertas con su reparto
   asimétrico. Al llegar el contenido no hay salto de layout, que es la
   mitad del trabajo de un esqueleto.

   `role="status"` con texto en sr-only: quien navega con lector de
   pantalla se entera de que la página está cargando; el resto solo ve
   las siluetas. */

export default function CargandoHome() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Cargando el catálogo…</span>

      {/* Hero */}
      <section className="border-b border-brand-border bg-brand-surface">
        <Container>
          <div className="grid items-center gap-8 py-12 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-20">
            <div>
              <Skeleton className="h-4 w-64" />
              <Skeleton className="mt-5 h-12 w-full max-w-[34rem]" />
              <Skeleton className="mt-3 h-12 w-full max-w-[28rem]" />
              <Skeleton className="mt-6 h-5 w-full max-w-[30rem]" />
              <Skeleton className="mt-2 h-5 w-full max-w-[24rem]" />
              <div className="mt-8 flex gap-3">
                <Skeleton className="h-12 w-36" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
            <div className="md:justify-self-end">
              <div className="overflow-hidden rounded-lg border border-brand-border bg-white">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="border-t border-brand-border p-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2 h-5 w-48" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tira de respaldo */}
      <div className="border-b border-brand-border bg-white">
        <Container>
          <ul className="grid gap-px py-5 sm:grid-cols-[1.15fr_1fr_0.95fr]">
            {[0, 1, 2].map(i => (
              <li key={i} className="flex gap-3 sm:pr-6">
                <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-2 h-3 w-full max-w-[16rem]" />
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* Las cuatro puertas, con su reparto asimétrico */}
      <section className="bg-white">
        <Container className="py-14 md:py-20">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="mt-3 h-5 w-full max-w-[26rem]" />
          <div className="mt-8 grid gap-4 md:grid-cols-4 md:grid-rows-2">
            <Skeleton className="h-72 md:col-span-2 md:row-span-2 md:h-full" />
            <Skeleton className="h-72 md:col-span-2" />
            <Skeleton className="h-72 md:col-span-1" />
            <Skeleton className="h-72 md:col-span-1" />
          </div>
        </Container>
      </section>
    </div>
  )
}
