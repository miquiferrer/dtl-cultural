import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export const metadata = { title: 'Política de Cookies – Agenda Cultural de Terrassa' }

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/"><Logo variant="light" size="sm" /></Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white transition">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Política de Cookies</h1>
        <p className="text-white/40 text-sm mb-10">Última actualización: mayo de 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde información sobre tu visita, como tu idioma preferido y otras opciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cookies que utilizamos</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm mt-4 border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-white font-semibold">Cookie</th>
                    <th className="text-left py-2 pr-4 text-white font-semibold">Tipo</th>
                    <th className="text-left py-2 text-white font-semibold">Finalidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-amber-400">sb-*-auth-token</td>
                    <td className="py-3 pr-4">Esencial</td>
                    <td className="py-3">Mantiene tu sesión iniciada de forma segura.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-amber-400">__stripe_mid</td>
                    <td className="py-3 pr-4">Funcional</td>
                    <td className="py-3">Stripe utiliza esta cookie para la detección de fraude en pagos.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-amber-400">__stripe_sid</td>
                    <td className="py-3 pr-4">Funcional</td>
                    <td className="py-3">Gestión de la sesión de pago en Stripe.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6">
              <strong className="text-white">No utilizamos cookies de seguimiento ni publicidad de terceros.</strong> Las cookies de autenticación son estrictamente necesarias para el funcionamiento del servicio y no pueden desactivarse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Cookies de terceros</h2>
            <p>
              Utilizamos <strong className="text-white">Google Maps</strong> para el selector de ubicación de eventos. Google puede establecer sus propias cookies cuando se carga el mapa interactivo. Consulta la{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">
                política de privacidad de Google
              </a>{' '}
              para más información.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Gestión de cookies</h2>
            <p>
              Puedes controlar y eliminar las cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar las cookies esenciales puede impedir el correcto funcionamiento de la plataforma.
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Safari</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contacto</h2>
            <p>
              Si tienes alguna pregunta sobre nuestra política de cookies, escríbenos a{' '}
              <a href="mailto:privacidad@lacultural.app" className="text-pink-400 hover:underline">privacidad@lacultural.app</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-white/30">
          <Link href="/privacidad" className="hover:text-white/60 transition">Privacidad</Link>
          <Link href="/cookies" className="text-white/60">Cookies</Link>
          <Link href="/terminos" className="hover:text-white/60 transition">Términos</Link>
        </div>
        <p className="text-xs text-white/20 mt-4">© 2026 Agenda Cultural de Terrassa. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
