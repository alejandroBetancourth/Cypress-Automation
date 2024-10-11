/// <reference types="Cypress" />
import { slowCypressDown } from "cypress-slow-down";

// slowCypressDown(300);

//pruebas03 sin rol digitalizador
describe(
  'Distribución física planillas - Gestión de entregas - Recibo documentos físicos', 
  {
    retries: {
      runMode: 3, 
      openMode: 3
    }
  }, () => {
  let radicadoEntrada; //No distribución física
  let radicadoEntrada2; //Con distribución física y se archiva
  let radicadoSalida; //Con distribución física y se deja en la tarea archivar
  let radicadoSalida2; //No distribución física y se archiva
  let planilla;

  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit('https://40.70.40.215/soaint-toolbox-front/#/login');
  });
  
  it('Con distribución física', { defaultCommandTimeout: 40000 }, () => {
    // cy.reload();
    cy.get('input[type="text"]').clear().type('pruebas01');
    cy.get('input[type="password"]').clear().type('Soadoc123');
    cy.get('button').click();
    cy.url().should('include', '/pages/application/1');

    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. De Contratacion').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Producción multiples documentos').click();

    cy.iframe().find('#tipoPlantilla').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('.ui-card-content button.buttonMainNext').click();

    //Datos generales
    cy.iframe().find('#subject').type("Prueba escenario por demanda");
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Principal').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Natural').click();
    cy.iframe().find('#nombre').type('C');
    cy.iframe().find('.ui-autocomplete-panel').contains('CAMILA COSSIO').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain').contains('Aceptar').click();
    cy.iframe().find('p-checkbox').contains('Física').click();
    cy.iframe().find('#clase_envio').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Local').click();
    cy.iframe().find('#modalidad_correo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('A La Mano').click();

    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Con Copia').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Anónimo').click();
    cy.iframe().find('div[role="dialog"] button.buttonHeaderTable').click();
    cy.iframe().find('div[role="dialog"] p-dropdown[formcontrolname="tipoContacto"]').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Otra').click();
    cy.iframe().find('div[role="dialog"] .ui-accordion-header').first().click();
    cy.iframe().find('#correoEle').type("correo@prueba.com");
    //Datos dirección
    cy.iframe().find('p-dropdown#tipoVia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Diagonal').click();
    cy.iframe().find('input#noViaPrincipal').type("2");
    cy.iframe().find('p-dropdown#prefijoCuadrante').click();
    cy.iframe().find('.ui-dropdown-items li').contains('B').first().click();
    cy.iframe().find('p-dropdown#bis').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Bis').click();
    cy.iframe().find('p-dropdown#orientacion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Norte').click();
    cy.iframe().find('input#noVia').type("3");
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains("Guardar").click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('div[role="dialog"] button.buttonMain').contains('Aceptar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();

    //Edición documento principal
    cy.iframe().find('.fa-plus').click();
    cy.iframe().find('.iconSave').click();
    cy.iframe().find('p-confirmdialog button').contains('Aceptar').click();

    //Relación de anexos
    cy.iframe().find('input[name="soporte"]').eq(1).click();
    cy.iframe().find('#tipoAnexo').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Fotografías').click();
    cy.iframe().find('.buttonMain input[type="file"]').selectFile('cypress/docs/prueba.pdf', { force: true });
    cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
    cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.iframe().find('div').contains('N°. Radicado :').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoSalida = uniDocumental.split(':')[1]?.trim() || '';
    });
    //Firmar documento
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoSalida}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.wait(5000);
    cy.iframe().find('app-root').then($body => {
      if ($body.find('a.ui-dialog-titlebar-icon').length) {
        cy.iframe().find('.ticket-radicado').should('exist');
        cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
          const uniDocumental = $radicado.text();
          radicadoSalida = uniDocumental.split(':')[1]?.trim() || '';
        });
        cy.iframe().find('a.ui-dialog-titlebar-icon').click();
      } else {
        cy.log('El elemento no existe');
      }
    });
    cy.iframe().find('.buttonMainNext').contains('Firmar').click();
    cy.iframe().find('p-menu li').contains('sistema').click();
    cy.iframe().find('#pass').type(12345);
    cy.iframe().find('button.buttonMain').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    //Archivar
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoSalida}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    
  });
  /////Flujo número 2/////
  it('Parte 2 - sin distribución física', { defaultCommandTimeout: 40000 }, () => {
    // cy.reload();
    cy.get('input[type="text"]').clear().type('pruebas02');
    cy.get('input[type="password"]').clear().type('Soadoc123');
    cy.get('button').click();
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
    cy.iframe().find('#reqDistFisica').click();
    cy.iframe().find('#medioRecepcion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Ventanilla Sede').click();
    cy.iframe().find('#tipologiaDocumental').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Reclamo').click();
    cy.iframe().find('#numeroFolio input').type(4);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("No se marca distribución física");
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
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Continuar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicadoEntrada}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf'], { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();

    /////Asignar comunicaciones/////
    cy.get('input[type="text"]').type('pruebas04');
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
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Tramitar').click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    
    //Recibir y gestionar documentos
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Archivar').click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    //Archivar
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    
  });
  
  it('Parte 3 - con distribución física', { defaultCommandTimeout: 40000 }, () => {
    // cy.reload();
    cy.get('input[type="text"]').clear().type('pruebas04');
    cy.get('input[type="password"]').clear().type('Soadoc123');
    cy.get('button').click();
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
    cy.iframe().find('#medioRecepcion').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Ventanilla Sede').click();
    cy.iframe().find('#tipologiaDocumental').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Circular').click();
    cy.iframe().find('#numeroFolio input').type(4);
    cy.iframe().find('textarea[formcontrolname="asunto"]').type("Prueba con distribución física");
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
    cy.iframe().find('.ui-dropdown-items li').contains('Nivel Central').click();
    cy.wait(300);
    cy.iframe().find('form.ng-invalid #dependenciaGrupo').click();
    cy.wait(300);
    cy.iframe().find('.ui-dropdown-items li').contains('Despacho Ministra').click();
    cy.wait(300);
    cy.iframe().find('form.ng-invalid button.buttonMain').contains('Agregar').not('[disabled]').click();
    cy.iframe().find('button.buttonMain .ui-clickable').contains('Radicar').not('[disabled]').click();
    cy.iframe().find('.ticket-radicado').should('exist');
    cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoEntrada2 = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.iframe().find('.ticket-radicado [class*="close"]').click();
    cy.iframe().find('.ui-card-content .page-buttons button').last().click(); //Btn Continuar
    cy.then(() => {
      cy.iframe().find('h2.page-title-primary').contains(`${radicadoEntrada2}`).should('exist');
    });
    cy.wait(1000);
    cy.iframe().find('.ui-fileupload input[type="file"]').selectFile(['cypress/docs/prueba.pdf'], { force: true });
    cy.iframe().find('p-radiobutton').first().click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('button').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('.ui-dialog-footer').contains('Aceptar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Asignar comunicaciones/////
    cy.get('input[type="text"]').type('pruebas03');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.iframe().find('ul li').contains('Gestión de Documentos').click();
    cy.iframe().find('li a').contains('Asignar comunicaciones').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoEntrada2}`);
    });
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Ver detalles"]').click();
    cy.iframe().find('a[role="button"]').click();
    cy.iframe().find('.ui-multiselect-label').click();
    cy.iframe().find('.ui-multiselect-items li').contains('pruebas05').click();
    cy.iframe().find('.iconsMenu').click();
    cy.iframe().find('.ng-trigger.ui-menu li').contains('Asignar').click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Recibir y Gestionar documentos/////
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada2}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('form[name="formDefault"] p-dropdown').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Producir Documento').click();
    cy.iframe().find('button.buttonMain').contains('Gestionar').parent().click();
    cy.iframe().find('.ui-card-content button.buttonMain').click(); //Finalizar
    
    //Gestión producción múltiples documentos
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada2}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('#tipoPlantilla').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Oficio').click();
    cy.iframe().find('button.buttonMain').contains('Agregar').click();
    cy.iframe().find('button.buttonMainNext').click();
    
    //Producir documento
    cy.iframe().find('#subject').type("Prueba sin distribución respuesta");
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('p-checkbox').contains('Electrónica Certificada').click();
    cy.iframe().find('.buttonHeaderTable').contains('Agregar').click();
    cy.iframe().find('#tipoDestinatario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Principal').click();
    cy.iframe().find('#tipoPersona').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Anónimo').click();
    cy.iframe().find('div[role="dialog"] .buttonHeaderTable').click();
    cy.iframe().find('i[ptooltip="Editar"]').click();
    cy.iframe().find('p-accordiontab').first().click();
    cy.iframe().find('#correoEle').type("correo@prueba.com");
    cy.iframe().find('p-accordion button.buttonMain').click();
    cy.iframe().find('p-dtradiobutton').click();
    cy.iframe().find('button.buttonMain').contains('Aceptar').click();
    
    //Gestionar producción
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('#sede').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Poblaciones').click();
    cy.wait(300);
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Dir. De Cuidado').click();
    cy.wait(300);
    cy.iframe().find('#rol').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Aprobador').click();
    cy.wait(300);
    cy.iframe().find('#funcionario').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Pruebas01').click();
    cy.iframe().find('.ui-panel-content-wrapper button.buttonMain').last().contains('Agregar').click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    
    //Edición documento principal
    cy.iframe().find('.fa-plus').click();
    cy.iframe().find('.iconSave').click();
    cy.iframe().find('p-confirmdialog button').contains('Aceptar').click();
    cy.wait(1000);
    cy.iframe().find('.buttonMainNext').contains('Continuar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Aprobar documento/////
    cy.get('input[type="text"]').type('pruebas01');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Dir. De Cuidado').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoEntrada2}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('button.buttonMainNext').contains('Aprobar').click();
    cy.iframe().find('.ui-menuitem').contains('Aprobar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.iframe().find('div').contains('N°. Radicado :').parent().then(($radicado) => {
      const uniDocumental = $radicado.text();
      radicadoSalida2 = uniDocumental.split(':')[1]?.trim() || '';
    });
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoSalida2}{enter}`);
    });
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').first().click();
    cy.wait(5000);
    cy.iframe().find('app-root').then($body => {
      if ($body.find('a.ui-dialog-titlebar-icon').length) {
        cy.iframe().find('.ticket-radicado').should('exist');
        cy.iframe().find('div').contains('N°. Radicado:').parent().then(($radicado) => {
          const uniDocumental = $radicado.text();
          radicadoSalida2 = uniDocumental.split(':')[1]?.trim() || '';
        });
        cy.iframe().find('a.ui-dialog-titlebar-icon').click();
      } else {
        cy.log('El elemento no existe');
      }
    });
    cy.iframe().find('.buttonMainNext').contains('Firmar').click();
    cy.iframe().find('p-menu li').contains('sistema').click();
    cy.iframe().find('#pass').type(12345);
    cy.iframe().find('button.buttonMain').contains('Guardar').click();
    cy.iframe().find('button.buttonMain').contains('Finalizar').click();
    cy.iframe().find('h2.page-title-primary').contains('Mis asignaciones').should('exist');
    cy.get('a .letrasMinagricultura').click();
    cy.get('.ultima-menu li[role="menuitem"]').contains('Cerrar').click();
    
    /////Archivar documento/////
    cy.get('input[type="text"]').type('pruebas05');
    cy.get('input[type="password"]').type('Soadoc123');
    cy.get('button').click();
    cy.wait(2000);
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Despacho Ministra').click();
    cy.iframe().find('ul li').contains('Mis Asignaciones').click();
    cy.then(() => {
      cy.iframe().find('#filter').type(`${radicadoSalida2}{enter}`);
    });
    cy.wait(1000);
    cy.iframe().find('.ui-datatable-data tr i[ptooltip="Iniciar"]').click();
    cy.iframe().find('#serie').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('PQRSD').click();
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').eq(1).find('tr').first().click();
    cy.iframe().find('button.buttonMain').contains('Siguiente').click();
    cy.iframe().find('.text-left.page-subtitle').should('exist');
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(1).find('td').first().click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').eq(1).find('td').eq(4).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Respuesta').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().find('td').eq(4).click();
    cy.iframe().find('.ui-datatable-tablewrapper tbody tr').first().find('td').eq(4).click();
    cy.iframe().find('.ui-dropdown-items li').contains('Solicitud').click();
    cy.iframe().find('.ui-dialog-footer button').contains('No').click();
    cy.iframe().find('.ui-datatable-thead tr').first().find('th').first().click();
    cy.iframe().find('.ui-icon-folder').first().click();
    cy.iframe().find('.ui-dialog-footer button').contains('Si').click();
    
    cy.then(() => {
      cy.log(`${radicadoEntrada}`);
      cy.log(`${radicadoEntrada2}`);
      cy.log(`${radicadoSalida}`);
      cy.log(`${radicadoSalida2}`);
    })
    
  });
  
  it('Verificar radicados', { defaultCommandTimeout: 40000 }, () => {
    // cy.reload();
    cy.get('input[type="text"]').clear().type('pruebas03');
    cy.get('input[type="password"]').clear().type('Soadoc123');
    cy.get('button').click();
    cy.url().should('include', '/pages/application/1');
    
    cy.wait(500)
    cy.frameLoaded('#external-page');
    cy.wait(1000);
    cy.iframe().find('form .dependencia-movil').should('exist').click();
    cy.iframe().find('form li').contains('Subd. Administrativa').click();
    cy.iframe().find('ul li').contains('Planillas').click();
    cy.iframe().find('li a').contains('Distribución Física').click();
    
    //Planilla entrada//
    //Búsqueda de tareas - Radicado de entrada
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoEntrada}`);
    });
    cy.iframe().find('#float-input').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Subd. Talento Humano').click();
    cy.iframe().find('button[label="Buscar"]').first().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');
    
    //Búsqueda de tareas - Radicado de entrada2
    cy.iframe().find('li a').contains('Gestión de Entregas').click();
    cy.iframe().find('li a').contains('Distribución Física').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoEntrada2}`);
    });
    cy.iframe().find('#float-input').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Despacho Ministra').click();
    cy.iframe().find('button[label="Buscar"]').first().click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().click();
    cy.iframe().find('button[label="Generar"]').click();
    cy.iframe().find('div[role="dialog"] .ui-datatable-scrollable-body').find('tr').find('td').eq(1).find('span').last().then(($planilla) => {
      planilla = $planilla.text();
    });
    cy.then(() => {
      cy.log(`${planilla}`);
    });
    cy.iframe().find('.ui-dialog-footer button').contains('Cerrar').click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');
    
    //Consultar
    cy.iframe().find('li[role="presentation"]').last().click();
    cy.iframe().find('p-multiselect[formcontrolname="dependencia"]').last().click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Despacho Ministra').click();
    cy.then(() => {
      cy.iframe().find('input[formcontrolname="nroPlanilla"]').type(`${planilla}`);
    });
    cy.iframe().find('button[label="Buscar"]').last().click();
    
    //Gestión de entregas - entregar//
    cy.iframe().find('li a').contains('Gestión de Entregas').click();
    cy.iframe().find('p-multiselect[formcontrolname="estado"]').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Planillado').click();
    cy.then(() => {
      cy.iframe().find('#nroPlanilla').type(`${planilla}`);
    })
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().find('td').eq(14).click();
    cy.iframe().find('div[role="dialog"] #estadoEntrega').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Entregado').click();
    cy.iframe().find('div[role="dialog"] button').contains('Guardar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.wait(500);
    cy.iframe().find('button[label="Guardar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');

    //Verificar por entregado
    cy.iframe().find('li a').contains('Distribución Física').click();
    cy.iframe().find('li a').contains('Gestión de Entregas').click();
    cy.iframe().find('p-multiselect[formcontrolname="estado"]').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Entregado').click();
    cy.then(() => {
      cy.iframe().find('#nroPlanilla').type(`${planilla}`);
    })
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().find('td').eq(14).click();
    cy.iframe().find('div[role="dialog"] #estadoEntrega').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Devuelto').click();
    cy.iframe().find('div[role="dialog"] button').contains('Guardar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.wait(500);
    cy.iframe().find('button[label="Guardar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');

    //Verificar por devuelto
    cy.iframe().find('li a').contains('Distribución Física').click();
    cy.iframe().find('li a').contains('Gestión de Entregas').click();
    cy.iframe().find('p-multiselect[formcontrolname="estado"]').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Devuelto').click();
    cy.then(() => {
      cy.iframe().find('#nroPlanilla').type(`${planilla}`);
    })
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().find('td').eq(14).click();
    cy.iframe().find('div[role="dialog"] #estadoEntrega').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Entregado').click();
    cy.iframe().find('div[role="dialog"] button').contains('Guardar').click();
    cy.iframe().find('.ui-dialog-footer button').contains('Aceptar').click();
    cy.wait(500);
    cy.iframe().find('button[label="Guardar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');
    
    //Verificar por entregado
    cy.iframe().find('li a').contains('Distribución Física').click();
    cy.iframe().find('li a').contains('Gestión de Entregas').click();
    cy.iframe().find('p-multiselect[formcontrolname="estado"]').click();
    cy.iframe().find('.ng-trigger-overlayAnimation li').contains('Entregado').click();
    cy.then(() => {
      cy.iframe().find('#nroPlanilla').type(`${planilla}`);
    })
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('not.have.class', 'ui-datatable-emptymessage-row');
    
    //Recibo Documentos Físicos//
    cy.iframe().find('li a').contains('Recibo Documentos Físicos').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoSalida}`);
    });
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Subd. De Contratacion').click();
    cy.iframe().find('button[label="Buscar"]').click();
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.length', 2);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().click();
    cy.iframe().find('button[label="Recibir"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').first().click();
    cy.iframe().find('button[label="Recibir"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');
    
    
    cy.iframe().find('li a').contains('Gestión de Entregas').click();
    cy.iframe().find('li a').contains('Recibo Documentos Físicos').click();
    cy.then(() => {
      cy.iframe().find('#numeroRadicado').type(`${radicadoSalida2}`);
    });
    cy.iframe().find('#dependencia').click();
    cy.iframe().find('.ui-dropdown-items li').contains('Dir. De Cuidado').click();
    cy.iframe().find('button[label="Buscar"]').click();
    cy.wait(500);
    cy.iframe().find('.ui-datatable-scrollable-body').first().find('tr').should('have.class', 'ui-datatable-emptymessage-row');
    
    
    
    
  });
  
});