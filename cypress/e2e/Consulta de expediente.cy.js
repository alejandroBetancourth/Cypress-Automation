/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Consulta de expediente', () => {
  let radicadoEntrada;
  let uniDocumental;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 20', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.frameLoaded('#external-page');
    cy.wait(1000);

    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('ul li').contains('Consulta').click();
    
    //Consulta
    cy.iframe().find('#depP input').type('SUBD. ADMINISTRATIVA');
    cy.iframe().find('.ui-autocomplete-panel li').first().click();
    
    cy.iframe().find('#sCode input').type('PQRSD');
    cy.iframe().find('.ui-autocomplete-panel li').first().click();

    cy.iframe().find('button.buttonMain[label="Buscar"]').first().should('not.be.disabled');
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
  });
});