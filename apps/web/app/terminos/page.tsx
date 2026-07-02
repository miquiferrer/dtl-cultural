import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export const metadata = { title: 'Condiciones Generales de Uso – Agenda Cultural de Terrassa' }

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/"><Logo variant="light" size="sm" /></Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white transition">← Volver al inicio</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Condiciones Generales de Uso</h1>
        <p className="text-white/40 text-sm mb-1">Versión 1.0</p>
        <p className="text-white/40 text-sm mb-10">Última actualización: 26 de junio de 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Objeto</h2>
            <p>
              Las presentes Condiciones Generales regulan el acceso, navegación y utilización de la aplicación móvil y del sitio web Agenda Cultural de Terrassa (en adelante, «la Plataforma»), así como los derechos y obligaciones de los usuarios y de los organizadores que publiquen eventos. El uso de la Plataforma implica la aceptación íntegra de estas condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Definiciones</h2>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-white">Plataforma:</strong> la aplicación móvil y la web Agenda Cultural de Terrassa.</li>
              <li><strong className="text-white">Usuario:</strong> persona que consulta o utiliza la Plataforma.</li>
              <li><strong className="text-white">Organizador:</strong> persona física o jurídica autorizada para publicar eventos.</li>
              <li><strong className="text-white">Evento:</strong> actividad cultural, artística, deportiva, educativa, social o de ocio publicada en la Plataforma.</li>
              <li><strong className="text-white">Contenido:</strong> cualquier texto, imagen, vídeo, documento, cartel, logotipo, audio o información publicada en la Plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalidad del servicio</h2>
            <p>
              Agenda Cultural de Terrassa tiene como finalidad facilitar el acceso a información sobre actividades y eventos desarrollados principalmente en la ciudad de Terrassa. La Plataforma actúa como intermediaria informativa entre organizadores y usuarios. Salvo indicación expresa, Agenda Cultural de Terrassa no organiza los eventos publicados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Acceso a la plataforma</h2>
            <p>
              El acceso básico podrá realizarse sin necesidad de registro. Determinadas funcionalidades podrán requerir una cuenta de usuario. El acceso podrá estar limitado por motivos de mantenimiento, seguridad o mejoras técnicas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Registro de usuarios</h2>
            <p>
              Para acceder a determinadas funcionalidades será necesario registrarse. Durante el registro el usuario deberá facilitar información veraz, completa y actualizada. Cada cuenta será personal e intransferible. El usuario será responsable de mantener la confidencialidad de sus credenciales de acceso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cuentas de organizador</h2>
            <p>
              Los organizadores deberán solicitar autorización para publicar eventos. La Plataforma podrá verificar la identidad, representación o actividad del solicitante antes de conceder acceso. Agenda Cultural de Terrassa podrá denegar solicitudes cuando existan motivos razonables relacionados con la seguridad, legalidad o calidad del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Publicación de eventos</h2>
            <p>Los organizadores serán responsables de que toda la información publicada sea veraz, actualizada, completa, clara y conforme a la legislación vigente. Cada publicación deberá incluir, cuando proceda:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Título y descripción.</li>
              <li>Fecha, horario y lugar.</li>
              <li>Organizador y datos de contacto.</li>
              <li>Precio, si existe.</li>
              <li>Imagen o cartel.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contenidos prohibidos</h2>
            <p>No podrán publicarse contenidos que:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Sean falsos o engañosos.</li>
              <li>Infrinjan derechos de propiedad intelectual.</li>
              <li>Contengan expresiones ofensivas o discriminatorias.</li>
              <li>Inciten a la violencia o promuevan actividades ilegales.</li>
              <li>Vulneren derechos fundamentales.</li>
              <li>Contengan malware o elementos técnicos dañinos.</li>
              <li>Publiciten productos o servicios ilícitos.</li>
            </ul>
            <p className="mt-2">Agenda Cultural de Terrassa podrá retirar estos contenidos sin previo aviso.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Propiedad de los contenidos</h2>
            <p>
              Cada organizador conservará la titularidad de los contenidos que publique. No obstante, concede a Agenda Cultural de Terrassa una licencia no exclusiva, gratuita y mientras el contenido permanezca publicado para reproducirlo, comunicarlo públicamente y adaptarlo técnicamente con el único fin de difundir el evento dentro de la Plataforma y en sus canales oficiales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Imágenes y material promocional</h2>
            <p>
              El organizador garantiza disponer de los derechos necesarios sobre fotografías, carteles, logotipos, vídeos y material gráfico. Será responsable frente a cualquier reclamación derivada de la utilización de dicho material.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Modificaciones de eventos</h2>
            <p>
              Los organizadores podrán modificar la información publicada. La Plataforma realizará los esfuerzos razonables para actualizar dichos cambios con la mayor rapidez posible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Cancelaciones</h2>
            <p>
              Cuando un evento sea cancelado, el organizador deberá comunicarlo lo antes posible. Agenda Cultural de Terrassa podrá informar a los usuarios mediante la propia ficha del evento, notificaciones push (cuando el usuario las haya autorizado) o correo electrónico cuando resulte procedente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Favoritos y recordatorios</h2>
            <p>
              Los usuarios podrán guardar eventos como favoritos y activar recordatorios. Estas funcionalidades tienen carácter informativo y no garantizan la celebración efectiva del evento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Valoraciones y comentarios</h2>
            <p>
              Cuando la Plataforma incorpore sistemas de valoración o comentarios, los usuarios deberán actuar con respeto y buena fe. No estarán permitidos comentarios insultantes, difamatorios, falsos, discriminatorios, publicitarios o contrarios a la ley. Agenda Cultural de Terrassa podrá moderar o eliminar dichos contenidos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Enlaces a sitios de terceros</h2>
            <p>
              La Plataforma podrá incluir enlaces a páginas de organizadores, venta de entradas o redes sociales. Agenda Cultural de Terrassa no controla dichos sitios ni responde de sus contenidos, disponibilidad o políticas de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Disponibilidad del servicio</h2>
            <p>
              La Plataforma procurará mantener el servicio operativo de forma continuada. No obstante, podrán producirse interrupciones por mantenimiento, actualizaciones, incidencias técnicas, ataques informáticos o fuerza mayor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">17. Limitación de responsabilidad</h2>
            <p>Agenda Cultural de Terrassa no responderá de:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Cambios de fecha u horario o cancelaciones.</li>
              <li>Errores introducidos por organizadores.</li>
              <li>Calidad de los eventos o incidencias ocurridas durante su celebración.</li>
              <li>Relaciones contractuales entre usuarios y organizadores.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">18. Suspensión y cancelación de cuentas</h2>
            <p>La Plataforma podrá suspender o cancelar cuentas cuando se detecten:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Incumplimientos de estas condiciones.</li>
              <li>Publicaciones fraudulentas o suplantación de identidad.</li>
              <li>Uso abusivo del servicio o actividades ilegales.</li>
              <li>Conductas que perjudiquen a otros usuarios o a la plataforma.</li>
            </ul>
            <p className="mt-2">Cuando resulte posible y adecuado, se informará previamente al usuario.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">19. Modificación de las condiciones</h2>
            <p>
              Agenda Cultural de Terrassa podrá modificar estas Condiciones para adaptarlas a cambios legales, técnicos o funcionales. Las modificaciones relevantes serán comunicadas a los usuarios por medios adecuados antes de su entrada en vigor cuando así lo exija la normativa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">20. Propiedad intelectual de la plataforma</h2>
            <p>
              Todos los elementos propios de la Plataforma son titularidad de Agenda Cultural de Terrassa o de sus respectivos titulares. Queda prohibida su reproducción, distribución o transformación sin autorización previa, salvo en los casos permitidos por la legislación aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">21. Protección de datos</h2>
            <p>
              El tratamiento de los datos personales se regirá por la{' '}
              <Link href="/privacidad" className="text-pink-400 hover:underline">Política de Privacidad</Link>{' '}
              de Agenda Cultural de Terrassa, que forma parte integrante de estas Condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">22. Comunicaciones electrónicas</h2>
            <p>
              El usuario acepta que determinadas comunicaciones relacionadas con el funcionamiento del servicio puedan realizarse por medios electrónicos. Las comunicaciones comerciales se enviarán únicamente cuando exista una base jurídica que lo permita.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">23. Cesión de la posición contractual</h2>
            <p>
              Agenda Cultural de Terrassa podrá ceder la gestión de la Plataforma a otra sociedad del mismo grupo empresarial o a un sucesor del negocio, respetando los derechos de los usuarios y la normativa aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">24. Nulidad parcial</h2>
            <p>
              Si alguna cláusula de estas Condiciones fuese declarada nula o inaplicable, dicha circunstancia no afectará a la validez del resto del documento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">25. Legislación aplicable</h2>
            <p>Estas Condiciones se regirán por la legislación española y europea aplicable, incluyendo:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Reglamento (UE) 2016/679 (RGPD).</li>
              <li>Ley Orgánica 3/2018 (LOPDGDD).</li>
              <li>Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).</li>
              <li>Real Decreto Legislativo 1/2007, Ley General para la Defensa de los Consumidores y Usuarios, cuando resulte aplicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">26. Resolución de conflictos</h2>
            <p>
              Las controversias derivadas del uso de la Plataforma se resolverán conforme a la legislación vigente. Cuando el usuario tenga la condición de consumidor, serán competentes los juzgados y tribunales que determine la normativa de protección de consumidores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">27. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con estas condiciones generales de uso:{' '}
              <a href="mailto:info@agendaculturaldeterrassa.cat" className="text-pink-400 hover:underline">info@agendaculturaldeterrassa.cat</a>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-white/30">
          <Link href="/privacidad" className="hover:text-white/60 transition">Privacidad</Link>
          <Link href="/cookies" className="hover:text-white/60 transition">Cookies</Link>
          <Link href="/terminos" className="text-white/60">Términos</Link>
          <Link href="/aviso-legal" className="hover:text-white/60 transition">Aviso legal</Link>
        </div>
        <p className="text-xs text-white/20 mt-4">© 2026 Agenda Cultural de Terrassa. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
