/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env("ambiente"));

describe("Organización y archivo crear unidad documental hibrida - por demanda", () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.inicioSesion("pruebas01", "puebas.jbpm05", env);
  });

  it("Flujo número 22", { defaultCommandTimeout: 40000 }, () => {
    cy.url().should("include", "/pages/application/1");

    cy.wait(500);
    cy.frameLoaded("#external-page");
    cy.wait(1000);
    cy.seleccionarDependencia(
      "Subd. Talento Humano",
      "Subdireccion De Talento Humano"
    );
    cy.iframe().find("ul li").contains("Gestión de Expedientes").click();
    cy.iframe().find("li a").contains("Organización y Archivo").click();

    //Organización y archivo
    cy.iframe()
      .find('p-radiobutton[label="Creación de unidad documental  "]')
      .click();
    selUnidadDocumental();
    cy.iframe().find("#generacionId").click();
    cy.iframe().find(".ui-dropdown-items li").contains("Manual").click();
    const id = Date.now();
    cy.iframe().find("#identificador").type(`${id}`);
    cy.iframe().find("#nombre").type(`${id}`);
    cy.iframe().find("button.buttonMain").contains("Agregar").click();
    cy.iframe()
      .find(".ui-datatable-scrollable-body")
      .first()
      .find("tr")
      .first()
      .click();

    //Agregar ubicación topográfica

    let i = 0;

    function selectAndCheck(subnivel) {
      select(subnivel);
      cy.wait(300);
      cy.iframe()
        .find('button[label="Crear"]')
        .then(($button) => {
          if ($button.is(":disabled")) {
            subnivel++;
            selectAndCheck(subnivel);
          } else {
            cy.wrap($button).click();
          }
        });
    }

    selectAndCheck(i);
    cy.iframe()
      .find('div[role="dialog"] .ui-dialog-footer button')
      .contains("Si")
      .click();
    cy.wait(2000);
    cy.iframe()
      .find(".ui-datatable-scrollable-body")
      .last()
      .find("tr")
      .first()
      .find("td")
      .first()
      .click();
    cy.iframe().find("button.buttonMain").contains("Siguiente").click();

    //Consultar creación - Gestión electrónica
    cy.iframe().find("app-menu ul li").contains("Consulta").click();
    cy.iframe().find("#depP .ui-autocomplete-dropdown").click();
    switch (Cypress.env("ambiente")) {
      case "Igualdad":
        cy.iframe()
          .find(".ui-autocomplete-items li")
          .contains("SUBD. TALENTO")
          .click();
        break;
      case "UNP":
        cy.iframe()
          .find(".ui-autocomplete-items li")
          .contains("SUBDIRECCION DE TALENTO")
          .click();
        break;
    }
    cy.iframe().find("#sCode .ui-autocomplete-dropdown").click();

    switch (Cypress.env("ambiente")) {
      case "Igualdad":
        cy.iframe().find(".ui-autocomplete-items li").contains("PQRSD").click();
        break;
      case "UNP":
        cy.iframe()
          .find(".ui-autocomplete-items li")
          .contains("INFORMES")
          .click();
        break;
    }
    cy.iframe().find("#udName").type(`${id}`);
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe()
      .find(".ui-datatable-scrollable-body tr")
      .first()
      .find("td")
      .eq(6)
      .should("include.text", "Híbrido");

    //Consultar creación - Gestión Física
    cy.get("ul.ultima-main-menu li")
      .contains("Gestión Física")
      .parent()
      .click();
    cy.get(".ui-blockui").should("have.css", "display", "block");
    cy.get(".ui-blockui").should("have.css", "display", "none");
    cy.wait(1000);
    seleccionarDependencia();

    cy.iframe().find("ul li").contains("Inventarios").click();
    cy.iframe().find("li a").contains("Cargue de inventario AG").click();

    cy.wait(1000);
    cy.iframe().within(() => {
      cy.frameLoaded("#main-content");
      cy.iframe().find("#tipo_soportedep1").select("TIP_SOP3");
      switch (Cypress.env("ambiente")) {
        case "Igualdad":
          cy.iframe().find("#serieSubserieSearch").select("2");
          break;
        case "UNP":
          cy.iframe().find("#serieSubserieSearch").select("9-42");
          break;
      }
      cy.then(() => {
        cy.iframe().find("#descripcionDocumento").type(`${id}`);
      });
      cy.iframe().find('button[type="button"]').contains("BUSCAR").click();
      cy.iframe().find("table#table_unidad tbody tr").should("have.length", 1);
    });
  });
});

function select(subnivel) {
  cy.iframe()
    .find("app-datos-unidad-conservacion p-dropdown")
    .eq(subnivel)
    .click();
  cy.iframe().find(".ui-dropdown-items li").first().click();
}

function selUnidadDocumental() {
  cy.iframe().find("#serie").click();

  switch (Cypress.env("ambiente")) {
    case "Igualdad":
      cy.iframe()
        .find(".ng-trigger-overlayAnimation li")
        .contains("PQRSD")
        .click();
      break;
    case "UNP":
      cy.iframe()
        .find(".ng-trigger-overlayAnimation li")
        .contains("INFORMES")
        .click();
      cy.iframe().find("#tipoId").click();
      cy.iframe()
        .find(".ng-trigger-overlayAnimation li")
        .contains("Informes de Gestión")
        .click();
      break;
  }
}

function seleccionarDependencia() {
  switch (Cypress.env("ambiente")) {
    case "Igualdad":
      cy.iframe().find("#dependences").select("121");
      break;
    case "UNP":
      cy.iframe().find("#dependences").select("2000");
      break;
  }
  cy.wait(500);
}
