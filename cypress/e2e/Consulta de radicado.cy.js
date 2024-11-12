/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env('ambiente'));

describe('Consulta de radicado', () => {
  let radicadoExtEnv;
  let radicadoExtRec;
  let radicadoIntEnv;

  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion('pruebas02', 'puebas.jbpm05', env); //pruebas05
  });

  it('Flujo número 27', { defaultCommandTimeout: 40000 }, () => {
    cy.url().should('include', '/pages/application/1');

    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();

    ///Comunicación Externa Enviada///
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.then(() => {
      busquedaRadicadoExtEnv();
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').eq(1).find('.table-text-custom-secundary').then(($texto) => {
      const texto = $texto.text().trim().split(' ');
      radicadoExtEnv = texto[texto.length - 1];
    });
    cy.then(() => {
      cy.log(`${radicadoExtEnv}`);
    })
    cy.iframe().find('ul li').contains('Consulta').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('#tipo_comunicacion').type("Externa Enviada");
    cy.iframe().find('.ui-autocomplete-panel li').contains('Externa Enviada').click();
    cy.then(() => {
      cy.iframe().find('#nro_radicado').type(`${radicadoExtEnv}`);
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
      const radModificado = radicadoExtEnv.split('-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda sin prefijo
    cy.then(() => {
      let radModificado;
      switch (Cypress.env("ambiente")) {
        case "Igualdad":
          radModificado = radicadoExtEnv.split('S-');
          break;
          case "UNP":
          radModificado = radicadoExtEnv.split('OFI-');
          break;
      }
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    });
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    ///Comunicación Externa recibida///
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.then(() => {
      busquedaRadicadoExtRe();
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').eq(1).find('.table-text-custom-secundary').then(($texto) => {
      const texto = $texto.text().trim().split(' ');
      radicadoExtRec = texto[texto.length - 1];
    });
    cy.then(() => {
      cy.log(`${radicadoExtRec}`);
    })
    cy.iframe().find('ul li').contains('Consulta').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('#tipo_comunicacion').type("Externa Recibida");
    cy.iframe().find('.ui-autocomplete-panel li').contains('Externa Recibida').click();
    cy.then(() => {
      cy.iframe().find('#nro_radicado').type(`${radicadoExtRec}`);
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
      const radModificado = radicadoExtRec.split('-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda sin prefijo
    cy.then(() => {
      let radModificado;
      switch (Cypress.env("ambiente")) {
        case "Igualdad":
          radModificado = radicadoExtRec.split('E-');
          break;
          case "UNP":
          radModificado = radicadoExtRec.split('EXT-');
          break;
      }
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    });
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    ///Comunicación Interna Enviada///
    cy.iframe().find('.ultima-menu li').contains('Mis Asignaciones').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.then(() => {
      busquedaRadicadoIntEnv();
    });
    cy.iframe().find('p-progressspinner').should('exist');
    cy.iframe().find('p-progressspinner').should('not.exist');
    cy.iframe().find('.ui-datatable-scrollable-body').find('tr').first().find('td').eq(1).find('.table-text-custom-secundary').then(($texto) => {
      const texto = $texto.text().trim().split(' ');
      radicadoIntEnv = texto[texto.length - 1];
    });
    cy.then(() => {
      cy.log(`${radicadoIntEnv}`);
    })
    cy.iframe().find('ul li').contains('Consulta').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('#tipo_comunicacion').type("Interna Enviada");
    cy.iframe().find('.ui-autocomplete-panel li').contains('Interna Enviada').click();
    cy.then(() => {
      cy.iframe().find('#nro_radicado').type(`${radicadoIntEnv}`);
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
      const radModificado = radicadoIntEnv.split('-');
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    })
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    
    //Busqueda sin prefijo
    cy.then(() => {
      let radModificado;
      switch (Cypress.env("ambiente")) {
        case "Igualdad":
          radModificado = radicadoIntEnv.split('E-');
          break;
          case "UNP":
          radModificado = radicadoIntEnv.split('MEM-');
          break;
      }
      cy.iframe().find('#nro_radicado').clear().type(`${radModificado[radModificado.length - 1]}`);
    });
    cy.iframe().find('button.buttonMain[label="Buscar"]').last().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
  });
});

function busquedaRadicadoExtEnv() {
  cy.then(() => {
    switch (Cypress.env("ambiente")) {
      case "Igualdad":
        cy.iframe().find('#filter').type(`S-{enter}`);
        break;
        case "UNP":
        cy.iframe().find('#filter').type(`OFI-{enter}`);
        break;
    }
  })
}

function busquedaRadicadoExtRe() {
  cy.then(() => {
    switch (Cypress.env("ambiente")) {
      case "Igualdad":
        cy.iframe().find('#filter').type(`E-{enter}`);
        break;
        case "UNP":
        cy.iframe().find('#filter').type(`EXT-{enter}`);
        break;
    }
  })
}

function busquedaRadicadoIntEnv() {
  cy.then(() => {
    switch (Cypress.env("ambiente")) {
      case "Igualdad":
        cy.iframe().find('#filter').type(`I-{enter}`);
        break;
        case "UNP":
        cy.iframe().find('#filter').type(`MEM-{enter}`);
        break;
    }
  })
}