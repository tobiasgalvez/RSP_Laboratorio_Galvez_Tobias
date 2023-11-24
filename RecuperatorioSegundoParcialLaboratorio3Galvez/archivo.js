class Vehiculo {
  constructor(id, modelo, anoFab, velMax) {
    this.id = id;
    this.modelo = modelo;
    this.anoFab = anoFab;
    this.velMax = velMax;
  }

  toString() {
    return `${this.modelo} ${this.anoFab}, velMax: ${this.velMax}`;
  }
}

class Aereo extends Vehiculo {
  constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
    super(id, modelo, anoFab, velMax);
    this.altMax = altMax;
    this.autonomia = autonomia;
  }
}

class Terrestre extends Vehiculo {
  constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
    super(id, modelo, anoFab, velMax);
    this.cantPue = cantPue;
    this.cantRue = cantRue;
  }
}

function validarCampos(modelo, anoFab, velMax) {
  const errores = [];

  if (modelo.trim() === "") {
    errores.push("El modelo es obligatorio. ");
  }

  if (isNaN(anoFab) || anoFab < 1885 || anoFab > 2023) {
    errores.push(
      "El año de fabricacion es obligatorio y debe ser mayor a 1885 y menor a 2023. "
    );
  }

  if (isNaN(velMax) || velMax <= 0) {
    errores.push("La velocidad maxima debe ser mayor a 0. ");
  }

  return errores;
}

function validarAereo(modelo, anoFab, velMax, altMax, autonomia) {
  const errores = validarCampos(modelo, anoFab, velMax);

  if (isNaN(altMax) || altMax <= 0) {
    errores.push("La altura maxima debe ser un número mayor a 0. ");
  }

  if (isNaN(autonomia) || autonomia <= 0) {
    errores.push("La autonomia deben ser un número mayor a 0. ");
  }

  return errores;
}

function validarTerrestre(modelo, anoFab, velMax, cantPue, cantRue) {
  const errores = validarCampos(modelo, anoFab, velMax);

  if (isNaN(cantPue) || cantPue <= -1) {
    errores.push("La cantidad de puertas deben ser un número mayor a -1. ");
  }

  if (isNaN(cantRue) || cantRue <= 0) {
    errores.push("La cantidad de puertas deben ser un número mayor a 0. ");
  }

  return errores;
}

// Muestra el spinner
function showSpinner(spinner) {
  if (spinner) {
    spinner.style.display = "flex";
  } else {
    console.error(
      "El elemento spinner no existe o no se ha pasado correctamente a la función showSpinner"
    );
  }
}

// Oculta el spinner
function hideSpinner(spinner) {
  spinner.style.display = "none";
}

const spinner = document.getElementById("spinner");
document.addEventListener("DOMContentLoaded", function () {
  // Ejemplo de uso: Simular una carga de 3 segundos
  showSpinner(spinner);
  setTimeout(() => {
    hideSpinner(spinner);
  }, 3000);
});

arrayVehiculos = [];

document.addEventListener("DOMContentLoaded", function () {
  fetch("vehiculoAereoTerrestre.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un error al recuperar los datos");
      }
      return response.json();
    })
    .then((data) => {
      for (let obj of data) {
        if ("altMax" in obj && "autonomia" in obj) {
          arrayVehiculos.push(
            new Aereo(
              obj.id,
              obj.modelo,
              obj.anoFab,
              obj.velMax,
              obj.altMax,
              obj.autonomia
            )
          );
        } else if ("cantPue" in obj && "cantRue" in obj) {
          arrayVehiculos.push(
            new Terrestre(
              obj.id,
              obj.modelo,
              obj.anoFab,
              obj.velMax,
              obj.cantPue,
              obj.cantRue
            )
          );
        }
      }
      insertarVehiculos(arrayVehiculos);
    })
    .catch((error) => {
      alert(error.message);
    });
});

