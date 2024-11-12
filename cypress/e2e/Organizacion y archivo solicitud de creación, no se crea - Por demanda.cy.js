/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(300);

//pruebas05, se le quita rol archivista
//pruebas03, se le asigna rol archivista 
const env = Cypress.env(Cypress.env('ambiente'));

describe('Organizacion y archivo solicitud de creación, no se crea - Por demanda', () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas05', 'puebas.jbpm07', env);
  });

  it('Flujo número 14', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    
    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    seleccionarDependencia('Oficina Juridica', 'Oficina Asesora Juridica');
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();

    //Organización y archivo
    cy.iframe().find('p-radiobutton[value="solicitarUnidadDocumental"]').click();
    selUnidadDocumental();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Automático').click();
    const id = Date.now();
    cy.iframe().find('#nombre').type(`${id}`);
    cy.iframe().find('#descriptor1').type("Caso");
    cy.iframe().find('#observaciones').type("Se crea unidad");
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('.ui-card-content button.buttonMain').contains("Solicitar").click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////No crear/////
    cy.inicioSesion('pruebas03', 'puebas.jbpm08', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    seleccionarDependencia('Oficina Juridica', 'Oficina Asesora Juridica');
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`Crear Unidad Documental{enter}`);
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.iframe().find('.ui-datatable-tablewrapper .ui-datatable-data').click();
    cy.iframe().find('table p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('No crear').click();
    cy.iframe().find('p-dropdown[formcontrolname="motivo"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Ya existe').click();
    cy.iframe().find('#nt-observaciones').type("No se va a crear la unidad");
    cy.iframe().find('button.buttonMain').contains("Aceptar").click();
    cy.iframe().find('.ui-dialog-footer').contains('Si').click();
    cy.iframe().find('button.buttonMain').contains("Finalizar").click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Verificar observaciones/////
    cy.inicioSesion('pruebas05', 'puebas.jbpm07', env);
    cy.frameLoaded('#external-page');
    seleccionarDependencia('Oficina Juridica', 'Oficina Asesora Juridica');
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`Archivar Documento{enter}`);
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().find("td").eq(7).click();
    cy.iframe().find('div[role="dialog"] tbody tr').should('have.length', 2);
    cy.iframe().find('div[role="dialog"] a[role="button"]').click();
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
        cy.iframe().find('#tipoId').click();
        cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Informes de Gestión').click();
      break;
  }
}