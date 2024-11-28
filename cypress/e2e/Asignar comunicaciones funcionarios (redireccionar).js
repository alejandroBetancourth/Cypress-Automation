/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

function radicarPrincipal(jerarquica, productora, copJerarquica, copProductora) {
  //Datos generales
  cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
  cy.iframe().find('#tipologiaDocumental').contains('empty').click();
  cy.iframe().find('.ui-dropdown-items li').contains('Reclamo').click();
  cy.iframe().find('#numeroFolio input').type(5);
  cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario redireccionar");
  cy.iframe().find('#soporteAnexos').click();
  cy.iframe().find('.ui-dropdown-items li').contains('Físico').click();
  cy.iframe().find('#tipoAnexos').click();
  cy.iframe().find('.ui-dropdown-items li').contains('Cd').click();
  cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
  cy.iframe().find('#soporteAnexos').click();
  cy.iframe().find('.ui-dropdown-items li').contains('Electrónico').click();
  cy.iframe().find('#tipoAnexos').click();
  cy.iframe().find('.ui-dropdown-items li').contains('Cd').click();
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
  cy.iframe().find('.ui-dropdown-items li').contains(`${jerarquica}`).click();
  cy.wait(300);
  cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
  cy.wait(300);
  cy.iframe().find('.ui-dropdown-items li').contains(`${productora}`).click();
  cy.wait(300);
  cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
  if(copJerarquica && copProductora) {
    cy.iframe().find('#tipoDestinatario').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Con Copia').click();
    cy.wait(300);
    cy.iframe().find('app-datos-destinatario #sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains(`${copJerarquica}`).click();
    cy.wait(300);
    cy.iframe().find('app-datos-destinatario #dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains(`${copProductora}`).click();
    cy.wait(300);
    cy.iframe().find('app-datos-destinatario button.buttonMain').contains('Agregar').not('[disabled]').click();
  }
  cy.iframe().find('button.buttonMain .ui-clickable').contains('Radicar').not('[disabled]').click();
}

function redireccionar(radicado) {
  cy.iframe().find('form .dependencia-movil').should('exist').click();
  cy.iframe().find('form li').contains('Subd. Talento').click();
  cy.wait(500);
  cy.then(() => {
    cy.iframe().find('#numeroRadicado').clear().type(`${radicado}`);
  });
  cy.iframe().find('button[label="Buscar"]').click();
  cy.wait(500);
  cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
  cy.iframe().find('a[role="button"]').click();
  cy.iframe().find('.iconsMenu').click();
  cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
  cy.iframe().find('#justificacion').type("Prueba 1");
  cy.iframe().find('#sedeAdministrativa').click();
  cy.wait(300);
  cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
  cy.wait(300);
  cy.iframe().find('#dependenciaGrupo').click();
  cy.wait(300);
  cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO DEL VICEMINISTERIO DE LA JUVENTUD').click();
  cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
  cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
  cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
}


describe('Asignar comunicaciones funcionarios (Redireccionar)', () => {
  let radicado1;
  let radicado2;
  let radicado3;
  let radicado4;
  let radicado5;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 13', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd Administrativa').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Radicado número 1
    radicarPrincipal('Nivel Central', 'Despacho Ministra');

    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicado1 = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Continuar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicado1}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.wait(1000);
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Radicado número 2
    radicarPrincipal('Secretaria General', 'Subd. Talento Humano');

    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicado2 = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Continuar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicado2}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba2.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.wait(1000);
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Radicado número 3
    radicarPrincipal('Despacho Ministra', 'Secretaria General');

    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicado3 = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Continuar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicado3}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba3.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.wait(1000);
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Radicado número 4
    radicarPrincipal('Despacho Ministra', 'Oficina De Control Interno', 'Nivel Central', 'Despacho Ministra');

    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicado4 = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Continuar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicado4}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.wait(1000);
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Radicado número 5
    radicarPrincipal('Despacho Ministra', 'Oficina Asesora De Comunicaciones', 'Secretaria General', 'Subd. Talento Humano');

    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicado5 = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Continuar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicado5}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba2.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.wait(1000);
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Redireccionamiento radicado 1/////
    cy.get('input[type="text"]').type('pruebas02');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicado1}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("Prueba 1");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO DEL VICEMINISTERIO DE LA JUVENTUD').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    /////Redireccionamiento radicado 2/////
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Talento').click();
    cy.wait(500);
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').clear().type(`${radicado2}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("Prueba 1");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO DEL VICEMINISTERIO DE LA JUVENTUD').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    /////Redireccionamiento radicado 3/////
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Secretaria General').click();
    cy.wait(500);
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').clear().type(`${radicado3}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("Prueba 1");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO DEL VICEMINISTERIO DE LA JUVENTUD').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    /////Redireccionamiento radicado 4/////
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina De Control Interno').click();
    cy.wait(500);
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').clear().type(`${radicado4}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("Prueba 1");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SECRETARIA GENERAL').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SUBD. ADMINISTRATIVA').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    //Cambio de dependencia a la redireccionada
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("Prueba 2");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('OFICINA DE CONTROL INTERNO').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('#tipoComunicacion').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Con Copia').click();
    cy.wait(300);
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SECRETARIA GENERAL').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SUBD. DE CONTRATACION').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    //Cambio de dependencia
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('div[role="dialog"] .ui-datatable-scrollable-body').find('tr').first().find("td").eq(4).click();
    cy.iframe().find('#justificacion').type("Prueba 3");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO DEL VICEMINISTERIO DE LA JUVENTUD').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    /////Redireccionamiento radicado 5/////
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina Asesora De Comunicaciones').click();
    cy.wait(500);
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').clear().type(`${radicado5}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("Prueba 1");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SECRETARIA GENERAL').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SUBD. ADMINISTRATIVA').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    //Cambio de dependencia a la redireccionada
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("Prueba 2");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('OFICINA ASESORA DE COMUNICACIONES').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('#tipoComunicacion').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Con Copia').click();
    cy.wait(300);
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SECRETARIA GENERAL').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SUBD. DE CONTRATACION').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    //Cambio de dependencia
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Talento').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('div[role="dialog"] .ui-datatable-scrollable-body').find('tr').first().find("td").eq(4).click();
    cy.iframe().find('#justificacion').type("Prueba 3");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO DEL VICEMINISTERIO DE LA JUVENTUD').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

    //Cambio de dependencia
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Del Viceministerio De La Juventud').click();
    cy.wait(500);
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').clear();
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-widget-header.ui-datatable-scrollable-header th').first().click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#toast-container .toast-warning').should('exist');
    cy.then(() => {
      cy.iframe().find('.ui-datatable-data tr').contains(`${radicado4}`).closest('tr').find('td').first().click();
      cy.iframe().find('.ui-datatable-data tr').contains(`${radicado5}`).closest('tr').find('td').first().click();
    });
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("Prueba 1");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO DEL VICEMINISTERIO DE LAS DIVERSIDADES').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();

  });
});

//Es necesario ajustar el fallo al final