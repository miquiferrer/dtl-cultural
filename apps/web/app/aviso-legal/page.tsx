import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export const metadata = { title: 'Aviso Legal – Agenda Cultural de Terrassa' }

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/"><Logo variant="light" size="sm" /></Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white transition">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Aviso Legal</h1>
        <p className="text-white/40 text-sm mb-1">Versión 1.0</p>
        <p className="text-white/40 text-sm mb-10">Fecha: 29 de junio de 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Identificación del titular</h2>
            <p>
              En cumplimiento de la normativa vigente, se informa a los usuarios de que la presente aplicación móvil y su sitio web son titularidad de <strong className="text-white">Zeralion, S.L.</strong>, con CIF B24944878 y domicilio en Calle Lepanto 270 local, 08013, Barcelona.
            </p>
            <p className="mt-2">
              Correo electrónico de contacto:{' '}
              <a href="mailto:info@agendaculturaldeterrassa.cat" className="text-pink-400 hover:underline">info@agendaculturaldeterrassa.cat</a>
              {' '}— Página web:{' '}
              <a href="https://www.agendaculturalterrassa.cat" className="text-pink-400 hover:underline" target="_blank" rel="noopener noreferrer">www.agendaculturalterrassa.cat</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Objeto de la plataforma</h2>
            <p>
              Agenda Cultural de Terrassa es una plataforma digital cuya finalidad es facilitar el acceso a informaciones sobre actividades culturales, educativas, deportivas, sociales, artísticas y de ocio desarrolladas principalmente en la ciudad de Terrassa.
            </p>
            <p className="mt-2">
              La plataforma permite, entre otras funcionalidades, consultar eventos, buscar actividades por categorías, descubrir eventos cercanos, guardar favoritos, recibir recomendaciones, consultar información de organizadores y publicar eventos por parte de entidades autorizadas. La Plataforma actúa como punto de encuentro entre ciudadanos y organizadores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Naturaleza del servicio</h2>
            <p>
              Agenda Cultural de Terrassa es una plataforma informativa. La organización, celebración, modificación o cancelación de los eventos corresponde exclusivamente a sus respectivos organizadores. La Plataforma no organiza, salvo indicación expresa, ninguno de los eventos publicados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Aceptación del usuario</h2>
            <p>
              El acceso a la aplicación o al sitio web implica la aceptación íntegra del presente Aviso Legal. Si el usuario no está de acuerdo con cualquiera de estas condiciones deberá abstenerse de utilizar la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Uso correcto de la plataforma</h2>
            <p>El usuario se compromete a utilizar la aplicación conforme a la legislación vigente, la buena fe, el orden público y las presentes condiciones.</p>
            <p className="mt-2">Queda prohibido:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Utilizar identidades falsas.</li>
              <li>Introducir virus o alterar el funcionamiento de la Plataforma.</li>
              <li>Intentar acceder a zonas restringidas o copiar bases de datos.</li>
              <li>Utilizar robots para extracción masiva de información.</li>
              <li>Realizar ingeniería inversa.</li>
              <li>Utilizar la información con fines ilícitos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Registro de usuarios</h2>
            <p>
              Determinadas funcionalidades podrán requerir registro previo. El usuario garantiza que toda la información facilitada es veraz y actualizada. Será responsable de mantener la confidencialidad de sus credenciales de acceso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Publicación de eventos</h2>
            <p>
              La publicación de eventos únicamente podrá realizarse por entidades autorizadas, asociaciones, empresas, administraciones públicas y organizadores previamente aceptados por la Plataforma. Agenda Cultural de Terrassa podrá verificar previamente la información antes de su publicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Responsabilidad sobre los contenidos</h2>
            <p>
              Cada organizador será el único responsable de horarios, precios, imágenes, carteles, descripciones, derechos de autor, permisos administrativos, modificaciones y cancelaciones. Agenda Cultural de Terrassa no responderá frente a terceros por errores introducidos por los organizadores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Modificaciones de eventos</h2>
            <p>
              Los organizadores podrán modificar fecha, ubicación, horarios, precio, aforo y descripción. La Plataforma intentará reflejar dichas modificaciones lo antes posible; no obstante, no garantiza la actualización inmediata.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Cancelaciones</h2>
            <p>
              Los eventos pueden cancelarse por múltiples circunstancias. Agenda Cultural de Terrassa no será responsable de cancelaciones, cambios meteorológicos, incidencias técnicas, causas de fuerza mayor o decisiones del organizador. Siempre se recomendará confirmar la celebración del evento con el organizador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Propiedad intelectual</h2>
            <p>
              Todos los elementos propios de la Plataforma son propiedad de Agenda Cultural de Terrassa o de sus respectivos titulares, entre ellos: logotipo, diseño, interfaz, código fuente, estructura, bases de datos, iconografía, nombre comercial y textos propios. Queda prohibida su reproducción sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Derechos sobre las imágenes publicadas</h2>
            <p>
              Los organizadores garantizan disponer de todos los derechos necesarios sobre fotografías, carteles, vídeos, logotipos e ilustraciones. Agenda Cultural de Terrassa podrá retirar cualquier contenido respecto del que existan dudas razonables sobre su titularidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Enlaces a terceros</h2>
            <p>
              La Plataforma puede contener enlaces a páginas web, venta de entradas, redes sociales y organizadores. Agenda Cultural de Terrassa no controla dichos sitios y no responde por sus contenidos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Disponibilidad del servicio</h2>
            <p>
              La Plataforma realizará todos los esfuerzos razonables para mantener el servicio disponible. No obstante, podrán producirse interrupciones por mantenimiento, actualizaciones, incidencias técnicas y causas ajenas. No se garantiza disponibilidad permanente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Exclusión de garantías</h2>
            <p>
              Agenda Cultural de Terrassa no garantiza ausencia total de errores, disponibilidad ininterrumpida, exactitud absoluta de todos los contenidos ni ausencia de virus introducidos por terceros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Limitación de responsabilidad</h2>
            <p>
              Agenda Cultural de Terrassa no responderá de daños indirectos, pérdida de beneficios, pérdida de datos, cancelaciones de eventos, errores facilitados por terceros ni actuaciones de organizadores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">17. Suspensión de cuentas</h2>
            <p>
              La Plataforma podrá suspender temporal o definitivamente usuarios que incumplan las normas, publiquen contenido falso, vulneren derechos de terceros o hagan un uso fraudulento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">18. Modificación del servicio</h2>
            <p>
              Agenda Cultural de Terrassa podrá añadir o eliminar funcionalidades, modificar el diseño, introducir nuevos servicios o implantar servicios de pago. Siempre que sea posible se informará previamente a los usuarios cuando los cambios sean relevantes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">19. Legislación aplicable</h2>
            <p>La Plataforma se regirá por:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Reglamento (UE) 2016/679 (RGPD).</li>
              <li>Ley Orgánica 3/2018 (LOPDGDD).</li>
              <li>Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).</li>
              <li>Real Decreto Legislativo 1/2007, Ley General para la Defensa de los Consumidores y Usuarios (cuando resulte aplicable).</li>
              <li>Demás normativa española y europea aplicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">20. Jurisdicción</h2>
            <p>
              Las controversias derivadas del uso de la Plataforma se someterán a los juzgados y tribunales que correspondan conforme a la legislación aplicable. Cuando el usuario tenga la condición de consumidor, serán competentes los juzgados que determine la normativa de protección de consumidores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">21. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con este Aviso Legal, los usuarios podrán dirigirse a{' '}
              <a href="mailto:info@agendaculturalterrassa.cat" className="text-pink-400 hover:underline">info@agendaculturalterrassa.cat</a>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-white/30">
          <Link href="/privacidad" className="hover:text-white/60 transition">Privacidad</Link>
          <Link href="/cookies" className="hover:text-white/60 transition">Cookies</Link>
          <Link href="/terminos" className="hover:text-white/60 transition">Términos</Link>
          <Link href="/aviso-legal" className="text-white/60">Aviso legal</Link>
        </div>
        <p className="text-xs text-white/20 mt-4">© 2026 Agenda Cultural de Terrassa. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
