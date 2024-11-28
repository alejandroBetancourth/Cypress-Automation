/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env("ambiente"));

//Agradecimiento - Petición general y particular
//ventanilla sede principal - Correo electrónico

describe('Correspondencia de entrada con regla Preclasificar-sustanciar', () => {
  let radicado;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion("pruebas04", "puebas.jbpm05", env);
  });

  it('Flujo número 11', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    // cy.get('app-menu a').contains('Administración').parent().click();

    cy.frameLoaded('#external-page');
    cy.wait(1000);

    //Creación de la regla proceso de radicación 
    // cy.iframe().find('p-panel[header="Reglas proceso de radicación"] .pi-pencil').click();
    // cy.iframe().find('#dependenciaRadicadora').click();
    // cy.wait(300);
    // cy.iframe().find('.ui-dropdown-items li').contains('SUBD. ADMINISTRATIVA').click();
    // cy.wait(300);
    // cy.iframe().find('#tipoDocumento').click();
    // cy.wait(300);
    // cy.iframe().find('.ui-dropdown-items li').contains('Publicidad').click();
    // cy.wait(300);
    // cy.iframe().find('#canal').click();
    // cy.wait(300);
    // cy.iframe().find('.ui-dropdown-items li').contains('Sede Electrónica').click();
    // cy.wait(300);
    // cy.iframe().find('#preclasificacion').click();
    // cy.wait(300);
    // cy.iframe().find('.ui-dropdown-items li').contains('Sí').click();
    // cy.wait(300);
    // cy.iframe().find('#repartoPreclasificacion').click();
    // cy.wait(300);
    // cy.iframe().find('.ui-dropdown-items li').contains('PRECLASIFICAR 1').click();
    // cy.wait(300);
    // cy.iframe().find('#sustanciación').click();
    // cy.wait(300);
    // cy.iframe().find('.ui-dropdown-items li').contains('Sí').click();
    // cy.wait(300);
    // cy.iframe().find('#repartoSustanciacion').click();
    // cy.wait(300);
    // cy.iframe().find('.ui-dropdown-items li').contains('Sustanciación A').click();
    // cy.wait(300);
    // cy.iframe().find('button[label="Agregar"]').click();

    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#medioRecepcion').click();
    selecLi('Ventanilla Sede Principal', 'Correo Electrónico');
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    selecLi('Agradecimiento', 'Petición general y particular');
    cy.iframe().find('#numeroFolio input').type(4);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario Correspondencia de entrada con regla pre-clasificar-sustanciar");
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
    cy.iframe().find('.ui-dropdown-items li').contains('Anónimo').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Radicar').not('[disabled]').click();
    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicado = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Finalizar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicado}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf', 'cypress/docs/prueba.docx', 'cypress/docs/prueba2.docx'], { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');

    //Consultar radicado//
    cy.then(() => {
      cy.consulta(radicado, 3, 'Preclasificar');
    });
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Preclasificar/////
    cy.inicioSesion('pruebas03', 'puebas.jbpm05', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('textarea[formcontrolname="asunto"]').clear().type("Escenario preclasificar");
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombreApellidos').type('Cy');
    cy.iframe().find('.ui-autocomplete-items li').contains('CYPRESS').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').contains('Finalizar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('textarea[formcontrolname="asunto"]').clear().type("Escenario preclasificar - sustanciar");
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    
    //Datos destinatario
    cy.iframe().find('app-datos-destinatario-sustanciacion #sedeAdministrativa').click();
    cy.wait(300);
    selecLi('Despacho Ministra', 'Direccion General');
    cy.wait(300);
    cy.iframe().find('app-datos-destinatario-sustanciacion #dependenciaGrupo').click();
    cy.wait(300);
    selecLi('Oficina Juridica', 'Oficina Asesora Juridica');
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').contains('Finalizar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');

    //Consultar radicado//
    cy.then(() => {
      cy.consulta(radicado, 3, 'Asignar Comunicaciones');
    })
    
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