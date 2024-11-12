/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente'));

describe('Cargue inventarios AC', {
  retries: {
    runMode: 2, 
    openMode: 2
  }
}, () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas01', 'puebas.jbpm05', env);
  });

  it('Secretaria General', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    cy.frameLoaded('#external-page');
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();

    cy.get('.ui-blockui').should('have.css', 'display', 'block');
    cy.get('.ui-blockui').should('have.css', 'display', 'none');
    cy.wait(1000);
    seleccionarDependencia();

    cy.iframe().find('ul li').contains('Inventarios').click();
    cy.iframe().find('li a').contains('Cargue de inventario AC').click();

    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded('#main-content');
      cy.iframe().find('#tipificador').select('0');
      cy.iframe().find('input[name="tipo_cargue"]').last().click();
      alert();
      cy.iframe().find('#sel_bodega')
        .find('option')
        .eq(1)
        .then(option => {
          cy.iframe().find('#sel_bodega').select(option.val());
        });
      alert();
      let i = 2;

      function selectAndCheck(subnivel) {
        select(subnivel);
        cy.iframe().find('#div_ultimo_nivel').then(($select) => {
          if($select.css('display') === 'none') {
            i++;
            selectAndCheck(i);
          }
        });
      }
      
      selectAndCheck(i);
      switch (Cypress.env('ambiente')) {
        case 'Igualdad':
          cy.iframe().find('#txtCodigoSerieSubserie').select('20');
          break;
        case 'UNP':
          cy.iframe().find('#txtCodigoSerieSubserie').select('63-21');
          break;
      }
      const id = Date.now();
      cy.iframe().find('#txtIdDocumental').type(`${id}`);
      cy.iframe().find('#txtNomUnidad').type(`${id}`);
      cy.iframe().find('#div_ultimo_nivel .ui-datepicker-trigger').first().click();
      cy.iframe().find('.ui-datepicker-calendar tbody td').contains('10').click();
      cy.iframe().find('#div_ultimo_nivel .ui-datepicker-trigger').last().click();
      cy.iframe().find('.ui-datepicker-calendar tbody td').contains('12').click();
      cy.iframe().find('#txtCarpetas').type('1');
      cy.iframe().find('#txtFolio').type('1-3');
      cy.iframe().find('#div_ultimo_nivel button[type="button"]').contains('ADICIONAR').click();
      cy.iframe().find('#jsp_alertMessage').should('include.text', 'LA UNIDAD DOCUMENTAL SE HA UBICADO EXITOSAMENTE.');
      cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button').last().click();

    });

  });

  // it('Subd. Talento Humano', { defaultCommandTimeout: 40000 }, () => {
  //   cy.url().should('include', '/pages/application/1');
  //   cy.frameLoaded('#external-page');
  //   cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().should('be.visible').click();
  //   cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
  //   cy.wait(1000);

  //   cy.iframe().find('#dependences').select('121');
  //   cy.wait(1000);
  //   cy.iframe().find('ul li').contains('Inventarios').click();
  //   cy.iframe().find('li a').contains('Cargue de inventario AC').click();

  //   cy.wait(1000);
  //   cy.iframe().within(() => {
  //     cy.frameLoaded('#main-content');
  //     cy.iframe().find('#tipificador').select('0');
  //     cy.iframe().find('input[name="tipo_cargue"]').last().click();
  //     alert();
  //     cy.iframe().find('#sel_bodega')
  //       .find('option')
  //       .eq(1)
  //       .then(option => {
  //         cy.iframe().find('#sel_bodega').select(option.val());
  //       });
  //     alert();
  //     let i = 2;

  //     function selectAndCheck(subnivel) {
  //       select(subnivel);
  //       cy.get('@selectedOption').then(optionText => {
  //         if (optionText !== 'CARPETA' && optionText !== 'ROLLO' && optionText !== 'ENTREPAÑO') {
  //           i++;
  //           selectAndCheck(i);
  //         }
  //       });
  //     }
      
  //     selectAndCheck(i);
  
  //     cy.iframe().find('#txtCodigoSerieSubserie').select('20');
  //     const id = Date.now();
  //     cy.iframe().find('#txtIdDocumental').type(`${id}`);
  //     cy.iframe().find('#txtNomUnidad').type(`${id}`);
  //     cy.iframe().find('#div_ultimo_nivel .ui-datepicker-trigger').first().click();
  //     cy.iframe().find('.ui-datepicker-calendar tbody td').contains('10').click();
  //     cy.iframe().find('#div_ultimo_nivel .ui-datepicker-trigger').last().click();
  //     cy.iframe().find('.ui-datepicker-calendar tbody td').contains('12').click();
  //     cy.iframe().find('#txtCarpetas').type('1');
  //     cy.iframe().find('#txtFolio').type('1-3');
  //     cy.iframe().find('#div_ultimo_nivel button[type="button"]').contains('ADICIONAR').click();
  //     cy.iframe().find('#jsp_alertMessage').should('include.text', 'LA UNIDAD DOCUMENTAL SE HA UBICADO EXITOSAMENTE.');
  //     cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button').last().click();

  //   });

  // });
  
  // it('Despacho Ministra', { defaultCommandTimeout: 40000 }, () => {
  //   cy.url().should('include', '/pages/application/1');
  //   cy.frameLoaded('#external-page');
  //   cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().should('be.visible').click();
  //   cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
  //   cy.wait(1000);

  //   cy.iframe().find('#dependences').select('100');
  //   cy.wait(1000);
  //   cy.iframe().find('ul li').contains('Inventarios').click();
  //   cy.iframe().find('li a').contains('Cargue de inventario AC').click();

  //   cy.wait(1000);
  //   cy.iframe().within(() => {
  //     cy.frameLoaded('#main-content');
  //     cy.iframe().find('#tipificador').select('0');
  //     cy.iframe().find('input[name="tipo_cargue"]').last().click();
  //     alert();
  //     cy.iframe().find('#sel_bodega')
  //       .find('option')
  //       .eq(1)
  //       .then(option => {
  //         cy.iframe().find('#sel_bodega').select(option.val());
  //       });
  //     alert();
  //     let i = 2;

  //     function selectAndCheck(subnivel) {
  //       select(subnivel);
  //       cy.get('@selectedOption').then(optionText => {
  //         if (optionText !== 'CARPETA' && optionText !== 'ROLLO' && optionText !== 'ENTREPAÑO') {
  //           i++;
  //           selectAndCheck(i);
  //         }
  //       });
  //     }
      
  //     selectAndCheck(i);
  
  //     cy.iframe().find('#txtCodigoSerieSubserie').select('20');
  //     const id = Date.now();
  //     cy.iframe().find('#txtIdDocumental').type(`${id}`);
  //     cy.iframe().find('#txtNomUnidad').type(`${id}`);
  //     cy.iframe().find('#div_ultimo_nivel .ui-datepicker-trigger').first().click();
  //     cy.iframe().find('.ui-datepicker-calendar tbody td').contains('10').click();
  //     cy.iframe().find('#div_ultimo_nivel .ui-datepicker-trigger').last().click();
  //     cy.iframe().find('.ui-datepicker-calendar tbody td').contains('12').click();
  //     cy.iframe().find('#txtCarpetas').type('1');
  //     cy.iframe().find('#txtFolio').type('1-3');
  //     cy.iframe().find('#div_ultimo_nivel button[type="button"]').contains('ADICIONAR').click();
  //     cy.iframe().find('#jsp_alertMessage').should('include.text', 'LA UNIDAD DOCUMENTAL SE HA UBICADO EXITOSAMENTE.');
  //     cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button').last().click();

  //   });

  // });

});

function select(subnivel) {
  cy.iframe().find(`#sel_sub_nivel_${subnivel}`)
    .find('option')
    .eq(1)
    .then(option => {
      const optionTextArray = option.text().split('');
      optionTextArray.pop();
      const optionText = optionTextArray.join('');
      cy.iframe().find(`#sel_sub_nivel_${subnivel}`).select(option.val());
      cy.wrap(optionText).as('selectedOption');
    });
  cy.iframe().find('.ui-dialog').should('be.visible');
  cy.iframe().find('.ui-dialog').should('not.be.visible');
}

function alert() {
  cy.iframe().find('.ui-dialog').should('be.visible');
  cy.iframe().find('.ui-dialog').should('not.be.visible');
}

function seleccionarDependencia() {
  switch (Cypress.env('ambiente')) {
    case 'Igualdad':
      cy.iframe().find('#dependences').select('120');
      break;
    case 'UNP':
      cy.iframe().find('#dependences').select('1200');
      break;
  }
  cy.wait(500);
}
