/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env("ambiente"));

describe('Correspondencia de entrada con regla sustanciar', () => {
  let radicadoEntrada;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion("pruebas03", "puebas.jbpm07", env);
  });

  it('Flujo número 18', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    // cy.get('app-menu a').contains('Administración').parent().click();

    cy.frameLoaded('#external-page');
    cy.wait(1000);

    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#medioRecepcion').click();
    selecLi('Correo Certificado', 'Correo Electrónico');
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    selecLi('Reclamo', 'Solicitud entre entidades');
    switch (Cypress.env("ambiente")) {
      case 'Igualdad':
        cy.iframe().find('p-dropdown[formcontrolname="empresaMensajeria"]').click();
        cy.iframe().find('.ui-dropdown-items li').contains('472').click();
        cy.iframe().find('#numeroGuia').type("1234");
        break;
    }
    cy.iframe().find('#numeroFolio').type(4);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario flujo con regla sustanciar");
    cy.iframe().find('#soporteAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Electrónico').click();
    cy.iframe().find('#tipoAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Cd').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('#soporteAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Electrónico').click();
    cy.iframe().find('#tipoAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Expediente').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    //Datos solicitante
    cy.iframe().find('#tipoNotificacion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Correo').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombreApellidos').type('Cy');
    cy.iframe().find('.ui-autocomplete-items li').contains('CYPRESS').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Radicar').not('[disabled]').click();
    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoEntrada = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Adjuntar documento/////
    cy.inicioSesion('pruebas04', 'puebas.jbpm06', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicadoEntrada}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf', 'cypress/docs/prueba2.pdf'], { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.wait(100);

    //Consultar radicado//
    cy.then(() => {
      cy.consulta(radicadoEntrada, 2, 'Sustanciar y asignar competencia');
    });
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Sustanciar y asignar/////
    cy.inicioSesion('pruebas02', 'puebas.jbpm05', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('textarea[formcontrolname="asunto"]').type(" - Cambio");
    switch (Cypress.env("ambiente")) {
      case 'Igualdad':
        cy.iframe().find('#numeroGuia').clear().type(555);
        break;
    }
    cy.iframe().find('li[role="presentation"]').eq(1).click();

    //Datos remitente
    cy.iframe().find('button.buttonSecundary').contains("Limpiar").click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Anónimo').click();
    cy.iframe().find('button.buttonHeaderTable').click();
    cy.iframe().find('p-dropdown[formcontrolname="tipoContacto"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Otra').click();
    cy.iframe().find('.ui-accordion-header').first().click();
    cy.iframe().find('#correoEle').type("correo@prueba.com");
    cy.iframe().find('.my-panel button.buttonMain').contains("Guardar").click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();

    //Datos destinatario
    cy.iframe().find('form.ng-invalid #sedeAdministrativa').click();
    selecLi('Despacho Ministra', 'Direccion General');
    cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Secretaria General').click();
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('.ui-card-content button.buttonMainNext').click(); //Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.wait(100);

    //Consultar radicado//
    cy.then(() => {
      cy.consulta(radicadoEntrada, 2, 'Asignar Comunicaciones');
    });
    
  });
});

function selecLi(Igualdad, UNP) {
  switch (Cypress.env("ambiente")) {
    case 'Igualdad':
      cy.iframe().find('.ui-dropdown-items li').contains(Igualdad).click();
      break;
      case 'UNP':
      cy.iframe().find('.ui-dropdown-items li').contains(UNP).click();      
      break;
  }
}