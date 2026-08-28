import { getCategories, getSettings } from '@/lib/catalog'
import { NavbarClient } from './NavbarClient'

/* Server Component: trae los datos y se los pasa al cliente, que solo
   se encarga del comportamiento al hacer scroll. */

/* Cuatro caben en una barra; siete la vuelven ilegible. Se toman las
   primeras por `order_index`, que es el orden que define el panel admin.
   Las demás siguen accesibles desde «Ver todo». */
const MAX_EN_BARRA = 4

export async function Navbar() {
  const [categorias, ajustes] = await Promise.all([
    getCategories(),
    getSettings(['whatsapp_number']),
  ])

  const numero = ajustes.data.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK || ''
  const mensaje = encodeURIComponent(
    'Hola, estoy mirando su página y quiero que me asesoren.'
  )
  const whatsappHref = numero
    ? `https://wa.me/${numero}?text=${mensaje}`
    : '/productos'

  return (
    <NavbarClient
      categorias={categorias.data.slice(0, MAX_EN_BARRA).map(c => ({
        name: c.name,
        slug: c.slug,
      }))}
      whatsappHref={whatsappHref}
    />
  )
}
