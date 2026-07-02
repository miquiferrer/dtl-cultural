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
        <p className="text-white/40 text-sm mb-1">Versión 1.0</p>
        <p className="text-white/40 text-sm mb-10">Última actualización: 29 de junio de 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introducción</h2>
            <p>
              En Agenda Cultural de Terrassa respetamos el derecho fundamental a la protección de los datos personales de nuestros usuarios. La presente Política de Privacidad explica de forma transparente cómo recopilamos, utilizamos, conservamos y protegemos la información facilitada por los usuarios de la aplicación móvil y del sitio web. Nuestro compromiso es garantizar el cumplimiento del Reglamento (UE) 2016/679 (RGPD), de la Ley Orgánica 3/2018 (LOPDGDD) y de la restante normativa aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Responsable del tratamiento</h2>
            <p>
              <strong className="text-white">Zeralion, S.L.</strong>, con CIF B24944878 y domicilio en Calle Lepanto, 270 Local, 08013, Barcelona.
            </p>
            <p className="mt-2">
              Correo electrónico:{' '}
              <a href="mailto:info@agendaculturaldeterrassa.cat" className="text-pink-400 hover:underline">info@agendaculturaldeterrassa.cat</a>
              {' '}— Sitio web:{' '}
              <a href="https://www.agendaculturalterrassa.cat" className="text-pink-400 hover:underline" target="_blank" rel="noopener noreferrer">www.agendaculturalterrassa.cat</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Ámbito de aplicación</h2>
            <p>Esta política resulta aplicable a:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Aplicación móvil y sitio web.</li>
              <li>Formularios y registro de usuarios.</li>
              <li>Publicadores de eventos, patrocinadores y colaboradores.</li>
              <li>Comunicaciones electrónicas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Datos que podemos recopilar</h2>
            <p>Dependiendo del uso realizado por el usuario podremos recopilar:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong className="text-white">Datos identificativos:</strong> nombre, apellidos, alias de usuario.</li>
              <li><strong className="text-white">Datos de contacto:</strong> correo electrónico, teléfono.</li>
              <li><strong className="text-white">Datos de acceso:</strong> contraseña cifrada, identificador de usuario.</li>
              <li><strong className="text-white">Datos del dispositivo:</strong> modelo, sistema operativo, idioma, versión de la aplicación, identificadores técnicos.</li>
              <li><strong className="text-white">Datos de navegación:</strong> dirección IP, fecha y hora de acceso, páginas visitadas, tiempo de uso, errores de funcionamiento.</li>
              <li><strong className="text-white">Preferencias:</strong> categorías favoritas, eventos guardados, historial de búsquedas, configuración del perfil.</li>
              <li><strong className="text-white">Geolocalización:</strong> únicamente cuando el usuario autorice expresamente dicho permiso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Datos de los organizadores</h2>
            <p>Cuando una entidad publique eventos podremos tratar:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Nombre de la entidad, CIF y dirección.</li>
              <li>Persona de contacto, email, teléfono.</li>
              <li>Redes sociales y página web.</li>
              <li>Datos de facturación e información bancaria cuando resulte necesaria para la prestación del servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Finalidades del tratamiento</h2>
            <p>Utilizamos los datos para:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Crear cuentas de usuario y permitir el acceso a la plataforma.</li>
              <li>Mostrar eventos personalizados y gestionar favoritos.</li>
              <li>Enviar notificaciones autorizadas y responder consultas.</li>
              <li>Gestionar incidencias y mejorar la plataforma.</li>
              <li>Detectar usos fraudulentos y elaborar estadísticas agregadas.</li>
              <li>Gestionar relaciones comerciales con organizadores y emitir facturas cuando corresponda.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Base jurídica</h2>
            <p>El tratamiento se fundamenta, según cada caso, en:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>El consentimiento del usuario.</li>
              <li>La ejecución de un contrato o de medidas precontractuales.</li>
              <li>El cumplimiento de obligaciones legales.</li>
              <li>El interés legítimo del responsable para mejorar y proteger la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Consentimiento</h2>
            <p>
              Cuando el tratamiento requiera consentimiento, este será libre, específico, informado e inequívoco. El usuario podrá retirarlo en cualquier momento sin que ello afecte a la licitud de los tratamientos realizados con anterioridad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Menores de edad</h2>
            <p>
              La plataforma no está dirigida específicamente a menores de 14 años. Cuando la legislación exija autorización de los representantes legales, será necesaria dicha autorización para el tratamiento de los datos personales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Notificaciones push</h2>
            <p>
              Las notificaciones solo se enviarán cuando el usuario haya autorizado expresamente esta funcionalidad desde su dispositivo. Podrán utilizarse para recordatorios, novedades, eventos guardados e información relevante sobre el servicio. El usuario podrá desactivarlas en cualquier momento desde la configuración del dispositivo o de la aplicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Newsletter y comunicaciones comerciales</h2>
            <p>
              Únicamente se enviarán comunicaciones promocionales cuando exista una base jurídica que lo permita, especialmente el consentimiento del usuario o los supuestos previstos por la legislación aplicable. Cada comunicación incluirá un mecanismo sencillo para darse de baja.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Geolocalización</h2>
            <p>
              La geolocalización será siempre opcional. Su finalidad será mostrar eventos cercanos, ordenar resultados por proximidad y mejorar la experiencia del usuario. La ubicación no se utilizará para fines distintos sin informar previamente al usuario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Favoritos y preferencias</h2>
            <p>
              La aplicación podrá almacenar eventos favoritos, categorías preferidas, historial de consultas y configuración personal. Estos datos se utilizarán exclusivamente para personalizar la experiencia del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Plazo de conservación</h2>
            <p>Los datos se conservarán:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Mientras exista una cuenta activa.</li>
              <li>Mientras sea necesario para prestar el servicio.</li>
              <li>Durante los plazos exigidos por la normativa aplicable.</li>
              <li>Hasta que el usuario solicite su supresión cuando proceda.</li>
            </ul>
            <p className="mt-2">Una vez finalizados dichos plazos, los datos serán eliminados o anonimizados.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Destinatarios de los datos</h2>
            <p>
              Con carácter general no se comunicarán datos personales a terceros. Podrán acceder a los datos únicamente aquellos proveedores que actúen como encargados del tratamiento para la prestación de servicios necesarios, tales como alojamiento web, infraestructura en la nube, correo electrónico, analítica, soporte técnico y procesamiento de pagos. Todos ellos deberán ofrecer garantías adecuadas en materia de protección de datos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Transferencias internacionales</h2>
            <p>
              En caso de utilizar proveedores ubicados fuera del Espacio Económico Europeo, se adoptarán las garantías exigidas por el RGPD, como decisiones de adecuación o cláusulas contractuales tipo cuando sean necesarias.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">17. Medidas de seguridad</h2>
            <p>
              Agenda Cultural de Terrassa aplica medidas técnicas y organizativas apropiadas para proteger la información frente a accesos no autorizados, alteración, pérdida, destrucción o divulgación indebida. Entre otras, podrán utilizarse cifrado de comunicaciones, contraseñas protegidas, copias de seguridad, control de accesos, monitorización de incidencias y actualizaciones de seguridad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">18. Derechos de los usuarios</h2>
            <p>El usuario podrá ejercer los siguientes derechos: acceso, rectificación, supresión, oposición, limitación del tratamiento, portabilidad y retirada del consentimiento.</p>
            <p className="mt-2">
              Las solicitudes podrán enviarse a{' '}
              <a href="mailto:info@agendaculturaldeterrassa.cat" className="text-pink-400 hover:underline">info@agendaculturaldeterrassa.cat</a>. Será necesario acreditar la identidad cuando resulte preciso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">19. Reclamaciones</h2>
            <p>
              Si el usuario considera que sus derechos no han sido respetados, podrá presentar una reclamación ante la autoridad de control competente, sin perjuicio de cualquier otro recurso administrativo o judicial que pudiera corresponderle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">20. Cookies y tecnologías similares</h2>
            <p>
              La web podrá utilizar cookies y tecnologías similares conforme a la{' '}
              <Link href="/cookies" className="text-pink-400 hover:underline">Política de Cookies</Link>{' '}
              disponible en el sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">21. Servicios de terceros</h2>
            <p>
              La plataforma podrá integrar servicios de terceros, como proveedores de mapas, analítica, pasarelas de pago, almacenamiento en la nube o redes sociales. Cada uno de estos servicios estará sujeto a sus propias políticas de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">22. Modificaciones de esta política</h2>
            <p>
              Agenda Cultural de Terrassa podrá actualizar esta Política de Privacidad cuando sea necesario por cambios legales, técnicos o funcionales. Cuando las modificaciones sean relevantes, se informará a los usuarios por medios adecuados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">23. Contacto</h2>
            <p>
              Para cualquier cuestión relacionada con la protección de datos puede contactar con{' '}
              <a href="mailto:info@agendaculturaldeterrassa.cat" className="text-pink-400 hover:underline">info@agendaculturaldeterrassa.cat</a>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-white/30">
          <Link href="/privacidad" className="text-white/60">Privacidad</Link>
          <Link href="/cookies" className="hover:text-white/60 transition">Cookies</Link>
          <Link href="/terminos" className="hover:text-white/60 transition">Términos</Link>
          <Link href="/aviso-legal" className="hover:text-white/60 transition">Aviso legal</Link>
        </div>
        <p className="text-xs text-white/20 mt-4">© 2026 Agenda Cultural de Terrassa. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
