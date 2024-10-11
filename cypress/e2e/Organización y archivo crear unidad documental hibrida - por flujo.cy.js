/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(100);

describe('Organización y archivo crear unidad documental hibrida - por flujo', () => {
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
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Correspondencia de entrada').click();

    //Datos generales
    cy.iframe().find('p-checkbox label').contains('Adjuntar documento').click();
    cy.iframe().find('#tipologiaDocumental').contains('empty').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Denuncia').click();
    cy.iframe().find('#numeroFolio input').type(4);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Prueba crear unidad documental");
    cy.iframe().find('#soporteAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Electrónico').click();
    cy.iframe().find('#tipoAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Cd').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('#soporteAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Electrónico').click();
    cy.iframe().find('#tipoAnexos').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Expediente').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();

    //Datos solicitante
    cy.iframe().find('#tipoNotificacion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Correo').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombreApellidos').type('S');
    cy.iframe().find('.ui-autocomplete-items li').contains('SEBAS').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Siguiente').not('[disabled]').click();

    //Dependencia destino
    cy.iframe().find('form.ng-invalid #sedeAdministrativa').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Secretaria General').click();
    cy.wait(300);
    cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Subd. Talento').click();
    cy.wait(300);
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Radicar').not('[disabled]').click();
    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoEntrada = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Finalizar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicadoEntrada}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf', 'cypress/docs/prueba2.pdf'], { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Asignar comunicaciones/////
    cy.get('input[type="text"]').type('pruebas02');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Talento').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoEntrada}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.ui-multiselect-label').click();
    cy.iframe().find('.ui-multiselect-items li').contains('pruebas03').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Asignar').click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Recibir y Gestionar documentos/////
    cy.get('input[type="text"]').type('pruebas03');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Talento').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Archivar Documento').click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar

    //Archivar documento
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('p-radiobutton[label="Creación de unidad documental  "]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ui-dropdown-items li').contains('PQRSD').click();
    cy.iframe().find('#generacionId').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Manual').click();
    const id = Date.now();
    cy.iframe().find('#identificador').type(`${id}`);
    cy.iframe().find('#nombre').type(`${id}`);
    cy.iframe().find('button.buttonMain').contains("Agregar").click();
    cy.iframe().find('.ui-datatable-scrollable-body').eq(1).find('tr').first().click();
    
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

    //Consultar creación - Gestión electrónica
    cy.iframe().find('app-menu ul li').contains('Consulta').click();
    cy.iframe().find('#depP').type("Subd. Talento");
    cy.iframe().find('.ui-autocomplete-items li').contains('SUBD. TALENTO').click();
    cy.iframe().find('#sCode').type("P");
    cy.iframe().find('.ui-autocomplete-items li').contains('PQRSD').click();
    cy.iframe().find('#udName').type(`${id}`);
    cy.iframe().find('button.buttonMain[label="Buscar"]').first().click();
    cy.iframe().find('.ui-datatable-scrollable-body tr').first().find("td").eq(6).should('include.text', 'Híbrido');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Consultar creación - Gestión Física/////
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
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