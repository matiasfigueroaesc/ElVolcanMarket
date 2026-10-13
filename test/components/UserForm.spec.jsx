import { fireEvent, render, screen } from "@testing-library/react";
import UserForm from "../../src/components/UserForm.jsx";

const CAMILA = {
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
  direccion: "Camino a Chillán Viejo 789",
};

const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } });

// Llena un usuario nuevo válido.
function llenarValido() {
  escribir("Run", "111111111");
  escribir("Nombre", "Ana");
  escribir("Apellidos", "Pérez");
  escribir("Correo", "ana.perez@gmail.com");
  escribir("Contraseña", "clave123");
  escribir("Tipo de usuario", "vendedor");
  escribir("Región", "nuble");
  escribir("Comuna", "chillan");
  escribir("Dirección", "Libertad 100");
}

// El formulario no usa router ni contexto: se monta solo.
describe("<UserForm />", () => {
  // Tipo: render
  it("muestra todos los campos y el texto de botón recibido", () => {
    render(<UserForm onSubmit={() => {}} textoBoton="Crear usuario" />);
    ["Run", "Nombre", "Apellidos", "Correo", "Contraseña", "Tipo de usuario", "Región", "Comuna", "Dirección"].forEach(
      (label) => expect(screen.getByLabelText(label)).toBeTruthy()
    );
    expect(screen.getByRole("button", { name: "Crear usuario" })).toBeTruthy();
  });

  // Tipo: props
  it("al editar carga los datos, deja el Run de solo lectura y no muestra la contraseña", () => {
    render(<UserForm inicial={CAMILA} editando onSubmit={() => {}} />);
    expect(screen.getByLabelText("Nombre").value).toBe("Camila");
    expect(screen.getByLabelText("Comuna").value).toBe("chillan-viejo");
    expect(screen.getByLabelText("Run").readOnly).toBeTrue();
    expect(screen.getByLabelText("Contraseña nueva (opcional)").value).toBe("");
  });

  // Tipo: props (renderizado condicional)
  it("con ocultarTipo no muestra el tipo de usuario", () => {
    render(<UserForm inicial={CAMILA} editando ocultarTipo onSubmit={() => {}} />);
    expect(screen.queryByLabelText("Tipo de usuario")).toBeNull();
  });

  // Tipo: estado (error en tiempo real)
  it("muestra el error del correo mientras se escribe", () => {
    render(<UserForm onSubmit={() => {}} />);
    escribir("Correo", "ana@hotmail.com");
    expect(screen.getByLabelText("Correo").className).toContain("is-invalid");
    expect(screen.getByText(/dominio válido/)).toBeTruthy();
    escribir("Correo", "ana@gmail.com");
    expect(screen.getByLabelText("Correo").className).not.toContain("is-invalid");
  });

  // Tipo: estado
  it("la comuna se habilita y se llena al elegir una región", () => {
    render(<UserForm onSubmit={() => {}} />);
    const comuna = screen.getByLabelText("Comuna");
    expect(comuna.disabled).toBeTrue();
    escribir("Región", "nuble");
    expect(comuna.disabled).toBeFalse();
    expect(comuna.querySelectorAll("option").length).toBeGreaterThan(1); // opción vacía + comunas
  });

  // Tipo: eventos
  it("envía los datos limpios si todo es válido", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<UserForm onSubmit={onSubmit} />);
    llenarValido();
    escribir("Nombre", "  Ana  ");
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(onSubmit).toHaveBeenCalledOnceWith({
      run: "111111111",
      nombre: "Ana",
      apellidos: "Pérez",
      correo: "ana.perez@gmail.com",
      telefono: null,
      fechaNacimiento: null,
      region: "nuble",
      comuna: "chillan",
      direccion: "Libertad 100",
      tipo: "vendedor",
      password: "clave123",
    });
  });

  // Tipo: eventos (renderizado condicional del error)
  it("no envía si hay errores y los muestra todos", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<UserForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("El RUN es obligatorio.")).toBeTruthy();
    expect(screen.getByText("La contraseña es obligatoria.")).toBeTruthy();
    expect(screen.getByText("Debes seleccionar un tipo de usuario.")).toBeTruthy();
  });

  // Tipo: eventos
  it("al editar con la contraseña en blanco no la envía", () => {
    const onSubmit = jasmine.createSpy("onSubmit");
    render(<UserForm inicial={CAMILA} editando onSubmit={onSubmit} />);
    escribir("Dirección", "Nueva dirección 456");
    fireEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));
    const datos = onSubmit.calls.mostRecent().args[0];
    expect(datos.direccion).toBe("Nueva dirección 456");
    expect("password" in datos).toBeFalse();
  });
});