function insertarVehiculos(vehiculos) {
  const tablaCuerpo = document.getElementById("tablaCuerpo");
  tablaCuerpo.innerHTML = "";
  vehiculos.forEach((objeto) => {
    const nuevaFila = document.createElement("tr");
    nuevaFila.id = `fila_con_id-${objeto.id}`;
    nuevaFila.innerHTML = `
            <td>${objeto.id}</td>
            <td>${objeto.modelo}</td>
            <td>${objeto.anoFab}</td>
            <td>${objeto.velMax}</td>
            <td>${objeto.altMax || "N/A"}</td>
            <td>${objeto.autonomia || "N/A"}</td>
            <td>${objeto.cantPue || "N/A"}</td>
            <td>${objeto.cantRue || "N/A"}</td>
            <td><span onclick="modificarUsuario(${
              objeto.id
            })">Modificar</span></td>
            <td><span onclick="eliminarUsuario(${
              objeto.id
            })">Eliminar</span></td>
        `;
    tablaCuerpo.appendChild(nuevaFila);
  });
}

// Obtén los encabezados de la tabla
let headers = Array.from(document.querySelectorAll("#tablaDatos th"));

// Añade un evento de click a cada encabezado
headers.forEach((header, index) => {
  header.addEventListener("click", () => {
    sortTable(index);
  });
});

function sortTable(index) {
  // Obtén las filas de la tabla
  let rows = Array.from(document.querySelectorAll("#tablaDatos tbody tr"));

  // Ordena las filas
  let sortedRows = rows.sort((a, b) => {
    let aValue = a.children[index].textContent;
    let bValue = b.children[index].textContent;

    // Si las celdas contienen números, conviértelos a números para la comparación
    if (!isNaN(aValue)) {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) {
      return -1;
    } else if (aValue > bValue) {
      return 1;
    } else {
      return 0;
    }
  });

  // Elimina las filas actuales de la tabla
  rows.forEach((row) => {
    row.parentNode.removeChild(row);
  });

  // Añade las filas ordenadas a la tabla
  let tbody = document.querySelector("#tablaDatos tbody");
  sortedRows.forEach((row) => {
    tbody.appendChild(row);
  });
}

function mostrarError(mensaje) {
  //   const mensajeError = document.getElementById("mensaje_error");
  //   mensajeError.textContent = mensaje;
  //   mensajeError.style.display = "block"; // Mostrar el mensaje de error

  alert(mensaje);
}

// Función para ocultar el mensaje de error
function ocultarError() {
  const mensajeError = document.getElementById("mensaje_error");
  mensajeError.textContent = ""; // Limpiar el contenido del mensaje
  mensajeError.style.display = "none"; // Ocultar el mensaje de error
}

function refrescarInputs() {
  document.getElementById("modelo").value = "";
  document.getElementById("anoFab").value = "";
  document.getElementById("velMax").value = "";
  document.getElementById("altMax_agregar").value = "";
  document.getElementById("autonomia_agregar").value = "";
  document.getElementById("cantPue_agregar").value = "";
  document.getElementById("cantRue_agregar").value = "";
}

function cambioABMParaAlta() {
  document.getElementById("tipo_vehiculo_label").style.display = "block";
  document.getElementById("tipo_agregar").style.display = "block";
  //document.getElementById("tipo_agregar").value = "Aereo";
  document.getElementById("btn_aceptar").style.display = "block";
  document.getElementById("btn_cancelar").style.display = "block";
  document.getElementById("encabezado_form_abm").innerText =
    "****************Alta****************";

  document.getElementById("btn_aceptar_cambio").style.display = "none";
  document.getElementById("btn_cancelar_cambio").style.display = "none";
  document.getElementById("btn_aceptar_eliminacion").style.display = "none";
  document.getElementById("btn_cancelar_eliminacion").style.display = "none";

  cambiarABMParaTipoSeleccionado(document.getElementById("tipo_agregar").value);
}

//FORMULARIO ABM CAMBIO DE TIPO DE Vehiculo A AGREGAR

//referencia al selector de tipo en el segundo formulario
const tipoAgregarSelect = document.getElementById("tipo_agregar");

const modeloInput = document.getElementById("modelo");
const anoFabInput = document.getElementById("anoFab");
const velMaxInput = document.getElementById("velMax");

//referencia a los campos en el segundo formulario
const altMaxInput = document.getElementById("altMax_agregar");
const autonomiaInput = document.getElementById("autonomia_agregar");

const cantPueInput = document.getElementById("cantPue_agregar");
const cantRueInput = document.getElementById("cantRue_agregar");

//referencia a los labels de los campos en el segundo formulario
const altMaxLabel = document.getElementById("altMax_agregar_label");
const autonomiaLabel = document.getElementById("autonomia_agregar_label");

