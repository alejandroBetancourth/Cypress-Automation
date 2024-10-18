/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

//Agradecimiento
//ventanilla sede principal

describe('Correspondencia de entrada con regla Preclasificar-sustanciar', () => {
  let radicado;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas04');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
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
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Agradecimiento').click();
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
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Consultar radicado/////
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('.ultima-menu li').contains('Consulta').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('#tipo_comunicacion').type("Externa Recibida");
    cy.iframe().find('.ui-autocomplete-list li').click();
    cy.then(() => {
      cy.iframe().find('#nro_radicado').type(`${radicado}`);
    });
    cy.iframe().find('button[label="Buscar"]').last().click();
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').should('have.length', 3);
    cy.iframe().find('.ui-datatable-scrollable-body').last().find('tr').should('have.length', 3);
    cy.iframe().find('p-header i').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains("Trazabilidad").click();
    cy.iframe().find('.ui-scrollpanel-wrapper .StepProgress').first().should('include.text', 'Preclasificar').click();
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Preclasificar/////
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('textarea[formcontrolname="asunto"]').clear().type("Escenario preclasificar");
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombreApellidos').type('S');
    cy.iframe().find('.ui-autocomplete-items li').contains('SEBAS').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').contains('Finalizar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Sustanciar y asignar competencia/////
    cy.get('input[type="text"]').type('pruebas03');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('textarea[formcontrolname="asunto"]').clear().type("Escenario preclasificar - sustanciar");
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    
    //Datos destinatario
    cy.iframe().find('app-datos-destinatario-sustanciacion #sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
    cy.wait(300);
    cy.iframe().find('app-datos-destinatario-sustanciacion #dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Oficina Juridica').click();
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').contains('Finalizar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Asignar comunicaciones/////
    cy.get('input[type="text"]').type('pruebas02');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina Juridica').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicado}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr').should('exist');
    
  });
});