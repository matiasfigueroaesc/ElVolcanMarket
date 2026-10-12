// Página "Nosotros": contenido estático migrado de legacy-eval1/store/about.html.
// Los bloques repetidos (equipo, desarrolladores) se recorren desde arreglos para no duplicar markup.

const EQUIPO = [
  {
    titulo: "Logística y distribución",
    texto:
      "Disponemos de 2 camiones de reparto operados por 3 repartidores experimentados, que recorren diariamente Chillán para cumplir con tus solicitudes.",
  },
  {
    titulo: "Atención telefónica",
    texto:
      "Nuestra operadora de llamadas recibe, coordina y agiliza cada solicitud de gas directamente en nuestra central.",
  },
  {
    titulo: "Administración y control",
    texto:
      "Nuestra administradora lidera los flujos contables y la gestión interna, garantizando un servicio transparente y cercano al cliente.",
  },
];

const DESARROLLADORES = [
  { nombre: "Matias Figueroa", rol: "Desarrollador frontend" },
  { nombre: "Fabian Rubio", rol: "Diseño y contenido" },
  { nombre: "Renato Figueroa", rol: "Documentación y QA" },
];

export default function Nosotros() {
  return (
    <section className="container py-5">
      <h1 className="mb-4">Quiénes somos</h1>

      <section className="mb-5">
        <h2 className="h4">Nuestra historia</h2>
        <p>
          Distribuidora de Gas El Volcán es una empresa familiar fundada en 1998 en la ciudad de
          Chillán, Región de Ñuble. Desde nuestros inicios, nos hemos dedicado a la distribución de
          cilindros de gas licuado a domicilio, llevando un servicio cálido, confiable y oportuno
          tanto a clientes residenciales como comerciales de la comuna y sus alrededores.
        </p>
        <p>
          Lo que comenzó como un pequeño emprendimiento local ha crecido gracias a la preferencia de
          nuestros vecinos, manteniendo siempre la esencia y los valores humanos del primer día.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="h4 mb-3">Nuestro equipo e infraestructura</h2>
        <p className="mb-4">
          Para asegurar que cada pedido llegue de manera eficiente a tu hogar, contamos con un
          equipo dedicado y una flota preparada para la ruta:
        </p>
        <div className="row g-4">
          {EQUIPO.map((e) => (
            <div className="col-md-4" key={e.titulo}>
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h6">{e.titulo}</h3>
                  <p className="card-text small text-muted">{e.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="h4">Compromiso de suministro</h2>
        <p>
          Sabemos lo importante que es el gas licuado en las tareas cotidianas del hogar y el
          comercio. Por ello, garantizamos un stock continuo en los tres formatos más solicitados
          del mercado: <strong>5 kg, 11 kg y 15 kg</strong>, listos para ser despachados cuando más
          lo necesites.
        </p>
      </section>

      <section className="mt-5">
        <h2 className="h4 mb-3">Equipo de desarrollo</h2>
        <p className="text-muted mb-4">
          Equipo responsable del desarrollo de la presente entrega (proyecto educativo).
        </p>
        <div className="row g-4">
          {DESARROLLADORES.map((d) => (
            <div className="col-sm-6 col-md-4" key={d.nombre}>
              <div className="card h-100">
                <div className="card-body text-center">
                  <h3 className="h6">{d.nombre}</h3>
                  <p className="small text-muted mb-0">{d.rol}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
