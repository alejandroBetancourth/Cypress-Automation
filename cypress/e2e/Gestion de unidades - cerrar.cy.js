/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Gestión de unidades - cerrar', () => {
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

  it('Flujo número 24', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    // cy.get('app-menu a').contains('Administración').parent().click();

    cy.frameLoaded('#external-page');
    cy.wait(1000);

    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Talento Humano').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Gestión de Unidades Documentales').click();
    
    //Gestión de unidades documentales

    //Sin modificar fecha
    cy.iframe().find('p-radiobutton[label="Cerrar Unidad Documental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PQRSD').click();
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find('td').eq(3).find('span.ui-cell-data').then(($nombre) => {
      nombreUniDocumental1 = $nombre.text();
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find('td').last().click();
    cy.iframe().find('div[role="dialog"] span.ui-float-label').click();
    cy.iframe().find('div[role="dialog"] .ui-dropdown-items li').contains('TOP').click();
    cy.iframe().find('div[role="dialog"] .ui-dialog-footer button').contains('Guardar').click();
    cy.iframe().find('button.buttonHeaderTable').contains('Cerrar').click();
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('Aceptar').click();
    
    //Modificando la fecha
    
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find('td').eq(3).find('span.ui-cell-data').then(($nombre) => {
      nombreUniDocumental2 = $nombre.text();
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find('td').last().click();
    cy.iframe().find('div[role="dialog"] span.ui-float-label').click();
    cy.iframe().find('div[role="dialog"] .ui-dropdown-items li').contains('TOP').click();
    cy.iframe().find('div[role="dialog"] .ui-dialog-footer button').contains('Guardar').click();
    cy.iframe().find('input[autocomplete="off"]').click();
    cy.iframe().find('.ui-datepicker-header .ui-datepicker-next').click();
    cy.iframe().find('.ui-datepicker-calendar-container tr td').contains('10').click();
    cy.iframe().find('button.buttonMain[label="Agregar"]').click();
    cy.iframe().find('button.buttonHeaderTable').contains('Cerrar').click();
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('Aceptar').click();
    
    
    //Verificación de inactivo

    cy.iframe().find('li a').contains('Organización y Archivo').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PQRSD').click();
    cy.then(() => {
      cy.iframe().find('#nombre').type(`${nombreUniDocumental1}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ng-trigger .ui-dialog-titlebar').should('include.text', 'Resultados no encontrados');
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('No').click();
    
    cy.then(() => {
      cy.iframe().find('#nombre').clear().type(`${nombreUniDocumental2}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ng-trigger .ui-dialog-titlebar').should('include.text', 'Resultados no encontrados');
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('No').click();

    //Cerrar múltiples unidades
    cy.iframe().find('li a').contains('Gestión de Unidades Documentales').click();
    cy.iframe().find('p-radiobutton[label="Cerrar Unidad Documental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PQRSD').click();
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find('td').last().click();
    cy.iframe().find('div[role="dialog"] span.ui-float-label').click();
    cy.iframe().find('div[role="dialog"] .ui-dropdown-items li').contains('TOP').click();
    cy.iframe().find('div[role="dialog"] .ui-dialog-footer button').contains('Guardar').click();
    
    cy.iframe().find('.ui-datatable-scrollable-body tr').eq(1).find('td').last().click();
    cy.iframe().find('div[role="dialog"] span.ui-float-label').click();
    cy.iframe().find('div[role="dialog"] .ui-dropdown-items li').contains('TOP').click();
    cy.iframe().find('div[role="dialog"] .ui-dialog-footer button').contains('Guardar').click();

    cy.iframe().find('.ui-datatable-scrollable-body tr').eq(2).find('td').last().click();
    cy.iframe().find('div[role="dialog"] span.ui-float-label').click();
    cy.iframe().find('div[role="dialog"] .ui-dropdown-items li').contains('TOP').click();
    cy.iframe().find('div[role="dialog"] .ui-dialog-footer button').contains('Guardar').click();
    
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find('td').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').eq(1).find('td').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').eq(2).find('td').first().click();
    cy.iframe().find('button.buttonHeaderTable').contains('Cerrar').click();
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ng-trigger .ui-dialog-footer button').contains('Aceptar').click();

  });
});