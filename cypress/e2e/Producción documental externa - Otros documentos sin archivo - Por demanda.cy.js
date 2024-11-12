/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente'));

describe('Producción documental externa - Otros documentos sin archivo - Por demanda', () => {
  let radicadoS;
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
  });

  // it('Con revisor', { defaultCommandTimeout: 40000 }, () => {
  //   cy.url().should('include', '/pages/application/1');

  //   cy.wait(500)
  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Subd. De Contratacion').click();
  //   cy.iframe().find('ul li').contains('Gestión de Documentos').click();
  //   cy.iframe().find('li a').contains('Producción multiples documentos').click();

  //   cy.iframe().find('#tipoPlantilla').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Auto - Conciliación').click();
  //   cy.iframe().find('button.buttonMain').contains('Agregar').click();
  //   cy.iframe().find('.ui-card-content button.buttonMainNext').click();
  //   //Producción Documental
  //   cy.iframe().find('#subject').type("Flujo otros documentos por demanda con revisor");
  //   cy.iframe().find('button.buttonMain').contains('Siguiente').click();

  //   //Gestionar producción
  //   cy.iframe().find('#sede').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Campesinos').click();
  //   cy.iframe().find('#dependencia').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Pueblos Indigenas').click();
  //   cy.iframe().find('#rol').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Revisor').click();
  //   cy.iframe().find('#funcionario').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Pruebas04').click();
  //   cy.iframe().find('.ui-panel-content-wrapper button.buttonMain').last().contains('Agregar').click();
  //   cy.iframe().find('#sede').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
  //   cy.iframe().find('#dependencia').click();
  //   cy.iframe().find('.ui-dropdown-items li').contains('Secretaria General').click();
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

  //   /////Revisar documento/////
  //   cy.get('input[type="text"]').type('pruebas04');
  //   cy.get('input[type="password"]').type('Soadoc123');
  //   cy.get('button').click();
  //   cy.wait(2000);
  //   cy.frameLoaded('#external-page');
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Pueblos Indigenas').click();
  //   cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`Revisar documento{enter}`);
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
  //   cy.iframe().find('form li').contains('Secretaria General').click();
  //   cy.iframe().find('ul li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`Aprobar Documento{enter}`);
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
  //   cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
  //   cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
  //   cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
  //   // cy.then(() => {
  //   //   cy.iframe().find('#filter').type(`Firmar{enter}`);
  //   // });
  //   // cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
  //   //Firmar documento//
  //   cy.iframe().find('.buttonMainNext').contains('Firmar').click();
  //   cy.iframe().find('p-menu li').contains('sistema').click();
  //   cy.iframe().find('#pass').type(12345);
  //   cy.iframe().find('button.buttonMain').contains('Guardar').click();
  //   cy.iframe().find('button.buttonMain').contains('Finalizar').click();
  //   cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
  //   //Archivar documento//
  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Subd. De Contratacion').click();
  //   cy.iframe().find('ul li').contains('Mis Asignaciones').click();
  //   cy.then(() => {
  //     cy.iframe().find('#filter').type(`Archivar Documento{enter}`);
  //   });
  //   cy.wait(1000);
  //   cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    
  // });

  it('Sin revisor', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    seleccionarDependencia('Subd. Talento Humano', 'Subdireccion De Talento Humano');
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Producción multiples documentos').click();

    selPlantilla();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-card-content button.buttonMainNext').click();
    //Producción Documental
    cy.iframe().find('#subject').type("Flujo otros documentos por demanda sin revisor");
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
    // cy.iframe().find('#filter').type(`Firmar`);
    // //Firmar documento//
    // cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    // cy.wait(5000);
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
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
    //Archivar documento//
    cy.then(() => {
      cy.iframe().find('#filter').type(`Archivar Documento{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    
  });

});

function selPlantilla() {
  cy.iframe().find('#tipoPlantilla').click();
  switch (Cypress.env('ambiente')) {
    case 'Igualdad':
      cy.iframe().find('.ui-dropdown-items li').contains('Auto - Conciliación').click();
      break;
    case 'UNP':
      cy.iframe().find('.ui-dropdown-items li').contains('OTROS DOCUMENTOS').click();
      break;
  }
}

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