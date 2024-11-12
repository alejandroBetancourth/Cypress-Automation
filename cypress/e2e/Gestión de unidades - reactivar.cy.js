/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente')) || Cypress.env('Igualdad');

describe('Gestión de unidades - reactivar', () => {
  let nombreUniDocumental1;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
  });

  it('Flujo número 25', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    // cy.get('app-menu a').contains('Administración').parent().click();

    cy.frameLoaded('#external-page');
    cy.wait(1000);

    seleccionarDependencia('Subd. Talento Humano', 'Subdireccion De Talento Humano');
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Gestión de Unidades Documentales').click();
    
    //Gestión de unidades documentales

    cy.iframe().find('p-radiobutton[label="Reactivar Unidad Documental"]').click();
    selUnidadDocumental();
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
    selUnidadDocumental();
    cy.then(() => {
      cy.iframe().find('#nombre').type(`${nombreUniDocumental1}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    

  });
});

function seleccionarDependencia(Igualdad, UNP) {
  cy.iframe().find('form .dependencia-movil').should('exist').click();
  switch (Cypress.env('ambiente')) {
    case 'Igualdad':
      cy.iframe().find('form li').contains(Igualdad).click();
      break;
    case 'UNP':
      cy.iframe().find('form li').contains(UNP).click();
      break;
  }
}

function selUnidadDocumental() {
  cy.iframe().find('#serie').click();
  
  switch (Cypress.env('ambiente')) {
    case 'Igualdad':
      cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
      break;
      case 'UNP':
        cy.iframe().find('.ng-trigger-overlayAnimation li').contains('INFORMES').click();
        cy.iframe().find('#subserie').click();
        cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Informes de Gestión').click();
      break;
  }
}