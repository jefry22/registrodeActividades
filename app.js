const dias = [
  "Lunes", //data.id === index
  "Martes", //1
  "Miercoles", //2
  "Jueves", //3
  "Viernes", //4
  "Sabado", //5
  "Domingo", //6
];

const formulario = document.querySelector("#formulario");
const list_dias = document.querySelector("thead tr");


const horaFin = document.querySelector("#hora_fin");
const dia = document.querySelector("#dia");
const actividad = document.querySelector("#actividad");

document.addEventListener("DOMContentLoaded", () => {
  agregarDias();
});

horaFin.addEventListener("input", ingresarDatos);
dia.addEventListener("input", ingresarDatos);
actividad.addEventListener("input", ingresarDatos);

formulario.addEventListener("submit", agregarActividad);

const objRactividad = {
  hora_comienzo: "",
  hora_fin: "",
  dia: "",
  actividad: "",
};

let arrayActividad = [];




function ingresarDatos(e) {
  e.preventDefault();
  
  if (e.target.value === "") {
    console.log("campos vacios");
    return;
  }
  
  if (
    (e.target.id === "hora_comienzo" && !validarHora(e.target.value)) ||
    (e.target.id === "hora_fin" && !validarHora(e.target.value))
  ) {
    console.log("no cumple con la condicion");
    return;
  }
  
  objRactividad.hora_comienzo = horaActual();
  objRactividad[e.target.id] = e.target.value;
  arrayActividad = [{ ...objRactividad }];
}

function horaActual(){
  const date = new Date();
  const hora = date.getHours();
  const minuto = date.getMinutes();
  const result = `${hora}:${minuto}`;
  document.querySelector('#hora_comienzo').placeholder = result;  
  return result;
}

setInterval(horaActual,10);


function agregarActividad(e) {

  e.preventDefault();
  arrayActividad.forEach((actividad_diaria) => {
    const { hora_comienzo, hora_fin, dia, actividad } = actividad_diaria;
    
    const divContainerTooltip = document.createElement("div");
    divContainerTooltip.classList.add("tooltip");
    
   
    const index = dias.findIndex(
      (dia_selecionado) => dia_selecionado.toLocaleLowerCase() === dia
    );
    
    const actividad_desarrollado = document.createElement("a");
    actividad_desarrollado.textContent = actividad;
    
    const horas = document.createElement("p");
    horas.textContent = `${hora_comienzo} - ${hora_fin}`;

    const tooltiptex = document.createElement("div");
    tooltiptex.classList.add("tooltiptext");
    limpiarHtml(tooltiptex);
    const id = document.querySelectorAll("td");
    id.forEach((element) => {
      const id_element = Number(element.getAttribute("id"));
      if (id_element === index) {
        tooltiptex.appendChild(actividad_desarrollado);
        tooltiptex.appendChild(horas);
        divContainerTooltip.appendChild(tooltiptex);
        element.appendChild(divContainerTooltip);
      }
    });
  });
  formulario.reset();
}

function limpiarHtml(referencia) {
  while (referencia.firstChild) {
    referencia.removeChild(referencia.firstChild);
  }
}

function agregarDias() {
  dias.forEach((dia) => {
    const th = document.createElement("th");
    th.textContent = dia;
    list_dias.appendChild(th);
  });
}

function validarHora(hora) {
  const expresionR = /^(?:0?[1-9]|1[0-2]):[0-5][0-9]\s?(?:[aApP](\.?)[mM]\1)?$/;
  const result = expresionR.test(hora);
  return result;
}
