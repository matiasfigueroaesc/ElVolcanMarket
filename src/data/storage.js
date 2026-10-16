// ============================================
// El Volcán Market — storage.js
// "Base de datos" simulada sobre localStorage.
//
// crearRepositorio(clave, seed) devuelve un objeto con las
// operaciones CRUD (listar, obtenerPorId, crear, actualizar,
// eliminar) para UNA colección. Cada entidad (productos,
// categorías, usuarios, órdenes) crea su propio repositorio
// con su clave de localStorage y sus datos de fábrica.
//
// Los componentes NUNCA deben usar localStorage directamente:
// siempre pasan por estos módulos. Así, en la Evaluación 3
// basta con cambiar el interior de estas funciones por
// llamadas a la API del backend.
// ============================================

export function leerJSON(clave, valorPorDefecto) {
  try {
    const data = localStorage.getItem(clave);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error(`storage.js: dato corrupto en "${clave}", se reinicia.`, e);
  }
  return valorPorDefecto;
}

export function escribirJSON(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function crearRepositorio(clave, seed = []) {
  function cargar() {
    const lista = leerJSON(clave, null);
    if (Array.isArray(lista)) return lista;
    // Primera carga (o dato corrupto): se usan los datos de fábrica.
    const inicial = structuredClone(seed);
    escribirJSON(clave, inicial);
    return inicial;
  }

  function guardar(lista) {
    escribirJSON(clave, lista);
  }

  function siguienteId(lista) {
    return lista.length ? Math.max(...lista.map((item) => item.id)) + 1 : 1;
  }

  return {
    listar() {
      return cargar();
    },

    obtenerPorId(id) {
      return cargar().find((item) => item.id === Number(id)) ?? null;
    },

    crear(datos) {
      const lista = cargar();
      const nuevo = { ...datos, id: siguienteId(lista) };
      lista.push(nuevo);
      guardar(lista);
      return nuevo;
    },

    actualizar(id, cambios) {
      const lista = cargar();
      const indice = lista.findIndex((item) => item.id === Number(id));
      if (indice === -1) return null;
      lista[indice] = { ...lista[indice], ...cambios, id: lista[indice].id };
      guardar(lista);
      return lista[indice];
    },

    eliminar(id) {
      const lista = cargar();
      const filtrada = lista.filter((item) => item.id !== Number(id));
      if (filtrada.length === lista.length) return false;
      guardar(filtrada);
      return true;
    },

    // Vuelve a los datos de fábrica (útil en pruebas y para "resetear la demo").
    reiniciar() {
      const inicial = structuredClone(seed);
      guardar(inicial);
      return inicial;
    },
  };
}
