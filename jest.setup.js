import "@testing-library/jest-dom";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ fill, priority, sizes, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    section: ({
      children,
      initial,
      animate,
      variants,
      whileInView,
      viewport,
      ...props
    }) => <section {...props}>{children}</section>,
    div: ({
      children,
      initial,
      animate,
      variants,
      transition,
      whileInView,
      viewport,
      ...props
    }) => <div {...props}>{children}</div>,
    h2: ({ children, variants, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, variants, ...props }) => <p {...props}>{children}</p>,
    article: ({ children, initial, animate, variants, viewport, ...props }) => (
      <article {...props}>{children}</article>
    ),
    a: ({ children, variants, ...props }) => <a {...props}>{children}</a>,
  },
  useAnimation: () => ({
    start: jest.fn(),
  }),
  useInView: () => true,
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();
