import { render, screen } from "@testing-library/react";
import Contact from "../Contact";

describe("Contact component", () => {
  it("renderiza el título de la sección", () => {
    render(<Contact />);
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });

  it("renderiza el subtítulo descriptivo", () => {
    render(<Contact />);
    expect(
      screen.getByText(
        /¿Tienes un proyecto en mente\? Me encantaría escuchar sobre él/i
      )
    ).toBeInTheDocument();
  });

  it("renderiza los enlaces de contacto", () => {
    render(<Contact />);
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
  });

  it("renderiza la información de disponibilidad", () => {
    render(<Contact />);
    expect(screen.getByText(/Disponibilidad/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Actualmente disponible para proyectos freelance/i)
    ).toBeInTheDocument();
  });

  it("tiene los enlaces con los hrefs correctos", () => {
    render(<Contact />);
    const emailLink = screen.getByText(/Email/i).closest("a");
    const githubLink = screen.getByText(/GitHub/i).closest("a");
    const linkedinLink = screen.getByText(/LinkedIn/i).closest("a");

    expect(emailLink).toHaveAttribute("href", "christofa2000@gmail.com");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/christofa2000"
    );
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/christian-oscar-papa?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    );
  });

  it("tiene los atributos ARIA correctos en los enlaces", () => {
    render(<Contact />);
    const emailLink = screen.getByText(/Email/i).closest("a");
    const githubLink = screen.getByText(/GitHub/i).closest("a");
    const linkedinLink = screen.getByText(/LinkedIn/i).closest("a");

    expect(emailLink).toHaveAttribute(
      "aria-label",
      "Enviar email a Christian Papa"
    );
    expect(githubLink).toHaveAttribute(
      "aria-label",
      "Ver perfil de GitHub de Christian Papa"
    );
    expect(linkedinLink).toHaveAttribute(
      "aria-label",
      "Ver perfil de LinkedIn de Christian Papa"
    );
  });

  it("coincide con el snapshot", () => {
    const { container } = render(<Contact />);
    expect(container).toMatchSnapshot();
  });
});
