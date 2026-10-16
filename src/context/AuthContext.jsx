// Sesión del usuario disponible en toda la app: useAuth()
import { createContext, useContext, useState } from "react";
import {
  autenticar,
  cerrarSesion,
  crearUsuario,
  guardarSesion,
  obtenerSesion,
} from "../data/usuarios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => obtenerSesion());

  // Devuelve true si las credenciales son correctas.
  function login(correo, password) {
    const encontrado = autenticar(correo, password);
    if (!encontrado) return false;
    setUsuario(guardarSesion(encontrado));
    return true;
  }

  function logout() {
    cerrarSesion();
    setUsuario(null);
  }

  // Registra un cliente nuevo y deja la sesión iniciada. Lanza Error si el correo existe.
  function registrar(datos) {
    const nuevo = crearUsuario({ ...datos, tipo: "cliente" });
    setUsuario(guardarSesion(nuevo));
    return nuevo;
  }

  const valor = {
    usuario,
    estaLogueado: usuario !== null,
    esAdmin: usuario?.tipo === "administrador",
    login,
    logout,
    registrar,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
