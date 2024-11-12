/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente'));

describe('Produccion Documental normal externa - con archivo.cy', () => {
  let radicadoS;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
  });


  it('Sin revisor', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencias[0]).click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();

    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').last().click();
    cy.iframe().find('button[label="Buscar"]').then(($button) => {
      if (cy.get($button).should('be.disabled')) {
        cy.iframe().find('#tipoId').click();
        cy.iframe().find('.ng-trigger-overlayAnimation li').first().click();
        cy.wrap($button).click();
      } else {
        cy.wrap($button).click();
      }
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-scrollable-body').eq(1).find('tr').first().click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.text-left.page-subtitle').should('exist');
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(1).find('td').first().click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(1).find('td').eq(4).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Respuesta').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ui-datatable-thead tr').first().find('th').first().click();
    cy.iframe().find('.ui-icon-folder').first().click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    
  });

});