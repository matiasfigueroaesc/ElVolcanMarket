// Datos de fábrica del backend (los mismos de Seed.java de catalogo, usuarios, ventas y despacho).
// Solo para las pruebas: el backend falso (apiFalsa.js) parte de estas listas.
// Son los mismos datos que usaba el frontend en la Eval 2 (src/data/*_SEED).

export const PRODUCTOS_SEED = [
  {
    id: 1,
    codigo: "CL001",
    nombre: "Cilindro GLP 5 kg",
    precio: 6500,
    stock: 80,
    stockCritico: 10,
    imagen: "/img/cilindro-5kg.png",
    descripcion: "Cilindro de gas licuado de petróleo 5 kg. Para uso residencial (cocina, calefacción pequeña).",
    unidad: "Unidad",
    categoriaId: 1,
    precioOferta: null
  },
  {
    id: 2,
    codigo: "CL002",
    nombre: "Cilindro GLP 11 kg",
    precio: 12000,
    stock: 200,
    stockCritico: 10,
    imagen: "/img/cilindro-11kg.png",
    descripcion: "Cilindro estándar doméstico. El más utilizado en hogares chilenos. Compatible con reguladores estándar.",
    unidad: "Unidad",
    categoriaId: 1,
    precioOferta: null
  },
  {
    id: 3,
    codigo: "CL003",
    nombre: "Cilindro GLP 15 kg",
    precio: 16000,
    stock: 90,
    stockCritico: 10,
    imagen: "/img/cilindro-15kg.png",
    descripcion: "Cilindro de mayor capacidad para hogares de alto consumo o locales pequeños.",
    unidad: "Unidad",
    categoriaId: 1,
    precioOferta: null
  },
  {
    id: 4,
    codigo: "CL004",
    nombre: "Cilindro GLP 45 kg",
    precio: 45000,
    stock: 30,
    stockCritico: 10,
    imagen: "/img/cilindro-45kg.png",
    descripcion: "Cilindro industrial. Uso comercial: restaurantes, talleres, calefacción de locales.",
    unidad: "Unidad",
    categoriaId: 1,
    precioOferta: 39990
  },
  {
    id: 5,
    codigo: "RG001",
    nombre: "Regulador doméstico estándar",
    precio: 8990,
    stock: 45,
    stockCritico: 10,
    imagen: "/img/regulador-estandar.png",
    descripcion: "Regulador de 1 etapa para cilindros 5, 11 y 15 kg. Presión de salida 28 mbar.",
    unidad: "Unidad",
    categoriaId: 2,
    precioOferta: null
  },
  {
    id: 6,
    codigo: "RG002",
    nombre: "Regulador de alta presión",
    precio: 18990,
    stock: 12,
    stockCritico: 5,
    imagen: "/img/regulador-alta-presion.png",
    descripcion: "Regulador para cocinas industriales o equipos de mayor consumo. Presión regulable.",
    unidad: "Unidad",
    categoriaId: 2,
    precioOferta: null
  },
  {
    id: 7,
    codigo: "RG003",
    nombre: "Regulador dual (2 salidas)",
    precio: 14990,
    stock: 18,
    stockCritico: 5,
    imagen: "/img/regulador-dual.png",
    descripcion: "Permite conectar dos artefactos simultáneamente al mismo cilindro.",
    unidad: "Unidad",
    categoriaId: 2,
    precioOferta: null
  },
  {
    id: 8,
    codigo: "MG001",
    nombre: "Manguera gas 1.5 m",
    precio: 3990,
    stock: 80,
    stockCritico: 10,
    imagen: "/img/manguera-1.5m.png",
    descripcion: "Manguera flexible homologada. Diámetro interior 9mm. Compatible con reguladores estándar.",
    unidad: "Unidad",
    categoriaId: 3,
    precioOferta: null
  },
  {
    id: 9,
    codigo: "MG002",
    nombre: "Manguera gas 3 m",
    precio: 6990,
    stock: 50,
    stockCritico: 10,
    imagen: "/img/manguera-3m.png",
    descripcion: "Manguera larga para instalaciones donde el artefacto está alejado del cilindro.",
    unidad: "Unidad",
    categoriaId: 3,
    precioOferta: null
  },
  {
    id: 10,
    codigo: "MG003",
    nombre: "Abrazadera metálica",
    precio: 990,
    stock: 200,
    stockCritico: 10,
    imagen: "/img/abrazadera.png",
    descripcion: "Abrazadera de acero para asegurar la conexión manguera-regulador y manguera-artefacto.",
    unidad: "Unidad",
    categoriaId: 3,
    precioOferta: null
  },
  {
    id: 11,
    codigo: "MG004",
    nombre: "Kit conexión completo (regulador + manguera 1.5m + abrazaderas)",
    precio: 12990,
    stock: 25,
    stockCritico: 10,
    imagen: "/img/kit-conexion.png",
    descripcion: "Todo lo necesario para instalar un cilindro nuevo.",
    unidad: "Kit",
    categoriaId: 3,
    precioOferta: 10990
  },
  {
    id: 12,
    codigo: "AC001",
    nombre: "Carro porta cilindro 11/15 kg",
    precio: 12990,
    stock: 20,
    stockCritico: 5,
    imagen: "/img/carro-porta-cilindro.png",
    descripcion: "Carro metálico con ruedas para transportar cilindros dentro del hogar con seguridad.",
    unidad: "Unidad",
    categoriaId: 4,
    precioOferta: null
  },
  {
    id: 13,
    codigo: "AC002",
    nombre: "Tapa protectora para válvula",
    precio: 1490,
    stock: 60,
    stockCritico: 10,
    imagen: "/img/tapa-protectora.png",
    descripcion: "Tapa de plástico ABS para proteger la válvula del cilindro durante el transporte.",
    unidad: "Unidad",
    categoriaId: 4,
    precioOferta: null
  },
  {
    id: 14,
    codigo: "AC003",
    nombre: "Detector de gas a batería",
    precio: 19990,
    stock: 4,
    stockCritico: 5,
    imagen: "/img/detector-gas.png",
    descripcion: "Sensor electroquímico. Alarma sonora y visual ante fuga de gas GLP o metano.",
    unidad: "Unidad",
    categoriaId: 4,
    precioOferta: 16990
  }
];

