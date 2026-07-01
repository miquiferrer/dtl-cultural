import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export const metadata = { title: 'Política de Privacidad – Agenda Cultural de Terrassa' }

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/"><Logo variant="light" size="sm" /></Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white transition">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
        <p className="text-white/40 text-sm mb-10">Última actualización: mayo de 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Responsable del tratamiento</h2>
            <p>
              <strong className="text-white">Agenda Cultural de Terrassa</strong> es la plataforma responsable del tratamiento de los datos personales recogidos a través de este sitio web. Puedes contactarnos en{' '}
              <a href="mailto:privacidad@lacultural.app" className="text-pink-400 hover:underline">privacidad@lacultural.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Datos que recopilamos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Datos de registro:</strong> nombre de la organización, dirección de correo electrónico y contraseña (almacenada de forma cifrada).</li>
              <li><strong className="text-white">Datos de eventos:</strong> título, descripción, fechas, ubicación, imágenes y demás información que publiques sobre tus eventos.</li>
              <li><strong className="text-white">Datos de facturación:</strong> información de suscripción gestionada a través de Stripe. No almacenamos datos de tarjeta de crédito en nuestros servidores.</li>
              <li><strong className="text-white">Datos de uso:</strong> registros de acceso, dirección IP y datos de navegación con fines de seguridad y mejora del servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalidad del tratamiento</h2>
            <p>Tratamos tus datos para:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Prestarte el servicio de publicación de eventos culturales.</li>
              <li>Gestionar tu cuenta y suscripción.</li>
              <li>Enviarte comunicaciones relacionadas con el servicio (confirmaciones, notificaciones).</li>
              <li>Mejorar la plataforma y garantizar su seguridad.</li>
              <li>Cumplir con las obligaciones legales aplicables.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Base legal</h2>
            <p>
              El tratamiento de tus datos se basa en la ejecución del contrato de servicio que aceptas al registrarte, en nuestro interés legítimo en mejorar la plataforma, y en el cumplimiento de obligaciones legales según el <strong className="text-white">Reglamento General de Protección de Datos (RGPD)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Conservación de los datos</h2>
            <p>
              Conservamos tus datos mientras tu cuenta esté activa. Si cancelas tu cuenta, eliminaremos tus datos personales en un plazo máximo de 90 días, salvo que sea necesario conservarlos por obligaciones legales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Tus derechos</h2>
            <p>En virtud del RGPD, tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Acceder a tus datos personales.</li>
              <li>Rectificar datos inexactos.</li>
              <li>Solicitar la supresión de tus datos.</li>
              <li>Oponerte al tratamiento o solicitar su limitación.</li>
              <li>Solicitar la portabilidad de tus datos.</li>
            </ul>
            <p className="mt-3">
              Para ejercer cualquiera de estos derechos, escríbenos a{' '}
              <a href="mailto:privacidad@lacultural.app" className="text-pink-400 hover:underline">privacidad@lacultural.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Transferencias internacionales</h2>
            <p>
              Utilizamos Supabase (infraestructura en la UE) y Stripe (con sede en EE. UU., acogido a las cláusulas contractuales estándar de la UE) para el almacenamiento y la gestión de pagos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política periódicamente. Te notificaremos por correo electrónico si los cambios son significativos. La fecha de la última actualización siempre aparece al inicio de esta página.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-white/30">
          <Link href="/privacidad" className="text-white/60">Privacidad</Link>
          <Link href="/cookies" className="hover:text-white/60 transition">Cookies</Link>
          <Link href="/terminos" className="hover:text-white/60 transition">Términos</Link>
        </div>
        <p className="text-xs text-white/20 mt-4">© 2026 Agenda Cultural de Terrassa. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
