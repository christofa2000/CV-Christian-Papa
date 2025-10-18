import { render, screen } from "@testing-library/react";
import ProjectCard from "../ProjectCard";

const mockProject = {
  id: "test-project",
  title: "Proyecto de Prueba",
  description: "Una descripción de prueba para el proyecto",
  image: "/placeholder-project-1.jpg",
  demoUrl: "https://demo.example.com",
  repoUrl: "https://github.com/example/repo",
  technologies: ["React", "TypeScript", "Next.js"],
};

describe("ProjectCard component", () => {
  it("renderiza el título del proyecto", () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText(/Proyecto de Prueba/i)).toBeInTheDocument();
  });

  it("renderiza la descripción del proyecto", () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(
      screen.getByText(/Una descripción de prueba para el proyecto/i)
    ).toBeInTheDocument();
  });

  it("renderiza las tecnologías como tags", () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText(/React/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
    expect(screen.getByText(/Next.js/i)).toBeInTheDocument();
  });

  it("renderiza los botones de demo y código", () => {
    render(<ProjectCard project={mockProject} index={0} />);
    expect(screen.getByText(/Ver Demo/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
  });

  it("renderiza la imagen con el alt text correcto", () => {
    render(<ProjectCard project={mockProject} index={0} />);
    const image = screen.getByAltText(
      /Screenshot del proyecto Proyecto de Prueba/i
    );
    expect(image).toBeInTheDocument();
  });

  it("tiene los enlaces con los hrefs correctos", () => {
    render(<ProjectCard project={mockProject} index={0} />);
    const demoLink = screen.getByText(/Ver Demo/i).closest("a");
    const codeLink = screen.getByText(/Código/i).closest("a");

    expect(demoLink).toHaveAttribute("href", "https://demo.example.com");
    expect(codeLink).toHaveAttribute("href", "https://github.com/example/repo");
  });

  it("coincide con el snapshot", () => {
    const { container } = render(
      <ProjectCard project={mockProject} index={0} />
    );
    expect(container).toMatchSnapshot();
  });
});


