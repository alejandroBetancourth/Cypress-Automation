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

Cypress.Commands.add('consulta', (radicado, numDocs, traza) => {
  cy.iframe().find('.ultima-menu li').contains('Consulta').click();
  cy.iframe().find('li[role="presentation"]').last().click();
  cy.iframe().find('#tipo_comunicacion').type("Externa Recibida");
  cy.iframe().find('.ui-autocomplete-list li').click();
  cy.then(() => {
    cy.iframe().find('#nro_radicado').type(`${radicado}`);
  });
  cy.iframe().find('button[label="Buscar"]').last().click();
  cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').first().click();
  if (numDocs) {
    cy.iframe().find('.ui-datatable-scrollable-body').should('have.length', 3);
    switch (Cypress.env("ambiente")) {
      case 'Igualdad':
        cy.iframe().find('.ui-datatable-scrollable-body').eq(1).find('tr').should('have.length', 1); //Historial de versiones
        cy.iframe().find('.ui-datatable-scrollable-body').last().find('tr').should('have.length', numDocs); //Anexos
        break;
      case 'UNP':
        cy.iframe().find('.ui-datatable-scrollable-body').eq(1).find('tr').should('have.length', 1); //Historial de versiones
        cy.iframe().find('.ui-datatable-scrollable-body').last().find('tr').should('have.length', numDocs - 1); //Anexos
        break;
    }
  }
  cy.iframe().find('p-header i').click();
  cy.iframe().find('.ng-trigger-overlayAnimation li').contains("Trazabilidad").click();
  cy.iframe().find('.ui-scrollpanel-wrapper .StepProgress').first().should('include.text', traza).click();
});

Cypress.Commands.add('seleccionarDependencia', (Igualdad, UNP) => {
  cy.iframe().find('form .dependencia-movil').should('exist').click();
  switch (Cypress.env('ambiente')) {
    case 'Igualdad':
      cy.iframe().find('form li').contains(Igualdad).click();
      break;
    case 'UNP':
      cy.iframe().find('form li').contains(UNP).click();
      break;
  }
})