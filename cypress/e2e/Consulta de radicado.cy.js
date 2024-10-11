/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Consulta de radicado', () => {
  let radicadoS;
  let radicadoE;
  let radicadoI;
  before(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
  })
  beforeEach(() => {
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
  });

  it('Flujo número 27', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();

    ///Comunicación Externa Enviada///
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.then(() => {
      cy.iframe().find('#filter').type(`S-2024{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').eq(1).find('.table-text-custom-secundary').then(($texto) => {
      const texto = $texto.text().trim().split(' ');
      radicadoS = texto[texto.length - 1];
    });
    cy.then(() => {
      cy.log(`${radicadoS}`);
    })
    cy.iframe().find('ul li').contains('Consulta').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('#tipo_comunicacion').type("Externa Enviada");
    cy.iframe().find('.ui-autocomplete-panel li').contains('Externa Enviada').click();
    cy.then(() => {
      cy.iframe().find('#nro_radicado').type(`${radicadoS}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    //Busqueda por año
    cy.iframe().find('#nro_radicado').clear().type(`*2024*`);
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda con los dos últimos digitos
    cy.then(() => {
      const radModificado = radicadoS.split('-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda sin la letra
    cy.then(() => {
      const radModificado = radicadoS.split('S-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    });
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    ///Comunicación Externa recibida///
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.then(() => {
      cy.iframe().find('#filter').type(`E-2024{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').eq(1).find('.table-text-custom-secundary').then(($texto) => {
      const texto = $texto.text().trim().split(' ');
      radicadoE = texto[texto.length - 1];
    });
    cy.then(() => {
      cy.log(`${radicadoE}`);
    })
    cy.iframe().find('ul li').contains('Consulta').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('#tipo_comunicacion').type("Externa Recibida");
    cy.iframe().find('.ui-autocomplete-panel li').contains('Externa Recibida').click();
    cy.then(() => {
      cy.iframe().find('#nro_radicado').type(`${radicadoE}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    //Busqueda por año
    cy.iframe().find('#nro_radicado').clear().type(`*2024*`);
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda con los dos últimos digitos
    cy.then(() => {
      const radModificado = radicadoE.split('-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda sin la letra
    cy.then(() => {
      const radModificado = radicadoE.split('E-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    });
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    ///Comunicación Interna Enviada///
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.then(() => {
      cy.iframe().find('#filter').type(`I-2024{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').eq(1).find('.table-text-custom-secundary').then(($texto) => {
      const texto = $texto.text().trim().split(' ');
      radicadoI = texto[texto.length - 1];
    });
    cy.then(() => {
      cy.log(`${radicadoI}`);
    })
    cy.iframe().find('ul li').contains('Consulta').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('#tipo_comunicacion').type("Interna Enviada");
    cy.iframe().find('.ui-autocomplete-panel li').contains('Interna Enviada').click();
    cy.then(() => {
      cy.iframe().find('#nro_radicado').type(`${radicadoI}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    //Busqueda por año
    cy.iframe().find('#nro_radicado').clear().type(`*2024*`);
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda con los dos últimos digitos
    cy.then(() => {
      const radModificado = radicadoI.split('-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda sin la letra
    cy.then(() => {
      const radModificado = radicadoI.split('I-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    });
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
  });
});