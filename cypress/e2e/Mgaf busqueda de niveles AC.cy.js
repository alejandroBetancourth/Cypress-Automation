/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Mgaf búsqueda de niveles AC',{
  retries: {
    runMode: 2, 
    openMode: 2
  }
}, () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Secretaria General', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    cy.frameLoaded('#external-page');
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().should('be.visible').click();
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    cy.wait(1000);

    cy.iframe().find('#dependences').select('120');
    cy.wait(1000);
    cy.iframe().find('ul li').contains('Almacenamiento').click();
    cy.iframe().find('li a').contains('Búsqueda de Niveles AC').click();

    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded('#main-content');
      cy.iframe().find('#estado_tipo').select('3');
      alert();
      
      let i = 1;

      function selectAndCheck(subnivel) {
        select(subnivel);
        cy.get('@selectedOption').then(optionText => {
          if (optionText !== 'CAJA' && optionText !== 'ENTREPAÑO' && optionText !== 'ESTANTE') {
            subnivel++;
            selectAndCheck(subnivel);
          }
        });
      }
      
      selectAndCheck(i);
      cy.iframe().find('button[type="button"]').click();
      alert();
      cy.iframe().find('#tableresult tbody tr').should('have.length.at.least', 1);
      for (let i = 0; i < 4; i++) {
        cy.iframe().find('#tableresult tbody tr td').eq(i).should('have.length.at.least', 1);
      }

      //Ocupado
      cy.iframe().find('#estado_tipo').select('1');
      alert();
      select(0);
      let j = 2;
      
      selectAndCheck(j);
      cy.iframe().find('button[type="button"]').click();
      alert();
      cy.iframe().find('#tableresult tbody tr').should('have.length.at.least', 1);
      for (let i = 0; i < 4; i++) {
        cy.iframe().find('#tableresult tbody tr td').eq(i).should('have.length.at.least', 1);
      }

    });

  });
  
  it('Subd. Talento Humano', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    cy.frameLoaded('#external-page');
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().should('be.visible').click();
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    cy.wait(1000);

    cy.iframe().find('#dependences').select('121');
    cy.wait(1000);
    cy.iframe().find('ul li').contains('Almacenamiento').click();
    cy.iframe().find('li a').contains('Búsqueda de Niveles AC').click();

    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded('#main-content');
      cy.iframe().find('#estado_tipo').select('3');
      alert();
      
      let i = 1;

      function selectAndCheck(subnivel) {
        select(subnivel);
        cy.get('@selectedOption').then(optionText => {
          if (optionText !== 'CAJA' && optionText !== 'ENTREPAÑO' && optionText !== 'ESTANTE') {
            subnivel++;
            selectAndCheck(subnivel);
          }
        });
      }
      
      selectAndCheck(i);
      cy.iframe().find('button[type="button"]').click();
      alert();
      cy.iframe().find('#tableresult tbody tr').should('have.length.at.least', 1);
      for (let i = 0; i < 4; i++) {
        cy.iframe().find('#tableresult tbody tr td').eq(i).should('have.length.at.least', 1);
      }

      //Ocupado
      cy.iframe().find('#estado_tipo').select('1');
      alert();
      select(0);
      let j = 2;
      
      selectAndCheck(j);
      cy.iframe().find('button[type="button"]').click();
      alert();
      cy.iframe().find('#tableresult tbody tr').should('have.length.at.least', 1);
      for (let i = 0; i < 4; i++) {
        cy.iframe().find('#tableresult tbody tr td').eq(i).should('have.length.at.least', 1);
      }

    });

  });

  it('Despacho Ministra', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    cy.frameLoaded('#external-page');
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().should('be.visible').click();
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    cy.wait(1000);

    cy.iframe().find('#dependences').select('100');
    cy.wait(1000);
    cy.iframe().find('ul li').contains('Almacenamiento').click();
    cy.iframe().find('li a').contains('Búsqueda de Niveles AC').click();

    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded('#main-content');
      cy.iframe().find('#estado_tipo').select('3');
      alert();
      
      let i = 1;

      function selectAndCheck(subnivel) {
        select(subnivel);
        cy.get('@selectedOption').then(optionText => {
          if (optionText !== 'CAJA' && optionText !== 'ENTREPAÑO' && optionText !== 'ESTANTE') {
            subnivel++;
            selectAndCheck(subnivel);
          }
        });
      }
      
      selectAndCheck(i);
      cy.iframe().find('button[type="button"]').click();
      alert();
      cy.iframe().find('#tableresult tbody tr').should('have.length.at.least', 1);
      for (let i = 0; i < 4; i++) {
        cy.iframe().find('#tableresult tbody tr td').eq(i).should('have.length.at.least', 1);
      }

      //Ocupado
      cy.iframe().find('#estado_tipo').select('1');
      alert();
      select(0);
      let j = 2;
      
      selectAndCheck(j);
      cy.iframe().find('button[type="button"]').click();
      alert();
      cy.iframe().find('#tableresult tbody tr').should('have.length.at.least', 1);
      for (let i = 0; i < 4; i++) {
        cy.iframe().find('#tableresult tbody tr td').eq(i).should('have.length.at.least', 1);
      }

    });

  });

});

function select(subnivel) {
  cy.iframe().find(`#sel_sub_nivel_${subnivel}`)
    .find('option')
    .eq(1)
    .then(option => {
      const optionTextArray = option.text().split('');
      do {
        optionTextArray.pop();
      } while (!isNaN(optionTextArray[optionTextArray.length - 1]));
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

