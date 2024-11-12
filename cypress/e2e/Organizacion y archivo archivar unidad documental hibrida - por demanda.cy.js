/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);
const env = Cypress.env(Cypress.env("ambiente"));

describe("Organización y archivo archivar unidad documental hibrida", () => {
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
      cy.wait(500);
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
    cy.iframe().find("p-progressspinner").should("exist");
    cy.iframe().find("p-progressspinner").should("not.exist");
    cy.iframe()
      .find(".ui-datatable-scrollable-body")
      .last()
      .find("tr")
      .first()
      .find("td")
      .first()
      .click();
    cy.iframe().find("button.buttonMain").contains("Siguiente").click();

    //Documentos a archivar
    cy.iframe()
      .find('input[type="file"]')
      .selectFile(["cypress/docs/prueba.pdf", "cypress/docs/prueba2.pdf"], {
        force: true,
      });
    cy.iframe()
      .find(".ui-datatable-tablewrapper tbody tr")
      .first()
      .find("td")
      .first()
      .click();
    cy.iframe()
      .find(".ui-datatable-tablewrapper tbody tr")
      .first()
      .find("td")
      .eq(3)
      .click();
    cy.iframe().find(".ui-dropdown-items li").first().click();
    cy.iframe().find(".ui-dialog-footer button").contains("Si").click();
    cy.iframe()
      .find(".ui-datatable-thead tr")
      .first()
      .find("th")
      .first()
      .click();
    cy.iframe().find(".ui-icon-folder").first().click();
    cy.iframe().find(".ui-dialog-footer button").contains("Si").click();
  });
});

function select(subnivel) {
  cy.iframe()
    .find("app-datos-unidad-conservacion p-dropdown")
    .eq(subnivel)
    .click();
  cy.iframe()
    .find(".ui-dropdown-items li")
    .first()
    .then((option) => {
      const optionTextArray = option.text().split("");
      do {
        optionTextArray.pop();
      } while (!isNaN(optionTextArray[optionTextArray.length - 1]));
      const optionText = optionTextArray.join("");
      cy.wrap(optionText).as("selectedOption");
    });
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
