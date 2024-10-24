// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "cypress-iframe";

Cypress.Commands.add("ifr", () => {
  return cy
    .get("#external-page")
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .find("#main-content")
    .its("0.contentDocument.body")
    .then(cy.wrap);
});

Cypress.Commands.add("inicioSesion", (Igualdad, UNP, env) => {
  cy.visit(env.url);

  let datos;
  cy.then(() => {
    switch (Cypress.env("ambiente")) {
      case "Igualdad":
        datos = env.usuarios.filter(({ usuario }) => usuario == Igualdad)[0];
        break;
      case "UNP":
        datos = env.usuarios.filter(({ usuario }) => usuario == UNP)[0];
        break;
    }
    const { usuario, contraseña } = datos;

    cy.get('input[type="text"]').type(usuario);
    cy.get('input[type="password"]').type(contraseña);
  });
  cy.get("button").click();
});
