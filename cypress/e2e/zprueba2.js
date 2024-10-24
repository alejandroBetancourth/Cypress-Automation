/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

//Agradecimiento
//ventanilla sede principal

describe('Gestión de unidades - cerrar', () => {
  let radicado;
  let nombreUniDocumental2;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 11', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    
    cy.get('a .letrasMinagricultura').should('be.visible');
    cy.wait(1000);
    cy.iframe().find('#dependences').select('121');
    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded('#main-content');
      cy.iframe().find('.ui-dialog button').click();
    });
    cy.iframe().find('ul li').contains('Inventarios').click();
    cy.iframe().find('li a').contains('Cargue de inventario AG').click();
    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded('#main-content');
      cy.iframe().find('#tipo_soportedep1').select('TIP_SOP3');
      cy.iframe().find('#serieSubserieSearch').select('2');
      // cy.then(() => {
      //   cy.iframe().find('#descripcionDocumento').type(`${id}`);
      // });
      cy.iframe().find('button[type="button"]').contains('BUSCAR').click();
    });
  });
});