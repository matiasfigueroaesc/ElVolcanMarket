// Artículos del blog (contenido migrado de legacy-eval1/store/blog*.html).
// Es contenido estático: no se guarda en localStorage, por eso vive aquí y no en src/data/.
// Si el equipo prefiere moverlo a src/data/, solo hay que cambiar el import (lo decide Mati).

export const ARTICULOS = [
  {
    id: 1,
    titulo: "Medidas clave para el uso seguro de cilindros en el hogar",
    fecha: "15 de agosto, 2026",
    autor: "Administradora El Volcán",
    imagen: "/img/blog-1.png",
    alt: "Consejos de seguridad con cilindros de gas",
    resumen:
      "Aprende a revisar conexiones, reguladores y mangueras para garantizar la máxima seguridad de tu familia.",
    introduccion:
      "El gas licuado es una fuente de energía segura cuando se maneja correctamente. En Distribuidora de Gas El Volcán queremos compartir contigo las recomendaciones básicas para que su uso en el hogar sea siempre seguro.",
    secciones: [
      {
        titulo: "1. Revisa las conexiones periódicamente",
        texto:
          "Antes de conectar un cilindro nuevo, verifica que la válvula y la manguera no presenten grietas ni desgaste. Una conexión floja es una de las principales causas de fugas.",
      },
      {
        titulo: "2. Ubica el cilindro en un lugar ventilado",
        texto:
          "Nunca instales el cilindro en espacios cerrados sin ventilación, ni cerca de fuentes de calor directo o llamas abiertas.",
      },
      {
        titulo: "3. Ante un olor a gas, actúa de inmediato",
        texto:
          "Cierra la válvula, ventila el espacio y no enciendas ni apagues artefactos eléctricos. Si el olor persiste, contáctanos para una revisión.",
      },
    ],
  },
  {
    id: 2,
    titulo: "Cómo optimizar el consumo de gas durante los meses fríos",
    fecha: "2 de agosto, 2026",
    autor: "Administradora El Volcán",
    imagen: "/img/blog-2.png",
    alt: "Optimización de consumo de gas en invierno",
    resumen:
      "Recomendaciones prácticas para calefaccionar tus ambientes de manera eficiente sin descuidar tu presupuesto.",
    introduccion:
      "Durante la época invernal en la Región de Ñuble, el uso de gas licuado para calefacción y agua caliente se incrementa notablemente. En Distribuidora de Gas El Volcán queremos ayudarte a cuidar tu presupuesto con recomendaciones simples que maximizarán el rendimiento de tus cilindros.",
    secciones: [
      {
        titulo: "1. Mantén la temperatura ideal en tus ambientes",
        texto:
          "Calefaccionar en exceso una habitación genera un gasto innecesario de energía. Mantener una temperatura constante y moderada (entre 19°C y 21°C) es suficiente para un espacio confortable y evita que el cilindro se agote antes de lo previsto.",
      },
      {
        titulo: "2. Evita filtraciones de aire",
        texto:
          "Un porcentaje importante del calor se pierde por rendijas en puertas y ventanas. Utilizar burletes o aislantes térmicos sencillos ayuda a conservar la temperatura del hogar por mucho más tiempo, reduciendo las horas en que necesitas tener encendida tu estufa a gas.",
      },
      {
        titulo: "3. Mantención de artefactos",
        texto:
          "Un quemador sucio u obstruido disminuye drásticamente la eficiencia de la combustión, gastando más gas para generar la misma cantidad de calor. Realizar una limpieza preventiva a tus estufas y calefón antes de que comience el invierno garantizará un consumo óptimo.",
      },
    ],
  },
];

/**
 * Busca un artículo por id. El id puede venir como string desde useParams().
 * Devuelve null si no existe o si el id no es un número.
 */
export function obtenerArticulo(id) {
  return ARTICULOS.find((a) => a.id === Number(id)) ?? null;
}
