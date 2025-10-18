import { render, screen } from "@testing-library/react";
import Hero from "../Hero";

describe("Hero component", () => {
  it("renderiza el título principal con el nombre", () => {
    render(<Hero />);
    expect(screen.getByText(/Christian Oscar Papa/i)).toBeInTheDocument();
  });

  it("renderiza el subtítulo descriptivo", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Desarrollador Frontend especializado en React/i)
    ).toBeInTheDocument();
  });

  it("renderiza los botones de acción", () => {
    render(<Hero />);
    expect(screen.getByText(/Ver proyectos/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });

  it("renderiza la imagen con el alt text correcto", () => {
    render(<Hero />);
    const image = screen.getByAltText(
      /Christian Oscar Papa - Frontend Developer/i
    );
    expect(image).toBeInTheDocument();
  });

  it("coincide con el snapshot", () => {
    const { container } = render(<Hero />);
    expect(container).toMatchSnapshot();
  });
});


