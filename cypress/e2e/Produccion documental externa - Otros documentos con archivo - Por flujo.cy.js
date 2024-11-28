/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente'));

describe('Producción documental externa con archivo', () => {
  let radicadoE;
  let radicadoS;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas02', 'puebas.jbpm06', env);
  });

  it('Flujo número 29', { defaultCommandTimeout: 40000 }, () => {
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
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Escenario producción documental externa con archivo");
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
    selecLi('Despacho Ministra', 'Direccion General');
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
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf', 'cypress/docs/prueba2.pdf', 'cypress/docs/prueba3.pdf'], { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');

    //Consultar radicado//
    cy.then(() => {
      cy.consulta(radicadoE, 3, 'Asignar Comunicaciones');
    })
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
      cy.iframe().find('#numeroRadicado').type(`${radicadoE}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.ui-multiselect-label').click();
    asignar('Pruebas01', 'JBPM 05');
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
    cy.wait(1000);
    cy.seleccionarDependencia('Despacho Ministra', 'Direccion General');
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
    cy.pause();
    //Gestión producción múltiples documentos
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoE}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('#tipoPlantilla').click();
    switch (Cypress.env("ambiente")) {
      case 'Igualdad':
        cy.iframe().find('.ui-dropdown-items li').contains('Prueba Salida 1').click();
        cy.pause();
        break;
      case 'UNP':
        cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
        break;
    }
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.pause();
    cy.iframe().find('button.buttonMainNext').click();
    cy.pause();
    cy.iframe().find('#tipoComunicacion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Otros Documentos').click();
    cy.iframe().find('#subject').type("Flujo completo otros documentos con archivo");
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
    cy.wait(5000);
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();

    //Minuto 26
    
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