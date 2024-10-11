/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Gestión de unidades - reactivar', () => {
  let nombreUniDocumental1;
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

  it('Flujo número 25', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    // cy.get('app-menu a').contains('Administración').parent().click();

    cy.frameLoaded('#external-page');
    cy.wait(1000);

    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Talento Humano').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Gestión de Unidades Documentales').click();
    
    //Gestión de unidades documentales

    cy.iframe().find('p-radiobutton[label="Reactivar Unidad Documental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PQRSD').click();
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find('td').eq(3).find('span.ui-cell-data').then(($nombre) => {
      nombreUniDocumental1 = $nombre.text();
    });
    cy.iframe().find('button.buttonHeaderTable').contains('Reactivar').click();
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('Si').click();
    cy.then(() => {
      cy.iframe().find('#nombre').type(`${nombreUniDocumental1}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');

    //Verificar que se volvió a activar
    cy.iframe().find('p-radiobutton[label="Cerrar Unidad Documental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PQRSD').click();
    cy.then(() => {
      cy.iframe().find('#nombre').type(`${nombreUniDocumental1}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    

  });
});