export const CATEGORIAS_SEED = [
  {
    id: 1,
    nombre: "Cilindros de Gas",
    slug: "cilindros",
    descripcion: "Cilindros de gas licuado de 5, 11, 15 y 45 kg.",
    imagen: "/img/cilindro-11kg.png",
  },
  {
    id: 2,
    nombre: "Reguladores",
    slug: "reguladores",
    descripcion: "Reguladores de presión para uso doméstico e industrial.",
    imagen: "/img/regulador-estandar.png",
  },
  {
    id: 3,
    nombre: "Mangueras y Conexiones",
    slug: "mangueras-conexiones",
    descripcion: "Mangueras homologadas, abrazaderas y kits de conexión.",
    imagen: "/img/kit-conexion.png",
  },
  {
    id: 4,
    nombre: "Accesorios",
    slug: "accesorios",
    descripcion: "Carros, tapas protectoras y detectores de gas.",
    imagen: "/img/detector-gas.png",
  },
];

// Incluye la contraseña porque el backend falso la necesita para el login;
// la API nunca la devuelve (igual que el backend real).
export const USUARIOS_SEED = [
  {
    id: 1,
    run: "191234561",
    nombre: "Javiera",
    apellidos: "Muñoz Soto",
    correo: "javiera.munoz@gmail.com",
    password: "admin1234",
    telefono: null,
    fechaNacimiento: null,
    tipo: "administrador",
    region: "nuble",
    comuna: "chillan",
    direccion: "Av. Libertad 100, Chillán"
  },
  {
    id: 2,
    run: "17894567K",
    nombre: "Pedro",
    apellidos: "Salinas Rojas",
    correo: "pedro.salinas@duoc.cl",
    password: "vendedor1234",
    telefono: null,
    fechaNacimiento: null,
    tipo: "vendedor",
    region: "nuble",
    comuna: "chillan",
    direccion: "Av. O'Higgins 456, Chillán"
  },
  {
    id: 3,
    run: "205671129",
    nombre: "Camila",
    apellidos: "Toro Pizarro",
    correo: "camila.toro@gmail.com",
    password: "cliente1234",
    telefono: null,
    fechaNacimiento: null,
    tipo: "cliente",
    region: "nuble",
    comuna: "chillan-viejo",
    direccion: "Camino a Chillán Viejo 789"
  }
];

