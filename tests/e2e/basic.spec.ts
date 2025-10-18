import { expect, test } from "@playwright/test";

test.describe("CV App - Tests Básicos", () => {
  test("debe cargar la página principal", async ({ page }) => {
    await page.goto("/");

    // Verificar que la página carga
    await expect(page).toHaveTitle(/Christian Oscar Papa/i);

    // Verificar elementos principales
    await expect(
      page.getByRole("heading", { name: /Hola, soy Christian Oscar Papa/i })
    ).toBeVisible();
    await expect(
      page.getByText(
        "Desarrollador Frontend especializado en React, Next.js y TypeScript"
      )
    ).toBeVisible();
  });

  test("debe tener navegación funcional", async ({ page }) => {
    await page.goto("/");

    // Verificar que la navegación existe
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();

    // Verificar botones de navegación
    await expect(nav.getByRole("button", { name: "Sobre mí" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Proyectos" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Contacto" })).toBeVisible();
  });

  test("debe tener skip link para accesibilidad", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.getByText("Saltar al contenido principal");
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute("href", "#content");
  });

  test("debe mostrar imagen del perfil", async ({ page }) => {
    await page.goto("/");

    const profileImage = page.getByAltText(
      /Christian Oscar Papa - Frontend Developer/i
    );
    await expect(profileImage).toBeVisible();
  });

  test("debe tener botones de acción en el hero", async ({ page }) => {
    await page.goto("/");

    // Buscar en la primera sección (hero)
    const heroSection = page.locator("section").first();
    await expect(
      heroSection.getByRole("button", { name: "Ver proyectos" })
    ).toBeVisible();
    await expect(
      heroSection.getByRole("button", { name: "Contacto" })
    ).toBeVisible();
  });

  test("debe navegar a sección de contacto", async ({ page }) => {
    await page.goto("/");

    // Usar el botón de navegación específico
    const nav = page.getByRole("navigation");
    await nav.getByRole("button", { name: "Contacto" }).click();

    // Verificar que la sección de contacto es visible
    const contactoSection = page.locator("#contacto");
    await expect(contactoSection).toBeVisible();
  });

  test("debe mostrar enlaces de contacto", async ({ page }) => {
    await page.goto("/");

    // Navegar a contacto usando el botón de navegación
    const nav = page.getByRole("navigation");
    await nav.getByRole("button", { name: "Contacto" }).click();

    // Verificar enlaces de contacto (usar selectores más específicos)
    await expect(
      page.getByRole("link", { name: /Enviar email a Christian Papa/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: /Ver perfil de GitHub de Christian Papa/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: /Ver perfil de LinkedIn de Christian Papa/i,
      })
    ).toBeVisible();
  });

  test("debe funcionar en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Verificar que el botón de menú móvil existe
    const mobileMenuButton = page.getByRole("button", {
      name: /Abrir\/Cerrar menú móvil/i,
    });
    await expect(mobileMenuButton).toBeVisible();

    // Abrir menú móvil
    await mobileMenuButton.click();

    // Verificar que el menú se abre
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();
  });
});
