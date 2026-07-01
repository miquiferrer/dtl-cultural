import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export const metadata = { title: 'Términos y Condiciones – Agenda Cultural de Terrassa' }

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/"><Logo variant="light" size="sm" /></Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white transition">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Términos y Condiciones</h1>
        <p className="text-white/40 text-sm mb-10">Última actualización: mayo de 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar la plataforma <strong className="text-white">Agenda Cultural de Terrassa</strong>, aceptas quedar vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Descripción del servicio</h2>
            <p>
              Agenda Cultural de Terrassa es una plataforma que permite a organizadores culturales publicar y gestionar eventos (música, teatro, gastronomía, etc.) para su difusión a través de aplicaciones móviles en diversas ciudades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Registro y cuentas</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Debes proporcionar información veraz y actualizada al registrarte.</li>
              <li>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
              <li>Debes notificarnos inmediatamente si sospechas de un acceso no autorizado a tu cuenta.</li>
              <li>Una cuenta por organización. Está prohibida la creación de cuentas falsas o duplicadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Contenido publicado</h2>
            <p>Al publicar un evento, declaras que:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Eres el organizador legítimo del evento o tienes autorización para publicarlo.</li>
              <li>La información proporcionada es veraz, precisa y no induce a error.</li>
              <li>Las imágenes utilizadas son de tu propiedad o dispones de licencia para usarlas.</li>
              <li>El contenido no infringe derechos de terceros ni la legislación vigente.</li>
            </ul>
            <p className="mt-3">
              Agenda Cultural de Terrassa se reserva el derecho de rechazar o eliminar eventos que no cumplan estos requisitos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Moderación de contenidos</h2>
            <p>
              Todos los eventos están sujetos a revisión por parte de nuestro equipo antes de su publicación. Nos reservamos el derecho de rechazar eventos sin necesidad de justificación, especialmente si contienen contenido inapropiado, engañoso o que incumpla nuestras normas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Planes y facturación</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Los precios se muestran en euros (€) e incluyen IVA cuando corresponda.</li>
              <li>Las suscripciones se renuevan automáticamente cada mes hasta que las canceles.</li>
              <li>Puedes cancelar en cualquier momento desde tu panel de control. El acceso continuará hasta el final del período facturado.</li>
              <li>No ofrecemos reembolsos por períodos parciales de suscripción.</li>
              <li>Los pagos son gestionados por <strong className="text-white">Stripe</strong>. Agenda Cultural de Terrassa no almacena datos de tarjetas de crédito.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitación de responsabilidad</h2>
            <p>
              Agenda Cultural de Terrassa actúa como plataforma intermediaria y no es responsable de la veracidad de los eventos publicados por los organizadores, de la calidad o realización de los mismos, ni de ningún daño derivado de la asistencia a los eventos listados en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Propiedad intelectual</h2>
            <p>
              El diseño, logotipos, código y contenidos propios de Agenda Cultural de Terrassa están protegidos por derechos de propiedad intelectual. Queda prohibida su reproducción o uso sin autorización expresa. El contenido publicado por los organizadores es de su exclusiva propiedad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Suspensión y cancelación</h2>
            <p>
              Nos reservamos el derecho de suspender o cancelar cuentas que incumplan estos términos, sin previo aviso y sin responsabilidad alguna. En caso de cancelación por incumplimiento, no se realizarán reembolsos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Legislación aplicable</h2>
            <p>
              Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de la ciudad de Barcelona, con renuncia expresa a cualquier otro fuero.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con estos términos, contáctanos en{' '}
              <a href="mailto:legal@lacultural.app" className="text-pink-400 hover:underline">legal@lacultural.app</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-white/30">
          <Link href="/privacidad" className="hover:text-white/60 transition">Privacidad</Link>
          <Link href="/cookies" className="hover:text-white/60 transition">Cookies</Link>
          <Link href="/terminos" className="text-white/60">Términos</Link>
        </div>
        <p className="text-xs text-white/20 mt-4">© 2026 Agenda Cultural de Terrassa. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
