import type { Metadata, Viewport } from 'next'
import { Schibsted_Grotesk, Hanken_Grotesk } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

/* Dirección "Vitrina". Schibsted Grotesk para titulares: una grotesca
   comercial, apretada, con más carácter que las que trae todo el mundo
   por defecto. */
const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

/* Hanken Grotesk para lectura: muy legible en pantallas pequeñas, que es
   donde ocurre la mayor parte del tráfico. */
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const SITE_NAME = 'ECOMPUTO'
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Computadores y portátiles en Medellín | ECOMPUTO',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Computadores, portátiles, celulares y accesorios con garantía de 12 meses. Envíos a toda Colombia desde Medellín. Te asesoramos por WhatsApp.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_CO',
    url: '/',
    title: 'Computadores y portátiles en Medellín | ECOMPUTO',
    description:
      'Equipos con garantía y envíos a todo el país. Te decimos cuál te sirve y cuál no.',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  /* Va aquí y no en `metadata`: ahí quedó obsoleto en Next 14. */
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es-CO"
      className={`${schibsted.variable} ${hanken.variable} h-full`}
      /* El fondo se pinta en el propio <html> para que no haya destello
         entre el primer cuadro y la hoja de estilos. */
      style={{ backgroundColor: '#ffffff' }}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        {/* Primer elemento enfocable: quien navega con teclado no tiene que
            recorrer la barra entera en cada página. */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-accent focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
