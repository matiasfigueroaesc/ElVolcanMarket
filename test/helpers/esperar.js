import { screen, waitFor } from "@testing-library/react";

// OJO: en Jasmine un expect() que falla NO lanza un error (solo lo anota), así que
// waitFor(() => expect(...)) no reintenta. Estas funciones lanzan un Error mientras
// la condición no se cumpla, y waitFor sigue intentando hasta que se cumpla (máx. 1 s).

// Espera hasta que condicion() devuelva true.
export async function esperarQue(condicion, descripcion = "la condición") {
  await waitFor(() => {
    if (!condicion()) throw new Error(`No se cumplió ${descripcion}`);
  });
}

// Espera a que desaparezca el "Cargando..." de EstadoCarga (la respuesta del backend llegó).
export async function esperarCarga() {
  await esperarQue(() => screen.queryByText("Cargando...") === null, "que termine la carga");
}