// ---------- Ventas y despacho ----------
const camila = { nombre: "Camila", apellidos: "Toro Pizarro", correo: "camila.toro@gmail.com" };
const direccionCamila = {
  calle: "Camino a Chillán Viejo 789",
  departamento: "",
  region: "nuble",
  comuna: "chillan-viejo",
  indicaciones: "",
};

// Boletas (BoletaResponse del servicio ventas, sin "estado": ese lo agrega despacho).
export const BOLETAS_SEED = [
  {
    id: 1,
    numero: "ORD-000001",
    fecha: "2026-09-02T14:10:00Z",
    usuarioId: 3,
    cliente: camila,
    direccion: direccionCamila,
    entrega: "normal",
    items: [
      { id: 2, codigo: "CL002", nombre: "Cilindro GLP 11 kg", precio: 12000, cantidad: 2, subtotal: 24000, imagen: "/img/cilindro-11kg.png" },
    ],
    total: 24000,
    estadoPago: "pagado",
  },
  {
    id: 2,
    numero: "ORD-000002",
    fecha: "2026-09-15T19:45:00Z",
    usuarioId: 3,
    cliente: camila,
    direccion: direccionCamila,
    entrega: "express",
    items: [
      { id: 3, codigo: "CL003", nombre: "Cilindro GLP 15 kg", precio: 16000, cantidad: 1, subtotal: 16000, imagen: "/img/cilindro-15kg.png" },
      { id: 5, codigo: "RG001", nombre: "Regulador doméstico estándar", precio: 8990, cantidad: 1, subtotal: 8990, imagen: "/img/regulador-estandar.png" },
    ],
    total: 24990,
    estadoPago: "pagado",
  },
];

// Despachos (servicio despacho): uno por boleta pagada.
export const DESPACHOS_SEED = [
  {
    boletaId: 1,
    numero: "ORD-000001",
    entrega: "normal",
    zona: "Zona Oriente",
    tiempo: "2 – 4 horas",
    estado: "entregado",
    historial: [
      { estado: "recibido", fecha: "2026-09-02T14:10:00Z" },
      { estado: "preparando", fecha: "2026-09-02T15:10:00Z" },
      { estado: "en camino", fecha: "2026-09-02T16:10:00Z" },
      { estado: "entregado", fecha: "2026-09-02T17:10:00Z" },
    ],
  },
  {
    boletaId: 2,
    numero: "ORD-000002",
    entrega: "express",
    zona: "Zona Oriente",
    tiempo: "2 – 4 horas",
    estado: "en camino",
    historial: [
      { estado: "recibido", fecha: "2026-09-15T19:45:00Z" },
      { estado: "preparando", fecha: "2026-09-15T20:45:00Z" },
      { estado: "en camino", fecha: "2026-09-15T21:45:00Z" },
    ],
  },
];

// Zonas de despacho (las 5 de la Eval 1).
export const ZONAS_SEED = [
  {
    id: "centro",
    nombre: "Zona Centro",
    cobertura: [{ comuna: "chillan", sector: "sectores centro, norte y sur" }],
    dias: "Lunes a Sábado",
    horario: "08:00 – 20:00",
    tiempo: "1 – 3 horas",
  },
  {
    id: "oriente",
    nombre: "Zona Oriente",
    cobertura: [{ comuna: "chillan", sector: "sector oriente" }, { comuna: "chillan-viejo" }],
    dias: "Lunes a Viernes",
    horario: "08:00 – 18:00",
    tiempo: "2 – 4 horas",
  },
  {
    id: "rural",
    nombre: "Zona Rural",
    cobertura: [{ comuna: "el-carmen" }, { comuna: "pinto" }, { comuna: "san-ignacio" }],
    dias: "Martes y Jueves",
    horario: "08:00 – 16:00",
    tiempo: "3 – 6 horas",
  },
  {
    id: "sur",
    nombre: "Zona Sur",
    cobertura: [{ comuna: "bulnes" }, { comuna: "quillon" }],
    dias: "Miércoles",
    horario: "08:00 – 16:00",
    tiempo: "4 – 6 horas",
  },
  {
    id: "comercial",
    nombre: "Zona Comercial",
    cobertura: [],
    detalle: "Parques industriales y locales comerciales",
    dias: "Lunes a Viernes",
    horario: "07:00 – 17:00",
    tiempo: "Según agenda",
  },
];
