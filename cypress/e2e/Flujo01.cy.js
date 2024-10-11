/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(300);

describe('Correspondencia de entrada', () => {
  let radicado;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, {log: false} );
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.intercept({ resourceType: /xhr|fetch/ }, {log: false} );
  });

  it('Flujo Número 1', {defaultCommandTimeout: 40000}, () => {
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.url().should('include', '/pages/application/1');

    // cy.get('p-scrollpanel li').contains('Conciliaciones Administrativas').click();
    // cy.get('p-scrollpanel li').contains('Gestión Electrónica').click();
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Circular').click();
    cy.iframe().find('#numeroFolio input').type(1);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Algún asunto");
    // cy.iframe().find('#tipoAnexos').click();
    // cy.iframe().find('.ui-dropdown-items li').contains('Expediente').click();
    // cy.iframe().find('#soporteAnexos').click();
    // cy.iframe().find('.ui-dropdown-items li').contains('Electrónico').click();
    // cy.iframe().find('#descripcionAnexos').type("Alguna descripción");
    // cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
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
    cy.iframe().find('.ui-dropdown-items li').contains('Secretaria General').click();
    cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Admin').click();
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Radicar').not('[disabled]').click();
    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicado = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Finalizar
    // cy.then(() => {
    //   cy.iframe().find('#filter').type(`${radicado}{enter}`);
    // });
    // cy.wait(2000);
    // cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicado}`).should('exist');
    });
    cy.wait(1000);
    
    //Carga de archivos
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();

    //Asignar Comunicaciones
    cy.wait(1000);
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();

    cy.then(() => {
        cy.iframe().find('#numeroRadicado').type(radicado);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-chkbox-box').eq(1).click();
    cy.iframe().find('.ui-multiselect-label').click();
    cy.iframe().find('.ui-multiselect-items li').first().click();
    cy.iframe().find('.iconsMenu').first().click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Asignar').click();
    cy.then(() => {
      cy.log(radicado)
    })
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();

    //Mis asignaciones
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('tbody td').last().click();
    cy.iframe().find('.ui-tabview li').last().click();
    cy.iframe().find('form[name="formDefault"] label').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Producir').click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    // cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    
    //Mis asignaciones 2
    cy.wait(300);
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.iframe().find('#tipoPlantilla').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('button.buttonMainNext').click();
    cy.iframe().find('#tipoComunicacion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Externa').click();
    cy.iframe().find('#subject').type('Algún asunto');
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('p-checkbox').contains('Electrónica').click();
    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Principal').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombre').type('S');
    cy.iframe().find('.ui-autocomplete-panel').contains('SEBAS').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain').contains('Aceptar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('#sede').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Secretaria').click();
    cy.iframe().find('#rol').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Revisor').click();
    cy.iframe().find('#funcionario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Pruebas05').click();
    cy.iframe().find('button.buttonMain').eq(2).contains('Agregar').click();
    cy.iframe().find('#sede').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Nivel').click();
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Despacho').click();
    cy.iframe().find('#rol').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Aprobador').click();
    cy.iframe().find('#funcionario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Pruebas01').click();
    cy.iframe().find('button.buttonMain').eq(2).contains('Agregar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.fa-plus').click();
    cy.iframe().find('.iconSave').click();
    cy.iframe().find('p-confirmdialog button').contains('Aceptar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.buttonMainNext').contains('Continuar').click();
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Revisor/////
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Secretaria General').click();
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    //Error: No salen destinatarios//
    cy.iframe().find('#sede').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Juventud').click();
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Barrismo').click();
    cy.iframe().find('#rol').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Aprobador').click();
    cy.iframe().find('#funcionario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Nsanchez1').click();
    cy.iframe().find('button.buttonMain').eq(3).contains('Agregar').click();
    cy.iframe().find('.ui-icon-delete').should('exist');
    cy.iframe().find('.ui-icon-delete').last().click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    
    //Edición documento principal
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver"]').last().click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    
    //Producción documental
    cy.iframe().find('.buttonMainNext').click();
    cy.wait(2000);
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Aprobador/////
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
    cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.iframe().find('app-root').then($body => {
      if ($body.find('a.ui-dialog-titlebar-icon').length) {
        cy.iframe().find('.ticket-radicado').should('exist');
        cy.iframe().find('div').contains('N°. Radicado : ').then(($radicado) => {
          const uniDocumental = $radicado.text();
          cy.log(uniDocumental)
          radicado = uniDocumental.split(':')[1]?.trim() || '';
        });
      } else {
        cy.log('El elemento no existe');
      }
    });
    // cy.iframe().find('button.buttonMain').contains('Finalizar').click();


    //Firmar documento
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicado}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.wait(5000);
    cy.iframe().find('app-root').then($body => {
      if ($body.find('a.ui-dialog-titlebar-icon').length) {
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
    cy.iframe().find('.ui-datatable-data tr').first().find('td').last().click();
  });
});