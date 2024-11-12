/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente'));

describe('Organización y archivo crear unidad documental fisica', () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
  });

  it('Flujo número 21', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    // cy.get('app-menu a').contains('Administración').parent().click();
    
    cy.frameLoaded('#external-page');
    // cy.wait(1000);
    
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    
  
    cy.get('.ui-blockui').should('have.css', 'display', 'block');
    cy.get('.ui-blockui').should('have.css', 'display', 'none');
    cy.wait(1000);
    seleccionarDependencia();

    cy.iframe().find('ul li').contains('Almacenamiento').click();
    cy.iframe().find('li a').contains('Niveles almacenamiento AG').click();

    cy.wait(1000);
    cy.iframe().within(() => {
      
      cy.frameLoaded('#main-content');
      cy.iframe().find('select#idTipoBodega').select('62');
      cy.iframe().find('input#bodega_nombre').type(`${Date.now()}`);
      cy.iframe().find('input#bodega_descripcion').type('Escenario creación');
      cy.iframe().find('input#bodega_capacidad').type(5);
      cy.iframe().find('button[onclick="agregarBodega()"]').click();
      cy.iframe().find('.last').click();
      cy.iframe().find('input[type="radio"]').last().click();
      cy.iframe().find('button[type="button"]').contains('SIGUIENTE').click();

      //Pisos
      for (let i = 0; i < 5; i++) {
        cy.iframe().find('div#dContainer input[type="radio"]').eq(`${i}`).click();
        cy.iframe().find('div#dContainer #capacidadSubNivel_1').clear().type(5);
        cy.iframe().find('div#dContainer #idTipoSubNivel_1').select('3');
        cy.iframe().find('div#dContainer button[type="button"]').contains('ACTUALIZAR').click();
        cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button[type="button"]').click();
      }
      cy.iframe().find('div#dContainer input[type="radio"]').eq(0).click();
      cy.iframe().find('div#dContainer button[type="button"]').contains('SIGUIENTE').click();

      //Estantes
      for (let i = 0; i < 5; i++) {
        cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(`${i}`).click();
        cy.iframe().find('div#dContainer_1 #capacidadSubNivel_2').clear().type(3);
        cy.iframe().find('div#dContainer #idTipoSubNivel_2').select('4');
        cy.iframe().find('div#dContainer_1 button[type="button"]').contains('ACTUALIZAR').click();
        cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button[type="button"]').click();
      }
      cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(0).click();
      cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();

      //Entrepaños
      for (let i = 0; i < 3; i++) {
        cy.iframe().find('div#dContainer_2 input[type="radio"]').eq(`${i}`).click();
        cy.iframe().find('div#dContainer_2 #capacidadSubNivel_3').clear().type(3);
        cy.iframe().find('div#dContainer #idTipoSubNivel_3').select('5');
        cy.iframe().find('div#dContainer_2 button[type="button"]').contains('ACTUALIZAR').click();
        cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button[type="button"]').click();
      }
      cy.iframe().find('div#dContainer_2 input[type="radio"]').eq(0).click();
      cy.iframe().find('div#dContainer_2 button[type="button"]').contains('SIGUIENTE').click();
      
      //Cajas
      for (let i = 0; i < 3; i++) {
        cy.iframe().find('div#dContainer_3 input[type="radio"]').eq(`${i}`).click();
        cy.iframe().find('div#dContainer_3 #capacidadSubNivel_4').clear().type(5);
        cy.iframe().find('div#dContainer #idTipoSubNivel_4').select('6');
        cy.iframe().find('div#dContainer_3 button[type="button"]').contains('ACTUALIZAR').click();
        cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button[type="button"]').click();
      }
      cy.iframe().find('div#dContainer_3 input[type="radio"]').eq(0).click();
      cy.iframe().find('div#dContainer_3 button[type="button"]').contains('SIGUIENTE').click();
      
      //Carpetas
      for (let i = 0; i < 5; i++) {
        cy.iframe().find('div#dContainer_4 input[type="radio"]').eq(`${i}`).click();
        cy.iframe().find('div#dContainer_4 #capacidadSubNivel_5').clear().type(100);
        cy.iframe().find('div#dContainer_4 button[type="button"]').contains('ACTUALIZAR').click();
        cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button[type="button"]').click();
      }

      //Cajas - Caja2
      cy.iframe().find('div#dContainer_3 input[type="radio"]').eq(1).click();
      cy.iframe().find('div#dContainer_3 button[type="button"]').contains('SIGUIENTE').click();

      //Carpetas
      for (let i = 0; i < 5; i++) {
        cy.iframe().find('div#dContainer_4 input[type="radio"]').eq(`${i}`).click();
        cy.iframe().find('div#dContainer_4 #capacidadSubNivel_5').clear().type(100);
        cy.iframe().find('div#dContainer_4 button[type="button"]').contains('ACTUALIZAR').click();
        cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button[type="button"]').click();
      }

      //Cajas - Caja3
      cy.iframe().find('div#dContainer_3 input[type="radio"]').eq(2).click();
      cy.iframe().find('div#dContainer_3 button[type="button"]').contains('SIGUIENTE').click();

      //Carpetas
      for (let i = 0; i < 5; i++) {
        cy.iframe().find('div#dContainer_4 input[type="radio"]').eq(`${i}`).click();
        cy.iframe().find('div#dContainer_4 #capacidadSubNivel_5').clear().type(100);
        cy.iframe().find('div#dContainer_4 button[type="button"]').contains('ACTUALIZAR').click();
        cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button[type="button"]').click();
      }
    });
    //Minuto 9:15

  });
});

function seleccionarDependencia() {
  switch (Cypress.env('ambiente')) {
    case 'Igualdad':
      cy.iframe().find('#dependences').select('121');
      break;
    case 'UNP':
      cy.iframe().find('#dependences').select('2000');
      break;
  }
  cy.wait(500)
}