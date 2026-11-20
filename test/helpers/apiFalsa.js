// ============================================
// Backend falso para las pruebas.
// Reemplaza window.fetch (con spyOn de Jasmine) por un servidor en memoria que
// responde como el Gateway real: mismas rutas /api/v1, mismos JSON, mismos
// códigos (200, 201, 204, 400, 401, 403, 404, 409) y mismas reglas de negocio
// principales. Así las páginas se prueban sin levantar Spring Boot.
//
// Uso en un spec:
//   let api;
//   beforeEach(() => { api = instalarApiFalsa({ sesion: "admin" }); });
//   ...
//   expect(api.db.productos.length).toBe(13);
//
// sesion: null (sin sesión), "admin", "vendedor" o "cliente". Simula la cookie
// del refresh: AuthProvider recupera esa sesión al montar.
// ============================================
import { establecerToken } from "../../src/api/cliente.js";
import {
  BOLETAS_SEED,
  CATEGORIAS_SEED,
  DESPACHOS_SEED,
  PRODUCTOS_SEED,
  USUARIOS_SEED,
  ZONAS_SEED,
} from "./datosBackend.js";

export { BOLETAS_SEED, CATEGORIAS_SEED, DESPACHOS_SEED, PRODUCTOS_SEED, USUARIOS_SEED, ZONAS_SEED };

const ESTADOS = ["recibido", "preparando", "en camino", "entregado"];

const CORREOS = {
  admin: "javiera.munoz@gmail.com",
  vendedor: "pedro.salinas@duoc.cl",
  cliente: "camila.toro@gmail.com",
};

const ROL = { administrador: "ADMIN", vendedor: "VENDEDOR", cliente: "CLIENTE" };

