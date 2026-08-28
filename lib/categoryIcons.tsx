import { Monitor, Laptop, Smartphone, Headphones, Package } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* Icono de respaldo por categoría: se usa solo cuando esa categoría
   todavía no tiene ningún producto con foto. En cuanto haya uno, manda
   la foto real — un ícono nunca vende un equipo. */

const POR_SLUG: Record<string, LucideIcon> = {
  computadores: Monitor,
  portatiles: Laptop,
  celulares: Smartphone,
  accesorios: Headphones,
}

export function iconoDeCategoria(slug: string): LucideIcon {
  return POR_SLUG[slug] ?? Package
}
