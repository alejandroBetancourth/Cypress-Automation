/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Organización y archivo consultar unidad documental', () => {
  let idUniDocumental;
  let nombreUniDocumental;

  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas02');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Oficina Juridica', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.frameLoaded('#external-page');
    cy.wait(1000);

    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Oficina Juridica').click();
    cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
    cy.iframe().find('li a').contains('Organización y Archivo').click();
    
    //Organización y archivo
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-hoverable-rows').first().find('tr').first().find('td').eq(3).find('span').last().then(($uniDocumental) => {
      idUniDocumental = $uniDocumental.text().trim();
    });
    cy.iframe().find('.ui-datatable-hoverable-rows').first().find('tr').eq(1).find('td').eq(4).find('span').last().then(($uniDocumental) => {
      nombreUniDocumental = $uniDocumental.text().trim();
    });

    //Busqueda por identificador
    cy.then(() => {
      cy.iframe().find('#identificador').type(`${idUniDocumental}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-hoverable-rows').first().find('tr').first().find('td').eq(3).find('span').last().then(($span) => {
      const spanText = $span.text().trim();
      expect(spanText).to.equal(idUniDocumental);
    });
      
    //Busqueda por nombre
    cy.iframe().find('#identificador').clear();
    cy.then(() => {
      cy.iframe().find('#nombre').type(`${nombreUniDocumental}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-hoverable-rows').first().find('tr').first().find('td').eq(4).find('span').last().then(($span) => {
      const spanText = $span.text().trim();
      expect(spanText).to.equal(nombreUniDocumental);
    });
    
  });

  // it('Secretaria General', { defaultCommandTimeout: 40000 }, () => {
  //   cy.url().should('include', '/pages/application/1');

  //   cy.frameLoaded('#external-page');
  //   cy.wait(1000);

  //   cy.iframe().find('form .dependencia-movil').should('exist').click();
  //   cy.iframe().find('form li').contains('Secretaria General').click();
  //   cy.iframe().find('ul li').contains('Gestión de Expedientes').click();
  //   cy.iframe().find('li a').contains('Organización y Archivo').click();
    
  //   //Organización y archivo
  //   cy.iframe().find('#serie').click();
  //   cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
  //   cy.iframe().find('button[label="Buscar"]').click();
  //   cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
  //   cy.iframe().find('.ui-datatable-hoverable-rows').first().find('tr').first().find('td').eq(3).find('span').last().then(($uniDocumental) => {
  //     idUniDocumental = $uniDocumental.text().trim();
  //   });
  //   cy.iframe().find('.ui-datatable-hoverable-rows').first().find('tr').eq(1).find('td').eq(4).find('span').last().then(($uniDocumental) => {
  //     nombreUniDocumental = $uniDocumental.text().trim();
  //   });

  //   //Busqueda por identificador
  //   cy.then(() => {
  //     cy.iframe().find('#identificador').type(`${idUniDocumental}`);
  //   });
  //   cy.iframe().find('button[label="Buscar"]').click();
  //   cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
  //   cy.iframe().find('.ui-datatable-hoverable-rows').first().find('tr').first().find('td').eq(3).find('span').last().then(($span) => {
  //     const spanText = $span.text().trim();
  //     expect(spanText).to.equal(idUniDocumental);
  //   });
      
  //   //Busqueda por nombre
  //   cy.iframe().find('#identificador').clear();
  //   cy.then(() => {
  //     cy.iframe().find('#nombre').type(`${nombreUniDocumental}`);
  //   });
  //   cy.iframe().find('button[label="Buscar"]').click();
  //   cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
  //   cy.iframe().find('.ui-datatable-hoverable-rows').first().find('tr').first().find('td').eq(4).find('span').last().then(($span) => {
  //     const spanText = $span.text().trim();
  //     expect(spanText).to.equal(nombreUniDocumental);
  //   });
    
  // });
});