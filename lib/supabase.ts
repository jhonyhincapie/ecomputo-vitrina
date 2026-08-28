import { createClient } from '@supabase/supabase-js'

/* =====================================================================
   Cliente de SOLO LECTURA.

   V2 lee el catálogo de la misma base que atiende al sitio en
   producción. Un `update` accidental desde aquí cambiaría precios o
   existencias de un negocio en marcha, así que la restricción no queda
   en un comentario: el cliente bloquea las escrituras en tiempo de
   ejecución y falla ruidosamente si alguien lo intenta.

   Si algún día V2 necesita escribir, se hace con un cliente aparte y
   con Jhony enterado — no relajando este.
   ===================================================================== */

/* La comprobación es PEREZOSA a propósito.

   Antes se hacía al importar el módulo, y eso tumbaba la compilación
   entera cuando faltaba una variable: la home se prerenderiza en el
   build, así que un despliegue sin configurar ni siquiera llegaba a
   publicarse. Ahora el sitio compila y se publica; lo único que falla es
   la consulta, y `lib/catalog.ts` ya la recoge y devuelve el catálogo
   vacío con su aviso, en vez de dejar la página en blanco.

   La regla de solo lectura no se toca: el guardián de abajo sigue
   bloqueando toda escritura. */
let cliente: ReturnType<typeof createClient> | null = null

function getClient() {
  if (cliente) return cliente

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error(
      'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. ' +
        'En local: copia .env.example como .env.local y rellena los valores. ' +
        'En Vercel: añádelas en Settings > Environment Variables y redespliega.'
    )
  }

  cliente = createClient(url, key, { auth: { persistSession: false } })
  return cliente
}

/** Métodos que modifican datos. Ninguno debe salir de V2. */
const WRITE_METHODS = new Set(['insert', 'update', 'upsert', 'delete', 'rpc'])

function guardQueryBuilder<T extends object>(builder: T): T {
  return new Proxy(builder, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && WRITE_METHODS.has(prop)) {
        throw new Error(
          `[solo lectura] Se intentó llamar a "${prop}()" sobre la base de ` +
            'producción de ECOMPUTO. V2 no escribe en esa base. ' +
            'Ver lib/supabase.ts.'
        )
      }
      return Reflect.get(target, prop, receiver)
    },
  })
}

/** Punto de entrada único a los datos. `from()` devuelve un constructor
    de consultas al que se le han quitado los métodos de escritura. */
export const supabaseRead = {
  from(table: string) {
    return guardQueryBuilder(getClient().from(table))
  },
}