const normalizar = (s = "") =>
  s.toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const slug = (s) => normalizar(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const json = (status, cuerpo) =>
  new Response(cuerpo === undefined ? null : JSON.stringify(cuerpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const error = (status, mensaje, campos = {}) => json(status, { status, mensaje, campos });
const sinPassword = ({ password: _password, ...resto }) => resto;

export function instalarApiFalsa({ sesion = null } = {}) {
  const db = {
    productos: structuredClone(PRODUCTOS_SEED),
    categorias: structuredClone(CATEGORIAS_SEED),
    usuarios: structuredClone(USUARIOS_SEED),
    boletas: structuredClone(BOLETAS_SEED),
    despachos: structuredClone(DESPACHOS_SEED),
    zonas: structuredClone(ZONAS_SEED),
    // "Cookie" del refresh: id del usuario con sesión, o null.
    cookieRefresh: null,
    // true = el backend está apagado (fetch falla como sin red).
    caido: false,
    // Registro de las peticiones recibidas: [{ metodo, ruta, cuerpo, token }]
    peticiones: [],
  };
  if (sesion) db.cookieRefresh = db.usuarios.find((u) => u.correo === CORREOS[sesion]).id;
  establecerToken(null);

  const siguienteId = (lista) => Math.max(0, ...lista.map((x) => x.id)) + 1;

  function emitirSesion(usuario) {
    db.cookieRefresh = usuario.id;
    return { accessToken: `token-${usuario.id}`, expiresIn: 900, usuario: sinPassword(usuario) };
  }

  function usuarioDelToken(cabeceras) {
    const auth = cabeceras.Authorization ?? "";
    const id = Number(auth.replace("Bearer token-", ""));
    return db.usuarios.find((u) => u.id === id) ?? null;
  }

  // Devuelve una Response de error si el usuario no tiene alguno de los roles, o null si puede.
  function exigir(actual, ...roles) {
    if (!actual) return error(401, "Debes iniciar sesión o renovar tu sesión.");
    if (!roles.includes(ROL[actual.tipo])) return error(403, "No tienes permisos para esta acción.");
    return null;
  }

  function responder(metodo, ruta, query, cuerpo, cabeceras) {
    const actual = usuarioDelToken(cabeceras);
    let m;

    // ---------- Autenticación ----------
    if (ruta === "/auth/login" && metodo === "POST") {
      const u = db.usuarios.find(
        (x) => x.correo === normalizar(cuerpo.correo) && x.password === cuerpo.password
      );
      return u ? json(200, emitirSesion(u)) : error(401, "Correo o contraseña incorrectos.");
    }
    if (ruta === "/auth/refresh" && metodo === "POST") {
      const u = db.usuarios.find((x) => x.id === db.cookieRefresh);
      return u ? json(200, emitirSesion(u)) : error(401, "La sesión expiró. Inicia sesión nuevamente.");
    }
    if (ruta === "/auth/logout" && metodo === "POST") {
      db.cookieRefresh = null;
      return json(204);
    }
    if (ruta === "/auth/registro" && metodo === "POST") {
      if (db.usuarios.some((u) => u.correo === normalizar(cuerpo.correo)))
        return error(409, "Ya existe un usuario con ese correo.");
      if (db.usuarios.some((u) => u.run === cuerpo.run.replace(/[.\s-]/g, "").toUpperCase()))
        return error(409, "Ya existe un usuario con ese RUN.");
      const nuevo = { ...cuerpo, correo: normalizar(cuerpo.correo), id: siguienteId(db.usuarios), tipo: "cliente" };
      db.usuarios.push(nuevo);
      return json(201, sinPassword(nuevo));
    }
    if (ruta === "/auth/me" && metodo === "GET") {
      return actual ? json(200, sinPassword(actual)) : error(401, "Debes iniciar sesión o renovar tu sesión.");
    }

    // ---------- Productos ----------
    if (ruta === "/productos/criticos" && metodo === "GET") {
      return exigir(actual, "ADMIN", "VENDEDOR") ?? json(200, db.productos.filter((p) => p.stock <= p.stockCritico));
    }
    if (ruta === "/productos" && metodo === "GET") {
      let lista = db.productos;
      if (query.get("categoriaId")) lista = lista.filter((p) => p.categoriaId === Number(query.get("categoriaId")));
      if (query.get("oferta") === "true") lista = lista.filter((p) => p.precioOferta != null);
      if (query.get("texto")) {
        const t = normalizar(query.get("texto"));
        lista = lista.filter((p) => normalizar(p.nombre).includes(t) || normalizar(p.codigo).includes(t));
      }
      return json(200, lista);
    }
    if ((m = ruta.match(/^\/productos\/(\d+)$/))) {
      const id = Number(m[1]);
      const p = db.productos.find((x) => x.id === id);
      if (metodo === "GET") return p ? json(200, p) : error(404, "Producto no encontrado.");
      const negado = exigir(actual, "ADMIN");
      if (negado) return negado;
      if (!p) return error(404, "Producto no encontrado.");
      if (metodo === "DELETE") {
        db.productos = db.productos.filter((x) => x.id !== id);
        return json(204);
      }
      if (metodo === "PUT") {
        if (db.productos.some((x) => x.id !== id && x.codigo === cuerpo.codigo))
          return error(409, `Ya existe un producto con el código ${cuerpo.codigo}.`);
        Object.assign(p, cuerpo, { id });
        return json(200, p);
      }
    }
    if (ruta === "/productos" && metodo === "POST") {
      const negado = exigir(actual, "ADMIN");
      if (negado) return negado;
      if (db.productos.some((x) => x.codigo === cuerpo.codigo))
        return error(409, `Ya existe un producto con el código ${cuerpo.codigo}.`);
      const nuevo = { ...cuerpo, id: siguienteId(db.productos) };
      db.productos.push(nuevo);
      return json(201, nuevo);
    }

    // ---------- Categorías ----------
    if (ruta === "/categorias" && metodo === "GET") return json(200, db.categorias);
    if ((m = ruta.match(/^\/categorias\/slug\/(.+)$/)) && metodo === "GET") {
      const c = db.categorias.find((x) => x.slug === decodeURIComponent(m[1]));
      return c ? json(200, c) : error(404, "Categoría no encontrada.");
    }
    if ((m = ruta.match(/^\/categorias\/(\d+)$/))) {
      const id = Number(m[1]);
      const c = db.categorias.find((x) => x.id === id);
      if (metodo === "GET") return c ? json(200, c) : error(404, "Categoría no encontrada.");
      const negado = exigir(actual, "ADMIN");
      if (negado) return negado;
      if (!c) return error(404, "Categoría no encontrada.");
      if (metodo === "DELETE") {
        if (db.productos.some((p) => p.categoriaId === id))
          return error(409, "No se puede eliminar una categoría que tiene productos.");
        db.categorias = db.categorias.filter((x) => x.id !== id);
        return json(204);
      }
      if (metodo === "PUT") {
        if (db.categorias.some((x) => x.id !== id && normalizar(x.nombre) === normalizar(cuerpo.nombre)))
          return error(409, "Ya existe una categoría con ese nombre.");
        const nuevoSlug = normalizar(cuerpo.nombre) === normalizar(c.nombre) ? c.slug : slug(cuerpo.nombre);
        Object.assign(c, cuerpo, { id, slug: nuevoSlug });
        return json(200, c);
      }
    }
    if (ruta === "/categorias" && metodo === "POST") {
      const negado = exigir(actual, "ADMIN");
      if (negado) return negado;
      if (db.categorias.some((x) => normalizar(x.nombre) === normalizar(cuerpo.nombre)))
        return error(409, "Ya existe una categoría con ese nombre.");
      const nueva = { ...cuerpo, id: siguienteId(db.categorias), slug: slug(cuerpo.nombre) };
      db.categorias.push(nueva);
      return json(201, nueva);
    }

    // ---------- Usuarios (solo ADMIN) ----------
    if (ruta === "/usuarios" || ruta.startsWith("/usuarios/")) {
      const negado = exigir(actual, "ADMIN");
      if (negado) return negado;
      if (ruta === "/usuarios" && metodo === "GET") {
        let lista = db.usuarios;
        if (query.get("tipo")) lista = lista.filter((u) => u.tipo === query.get("tipo"));
        return json(200, lista.map(sinPassword));
      }
      if (ruta === "/usuarios" && metodo === "POST") {
        if (db.usuarios.some((u) => u.correo === normalizar(cuerpo.correo)))
          return error(409, "Ya existe un usuario con ese correo.");
        if (db.usuarios.some((u) => u.run === cuerpo.run)) return error(409, "Ya existe un usuario con ese RUN.");
        const nuevo = { ...cuerpo, correo: normalizar(cuerpo.correo), id: siguienteId(db.usuarios) };
        db.usuarios.push(nuevo);
        return json(201, sinPassword(nuevo));
      }
      if ((m = ruta.match(/^\/usuarios\/(\d+)$/))) {
        const id = Number(m[1]);
        const u = db.usuarios.find((x) => x.id === id);
        if (!u) return error(404, "Usuario no encontrado.");
        if (metodo === "GET") return json(200, sinPassword(u));
        if (metodo === "DELETE") {
          if (id === actual.id) return error(409, "No puedes eliminar tu propia cuenta.");
          db.usuarios = db.usuarios.filter((x) => x.id !== id);
          return json(204);
        }
        if (metodo === "PUT") {
          if (db.usuarios.some((x) => x.id !== id && x.correo === normalizar(cuerpo.correo)))
            return error(409, "Ya existe un usuario con ese correo.");
          const { password, run: _run, ...cambios } = cuerpo;
          Object.assign(u, cambios, { correo: normalizar(cuerpo.correo) });
          if (password) u.password = password;
          return json(200, sinPassword(u));
        }
      }
    }

    // ---------- Ventas (boletas) ----------
    // La boleta sale con el "estado" del despacho, como la arma el servicio ventas.
    const conEstado = (b) => ({
      ...b,
      estado: db.despachos.find((d) => d.boletaId === b.id)?.estado ?? null,
    });
    const masNuevas = (lista) => [...lista].sort((a, b) => b.id - a.id).map(conEstado);

    if (ruta === "/boletas" && metodo === "POST") {
      if (!cuerpo.items?.length) return error(400, "Revisa los campos del formulario.", { items: "El carrito está vacío." });
      const lineas = [];
      for (const { id, cantidad } of cuerpo.items) {
        const p = db.productos.find((x) => x.id === id);
        if (!p) return error(409, "Un producto ya no está disponible.");
        if (!cuerpo.simularRechazo && p.stock < cantidad)
          return error(409, `Stock insuficiente de ${p.nombre} (disponible: ${p.stock}).`);
        const precio = p.precioOferta ?? p.precio; // el precio lo fija el catálogo
        lineas.push({ p, id, codigo: p.codigo, nombre: p.nombre, precio, cantidad, subtotal: precio * cantidad, imagen: p.imagen });
      }
      const pagada = !cuerpo.simularRechazo;
      if (pagada) lineas.forEach((l) => (l.p.stock -= l.cantidad)); // todo o nada
      const id = siguienteId(db.boletas);
      const boleta = {
        id,
        numero: `ORD-${String(id).padStart(6, "0")}`,
        fecha: new Date().toISOString(),
        usuarioId: actual?.id ?? null,
        cliente: cuerpo.cliente,
        direccion: cuerpo.direccion,
        entrega: cuerpo.entrega,
        items: lineas.map(({ p: _p, ...l }) => l),
        total: lineas.reduce((acc, l) => acc + l.subtotal, 0),
        estadoPago: pagada ? "pagado" : "rechazado",
      };
      db.boletas.push(boleta);
      if (pagada) {
        db.despachos.push({
          boletaId: id,
          numero: boleta.numero,
          entrega: boleta.entrega,
          zona: null,
          tiempo: null,
          estado: "recibido",
          historial: [{ estado: "recibido", fecha: boleta.fecha }],
        });
      }
      return json(201, conEstado(boleta));
    }
    if (ruta === "/boletas" && metodo === "GET") {
      const negado = exigir(actual, "ADMIN", "VENDEDOR");
      if (negado) return negado;
      let lista = db.boletas;
      if (query.get("estadoPago")) lista = lista.filter((b) => b.estadoPago === query.get("estadoPago"));
      if (query.get("usuarioId")) lista = lista.filter((b) => b.usuarioId === Number(query.get("usuarioId")));
      return json(200, masNuevas(lista));
    }
    if (ruta === "/boletas/mias" && metodo === "GET") {
      if (!actual) return error(401, "Debes iniciar sesión o renovar tu sesión.");
      return json(200, masNuevas(db.boletas.filter((b) => b.usuarioId === actual.id)));
    }
    if ((m = ruta.match(/^\/boletas\/(\d+)$/)) && metodo === "GET") {
      if (!actual) return error(401, "Debes iniciar sesión o renovar tu sesión.");
      const personal = ["ADMIN", "VENDEDOR"].includes(ROL[actual.tipo]);
      const b = db.boletas.find((x) => x.id === Number(m[1]) && (personal || x.usuarioId === actual.id));
      return b ? json(200, conEstado(b)) : error(404, "Boleta no encontrada.");
    }

    // ---------- Despacho ----------
    if ((m = ruta.match(/^\/despachos\/seguimiento\/(.+)$/)) && metodo === "GET") {
      const d = db.despachos.find((x) => x.numero === decodeURIComponent(m[1]).trim().toUpperCase());
      if (!d) return error(404, "Pedido no encontrado. Verifica el número (ej: ORD-000001).");
      const { boletaId: _b, ...publico } = d;
      return json(200, { ...publico, etapas: ESTADOS });
    }
    if ((m = ruta.match(/^\/despachos\/(\d+)\/estado$/)) && metodo === "PATCH") {
      const negado = exigir(actual, "ADMIN");
      if (negado) return negado;
      const d = db.despachos.find((x) => x.boletaId === Number(m[1]));
      if (!d) return error(404, "Despacho no encontrado.");
      if (d.estado === "entregado") return error(409, "El pedido ya fue entregado.");
      if (ESTADOS.indexOf(cuerpo.estado) <= ESTADOS.indexOf(d.estado))
        return error(409, `El pedido está "${d.estado}": solo puede avanzar a una etapa siguiente.`);
      d.estado = cuerpo.estado;
      d.historial.push({ estado: cuerpo.estado, fecha: new Date().toISOString() });
      return json(200, d);
    }
    if (ruta === "/zonas" && metodo === "GET") return json(200, db.zonas);

    return error(404, `Ruta no simulada: ${metodo} ${ruta}`);
  }

  // Si en la misma prueba se instala otra vez (por ejemplo, con otra sesión), se reemplaza.
  const espia = jasmine.isSpy(window.fetch) ? window.fetch : spyOn(window, "fetch");
  espia.and.callFake(async (url, opciones = {}) => {
    if (db.caido) throw new TypeError("Failed to fetch");
    const direccion = new URL(url, window.location.origin);
    const ruta = direccion.pathname.replace(/^\/api\/v1/, "");
    const metodo = opciones.method ?? "GET";
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : undefined;
    const cabeceras = opciones.headers ?? {};
    db.peticiones.push({ metodo, ruta, cuerpo, token: cabeceras.Authorization ?? null });
    return responder(metodo, ruta, direccion.searchParams, cuerpo, cabeceras);
  });

  return { db };
}

// Inicia sesión directamente en el cliente HTTP (para probar páginas sin AuthProvider).
export function conToken(tipo) {
  const id = USUARIOS_SEED.find((u) => u.correo === CORREOS[tipo]).id;
  establecerToken(`token-${id}`);
}