const cantPueLabel = document.getElementById("cantPue_agregar_label");
const cantRueLabel = document.getElementById("cantRue_agregar_label");

// Agrega un evento change al selector de tipo
tipoAgregarSelect.addEventListener("change", function () {
  const tipoSeleccionado = tipoAgregarSelect.value;

  modeloInput.value = "";
  anoFabInput.value = "";
  velMaxInput.value = "";

  // Ocultar todos los campos y labels por defecto
  altMaxLabel.style.display = "none";
  altMaxInput.style.display = "none";

  autonomiaLabel.style.display = "none";
  autonomiaInput.style.display = "none";

  cantPueLabel.style.display = "none";
  cantPueInput.style.display = "none";

  cantRueLabel.style.display = "none";
  cantRueInput.style.display = "none";

  cambiarABMParaTipoSeleccionado(tipoSeleccionado);
});

function cambiarABMParaTipoSeleccionado(tipoSeleccionado) {
  // Mostrar campos y labels según el tipo seleccionado
  if (tipoSeleccionado === "aereo") {
    altMaxLabel.style.display = "inline";
    altMaxInput.style.display = "inline";

    autonomiaLabel.style.display = "inline";
    autonomiaInput.style.display = "inline";
  } else if (tipoSeleccionado === "terrestre") {
    cantPueLabel.style.display = "inline";
    cantPueInput.style.display = "inline";

    cantRueLabel.style.display = "inline";
    cantRueInput.style.display = "inline";
  }
}

function ocultarABMFormulario() {
  document.getElementById("form_agregar").style.display = "none";
}
function mostrarABMFormulario() {
  document.getElementById("form_agregar").style.display = "block";
}

function ocultarFormularioPrincipal() {
  document.getElementById("form_principal").style.display = "none";
}
function mostrarFormularioLista() {
  document.getElementById("form_principal").style.display = "block";
}

function hacerTextoInput() {
  document.getElementById("modelo").readOnly = false;
  document.getElementById("anoFab").readOnly = false;
  document.getElementById("velMax").readOnly = false;
  document.getElementById("altMax_agregar").readOnly = false;
  document.getElementById("autonomia_agregar").readOnly = false;
  document.getElementById("cantPue_agregar").readOnly = false;
  document.getElementById("cantRue_agregar").readOnly = false;
}

//*************************************PUNTO 4 ALTAS************************************************** */

function agregarObjeto() {
  // Obtén una referencia al cuerpo de la tabla
  const tablaCuerpo = document.getElementById("tablaCuerpo");

  // Obtén los valores de los campos
  const tipo = document.getElementById("tipo_agregar").value;
  const modelo = document.getElementById("modelo").value;
  const anoFab = parseInt(document.getElementById("anoFab").value);
  const velMax = parseInt(document.getElementById("velMax").value);

  erroresValidacion = "";

  // Crear el objeto según el tipo seleccionado
  let objeto = null;

  if (tipo === "aereo") {
    const altMax = parseInt(document.getElementById("altMax_agregar").value);
    const autonomia = parseInt(
      document.getElementById("autonomia_agregar").value
    );

    // // Validar los campos
    // erroresValidacion = validarAereo(modelo, anoFab, velMax, altMax, autonomia);
    objeto = new Aereo(0, modelo, anoFab, velMax, altMax, autonomia);
  } else if (tipo === "terrestre") {
    const cantPue = parseInt(document.getElementById("cantPue_agregar").value);
    const cantRue = parseInt(document.getElementById("cantRue_agregar").value);

    // erroresValidacion = validarTerrestre(
    //   modelo,
    //   anoFab,
    //   velMax,
    //   cantPue,
    //   cantRue
    // );
    objeto = new Terrestre(0, modelo, anoFab, velMax, cantPue, cantRue);
  }

  //   if (erroresValidacion.length > 0) {
  //     mostrarError(erroresValidacion.join(" "));
  //     return;
  //   }

  if (objeto !== null) {
    console.log(objeto);
    return objeto;
  }
}

