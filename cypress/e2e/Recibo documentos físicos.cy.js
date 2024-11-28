/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(300);
const env = Cypress.env(Cypress.env("ambiente"));

//pruebas03 sin rol digitalizador
describe( 'Recibo documentos físicos', () => {
  let radicadoSalida; //Con distribución física y se deja en la tarea archivar

  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion("pruebas01", "puebas.jbpm05", env);
  });
  
  it('Con distribución física', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.seleccionarDependencia('Subd. De Contratacion', 'Grupo De Contratacion');
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Producción multiples documentos').click();

    cy.iframe().find('#tipoPlantilla').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-card-content button.buttonMainNext').click();

    //Datos generales
    cy.iframe().find('#subject').type("Escenario Recibo documentos físicos");
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Principal').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombre').type('Cy');
    cy.iframe().find('.ui-autocomplete-panel').contains('CYPRESS').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain').contains('Aceptar').click();
    cy.iframe().find('p-checkbox').contains('Física').click();
    cy.iframe().find('#clase_envio').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Local').click();
    cy.iframe().find('#modalidad_correo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('A La Mano').click();
    
    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Con Copia').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Anónimo').click();
    cy.iframe().find('div[role="dialog"] button.buttonHeaderTable').click();
    cy.iframe().find('div[role="dialog"] p-dropdown[formcontrolname="tipoContacto"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Otra').click();
    cy.iframe().find('div[role="dialog"] .ui-accordion-header').first().click();
    cy.iframe().find('#correoEle').type("correo@prueba.com");
    //Datos dirección
    cy.iframe().find('p-dropdown#tipoVia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Diagonal').click();
    cy.iframe().find('input#noViaPrincipal').type("2");
    cy.iframe().find('p-dropdown#prefijoCuadrante').click();
    cy.iframe().find('.ui-dropdown-items li').contains('B').first().click();
    cy.iframe().find('p-dropdown#bis').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Bis').click();
    cy.iframe().find('p-dropdown#orientacion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Norte').click();
    cy.iframe().find('input#noVia').type("3");
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Guardar").click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains('Aceptar').click();
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
    cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
    cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.iframe().find('div').contains('N°. Radicado :').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoSalida = uniDocumental.split(':')[1]?.trim() || '';
    });
    //Firmar documento
    // cy.then(() => {
    //   cy.iframe().find('#filter').type(`${radicadoSalida}{enter}`);
    // });
    // cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    // cy.wait(5000);
    cy.iframe().find('app-root').then($body => {
      if ($body.find('a.ui-dialog-titlebar-icon').length) {
        cy.iframe().find('.ticket-radicado').should('exist');
        cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
          const uniDocumental = $radicado.text();
          radicadoSalida = uniDocumental.split(':')[1]?.trim() || '';
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
    //Archivar
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoSalida}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    
    //Verificar radicados//
    cy.iframe().find('li a').contains('Vista Corporativa').click();
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains(env.dependencia_radicadora).click();
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('ul li').contains('Planillas').click();
    
    //Recibo Documentos Físicos//
    cy.iframe().find('li a').contains('Recibo Documentos Fisicos').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoSalida}`);
    });
    cy.iframe().find('#dependencia').click();
    selecLi('Subd. De Contratacion', 'Grupo De Contratacion');
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.length', 2);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().click();
    cy.iframe().find('button[label="Recibir"]').click();
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().click();
    cy.iframe().find('button[label="Recibir"]').click();
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');   
    
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