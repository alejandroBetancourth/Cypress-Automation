/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Mgaf creación ubicación física AC', {
  retries: {
    runMode: 2, 
    openMode: 2
  }
}, () => {
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Secretaria General - Interna', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');
    cy.frameLoaded('#external-page');    
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().should('be.visible').click();
    cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    
    cy.wait(1000);
    cy.iframe().find('#dependences').select('120');
    cy.wait(1000);
    cy.iframe().find('ul li').contains('Almacenamiento').click();
    cy.iframe().find('li a').contains('Niveles almacenamiento AC').click();

    cy.wait(1000);
    cy.iframe().within(() => {
      
      cy.frameLoaded('#main-content');
      ///Interna///

      cy.iframe().find('#idTipoBodega').select('62');
      const id = Date.now();
      cy.iframe().find('#bodega_nombre').type(`${id}`);
      cy.iframe().find('#bodega_descripcion').type("Test de creación");
      cy.iframe().find('#bodega_capacidad').type(5);
      cy.iframe().find('button[type="button"]').contains("ADICIONAR").click();
      cy.iframe().find('input[data-column="3"]').type(`${id}`);
      cy.wait(300)
      cy.iframe().find('#table_bodegas tbody tr').not('.filtered').find('input').click();
      cy.iframe().find('button[type="button"]').contains('SIGUIENTE').click();

      //Pisos
      for (let i = 0; i < 5; i++) {
        i%2 == 0 ? niveles('', '_1', i, '5') : niveles('', '_1', i, '3');
      }
      cy.iframe().find('div#dContainer input[type="radio"]').eq(0).click();
      cy.iframe().find('div#dContainer button[type="button"]').contains('SIGUIENTE').click();

      //Cajas
      for (let i = 0; i < 5; i++) {
        i%2 == 0 ? niveles('_1', '_2', i, '6') : niveles('_1', '_2', i, '7');
      }
      cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(0).click();
      cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();

      //Carpetas
      for (let i = 0; i < 5; i++) {
        niveles('_2', '_3', i);
      }
      
      //Cajas - Caja2
      cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(1).click();
      cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();
      //Rollos
      for (let i = 0; i < 5; i++) {
        niveles('_2', '_3', i);
      }
      
      //Cajas - Caja3
      cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(2).click();
      cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();
      //Carpetas
      for (let i = 0; i < 5; i++) {
        niveles('_2', '_3', i);
      }
      
    });
  });

  // it('Secretaria General - Externa', { defaultCommandTimeout: 40000 }, () => {
  //   cy.url().should('include', '/pages/application/1');
  //   cy.frameLoaded('#external-page');    
  //   cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().should('be.visible').click();
  //   cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    
  //   cy.wait(1000);
  //   cy.iframe().find('#dependences').select('120');
  //   cy.wait(1000);
  //   cy.iframe().find('ul li').contains('Almacenamiento').click();
  //   cy.iframe().find('li a').contains('Niveles almacenamiento AC').click();

  //   cy.wait(1000);
  //   cy.iframe().within(() => {
      
  //     cy.frameLoaded('#main-content');

  
  //     cy.iframe().find('#idTipoBodega').select('63');
  //     const id2 = Date.now();
  //     cy.iframe().find('#bodega_nombre').clear().type(`${id2}`);
  //     cy.iframe().find('#bodega_descripcion').clear().type("Test de creación");
  //     cy.iframe().find('#bodega_capacidad').clear().type(5);
  //     cy.iframe().find('.div_niveles').first().find('button[type="button"]').contains("ADICIONAR").click();
  //     cy.iframe().find('#table_bodegas input[data-column="3"]').clear().type(`${id2}`);
  //     cy.wait(300);
  //     cy.iframe().find('#table_bodegas tbody tr').not('.filtered').find('input').click();
  //     cy.iframe().find('.div_niveles').first().find('button[type="button"]').contains('SIGUIENTE').click();

  //     //Pisos
  //     for (let i = 0; i < 5; i++) {
  //       i%2 == 0 ? niveles('', '_1', i, '5') : niveles('', '_1', i, '3');
  //     }
  //     cy.iframe().find('div#dContainer input[type="radio"]').eq(0).click();
  //     cy.iframe().find('div#dContainer button[type="button"]').contains('SIGUIENTE').click();

  //     //Cajas
  //     for (let i = 0; i < 5; i++) {
  //       i%2 == 0 ? niveles('_1', '_2', i, '6') : niveles('_1', '_2', i, '7');
  //     }
  //     cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(0).click();
  //     cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();

  //     //Carpetas
  //     for (let i = 0; i < 5; i++) {
  //       niveles('_2', '_3', i);
  //     }

  //     //Cajas - Caja2
  //     cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(1).click();
  //     cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();
  //     //Rollos
  //     for (let i = 0; i < 5; i++) {
  //       niveles('_2', '_3', i);
  //     }

  //     //Cajas - Caja3
  //     cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(2).click();
  //     cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();
  //     //Carpetas
  //     for (let i = 0; i < 5; i++) {
  //       niveles('_2', '_3', i);
  //     }
      
  //   });
  // });

  // it('Subd. Talento Humano - Despacho Ministra', { defaultCommandTimeout: 40000 }, () => {
  //   cy.url().should('include', '/pages/application/1');
  //   cy.frameLoaded('#external-page');    
  //   cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().should('be.visible').click();
  //   cy.get('ul.ultima-main-menu li').contains('Gestión Física').parent().click();
    
  //   cy.wait(1000);
  //   ///Subd. Talento Humano///
  //   cy.iframe().find('#dependences').select('121');
  //   cy.wait(1000);
  //   cy.iframe().find('ul li').contains('Almacenamiento').click();
  //   cy.iframe().find('li a').contains('Niveles almacenamiento AC').click();

  //   cy.wait(1000);
  //   cy.iframe().within(() => {
  //     cy.frameLoaded('#main-content');
  //     cy.iframe().find('#idTipoBodega').select('62');
  //     const id = Date.now();
  //     cy.iframe().find('#bodega_nombre').type(`${id}`);
  //     cy.iframe().find('#bodega_descripcion').type("Test de creación");
  //     cy.iframe().find('#bodega_capacidad').type(5);
  //     cy.iframe().find('button[type="button"]').contains("ADICIONAR").click();
  //     cy.iframe().find('input[data-column="3"]').type(`${id}`);
  //     cy.wait(300)
  //     cy.iframe().find('#table_bodegas tbody tr').not('.filtered').find('input').click();
  //     cy.iframe().find('button[type="button"]').contains('SIGUIENTE').click();

  //     //Pisos
  //     for (let i = 0; i < 5; i++) {
  //       i%2 == 0 ? niveles('', '_1', i, '5') : niveles('', '_1', i, '3');
  //     }
  //     cy.iframe().find('div#dContainer input[type="radio"]').eq(0).click();
  //     cy.iframe().find('div#dContainer button[type="button"]').contains('SIGUIENTE').click();

  //     //Cajas
  //     for (let i = 0; i < 5; i++) {
  //       i%2 == 0 ? niveles('_1', '_2', i, '6') : niveles('_1', '_2', i, '7');
  //     }
  //     cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(0).click();
  //     cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();

  //     //Carpetas
  //     for (let i = 0; i < 5; i++) {
  //       niveles('_2', '_3', i);
  //     }
      
  //     //Cajas - Caja2
  //     cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(1).click();
  //     cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();
  //     //Rollos
  //     for (let i = 0; i < 5; i++) {
  //       niveles('_2', '_3', i);
  //     }
      
  //   });

  //   ///Despacho ministra///
  //   cy.iframe().find('#dependences').select('100');
  //   cy.wait(1000);
  //   cy.iframe().find('ul li').contains('Almacenamiento').click();
  //   cy.iframe().find('li a').contains('Niveles almacenamiento AC').click();

  //   cy.wait(1000);
  //   cy.iframe().within(() => {
  //     cy.frameLoaded('#main-content');
  //     cy.iframe().find('#idTipoBodega').select('62');
  //     const id2 = Date.now();
  //     cy.iframe().find('#bodega_nombre').type(`${id2}`);
  //     cy.iframe().find('#bodega_descripcion').type("Test de creación");
  //     cy.iframe().find('#bodega_capacidad').type(5);
  //     cy.iframe().find('button[type="button"]').contains("ADICIONAR").click();
  //     cy.iframe().find('input[data-column="3"]').type(`${id2}`);
  //     cy.wait(300)
  //     cy.iframe().find('#table_bodegas tbody tr').not('.filtered').find('input').click();
  //     cy.iframe().find('button[type="button"]').contains('SIGUIENTE').click();

  //     //Pisos
  //     for (let i = 0; i < 5; i++) {
  //       i%2 == 0 ? niveles('', '_1', i, '5') : niveles('', '_1', i, '3');
  //     }
  //     cy.iframe().find('div#dContainer input[type="radio"]').eq(0).click();
  //     cy.iframe().find('div#dContainer button[type="button"]').contains('SIGUIENTE').click();

  //     //Cajas
  //     for (let i = 0; i < 5; i++) {
  //       i%2 == 0 ? niveles('_1', '_2', i, '6') : niveles('_1', '_2', i, '7');
  //     }
  //     cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(0).click();
  //     cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();

  //     //Carpetas
  //     for (let i = 0; i < 5; i++) {
  //       niveles('_2', '_3', i);
  //     }
      
  //     //Cajas - Caja2
  //     cy.iframe().find('div#dContainer_1 input[type="radio"]').eq(1).click();
  //     cy.iframe().find('div#dContainer_1 button[type="button"]').contains('SIGUIENTE').click();
  //     //Rollos
  //     for (let i = 0; i < 5; i++) {
  //       niveles('_2', '_3', i);
  //     }
      
  //   });
  // });
});

function niveles(nivel, subnivel, i, ubicacion) {
  cy.iframe().find(`div#dContainer${nivel} input[type="radio"]`).eq(`${i}`).click();
  if(ubicacion) {
    cy.iframe().find(`div#dContainer${nivel} #capacidadSubNivel${subnivel}`).clear().type(5);
    cy.iframe().find(`div#dContainer${nivel} #idTipoSubNivel${subnivel}`).select(`${ubicacion}`);
  } else {
    cy.iframe().find(`div#dContainer${nivel} #capacidadSubNivel${subnivel}`).clear().type(100);
  }
  cy.iframe().find(`div#dContainer${nivel} button[type="button"]`).contains('ACTUALIZAR').click();
  cy.iframe().find('.ui-dialog .ui-dialog-buttonpane button[type="button"]').click();
}