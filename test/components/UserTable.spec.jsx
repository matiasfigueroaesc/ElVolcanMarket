import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserTable from "../../src/components/UserTable.jsx";

const USUARIOS = [
  { id: 1, run: "191234561", nombre: "Javiera", apellidos: "Muñoz Soto", correo: "javiera.munoz@gmail.com", tipo: "administrador" },
  { id: 4, run: "111111111", nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com", tipo: "cliente" },
];

// UserTable usa <Link>, por eso se envuelve en MemoryRouter.
const mostrar = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("<UserTable />", () => {
  // Tipo: render (lista)
  it("muestra una fila por usuario", () => {
    mostrar(<UserTable usuarios={USUARIOS} onEliminar={() => {}} />);
    expect(screen.getAllByRole("row").length).toBe(USUARIOS.length + 1); // + encabezado
    expect(screen.getByText("javiera.munoz@gmail.com")).toBeTruthy();
    expect(screen.getByText("111111111")).toBeTruthy();
  });

  // Tipo: render
  it("muestra el tipo de usuario con su nombre y color", () => {
    mostrar(<UserTable usuarios={USUARIOS} onEliminar={() => {}} />);
    const fila = screen.getByText("Ana").closest("tr");
    const badge = within(fila).getByText("Cliente");
    expect(badge.className).toContain("badge");
    expect(badge.className).toContain("text-bg-secondary");
  });

  // Tipo: props
  it("los enlaces Ver y Editar apuntan al usuario de la fila", () => {
    mostrar(<UserTable usuarios={USUARIOS} onEliminar={() => {}} />);
    const fila = screen.getByText("Ana").closest("tr");
    expect(within(fila).getByRole("link", { name: "Ver" }).getAttribute("href")).toBe("/admin/usuarios/4");
    expect(within(fila).getByRole("link", { name: "Editar" }).getAttribute("href")).toBe("/admin/usuarios/4/editar");
  });

  // Tipo: eventos
  it("llama a onEliminar con el usuario clickeado", () => {
    const onEliminar = jasmine.createSpy("onEliminar");
    mostrar(<UserTable usuarios={USUARIOS} onEliminar={onEliminar} />);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Ana Pérez" }));
    expect(onEliminar).toHaveBeenCalledOnceWith(USUARIOS[1]);
  });

  // Tipo: props
  it("deshabilita el botón Eliminar del usuario con sesión iniciada", () => {
    const onEliminar = jasmine.createSpy("onEliminar");
    mostrar(<UserTable usuarios={USUARIOS} onEliminar={onEliminar} idActual={1} />);
    const propio = screen.getByRole("button", { name: "Eliminar Javiera Muñoz Soto" });
    expect(propio.disabled).toBeTrue();
    expect(screen.getByRole("button", { name: "Eliminar Ana Pérez" }).disabled).toBeFalse();
    fireEvent.click(propio);
    expect(onEliminar).not.toHaveBeenCalled();
  });

  // Tipo: render (condicional)
  it("muestra un aviso si no hay usuarios", () => {
    mostrar(<UserTable usuarios={[]} onEliminar={() => {}} />);
    expect(screen.getByText("No hay usuarios que mostrar.")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });
});