document
  .getElementById("btn_aceptar")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showSpinner(spinner);
    setTimeout(() => {
      hideSpinner(spinner);
    }, 3000);

    var elemento = agregarObjeto();
    if (elemento instanceof Aereo) {
      console.log("es  aereo");
      // Validar los campos
      erroresValidacion = validarAereo(
        elemento.modelo,
        elemento.anoFab,
        elemento.velMax,
        elemento.altMax,
        elemento.autonomia
      );
    } else {
      console.log("es  terrestre");
      erroresValidacion = validarTerrestre(
        elemento.modelo,
        elemento.anoFab,
        elemento.velMax,
        elemento.cantPue,
        elemento.cantRue
      );
    }

    if (erroresValidacion.length > 0) {
      mostrarError(erroresValidacion.join(" "));
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "vehiculoAereoTerrestre.php", false); // `false` hace que la solicitud sea síncrona
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(elemento));

    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      elemento.id = data.id;
      arrayVehiculos.push(elemento);
      insertarVehiculos(arrayVehiculos);
      document.getElementById("spinner").style.display = "none";
      document.getElementById("form_agregar").style.display = "none";
      document.getElementById("form_principal").style.display = "block";
      ocultarError();
    } else {
      console.log("Hubo un problema con la operación fetch: " + xhr.status);
      document.getElementById("spinner").style.display = "none";
      document.getElementById("form_agregar").style.display = "none";
      document.getElementById("form_principal").style.display = "block";
      alert(
        "No se pudo realizar la operación. Por favor, inténtelo de nuevo más tarde."
      );
      ocultarError();
    }
  });

document
  .getElementById("btn_agregar_elemento")
  .addEventListener("click", function (evento) {
    evento.preventDefault();
    refrescarInputs();
    cambioABMParaAlta();
    hacerTextoInput();

    document.getElementById("form_principal").style.display = "none";
    document.getElementById("form_agregar").style.display = "block";
    document.getElementById("btn_aceptar_cambio").style.display = "none";
    document.getElementById("btn_cancelar_cambio").style.display = "none";

    const botonCancelar = document.getElementById("btn_cancelar");
    botonCancelar.addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("form_agregar").style.display = "none";
      document.getElementById("form_principal").style.display = "block";
    });
  });

//////***********************************************PUNTO 5 - MODIFICAR ************************************************************ */

