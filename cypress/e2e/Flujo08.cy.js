/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(300);

//Escenario correspondencia de salida
describe('Flujo completo', () => {
  let radicado;
  let radicadoInterno;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas04');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 8', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();
    
    //Organización y archivo
    cy.iframe().find('p-radiobutton[value="solicitarUnidadDocumental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Manual').click();
    const id = Date.now();
    cy.iframe().find('#identificador').type(`${id}`);
    cy.iframe().find('#nombre').type(`${id}`);
    cy.iframe().find('#descriptor1').type("Caso 1");
    cy.iframe().find('#descriptor2').type("Inicio");
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().click();
    cy.iframe().find('p-checkbox[formcontrolname="unidadFisica"]').click();
    cy.iframe().find('button.buttonMain').contains("Crear").click();
    cy.iframe().find('.ui-dialog-footer').contains('Si').click();
    cy.wait(2000);
    cy.iframe().find('.ui-datatable-scrollable-body').last().find('tr').first().find("td").first().click();
    cy.iframe().find('button.buttonMain').contains("Siguiente").click();
    cy.iframe().find('.buttonHeaderTable input[type="file"]').selectFile(['cypress/docs/prueba.pdf', 'cypress/docs/prueba.docx', 'cypress/docs/prueba2.pdf', 'cypress/docs/prueba2.docx'], { force: true });
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().find('td').eq(3).click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().find('td').eq(3).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Testigo').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(1).find('td').eq(3).click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(1).find('td').eq(3).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Solicitud').click();
    cy.iframe().find('.ui-dialog-footer button').contains('No').click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(2).find('td').eq(3).click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(2).find('td').eq(3).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Respuesta').click();
    cy.iframe().find('.ui-dialog-footer button').contains('No').click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(3).find('td').eq(3).click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(3).find('td').eq(3).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Anexos').click();
    cy.iframe().find('.ui-dialog-footer button').contains('No').click();
    cy.iframe().find('.ui-datatable-thead tr').first().find('th').first().click();
    cy.iframe().find('.ui-icon-folder').first().click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    cy.wait(3000);
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Recibir y Gestionar documentos/////
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Gestión de Unidades Documentales').click();
    cy.iframe().find('p-radiobutton[label="Cerrar Unidad Documental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
    cy.iframe().find('#nombre').type(`${id}`);
    cy.iframe().find('form button.buttonMain').contains('Buscar').click();
    cy.iframe().find('.ui-datatable-scrollable-body tbody tr').first().find('td').last().click();
    cy.iframe().find('#tipoCom').click();
    cy.iframe().find('.ui-dropdown-items li').first().click();
    cy.iframe().find('.ui-dialog-footer button').contains('Guardar').click();
    cy.iframe().find('p-header button.buttonMain').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    
    //23:44

    
  });
});