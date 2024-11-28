/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente')) || Cypress.env('Igualdad');

describe('Recibir y gestionar - reasignar', () => {
  let radicado;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas04', 'puebas.jbpm06', env);

  });

  it('Flujo número 10', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Denuncia').click();
    cy.iframe().find('#numeroFolio input').type(4);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario Recibir y gestionar - reasignar");
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
    selecLi('Despacho Ministra', 'Direccion General');
    cy.wait(300);
    cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Oficina De Control Interno').click();
    cy.wait(300);
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
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
    cy.wait(900);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Asignar comunicaciones/////
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina De Control Interno').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicado}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.ui-multiselect-label').click();
    asignar('pruebas03', 'puebas.jbpm08');
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Asignar').click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Recibir y Gestionar documentos/////
    cy.inicioSesion('pruebas03', 'puebas.jbpm08', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina De Control Interno').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Reasignar').click();
    cy.iframe().find('div[role="dialog"] form #observacion').type("Se reasigna, intento 1");
    cy.iframe().find('div[role="dialog"] form #funcionarioDependencia').click();
    selecLi('pruebas05', 'puebas.jbpm07');
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Agregar").click();
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Aceptar").click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Recibir y Gestionar documentos/////
    cy.inicioSesion('pruebas05', 'puebas.jbpm07', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina De Control Interno').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').eq(3).click();
    cy.iframe().find('#observacion').type("Se recibe la comunicación");
    cy.iframe().find('form[name="formDefault"] button.buttonMain').contains("Agregar").click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Reasignar').click();
    cy.iframe().find('div[role="dialog"] form #observacion').type("Se reasigna, intento 2");
    cy.iframe().find('div[role="dialog"] form #funcionarioDependencia').click();
    selecLi('Pruebas01', 'JBPM 05');
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Agregar").click();
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Aceptar").click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Recibir y Gestionar documentos/////
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina De Control Interno').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Reasignar').click();
    cy.iframe().find('div[role="dialog"] form #observacion').type("Se reasigna, intento 3");
    cy.iframe().find('div[role="dialog"] form #funcionarioDependencia').click();
    selecLi('pruebas02', 'puebas.jbpm06');
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Agregar").click();
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Aceptar").click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Recibir y Gestionar documentos/////
    cy.inicioSesion('pruebas02', 'puebas.jbpm06', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina De Control Interno').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Reasignar').click();
    cy.iframe().find('#toast-container .toast-info').should('exist');
    
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

function asignar(Igualdad, UNP) {
  switch (Cypress.env("ambiente")) {
    case 'Igualdad':
      cy.iframe().find('.ui-multiselect-items li').contains(Igualdad).click();
      break;
    case 'UNP':
      cy.iframe().find('.ui-multiselect-items li').contains(UNP).click();
      break;
  }
}