function modificarUsuario(idVehiculo) {
  console.log("Id de vehiculo a modificar: " + idVehiculo);

  const resultado = confirm(
    "Está seguro/a de modificar el id " + idVehiculo + "?"
  );

  if (!resultado) {
    console.log("Cancelado");
    return;
  } else {
    refrescarInputs();

    hacerTextoInput();

    document.getElementById("form_principal").style.display = "none";
    document.getElementById("form_agregar").style.display = "block";
    var objetoEncontrado = arrayVehiculos.find(function (objeto) {
      return objeto.id === idVehiculo;
    });

    cambiarFormABMParaModificar(objetoEncontrado);

    // document
    // .getElementById("btn_aceptar_cambio")
    // .removeEventListener("click", handlerModificar);

    // if (handlerModificar) {
    //     document.getElementById("btn_aceptar_cambio").removeEventListener("click", handlerModificar);
    //   }

    document
      .getElementById("btn_aceptar_cambio")
      .addEventListener("click", handlerModificar, { once: true });
  }

  async function handlerModificar(event) {
    event.preventDefault();
    showSpinner(spinner);
    setTimeout(() => {
      hideSpinner(spinner);
    }, 3000);

    // en lugar de crear un nuevo objeto, modifica el objeto existente
    var elemento = objetoEncontrado;

    elemento.modelo = document.getElementById("modelo").value;
    elemento.anoFab = parseInt(document.getElementById("anoFab").value);
    elemento.velMax = parseInt(document.getElementById("velMax").value);

    if (elemento instanceof Aereo) {
      //document.getElementById("tipo_agregar").value = "empleado";
      console.log("es  aereo");
      elemento.altMax = document.getElementById("altMax_agregar").value;
      elemento.autonomia = document.getElementById("autonomia_agregar").value;
      //    // Validar los campos
      //    erroresValidacion = validarAereo(elemento.modelo, elemento.anoFab, elemento.velMax, elemento.altMax, elemento.autonomia);
    } else {
      console.log("es  terrestre");
      elemento.cantPue = document.getElementById("cantPue_agregar").value;
      elemento.cantRue = document.getElementById("cantRue_agregar").value;

      //   erroresValidacion = validarTerrestre(
      //     elemento.modelo,
      //     elemento.anoFab,
      //     elemento.velMax,
      //     elemento.cantPue,
      //     elemento.cantRue
      //   );
    }

    // if (erroresValidacion.length > 0) {
    //   mostrarError(erroresValidacion.join(" "));
    //   return;
    // }

    var headers = new Headers({
      "Content-Type": "application/json",
    });

    var init = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(elemento),
    };

    try {
      let response = await fetch("vehiculoAereoTerrestre.php", init);
      let data;

      // Verificar si la respuesta es un JSON válido
      if (response.headers.get("content-type").includes("application/json")) {
        data = await response.json();
      } else {
        // Si la respuesta no es un JSON válido, asumir que es un texto simple
        data = await response.text();
      }

      // Realizar el resto del código solo si la respuesta es exitosa
      if (response.status === 200) {
        var elementoIndex = arrayVehiculos.findIndex(function (vehiculo) {
          return vehiculo.id === idVehiculo;
        });
        // Actualizar el ID con el provisto en la respuesta
        console.log(data);
        //console.log("hola estoy en el modificarrrrrrrr");
        elemento.id = objetoEncontrado.id;
        // Actualizar el elemento en la lista
        // Ocultar el Spinner y el Formulario ABM
        // Mostrar el Formulario Lista reflejando los cambios
        arrayVehiculos[elementoIndex] = elemento;
        insertarVehiculos(arrayVehiculos);
        //hideSpinner();
        ocultarABMFormulario();
        mostrarFormularioLista();
      } else {
        throw new Error("Error: " + response.status);
      }
    } catch (error) {
      console.log("Hubo un problema con la operación fetch: " + error.message);
      // Ocultar el Spinner y el Formulario ABM
      // Mostrar el Formulario Lista con un mensaje de error
      //hideSpinner(spinner);
      ocultarABMFormulario();
    }
  }

  ///EVENTO PARA OCULTAR SEGUNDO FORMULARIO
  const botonCancelarCambio = document.getElementById("btn_cancelar_cambio");
  // Agregar un evento click al botón "Cancelar"
  botonCancelarCambio.addEventListener("click", function (event) {
    //ocultarError();
    event.preventDefault(); // Prevenir el comportamiento predeterminado del botón
    document.getElementById("form_agregar").style.display = "none"; // Oculta el segundo formulario
    document.getElementById("form_principal").style.display = "block"; // muestra el form principal
  });
}

function cambiarFormABMParaModificar(objeto) {
  document.getElementById("tipo_agregar").style.display = "none";
  document.getElementById("tipo_vehiculo_label").style.display = "none";
  document.getElementById("btn_aceptar").style.display = "none";
  document.getElementById("btn_cancelar").style.display = "none";
  document.getElementById("btn_aceptar_eliminacion").style.display = "none";
  document.getElementById("btn_cancelar_eliminacion").style.display = "none";

  document.getElementById("btn_aceptar_cambio").style.display = "block";
  document.getElementById("btn_cancelar_cambio").style.display = "block";

  document.getElementById("encabezado_form_abm").innerText =
    "*************Modificacion*************";
  cambiarABMParaTipoSeleccionado(objeto.tipo);
  insertarDatosSegunTipoParaModificarOEliminar(objeto);
}

function insertarDatosSegunTipoParaModificarOEliminar(objeto) {
  document.getElementById("modelo").value = objeto.modelo;
  document.getElementById("anoFab").value = objeto.anoFab;
  document.getElementById("velMax").value = objeto.velMax;
  if (objeto instanceof Aereo) {
    document.getElementById("tipo_agregar").value = "Aereo";

    altMax_agregar.value = objeto.altMax;
    autonomia_agregar.value = objeto.autonomia;

    document.getElementById("altMax_agregar_label").style.display = "inline";
    document.getElementById("autonomia_agregar_label").style.display = "inline";

    altMax_agregar.style.display = "inline";
    autonomia_agregar.style.display = "inline";

    document.getElementById("cantPue_agregar_label").style.display = "none";
    document.getElementById("cantRue_agregar_label").style.display = "none";

    cantPue_agregar.style.display = "none";
    cantRue_agregar.style.display = "none";
  } else {
    document.getElementById("tipo_agregar").value = "Terrestre";

    cantPue_agregar.value = objeto.cantPue;
    cantRue_agregar.value = objeto.cantRue;

    document.getElementById("cantPue_agregar_label").style.display = "inline";
    document.getElementById("cantRue_agregar_label").style.display = "inline";

    cantPue_agregar.style.display = "inline";
    cantRue_agregar.style.display = "inline";

    document.getElementById("altMax_agregar_label").style.display = "none";
    document.getElementById("autonomia_agregar_label").style.display = "none";

    altMax_agregar.style.display = "none";
    autonomia_agregar.style.display = "none";
  }
}

