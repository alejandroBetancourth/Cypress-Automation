/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente')) || Cypress.env('Igualdad');

describe('Producción documental externa - Otros documentos sin archivo - Por flujo', () => {
  let radicadoE;
  let radicadoS;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas01', 'puebas.jbpm07', env);
  });

  it('Sin revisor', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Reclamo').click();
    cy.iframe().find('#numeroFolio input').type(5);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario producción documental");
    cy.iframe().find('#soporteAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Electrónico').click();
    cy.iframe().find('#tipoAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Cd').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('#soporteAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Físico').click();
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
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Asignar comunicaciones/////
    cy.inicioSesion('pruebas02', 'puebas.jbpm06', env);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    seleccionarDependencia('Despacho Ministra', 'Direccion General');
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoE}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').should('have.length', 1);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.ui-multiselect-label').click();
    switch (Cypress.env('ambiente')) {
      case 'Igualdad':
        cy.iframe().find('.ui-multiselect-items li').contains('Pruebas01').click();
        break;
      case 'UNP':
        cy.iframe().find('.ui-multiselect-items li').contains('JBPM 05').click();
        break;
    }
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Asignar').click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Recibir y Gestionar documentos/////
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    seleccionarDependencia('Despacho Ministra', 'Direccion General');
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Producir Documento').click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    //Gestión producción múltiples documentos
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('#tipoPlantilla').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('button.buttonMainNext').click();
    cy.iframe().find('#tipoComunicacion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Otros Documentos').click();
    cy.iframe().find('#subject').type("Escenario otros documentos sin archivo");
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    
    //Edición documento principal
    cy.iframe().find('.fa-plus').click();
    cy.iframe().find('.iconSave').click();
    cy.iframe().find('p-confirmdialog button').contains('Aceptar').click();
    
    //Relación de anexos
    cy.iframe().find('input[name="soporte"]').eq(1).click();
    cy.iframe().find('#tipoAnexo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Fotografías').click();
    cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('input[name="soporte"]').eq(2).click();
    cy.iframe().find('#tipoAnexo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Expediente').click();
    cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba2.pdf', { force: true });
    //Aprobar documento//
    cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
    cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    //Firmar documento//
    // cy.iframe().find('#filter').type(`Firmar`);
    // cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.wait(5000);
    cy.iframe().find('app-root').then($body => {
      if ($body.find('a.ui-dialog-titlebar-icon').length) {
        cy.iframe().find('.ticket-radicado').should('exist');
        cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
          const uniDocumental = $radicado.text();
          radicadoS = uniDocumental.split(':')[1]?.trim() || '';
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
    
  });

  // it('Con revisor', { defaultCommandTimeout: 40000 }, () => {
  //   cy.url().should('include', '/pages/application/1');

  //   cy.wait(500)
  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Subd. Administrativa').click();
  //   cy.iframe().find('ul li').contains('Gestión de Documentos').click();
  //   cy.iframe().find('li a').contains('Correspondencia de entrada').click();

  //   //Datos generales
  //   cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
  //   cy.iframe().find('#tipologiaDocumental').contains('empty').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Circular').click();
  //   cy.iframe().find('#numeroFolio input').type(5);
  //   cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario producción documental");
  //   cy.iframe().find('#soporteAnexos').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Electrónico').click();
  //   cy.iframe().find('#tipoAnexos').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Cd').click();
  //   cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
  //   cy.iframe().find('#soporteAnexos').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Físico').click();
  //   cy.iframe().find('#tipoAnexos').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Expediente').click();
  //   cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
  //   cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();

  //   //Datos solicitante
  //   cy.iframe().find('#tipoNotificacion').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Correo').click();
  //   cy.iframe().find('#tipoPersona').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
  //   cy.iframe().find('#nombreApellidos').type('S');
  //   cy.iframe().find('.ui-autocomplete-items li').contains('SEBAS').click();
  //   cy.iframe().find('p-dtradiobutton').click();
  //   cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();

  //   //Dependencia destino
  //   cy.iframe().find('form.ng-invalid #sedeAdministrativa').click();
  //   cy.wait(300);
  //   cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
  //   cy.wait(300);
  //   cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
  //   cy.wait(300);
  //   cy.iframe().find('.ui-dropdown-items li').contains('Oficina Juridica').click();
  //   cy.wait(300);
  //   cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
  //   cy.iframe().find('button.buttonMain .ui-clickable').contains('Radicar').not('[disabled]').click();
  //   cy.iframe().find('.ticket-radicado').should('exist');
  //   cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
  //     const uniDocumental = $radicado.text();
  //     radicadoE = uniDocumental.split(':')[1]?.trim() || '';
  //   });
  //   cy.iframe().find('.ticket-radicado [class*="close"]').click();
  //   cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Finalizar
  //   cy.then(() => {
  //     cy.iframe().find('h2.page-title-primary').contains(`${radicadoE}`).should('exist');
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf', 'cypress/docs/prueba2.pdf'], { force: true });
  //   cy.iframe().find('p-radiobutton').first().click();
  //   cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
  //   cy.iframe().find('button').contains('Guardar').click();
  //   cy.iframe().find('button.buttonMain').contains('Finalizar').click();
  //   cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
  //   cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
  //   cy.get('a .letrasMinagricultura').click();
  //   cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

  //   /////Consultar radicado/////
  //   cy.get('input[type="text"]').type('pruebas01');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.wait(2000);
  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);
  //   cy.iframe().find('.ultima-menu li').contains('Consulta').click();
  //   cy.iframe().find('li[role="presentation"]').last().click();
  //   cy.iframe().find('#tipo_comunicacion').type("Externa Recibida");
  //   cy.iframe().find('.ui-autocomplete-list li').click();
  //   cy.then(() => {
  //     cy.iframe().find('#nro_radicado').type(`${radicadoE}`);
  //   });
  //   cy.iframe().find('button[label="Buscar"]').last().click();
  //   cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').first().click();
  //   cy.iframe().find('.ui-datatable-scrollable-body').should('have.length', 3);
  //   cy.iframe().find('.ui-datatable-scrollable-body').last().find('tr').should('have.length', 2);
  //   cy.iframe().find('p-header i').click();
  //   cy.iframe().find('.ng-trigger-overlayAnimation li').contains("Trazabilidad").click();
  //   cy.iframe().find('.ui-scrollpanel-wrapper .StepProgress').first().should('include.text', 'Asignar Comunicaciones').click();
  //   cy.get('a .letrasMinagricultura').click();
  //   cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

  //   /////Asignar comunicaciones/////
  //   cy.get('input[type="text"]').type('pruebas02');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.wait(2000);
  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Oficina Juridica').click();
  //   cy.iframe().find('ul li').contains('Gestión de Documentos').click();
  //   cy.iframe().find('li a').contains('Asignar comunicaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#numeroRadicado').type(`${radicadoE}`);
  //   });
  //   cy.iframe().find('button[label="Buscar"]').click();
  //   cy.wait(500);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
  //   cy.iframe().find('a[role="button"]').click();
  //   cy.iframe().find('.ui-multiselect-label').click();
  //   cy.iframe().find('.ui-multiselect-items li').contains('pruebas04').click();
  //   cy.iframe().find('.iconsMenu').click();
  //   cy.iframe().find('.ng-trigger.ui-menu li').contains('Asignar').click();
  //   cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
  //   cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
  //   cy.get('a .letrasMinagricultura').click();
  //   cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

  //   /////Recibir y Gestionar documentos/////
  //   cy.get('input[type="text"]').type('pruebas04');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.wait(2000);
  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Oficina Juridica').click();
  //   cy.iframe().find('ul li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
  //   cy.iframe().find('li[role="presentation"]').last().click();
  //   cy.iframe().find('form[name="formDefault"] p-dropdown').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Producir Documento').click();
  //   cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
  //   cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    
  //   //Gestión producción múltiples documentos
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
  //   cy.iframe().find('#tipoPlantilla').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Prueba01').click();
  //   cy.iframe().find('button.buttonMain').contains('Agregar').click();
  //   cy.iframe().find('button.buttonMainNext').click();
  //   cy.iframe().find('#tipoComunicacion').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Otros Documentos').click();
  //   cy.iframe().find('#subject').type("Prueba flujo completo otros documentos");
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();

  //   //Gestionar producción
  //   cy.iframe().find('#sede').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Diversidades').click();
  //   cy.iframe().find('#dependencia').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Discapacidad').click();
  //   cy.iframe().find('#rol').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Revisor').click();
  //   cy.iframe().find('#funcionario').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Pruebas02').click();
  //   cy.iframe().find('.ui-panel-content-wrapper button.buttonMain').last().contains('Agregar').click();
  //   cy.iframe().find('#sede').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Nivel Central').click();
  //   cy.iframe().find('#dependencia').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
  //   cy.iframe().find('#rol').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Aprobador').click();
  //   cy.iframe().find('#funcionario').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Pruebas01').click();
  //   cy.iframe().find('.ui-panel-content-wrapper button.buttonMain').last().contains('Agregar').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    
  //   //Edición documento principal
  //   cy.iframe().find('.fa-plus').click();
  //   cy.iframe().find('.iconSave').click();
  //   cy.iframe().find('p-confirmdialog button').contains('Aceptar').click();
    
  //   //Relación de anexos
  //   cy.iframe().find('input[name="soporte"]').eq(1).click();
  //   cy.iframe().find('#tipoAnexo').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Fotografías').click();
  //   cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
  //   cy.iframe().find('input[name="soporte"]').eq(2).click();
  //   cy.iframe().find('#tipoAnexo').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Expediente').click();
  //   cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba2.pdf', { force: true });
  //   cy.iframe().find('button.buttonMainNext').contains('Continuar').click();
  //   cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
  //   cy.get('a .letrasMinagricultura').click();
  //   cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    
  //   /////Revisar documento - devolución/////
  //   cy.get('input[type="text"]').type('pruebas02');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Discapacidad').click();
  //   cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
  //   cy.iframe().find('#responderRemitente').click();
  //   cy.iframe().find('p-checkbox[formcontrolname="distElectronicaCertificada"]').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
  //   cy.iframe().find('button.buttonHeaderTableSecundary').click();
  //   cy.iframe().find('div[role="dialog"] textarea').type("Se hace la devolución");
  //   cy.iframe().find('div[role="dialog"] button').contains('Guardar').click();
  //   cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Devolver
  //   cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
  //   cy.get('a .letrasMinagricultura').click();
  //   cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

  //   /////Ajustar documento/////
  //   cy.get('input[type="text"]').type('pruebas04');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.wait(2000);
  //   cy.frameLoaded('#external-page');
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Oficina Juridica').click();
  //   cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
  //   cy.iframe().find('p-tabpanel[header="Datos destinatario"] i[ptooltip="Eliminar"]').click();
  //   cy.iframe().find('button.buttonHeaderTable').click();
  //   cy.iframe().find('#tipoDestinatario').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Principal').click();
  //   cy.iframe().find('#tipoPersona').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
  //   cy.iframe().find('#nombre').type('Andrea');
  //   cy.iframe().find('.ui-autocomplete-panel').contains('ANDREA CUESTA').click();
  //   cy.iframe().find('p-dtradiobutton').click();
  //   cy.iframe().find('button.buttonMain').contains('Aceptar').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();
  //   cy.iframe().find('button.buttonHeaderTableSecundary').click();
  //   cy.iframe().find('div[role="dialog"] textarea').type("Se corrige");
  //   cy.iframe().find('div[role="dialog"] button').contains('Guardar').click();
  //   cy.iframe().find('.ui-card-content .buttonMainNext').contains('Continuar').click();
  //   cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
  //   cy.get('a .letrasMinagricultura').click();
  //   cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

  //   /////Enviar al aprobador/////
  //   cy.get('input[type="text"]').type('pruebas02');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.wait(2000);
  //   cy.frameLoaded('#external-page');
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Discapacidad').click();
  //   cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
  //   });
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
  //   cy.iframe().find('.ui-card-content .buttonMainNext').contains('Continuar').click();
  //   cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
  //   cy.get('a .letrasMinagricultura').click();
  //   cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

  //   /////Aprobar documento/////
  //   cy.get('input[type="text"]').type('pruebas01');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.wait(2000);
  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Despacho Ministra').click();
  //   cy.iframe().find('ul li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
  //   cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
  //   cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
  //   cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
  //   cy.iframe().find('div').contains('N°. Radicado :').parent().then(($radicado) => {
  //     const uniDocumental = $radicado.text();
  //     radicadoS = uniDocumental.split(':')[1]?.trim() || '';
  //   });
  //   // cy.then(() => {
  //   //   cy.iframe().find('#filter').type(`${radicadoS}{enter}`);
  //   // });
  //   // cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
  //   cy.wait(5000);
  //   cy.iframe().find('app-root').then($body => {
  //     if ($body.find('a.ui-dialog-titlebar-icon').length) {
  //       cy.iframe().find('.ticket-radicado').should('exist');
  //       cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
  //         const uniDocumental = $radicado.text();
  //         radicadoS = uniDocumental.split(':')[1]?.trim() || '';
  //       });
  //       cy.iframe().find('a.ui-dialog-titlebar-icon').click();
  //     } else {
  //       cy.log('El elemento no existe');
  //     }
  //   });
  //   cy.iframe().find('.buttonMainNext').contains('Firmar').click();
  //   cy.iframe().find('p-menu li').contains('sistema').click();
  //   cy.iframe().find('#pass').type(12345);
  //   cy.iframe().find('button.buttonMain').contains('Guardar').click();
  //   cy.iframe().find('button.buttonMain').contains('Finalizar').click();
  //   cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
  //   cy.get('a .letrasMinagricultura').click();
  //   cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

  //   /////Archivar documento/////
  //   cy.get('input[type="text"]').type('pruebas04');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.wait(2000);
  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Oficina Juridica').click();
  //   cy.iframe().find('ul li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`${radicadoS}{enter}`);
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    
  // });
});

function seleccionarDependencia(Igualdad, UNP) {
  cy.iframe().find('form .dependencia-movil').should('exist').click();
  switch (Cypress.env('ambiente')) {
    case 'Igualdad':
      cy.iframe().find('form li').contains(Igualdad).click();
      break;
    case 'UNP':
      cy.iframe().find('form li').contains(UNP).click();
      break;
  }
}