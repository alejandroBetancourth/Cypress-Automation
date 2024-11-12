/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(300);

//pruebas05, se le quita rol archivista
//pruebas03, se le asigna rol archivista 
const env = Cypress.env(Cypress.env('ambiente'));

describe('Organizacion y archivo solicitud y creacion de una unidad - Por demanda', () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas05', 'puebas.jbpm07', env);
  });

  it('Flujo número 14', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    
    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    seleccionarDependencia('Despacho Ministra', 'Direccion General');
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();
    
    //Organización y archivo
    cy.iframe().find('p-radiobutton[value="solicitarUnidadDocumental"]').click();
    selUnidadDocumental();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Automático').click();
    const id = Date.now();
    cy.iframe().find('#nombre').type(`${id}`);
    cy.iframe().find('#observaciones').type("Se hace la solicitud");
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('.ui-card-content button.buttonMain').contains("Solicitar").click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Crear unidad/////
    cy.inicioSesion('pruebas02', 'puebas.jbpm06', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    seleccionarDependencia('Despacho Ministra', 'Direccion General');
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`Crear Unidad Documental{enter}`);
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().click();
    cy.iframe().find('table p-dropdown').first().click();
    cy.iframe().find('.ui-dropdown-items li').contains('Crear').click();
    cy.iframe().find('p-checkbox[formcontrolname="unidadFisica"]').click();
    cy.then(() => {
      cy.iframe().find('#fcu-nombre').clear().type(`CN-${id}`);
    })
    cy.iframe().find('#fcu-descriptor1').clear().type("Escenario creación");
    cy.iframe().find('#fcu-observaciones').clear().type("Se crea la unidad");
    cy.iframe().find('button.buttonMain').contains("Crear").click();
    cy.iframe().find('.ui-dialog-footer').contains('Si').click();
    cy.iframe().find('button.buttonMain').contains("Finalizar").click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Verificar observaciones/////
    cy.inicioSesion('pruebas05', 'puebas.jbpm07', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    seleccionarDependencia('Despacho Ministra', 'Direccion General');
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`Archivar Documento{enter}`);
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').should('have.length', 1);
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
        cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Informes').click();
      break;
  }
}