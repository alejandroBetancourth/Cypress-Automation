/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente')) || Cypress.env('Igualdad');

let radicadoE;
describe('Correspondencia de entrada - sin regla', () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas02', 'puebas.jbpm06', env);
  });

  it('Flujo número 2', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    // Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Consulta').click();
    cy.iframe().find('#numeroFolio input').type(4);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario sin regla");
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
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();

    //Dependencia destino
    cy.iframe().find('form.ng-invalid #sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Nivel Central').click();
    cy.wait(300);
    cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').first().click();
    cy.wait(300);
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Radicar').not('[disabled]').click();
    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoE = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Finalizar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicadoE}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf', 'cypress/docs/prueba2.pdf'], { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');

    //Consultar radicado//
    cy.then(() => {
      cy.consulta(radicadoE, 2, 'Asignar Comunicaciones');
    })
  });
});