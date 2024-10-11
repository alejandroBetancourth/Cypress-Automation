/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

//Cambio de tipo de documento en asignar comunicaciones y reasignar a pruebas 01
describe('Flujo completo', () => {
  let radicado;
  let radicadoInterno;
  let radicadoExterno;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas02');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 7', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Denuncia').click();
    cy.iframe().find('#numeroFolio input').type(3);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Algún asunto");
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();

    //Datos solicitante
    cy.iframe().find('#tipoNotificacion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Correo').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombreApellidos').type('S');
    cy.iframe().find('.ui-autocomplete-items li').contains('SEBAS').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();

    //Dependencia destino
    cy.iframe().find('form.ng-invalid #sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Nivel Central').click();
    cy.wait(300);
    cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
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
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Asignar comunicaciones/////
    cy.get('input[type="text"]').type('pruebas03');
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
      cy.iframe().find('#numeroRadicado').type(`${radicado}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('#tipologiaDocumental').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.wait(500);
    cy.iframe().find('a[role="button"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body tr').click();
    cy.iframe().find('.ui-multiselect-label').click();
    cy.iframe().find('.ui-multiselect-items li').contains('pruebas05').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Asignar').click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.wait(500);
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Recibir y Gestionar documentos/////
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Reasignar').click();
    cy.iframe().find('div[role="dialog"] form #observacion').type("Se reasigna al usuario pruebas01");
    cy.iframe().find('div[role="dialog"] form #funcionarioDependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Pruebas01').click();
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Agregar").click();
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Aceptar").click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
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
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.wait(1000);
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
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('#tipoPlantilla').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Memorando').click();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('button.buttonMainNext').click();
    cy.iframe().find('#subject').type("Prueba 2");
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Principal').click();
    cy.iframe().find('#sede').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Pueblos').click();
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Comunidades').click();
    cy.iframe().find('div[role="dialog"] button.buttonMain').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    
    //Gestionar producción
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.fa-plus').click();
    cy.iframe().find('.iconSave').click();
    cy.iframe().find('p-confirmdialog button').contains('Aceptar').click();
    cy.iframe().find('input[name="soporte"]').eq(1).click();
    cy.iframe().find('#tipoAnexo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Caja').click();
    cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('input[name="soporte"]').eq(2).click();
    cy.iframe().find('#tipoAnexo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Sobre Sellado').click();
    cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba.docx', { force: true });
    cy.iframe().find('input[name="soporte"]').eq(0).click();
    cy.iframe().find('#tipoAnexo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Usb').click();
    cy.iframe().find('.ui-panel-content-wrapper button.buttonMain').last().click();
    cy.iframe().find('input[name="soporte"]').eq(1).click();
    cy.iframe().find('#tipoAnexo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Expediente').click();
    cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba.docx', { force: true });
    cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
    cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    // cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado :').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoInterno = uniDocumental.split(':')[1]?.trim() || '';
    });
    // cy.iframe().find('.ticket-radicado [class*="close"]').click();
    // cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Finalizar
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoInterno}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.wait(5000);
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
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Asignar comunicaciones/////
    cy.get('input[type="text"]').type('pruebas04');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Comunidad').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoInterno}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Observaciones"]').click();
    cy.iframe().find('#observacion').type("Prueba");
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Agregar").click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Redireccionar').click();
    cy.iframe().find('#justificacion').type("No es de aquí");
    cy.iframe().find('#sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('DESPACHO MINISTRA').click();
    cy.wait(300);
    cy.iframe().find('#dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('SECRETARIA GENERAL').click();
    cy.iframe().find('.ui-dialog-content button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-dialog-footer').last().find('button').contains('Aceptar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.iframe().find('.ui-card-content button').click(); //Btn Finalizar
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Asignar comunicaciones/////
    cy.get('input[type="text"]').type('pruebas03');
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
      cy.iframe().find('#numeroRadicado').type(`${radicadoInterno}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Tramitar').click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar

    //Recibir y gestionar documentos
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoInterno}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').eq(3).click();
    cy.iframe().find('#observacion').type("Se genera respuesta");
    cy.iframe().find('form[name="formDefault"] button.buttonMain').contains("Agregar").click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Producir').click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar

    //Gestión Producción múltiples documentos
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoInterno}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('#tipoPlantilla').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('button.buttonMainNext').click();
    cy.iframe().find('#subject').type("Prueba 3");
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('p-checkbox').contains('Electrónica no').click();
    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Principal').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Anónimo').click();
    cy.iframe().find('div[role="dialog"] .buttonHeaderTable').click();
    cy.iframe().find('#correoEle').type("correo@prueba.com");
    cy.iframe().find('p-accordion button.buttonMain').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain').contains('Aceptar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    
    //Producción documental
    cy.iframe().find('#sede').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Secretaria').click();
    cy.iframe().find('#rol').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Aprobador').click();
    cy.iframe().find('#funcionario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Pruebas01').click();
    cy.iframe().find('.ui-panel-content-wrapper button.buttonMain').last().contains('Agregar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.fa-plus').click();
    cy.iframe().find('.iconSave').click();
    cy.iframe().find('p-confirmdialog button').contains('Aceptar').click();
    cy.wait(1000);
    cy.iframe().find('.buttonMainNext').contains('Continuar').click();
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Aprobar/////    
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Secretaria General').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoInterno}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
    cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.iframe().find('div').contains('N°. Radicado :').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoExterno = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoExterno}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.wait(5000);
    cy.iframe().find('app-root').then($body => {
      if ($body.find('a.ui-dialog-titlebar-icon').length) {
        cy.iframe().find('.ticket-radicado').should('exist');
        cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
          const uniDocumental = $radicado.text();
          radicadoExterno = uniDocumental.split(':')[1]?.trim() || '';
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
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Asignar comunicaciones/////
    cy.get('input[type="text"]').type('pruebas03');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Secretaria General').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoExterno}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('p-radiobutton[value="solicitarUnidadDocumental"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Manual').click();
    const id = Date.now();
    cy.iframe().find('#identificador').type(`${id}`);
    cy.iframe().find('#nombre').type(`${id}`);
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('.ui-datatable-scrollable-body').eq(1).find('tr').first().click();
    cy.iframe().find('p-checkbox[formcontrolname="unidadFisica"]').click();
    cy.iframe().find('button.buttonMain').contains("Crear").click();
    cy.iframe().find('.ui-dialog-footer').contains('Si').click();
    cy.wait(2000);
    cy.iframe().find('.ui-datatable-scrollable-body').eq(2).find('tr').first().find("td").first().click();
    cy.iframe().find('button.buttonMain').contains("Siguiente").click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().find('td').first().click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().find('td').eq(4).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Respuesta').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ui-datatable-thead tr').first().find('th').first().click();
    cy.iframe().find('.ui-icon-folder').first().click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    cy.wait(1000);

    //Minuto 23

    //Reportar corte de trazabilidad después de aprobar
    //Reportar error al visualizar observaciones pruebas04 (memorando)
    
  });
});