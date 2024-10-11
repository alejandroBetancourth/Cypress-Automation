/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Organización y archivo crear unidad documental hibrida - por demanda', () => {
  let radicadoEntrada;
  let uniDocumental;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 22', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Talento').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();
    
    //Organización y archivo
    cy.iframe().find('p-radiobutton[label="Creación de unidad documental  "]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PQRSD').click();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Manual').click();
    const id = Date.now();
    cy.iframe().find('#identificador').type(`${id}`);
    cy.iframe().find('#nombre').type(`${id}`);
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().click();
    
    //Agregar ubicación topográfica
    cy.iframe().find('p-dropdown[formcontrolname="bodega"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PRUEBA MC').first().click();
    cy.iframe().find('p-dropdown[formcontrolname="piso"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PISO1').click();
    cy.iframe().find('p-dropdown[formcontrolname="estante"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('ESTANTE1').click();
    cy.wait(300);
    cy.iframe().find('p-dropdown[formcontrolname="seccion"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('ENTREPAÑO1').click();
    cy.wait(300);
    cy.iframe().find('p-dropdown[formcontrolname="caja"]').click();
    cy.iframe().find('.ui-dropdown-items li').first().click();
    cy.wait(300);
    cy.iframe().find('p-dropdown[formcontrolname="carpeta"]').click();
    cy.iframe().find('.ui-dropdown-items li').first().click();
    cy.wait(300)
    cy.iframe().find('button.buttonMain').contains("Crear").click();
    cy.iframe().find('div[role="dialog"] .ui-dialog-footer button').contains("Si").click();
    cy.wait(2000);
    cy.iframe().find('.ui-datatable-scrollable-body').last().find('tr').first().find("td").first().click();
    cy.iframe().find('button.buttonMain').contains("Siguiente").click();
    
    //Consultar creación - Gestión electrónica
    cy.iframe().find('app-menu ul li').contains('Consulta').click();
    cy.iframe().find('#depP').type("Subd. Talento");
    cy.iframe().find('.ui-autocomplete-items li').contains('SUBD. TALENTO').click();
    cy.iframe().find('#sCode').type("P");
    cy.iframe().find('.ui-autocomplete-items li').contains('PQRSD').click();
    cy.iframe().find('#udName').type(`${id}`);
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find("td").eq(6).should('include.text', 'Híbrido');

    //Consultar creación - Gestión Física
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    cy.get('a .letrasMinagricultura').should('be.visible');
    cy.wait(1000);
    cy.iframe().find('#dependences').select('121');
    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded('#main-content');
      cy.iframe().find('.ui-dialog button').click();
    });
    cy.iframe().find('ul li').contains('Inventarios').click();
    cy.iframe().find('li a').contains('Cargue de inventario AG').click();
    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded('#main-content');
      cy.iframe().find('#tipo_soportedep1').select('TIP_SOP3');
      cy.iframe().find('#serieSubserieSearch').select('2');
      cy.then(() => {
        cy.iframe().find('#descripcionDocumento').type(`${id}`);
      });
      cy.iframe().find('button[type="button"]').contains('BUSCAR').click();
      cy.iframe().find('table#table_unidad tbody tr').should('have.length', 1);
    });

  });
});