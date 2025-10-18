import { render, screen } from "@testing-library/react";
import NavBar from "../NavBar";

describe("NavBar component", () => {
  it("renderiza el skip link para accesibilidad", () => {
    render(<NavBar />);
    expect(
      screen.getByText(/Saltar al contenido principal/i)
    ).toBeInTheDocument();
  });

  it("renderiza los enlaces de navegación", () => {
    render(<NavBar />);
    expect(screen.getAllByText(/Sobre mí/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Proyectos/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Contacto/i).length).toBeGreaterThan(0);
  });

  it("renderiza el botón de menú móvil", () => {
    render(<NavBar />);
    const mobileMenuButton = screen.getByLabelText(/Abrir\/Cerrar menú móvil/i);
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it("tiene los atributos ARIA correctos en el botón móvil", () => {
    render(<NavBar />);
    const mobileMenuButton = screen.getByLabelText(/Abrir\/Cerrar menú móvil/i);
    expect(mobileMenuButton).toHaveAttribute("aria-expanded", "false");
    expect(mobileMenuButton).toHaveAttribute("aria-controls", "mobile-menu");
  });

  it("coincide con el snapshot", () => {
    const { container } = render(<NavBar />);
    expect(container).toMatchSnapshot();
  });
});
