/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente'));

describe('Consulta de expediente', () => {
  let idUniDocumental;
  let nombreUniDocumental;

  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
  });

  it('Subd. Administrativa', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('ul li').contains('Consulta').click();
    
    //Consulta
    cy.iframe().find('#depP input').type(env.dependencia_radicadora);
    cy.iframe().find('.ui-autocomplete-panel li').first().click();
    cy.iframe().find('.ui-autocomplete-panel li').should('not.exist');
    
    cy.iframe().find('#sCode .ui-autocomplete-dropdown').click();
    cy.iframe().find('.ui-autocomplete-panel li').first().click();
    cy.iframe().find('.ui-autocomplete-panel li').should('not.exist');

    cy.iframe().find('button.buttonMain[label="Buscar"]').first().should('not.be.disabled');
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-scrollable-table-wrapper tr').first().find('td').eq(2).find('span').last().then(($uniDocumental) => {
      idUniDocumental = $uniDocumental.text().trim();
    });
    cy.iframe().find('.ui-datatable-scrollable-table-wrapper tr').eq(1).find('td').eq(3).find('span').last().then(($uniDocumental) => {
      nombreUniDocumental = $uniDocumental.text().trim();
    });
    
    //Busqueda por identificador
    cy.then(() => {
      cy.iframe().find('#udId').type(`${idUniDocumental}`);
    });
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-scrollable-table-wrapper tr').first().find('td').eq(2).find('span').last().then(($span) => {
      const spanText = $span.text().trim();
      expect(spanText).to.equal(idUniDocumental);
    });
    
    //Busqueda por nombre
    
    cy.iframe().find('#udId').clear();
    cy.then(() => {
      cy.iframe().find('#udName').type(`${nombreUniDocumental}`);
    });
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-scrollable-table-wrapper tr').first().find('td').eq(3).find('span').last().then(($span) => {
      const spanText = $span.text().trim();
      expect(spanText).to.equal(nombreUniDocumental);
    });
  });

  // it('Despacho Ministra', { defaultCommandTimeout: 40000 }, () => {
  //   cy.url().should('include', '/pages/application/1');

  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);

  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('ul li').contains('Consulta').click();
    
  //   //Consulta
  //   cy.iframe().find('#depP input').type('DESPACHO MINISTRA');
  //   cy.iframe().find('.ui-autocomplete-panel li').first().click();
    
  //   cy.iframe().find('#sCode input').type('PQRSD');
  //   cy.iframe().find('.ui-autocomplete-panel li').first().click();

  //   cy.iframe().find('button.buttonMain[label="Buscar"]').first().should('not.be.disabled');
  //   cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
  //   cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
  //   cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
  //   cy.iframe().find('.ui-datatable-scrollable-table-wrapper tr').first().find('td').eq(2).find('span').last().then(($uniDocumental) => {
  //     idUniDocumental = $uniDocumental.text().trim();
  //   });
  //   cy.iframe().find('.ui-datatable-scrollable-table-wrapper tr').eq(1).find('td').eq(3).find('span').last().then(($uniDocumental) => {
  //     nombreUniDocumental = $uniDocumental.text().trim();
  //   });
    
  //   //Busqueda por identificador
  //   cy.then(() => {
  //     cy.iframe().find('#udId').type(`${idUniDocumental}`);
  //   });
  //   cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
  //   cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
  //   cy.iframe().find('.ui-datatable-scrollable-table-wrapper tr').first().find('td').eq(2).find('span').last().then(($span) => {
  //     const spanText = $span.text().trim();
  //     expect(spanText).to.equal(idUniDocumental);
  //   });
    
  //   //Busqueda por nombre
    
  //   cy.iframe().find('#udId').clear();
  //   cy.then(() => {
  //     cy.iframe().find('#udName').type(`${nombreUniDocumental}`);
  //   });
  //   cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
  //   cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
  //   cy.iframe().find('.ui-datatable-scrollable-table-wrapper tr').first().find('td').eq(3).find('span').last().then(($span) => {
  //     const spanText = $span.text().trim();
  //     expect(spanText).to.equal(nombreUniDocumental);
  //   });
  // });
});