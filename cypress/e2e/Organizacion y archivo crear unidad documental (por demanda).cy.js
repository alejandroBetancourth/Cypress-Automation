/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(300);

//pruebas05, se le quita rol archivista
//pruebas03, se le asigna rol archivista 

describe('Organización y archivo crear unidad documental electrónica (por demanda)', () => {
  let radicado;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 14', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina Juridica').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();

    //Organización y archivo
    cy.iframe().find('p-radiobutton[value="solicitarUnidadDocumental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
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
    cy.get('input[type="text"]').type('pruebas03');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina Juridica').click();
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
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina Juridica').click();
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

    //Flujo segunda parte - solicitud de dos unidades, se crea únicamente una
    cy.iframe().find('ul li').contains('Vista Corporativa').click();
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Secretaria General').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();
    
    //Organización y archivo
    cy.iframe().find('p-radiobutton[value="solicitarUnidadDocumental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Manual').click();
    const id2 = Date.now();
    cy.iframe().find('#identificador').type(`${id2}`);
    cy.iframe().find('#nombre').type(`${id2}`);
    cy.iframe().find('#descriptor1').type("Caso");
    cy.iframe().find('#observaciones').type("Se solicita");
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Automático').click();
    const id3 = Date.now();
    cy.iframe().find('#nombre').type(`${id3}`);
    cy.iframe().find('#descriptor1').type("Caso");
    cy.iframe().find('#observaciones').type("Crear");
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('.ui-card-content button.buttonMain').contains("Solicitar").click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Crear unidad/////
    cy.get('input[type="text"]').type('pruebas02');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Secretaria General').click();
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
    cy.iframe().find('#fcu-observaciones').clear().type("Se crea la unidad");
    cy.iframe().find('button.buttonMain').contains("Crear").click();
    cy.iframe().find('.ui-dialog-footer').contains('Si').click();
    cy.iframe().find('button.buttonMain').contains("Finalizar").click();
    cy.iframe().find('#toast-container .toast-info').should('exist');

    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').last().click();
    cy.iframe().find('table p-dropdown').last().click();
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
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Secretaria General').click();
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`Archivar Documento{enter}`);
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').should('have.length', 2);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().find("td").eq(7).click();
    cy.iframe().find('div[role="dialog"] tbody tr').should('have.length', 2);
    cy.iframe().find('div[role="dialog"] a[role="button"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').last().find("td").eq(7).click();
    cy.iframe().find('div[role="dialog"] tbody tr').should('have.length', 2);
    cy.iframe().find('div[role="dialog"] a[role="button"]').click();

    //Flujo tercera parte - solicitud de una unidad, se crea 
    cy.iframe().find('ul li').contains('Vista Corporativa').click();
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();
    
    //Organización y archivo
    cy.iframe().find('p-radiobutton[value="solicitarUnidadDocumental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Automático').click();
    const id4 = Date.now();
    cy.iframe().find('#nombre').type(`${id4}`);
    cy.iframe().find('#observaciones').type("Se hace la solicitud");
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('.ui-card-content button.buttonMain').contains("Solicitar").click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Crear unidad/////
    cy.get('input[type="text"]').type('pruebas04');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
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
      cy.iframe().find('#fcu-nombre').clear().type(`Cambio de nombre-${id}`);
    })
    cy.iframe().find('#fcu-descriptor1').clear().type("Se cambió el nombre");
    cy.iframe().find('#fcu-observaciones').clear().type("Se crea la unidad");
    cy.iframe().find('button.buttonMain').contains("Crear").click();
    cy.iframe().find('.ui-dialog-footer').contains('Si').click();
    cy.iframe().find('button.buttonMain').contains("Finalizar").click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Verificar observaciones/////
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
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