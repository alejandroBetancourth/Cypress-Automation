/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente')) || Cypress.env('Igualdad');

describe('Recibir y gestionar documento externo', () => {
  let radicado;
  let radicadoInterno;
  let radicadoExterno;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas02', 'puebas.jbpm06', env);
  });

  it('Flujo número 9', { defaultCommandTimeout: 40000 }, () => {
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
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario respuesta documento externo (oficio)");
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
    selecLi('Despacho Ministra', 'Direccion General');
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
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Asignar comunicaciones/////
    cy.inicioSesion('pruebas03', 'puebas.jbpm08', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.seleccionarDependencia('Despacho Ministra', 'Direccion General');
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
    asignar('pruebas05', 'puebas.jbpm07');
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Asignar').click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Recibir y Gestionar documentos/////
    cy.inicioSesion('pruebas05', 'puebas.jbpm07', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.seleccionarDependencia('Despacho Ministra', 'Direccion General');
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Producir Documento Respuesta').click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar

    //Gestión producción múltiples documentos
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('#tipoPlantilla').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('button.buttonMainNext').click();
    cy.iframe().find('#subject').type("Escenario respuesta documento externo (oficio)");
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('p-checkbox').contains('Electrónica Certificada').click();
    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Principal').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombre').type('Cy');
    cy.iframe().find('.ui-autocomplete-panel').contains('CYPRESS').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain').contains('Aceptar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('#sede').click();
    selecLi('Despacho Ministra', 'Direccion General');
    cy.wait(300);
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Secretaria').click();
    cy.wait(300);
    cy.iframe().find('#rol').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Revisor').click();
    cy.wait(300);
    cy.iframe().find('#funcionario').click();
    selecLi('Pruebas03', 'Puebas.jbpm08');
    cy.iframe().find('button.buttonMain').eq(2).contains('Agregar').click();
    cy.iframe().find('#sede').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Nivel').click();
    cy.wait(300);
    cy.iframe().find('#dependencia').click();
    selecLi('Despacho Ministra', 'Direccion General');
    cy.wait(300);
    cy.iframe().find('#rol').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Aprobador').click();
    cy.wait(300);
    cy.iframe().find('#funcionario').click();
    selecLi('Pruebas01', 'Jbpm 05');
    cy.iframe().find('button.buttonMain').eq(2).contains('Agregar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.fa-plus').click();
    cy.iframe().find('.iconSave').click();
    cy.iframe().find('p-confirmdialog button').contains('Aceptar').click();
    cy.iframe().find('input[name="soporte"]').eq(1).click();
    cy.iframe().find('#tipoAnexo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Expediente').click();
    cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('button.buttonMainNext').contains('Continuar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Revisar documento/////
    cy.inicioSesion('pruebas03', 'puebas.jbpm08', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Secretaria General').click();
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('.buttonMainNext').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Aprobar/////    
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.seleccionarDependencia('Despacho Ministra', 'Direccion General');
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
    cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.iframe().find('div').contains('N°. Radicado :').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoInterno = uniDocumental.split(':')[1]?.trim() || '';
    });
    // cy.then(() => {
    //   cy.iframe().find('#filter').type(`${radicadoInterno}{enter}`);
    // });
    // cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    // cy.wait(5000);
    cy.iframe().find('app-root').then($body => {
      if ($body.find('a.ui-dialog-titlebar-icon').length) {
        cy.iframe().find('.ticket-radicado').should('exist');
        cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
          const uniDocumental = $radicado.text();
          radicadoInterno = uniDocumental.split(':')[1]?.trim() || '';
        });
        cy.iframe().find('a.ui-dialog-titlebar-icon').click();
      } else {
        cy.log('El elemento no existe');
      }
    });
    cy.iframe().find('.buttonMainNext').contains('Firmar').click();
    cy.iframe().find('p-menu li').contains('sistema').click();
    cy.iframe().find('#pass').type(12345);
    cy.iframe().find('button.buttonMain').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Archivar documento/////
    cy.inicioSesion('pruebas05', 'puebas.jbpm07', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.seleccionarDependencia('Despacho Ministra', 'Direccion General');
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoInterno}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    selUnidadDocumental();
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').eq(1).find('tr').first().click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.text-left.page-subtitle').should('exist');
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(1).find('td').first().click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(1).find('td').eq(4).click();
    cy.iframe().find('.ui-dropdown-items li').first().click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().find('td').eq(4).click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().find('td').eq(4).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Solicitud').click();
    cy.iframe().find('.ui-dialog-footer button').contains('No').click();
    cy.iframe().find('.ui-datatable-thead tr').first().find('th').first().click();
    cy.iframe().find('.ui-icon-folder').first().click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
  
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

function selUnidadDocumental() {
  cy.iframe().find('#serie').click();
  
  switch (Cypress.env('ambiente')) {
    case 'Igualdad':
      cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
      break;
      case 'UNP':
        cy.iframe().find('.ng-trigger-overlayAnimation li').contains('INFORMES').click();
        cy.iframe().find('#tipoId').click();
        cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Informes').click();
      break;
  }
}