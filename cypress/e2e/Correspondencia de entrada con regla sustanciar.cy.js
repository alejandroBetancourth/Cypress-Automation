/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

//Agradecimiento
//ventanilla sede principal

describe('Correspondencia de entrada con regla sustanciar', () => {
  let radicadoEntrada;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas03');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 18', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    // cy.get('app-menu a').contains('Administración').parent().click();

    cy.frameLoaded('#external-page');
    cy.wait(1000);

    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#medioRecepcion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Correo Certificado').click();
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Reclamo').click();
    cy.iframe().find('p-dropdown[formcontrolname="empresaMensajeria"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('472').click();
    cy.iframe().find('#numeroGuia').type("1234");
    cy.iframe().find('#numeroFolio').type(4);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario flujo con sustanciar");
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
    cy.iframe().find('#nombreApellidos').type('S');
    cy.iframe().find('.ui-autocomplete-items li').contains('SEBAS').click();
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
    cy.get('input[type="text"]').type('pruebas04');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicadoEntrada}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf'], { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
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
      cy.iframe().find('#nro_radicado').type(`${radicadoEntrada}`);
    });
    cy.iframe().find('button[label="Buscar"]').last().click();
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').should('have.length', 3);
    cy.iframe().find('.ui-datatable-scrollable-body').last().find('tr').should('have.length', 2);
    cy.iframe().find('p-header i').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains("Trazabilidad").click();
    cy.iframe().find('.ui-scrollpanel-wrapper .StepProgress').first().should('include.text', 'Sustanciar y asignar competencia').click();
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Sustanciar y asignar/////
    cy.get('input[type="text"]').type('pruebas02');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('textarea[formcontrolname="asunto"]').type(" - Cambio");
    cy.iframe().find('#numeroGuia').clear().type(555);
    cy.iframe().find('li[role="presentation"]').eq(1).click();
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
    cy.iframe().find('form.ng-invalid #sedeAdministrativa').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
    cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Secretaria General').click();
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('.ui-card-content button.buttonMainNext').click(); //Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
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
      cy.iframe().find('#nro_radicado').type(`${radicadoEntrada}`);
    });
    cy.iframe().find('button[label="Buscar"]').last().click();
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').should('have.length', 3);
    cy.iframe().find('.ui-datatable-scrollable-body').last().find('tr').should('have.length', 2);
    cy.iframe().find('p-header i').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains("Trazabilidad").click();
    cy.iframe().find('.ui-scrollpanel-wrapper .StepProgress').first().should('include.text', 'Asignar Comunicaciones').click();
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
    cy.iframe().find('form li').contains('Secretaria General').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoEntrada}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    

    //Min 24:30
    
  });
});