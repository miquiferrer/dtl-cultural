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
        <p className="text-white/40 text-sm mb-1">Versión 1.0</p>
        <p className="text-white/40 text-sm mb-10">Última actualización: 29 de junio de 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introducción</h2>
            <p>
              La presente Política de Cookies explica qué son las cookies, qué tipos utiliza Agenda Cultural de Terrassa y cómo puede el usuario gestionarlas. Nuestro objetivo es garantizar la máxima transparencia respecto al uso de tecnologías que almacenan o acceden a información en el dispositivo del usuario. Esta Política resulta aplicable al sitio web de Agenda Cultural de Terrassa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que un sitio web almacena en el dispositivo del usuario cuando visita una página. Permiten recordar información para facilitar la navegación, mejorar el funcionamiento del sitio web y ofrecer determinados servicios. Las cookies no suelen contener información que identifique directamente al usuario, aunque pueden asociarse a un navegador o dispositivo concreto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. ¿Qué son las tecnologías similares?</h2>
            <p>Además de cookies, el sitio web puede utilizar tecnologías similares como:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Local Storage y Session Storage.</li>
              <li>Píxeles de seguimiento y SDK web.</li>
              <li>Etiquetas de conversión y balizas web.</li>
            </ul>
            <p className="mt-2">Estas tecnologías cumplen funciones equivalentes y se rigen por esta misma Política cuando resulte aplicable.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Tipos de cookies</h2>

            <h3 className="text-base font-semibold text-white/90 mt-4 mb-2">4.1 Cookies técnicas</h3>
            <p>Son necesarias para el funcionamiento del sitio web. Permiten, entre otras funciones, mantener la sesión iniciada, recordar preferencias técnicas, gestionar la seguridad, equilibrar la carga del servidor y permitir el acceso a áreas privadas. Estas cookies no requieren consentimiento cuando sean estrictamente necesarias para prestar el servicio solicitado.</p>

            <h3 className="text-base font-semibold text-white/90 mt-4 mb-2">4.2 Cookies de personalización</h3>
            <p>Permiten recordar determinadas preferencias del usuario, como idioma, región, tamaño del texto y configuración de visualización.</p>

            <h3 className="text-base font-semibold text-white/90 mt-4 mb-2">4.3 Cookies de análisis</h3>
            <p>Nos ayudan a conocer cómo utilizan los usuarios el sitio web. Gracias a ellas podemos obtener información agregada sobre número de visitas, tiempo de permanencia, páginas más consultadas, errores detectados y rendimiento del sitio. Estos datos se utilizan únicamente para mejorar la experiencia de navegación.</p>

            <h3 className="text-base font-semibold text-white/90 mt-4 mb-2">4.4 Cookies funcionales</h3>
            <p>Permiten ofrecer funciones adicionales como guardar favoritos, recordar búsquedas recientes, formularios parcialmente completados y configuración personalizada.</p>

            <h3 className="text-base font-semibold text-white/90 mt-4 mb-2">4.5 Cookies publicitarias</h3>
            <p>Podrán utilizarse para mostrar publicidad relacionada con los intereses del usuario. En caso de utilizarse, se solicitará previamente el consentimiento cuando sea exigible.</p>

            <h3 className="text-base font-semibold text-white/90 mt-4 mb-2">4.6 Cookies de redes sociales</h3>
            <p>Cuando el usuario interactúe con contenidos procedentes de redes sociales, dichas plataformas podrán instalar sus propias cookies conforme a sus respectivas políticas de privacidad.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies propias</h2>
            <p>
              Son aquellas enviadas directamente por Agenda Cultural de Terrassa. Podrán utilizarse para gestión de sesiones, seguridad, preferencias del usuario y funcionamiento interno del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cookies de terceros</h2>
            <p>El sitio web podrá integrar servicios de terceros que instalen sus propias cookies, como por ejemplo:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Herramientas de analítica y mapas interactivos.</li>
              <li>Vídeos embebidos y redes sociales.</li>
              <li>Plataformas publicitarias y sistemas de atención al cliente.</li>
              <li>Servicios de medición de audiencia.</li>
            </ul>
            <p className="mt-2">Cada proveedor tratará la información conforme a su propia política de privacidad.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Finalidad del uso de cookies</h2>
            <p>Las cookies podrán utilizarse para garantizar el funcionamiento técnico, mejorar la navegación, personalizar contenidos, analizar el uso del sitio web, detectar incidencias, incrementar la seguridad, elaborar estadísticas agregadas y recordar configuraciones.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Consentimiento</h2>
            <p>
              Cuando la normativa lo exija, el sitio web solicitará el consentimiento del usuario antes de instalar cookies no esenciales. El consentimiento podrá otorgarse mediante el panel de configuración habilitado al acceder al sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Retirada del consentimiento</h2>
            <p>El usuario podrá modificar o retirar su consentimiento en cualquier momento. Para ello podrá:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Acceder al panel de configuración de cookies.</li>
              <li>Eliminar las cookies desde su navegador.</li>
              <li>Cambiar las preferencias previamente seleccionadas.</li>
            </ul>
            <p className="mt-2">La retirada del consentimiento no afectará a la licitud del tratamiento realizado con anterioridad.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Configuración del navegador</h2>
            <p>
              El usuario puede bloquear, eliminar o limitar las cookies desde la configuración de su navegador. Debe tener en cuenta que la desactivación de determinadas cookies puede afectar al correcto funcionamiento del sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Plazo de conservación</h2>
            <p>Las cookies podrán permanecer almacenadas:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Durante la sesión.</li>
              <li>Durante un periodo determinado.</li>
              <li>Hasta que el usuario las elimine manualmente.</li>
            </ul>
            <p className="mt-2">El tiempo de conservación dependerá del tipo de cookie y de su finalidad.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Transferencias internacionales</h2>
            <p>
              Algunos proveedores tecnológicos podrán tratar información fuera del Espacio Económico Europeo. En esos casos se adoptarán las garantías exigidas por la normativa de protección de datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Protección de datos</h2>
            <p>
              Cuando las cookies impliquen tratamiento de datos personales, dicho tratamiento se realizará conforme a la{' '}
              <Link href="/privacidad" className="text-pink-400 hover:underline">Política de Privacidad</Link>{' '}
              de Agenda Cultural de Terrassa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Actualización de la política</h2>
            <p>
              Esta Política podrá modificarse para adaptarse a cambios legales, nuevas funcionalidades, nuevos proveedores y evolución tecnológica. La fecha de actualización aparecerá al inicio del documento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Panel de configuración</h2>
            <p>El sitio web dispondrá de un sistema que permitirá al usuario:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Aceptar todas las cookies.</li>
              <li>Rechazar las cookies no esenciales.</li>
              <li>Configurar las preferencias por categorías.</li>
              <li>Modificar posteriormente dichas preferencias.</li>
            </ul>
            <p className="mt-2">La elección realizada será respetada mientras permanezca vigente, salvo que el usuario decida modificarla.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Cookies previstas para el proyecto</h2>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-white">Técnicas:</strong> inicio de sesión, seguridad, idioma y preferencias.</li>
              <li><strong className="text-white">Analíticas:</strong> medición de audiencia, estadísticas de uso y rendimiento.</li>
              <li><strong className="text-white">Funcionales:</strong> eventos favoritos, recordatorios y preferencias del usuario.</li>
              <li><strong className="text-white">Mapas:</strong> visualización de ubicaciones de eventos.</li>
              <li><strong className="text-white">Vídeos:</strong> reproducción de contenidos audiovisuales.</li>
              <li><strong className="text-white">Redes sociales:</strong> compartir eventos e integración con perfiles oficiales.</li>
              <li><strong className="text-white">Publicidad:</strong> campañas patrocinadas, medición de conversiones y remarketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">17. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con esta Política de Cookies:{' '}
              <a href="mailto:info@agendaculturalterrassa.cat" className="text-pink-400 hover:underline">info@agendaculturalterrassa.cat</a>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-white/30">
          <Link href="/privacidad" className="hover:text-white/60 transition">Privacidad</Link>
          <Link href="/cookies" className="text-white/60">Cookies</Link>
          <Link href="/terminos" className="hover:text-white/60 transition">Términos</Link>
          <Link href="/aviso-legal" className="hover:text-white/60 transition">Aviso legal</Link>
        </div>
        <p className="text-xs text-white/20 mt-4">© 2026 Agenda Cultural de Terrassa. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
