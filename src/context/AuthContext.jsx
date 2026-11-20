// Sesión del usuario disponible en toda la app: useAuth()
// Desde la Eval 3 la sesión la entrega el backend (servicio usuarios):
//  - login() y registrar() llaman a la API y guardan el JWT en memoria.
//  - Al abrir o recargar la página se recupera la sesión con la cookie del refresh;
//    mientras tanto "cargandoSesion" es true (el panel espera antes de decidir si deja entrar).
import { createContext, useContext, useEffect, useState } from "react";
import { cuandoExpireLaSesion } from "../api/cliente.js";
import {
  cerrarSesion,
  iniciarSesion,
  registrarCliente,
  restaurarSesion,
} from "../data/usuarios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    let vigente = true;
    // Si el refresh vence mientras se navega, el cliente HTTP avisa y se cierra la sesión.
    cuandoExpireLaSesion(() => setUsuario(null));
    restaurarSesion().then((sesion) => {
      if (!vigente) return;
      setUsuario(sesion?.usuario ?? null);
      setCargandoSesion(false);
    });
    return () => {
      vigente = false;
    };
  }, []);

  // Devuelve true si las credenciales son correctas y false si no (401).
  // Otros errores (backend apagado) se lanzan para que el formulario los muestre.
  async function login(correo, password) {
    try {
      const sesion = await iniciarSesion(correo, password);
      setUsuario(sesion.usuario);
      return true;
    } catch (error) {
      if (error.status === 401) return false;
      throw error;
    }
  }

  async function logout() {
    try {
      await cerrarSesion();
    } catch {
      // Si el backend no responde, igual se cierra la sesión en este navegador.
    }
    setUsuario(null);
  }

  // Registra un cliente y deja la sesión iniciada. Lanza ApiError (409 si el correo o el RUN existen).
  async function registrar(datos) {
    const nuevo = await registrarCliente(datos);
    await login(datos.correo, datos.password);
    return nuevo;
  }

  const valor = {
    usuario,
    cargandoSesion,
    estaLogueado: usuario !== null,
    esAdmin: usuario?.tipo === "administrador",
    esVendedor: usuario?.tipo === "vendedor",
    login,
    logout,
    registrar,
    // Perfil: después de guardar, la sesión muestra los datos nuevos.
    actualizarUsuarioSesion: setUsuario,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