////*******************************************PUNTO 6 ELIMINAR********************************************* */

var eliminarVehiculoListener; // Variable para guardar el event listener

function eliminarUsuario(idVehiculo) {
  console.log("Id de Vehiculo a eliminar: " + idVehiculo);

  const resultado = confirm(
    "Está seguro/a de eliminar el id " + idVehiculo + "?"
  );

  if (!resultado) {
    console.log("Cancelado");
    return;
  } else {
    ocultarFormularioPrincipal();
    mostrarABMFormulario();
    var objetoEncontrado = arrayVehiculos.find(function (objeto) {
      return objeto.id === idVehiculo;
    });
    cambiarFormABMParaEliminar(objetoEncontrado);
    hacerTextoSoloLectura();

    var botonAceptarEliminacion = document.getElementById(
      "btn_aceptar_eliminacion"
    );

    // Remover el event listener anterior si existe
    if (eliminarVehiculoListener) {
      botonAceptarEliminacion.removeEventListener(
        "click",
        eliminarVehiculoListener
      );
    }

    eliminarVehiculoListener = function (event) {
      event.preventDefault();
      showSpinner(spinner);

      var idElemento = JSON.stringify({ id: idVehiculo });

      var xhr = new XMLHttpRequest();
      xhr.open("DELETE", "vehiculoAereoTerrestre.php", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          arrayVehiculos = arrayVehiculos.filter(function (vehiculo) {
            return vehiculo.id !== idVehiculo;
          });
          insertarVehiculos(arrayVehiculos);
          console.log("id " + idVehiculo + " eliminado");
          document.getElementById("form_agregar").style.display = "none";
          document.getElementById("form_principal").style.display = "block";
        } else if (xhr.readyState === 4) {
          console.log("Hubo un problema con la operación: " + xhr.statusText);
          document.getElementById("spinner").style.display = "none";
          document.getElementById("form_agregar").style.display = "none";
          document.getElementById("form_principal").style.display = "block";
        }
      };
      xhr.send(idElemento);

      setTimeout(() => {
        hideSpinner(spinner);
      }, 3000);
    };

    botonAceptarEliminacion.addEventListener("click", eliminarVehiculoListener);
  }

  ///EVENTO PARA OCULTAR SEGUNDO FORMULARIO
  const botonCancelarEliminacion = document.getElementById(
    "btn_cancelar_eliminacion"
  );
  // Agregar un evento click al botón "Cancelar"
  botonCancelarEliminacion.addEventListener("click", function (event) {
    event.preventDefault();
    ocultarABMFormulario();
    mostrarFormularioLista();
  });
}

function cambiarFormABMParaEliminar(objeto) {
  document.getElementById("tipo_agregar").style.display = "none";
  document.getElementById("tipo_vehiculo_label").style.display = "none";
  document.getElementById("btn_aceptar").style.display = "none";
  document.getElementById("btn_cancelar").style.display = "none";
  document.getElementById("btn_aceptar_cambio").style.display = "none";
  document.getElementById("btn_cancelar_cambio").style.display = "none";

  document.getElementById("btn_aceptar_eliminacion").style.display = "block";
  document.getElementById("btn_cancelar_eliminacion").style.display = "block";

  document.getElementById("encabezado_form_abm").innerText =
    "*************Eliminacion*************";
  cambiarABMParaTipoSeleccionado(objeto.tipo);
  insertarDatosSegunTipoParaModificarOEliminar(objeto);
}

function hacerTextoSoloLectura() {
  document.getElementById("modelo").readOnly = true;
  document.getElementById("anoFab").readOnly = true;
  document.getElementById("velMax").readOnly = true;

  document.getElementById("altMax_agregar").readOnly = true;
  document.getElementById("autonomia_agregar").readOnly = true;

  document.getElementById("cantPue_agregar").readOnly = true;
  document.getElementById("cantRue_agregar").readOnly = true;
}
