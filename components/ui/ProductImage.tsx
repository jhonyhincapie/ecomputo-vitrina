'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'

/* Imagen de producto con respaldo.

   Las fotos vienen del Storage de Supabase. Cuando ese servicio no
   responde —ya pasó en el sitio actual: devolvía 502 y el catálogo se
   veía vacío— esto muestra un marcador de marca en vez de un hueco.

   Un fallo de un servicio externo no puede hacer que la tienda parezca
   rota. */

interface Props {
  src: string | null | undefined
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
  etiqueta?: string
}

export function ProductImage({ src, alt, sizes, className, priority, etiqueta }: Props) {
  const [falló, setFalló] = useState(false)

  if (!src || falló) {
    return (
      <div
        role="img"
        aria-label={`${alt} — imagen no disponible`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-surface-2"
      >
        <ImageOff size={26} strokeWidth={1.5} aria-hidden="true" className="text-brand-ink-mute" />
        {etiqueta && (
          <span className="max-w-[24ch] px-3 text-center text-xs leading-tight text-brand-ink-faint">
            {etiqueta}
          </span>
        )}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFalló(true)}
    />
  )
}
