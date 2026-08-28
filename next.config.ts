import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    /* Las fotos del catálogo viven en el Storage de Supabase, el mismo
       proyecto que atiende al sitio actual. Sin este permiso, next/image
       rechaza el dominio y no se ve ni un producto. */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jzbnauhdemknufmryjls.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
