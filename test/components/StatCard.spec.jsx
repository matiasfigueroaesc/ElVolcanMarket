import { render, screen } from "@testing-library/react";
import StatCard from "../../src/components/StatCard.jsx";

describe("<StatCard />", () => {
  it("muestra el título, valor y detalle recibidos por props", () => {
    render(<StatCard titulo="Productos" valor={14} detalle="Stock total: 900" />);
    expect(screen.getByRole("heading", { name: "Productos" })).toBeTruthy();
    expect(screen.getByTestId("stat-valor").textContent).toBe("14");
    expect(screen.getByText("Stock total: 900")).toBeTruthy();
  });

  it("aplica el color recibido y no muestra detalle si no viene", () => {
    const { container } = render(<StatCard titulo="Críticos" valor={1} color="danger" />);
    expect(container.querySelector(".card").classList).toContain("text-bg-danger");
    expect(container.querySelectorAll("p").length).toBe(1);
  });
});
