// Listado de usuarios del panel: /admin/usuarios
// Migrado de legacy-eval1/admin/users.html + assets/js/admin-users.js.
// Mismo patrón que pages/admin/Productos.jsx: la página tiene el estado y los datos,
// UserTable solo dibuja.
import { useState } from "react";
import { Link } from "react-router-dom";
import UserTable from "../../components/UserTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { TIPOS_USUARIO, eliminarUsuario, listarUsuarios } from "../../data/usuarios.js";
import { nombreTipo } from "../../utils/tiposUsuario.js";

export default function Usuarios() {
  // Admin con sesión iniciada (para no dejar que se elimine a sí mismo).
  const { usuario: actual } = useAuth();

  // Estado: la lista de usuarios (cambia al eliminar).
  const [usuarios, setUsuarios] = useState(() => listarUsuarios());
  // Estado: filtros.
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("");
  // Estado: mensaje de resultado { tipo: "success" | "danger", texto }.
  const [aviso, setAviso] = useState(null);

  // Valor derivado: se recalcula en cada render a partir de los filtros.
  const texto = busqueda.trim().toLowerCase();
  const filtrados = usuarios
    .filter((u) => tipo === "" || u.tipo === tipo)
    .filter((u) => `${u.run} ${u.nombre} ${u.apellidos} ${u.correo}`.toLowerCase().includes(texto));

  function handleEliminar(u) {
    // Segunda barrera (el botón ya viene deshabilitado en la tabla).
    if (u.id === actual?.id) {
      setAviso({ tipo: "danger", texto: "No puedes eliminar tu propia cuenta." });
      return;
    }
    if (!window.confirm(`¿Eliminar a "${u.nombre} ${u.apellidos}"? Esta acción no se puede deshacer.`)) return;
    eliminarUsuario(u.id); // 1) lo borra de los datos guardados
    setUsuarios(listarUsuarios()); // 2) actualiza el estado -> React vuelve a dibujar
    setAviso({ tipo: "success", texto: `Usuario "${u.nombre} ${u.apellidos}" eliminado.` });
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
          Nuevo usuario
        </Link>
      </div>

      {aviso && (
        <div className={`alert alert-${aviso.tipo}`} role="status">
          {aviso.texto}
        </div>
      )}

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <label htmlFor="buscar-usuario" className="visually-hidden">
            Buscar usuario
          </label>
          <input
            id="buscar-usuario"
            type="search"
            className="form-control"
            placeholder="Buscar por run, nombre o correo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="filtro-tipo" className="visually-hidden">
            Filtrar por tipo
          </label>
          <select id="filtro-tipo" className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            {TIPOS_USUARIO.map((t) => (
              <option key={t} value={t}>
                {nombreTipo(t)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="small">Mostrando {filtrados.length} usuario(s)</p>

      <UserTable usuarios={filtrados} onEliminar={handleEliminar} idActual={actual?.id ?? null} />
    </div>
  );
}
