const formulario = document.querySelector("#formulario");
const horaComienzo = document.querySelector("#hora_comienzo");
const horaFin = document.querySelector("#hora_fin");
const dia = document.querySelector("#dia");
const actividad = document.querySelector("#actividad");

let dias = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

class Actividad {
  constructor() {}
  agregarActividad(registroActividad) {
    localStorage.setItem("actividad", JSON.stringify(registroActividad));
  }
}

class UI {
  constructor(dias) {
    this.dias = dias;
  }
  mostrarMensaje(mensaje, tipo, referencia) {
    if (tipo === "error") {
      this.limpiarHtml(referencia);
      const divAlert = document.createElement("p");
      divAlert.classList.add("error");
      divAlert.textContent = mensaje;
      referencia.appendChild(divAlert);
    }
  }

  notificacion(diferencia){
    setTimeout(()=>{
      Push.create('APP DE CONTROL DE ACTIVIDADES',{
        body:'EL TIEMPO DE LA ATIVIDAD SE HA TERMINADO',
        icon: 'icon.png',
        timeout: 18000,
        onClick:function(){
          window.focus();
          this.close();
        }
      });
    },diferencia)
  }

  mostrarEnFormulario(mensaje, tipo, referencia) {
    if (tipo === "error") {
      this.limpiarHtml(referencia);
      const divAlert = document.createElement("p");
      divAlert.classList.add("error");
      divAlert.textContent = mensaje;
      referencia.appendChild(divAlert);
      setTimeout(() => {
        divAlert.remove();
      }, 3000);
    }
  }

  agregarDias() {
    this.dias.forEach((dia) => {
      const th = document.createElement("th");
      th.textContent = dia;
      const list_dias = document.querySelector("thead tr");
      list_dias.appendChild(th);
    });
    return dias;
  }

  addActividadList(registroActividad) {
    registroActividad.forEach((actividades) => {
      const { hora_comienzo, hr_fin, dia, actividad } = actividades;
      const index_dias = this.dias.findIndex((dias) => dias === dia);

      const actividad_desarrollado = document.createElement("a");
      actividad_desarrollado.textContent = actividad;
      const horas = document.createElement("p");
      horas.textContent = `${hora_comienzo}-${hr_fin}`;
      this.validacionDia(index_dias, horas, actividad_desarrollado);
    });
  }

  validacionDia(index_dias, hr_fin, actividad) {
    const id_element = document.querySelectorAll("tbody td");
    id_element.forEach((e) => {
      if (Number(e.id) === index_dias) {
        const divContainerTooltip = document.createElement("div");
        divContainerTooltip.classList.add("tooltip");
        const tooltiptex = document.createElement("div");
        tooltiptex.classList.add("tooltiptext");
        tooltiptex.appendChild(actividad);
        tooltiptex.appendChild(hr_fin);
        divContainerTooltip.appendChild(tooltiptex);
        e.appendChild(divContainerTooltip);
      }
    });
  }

  limpiarDiv(referencia) {
    while (referencia.firstChild) {
      referencia.removeChild(referencia.firstChild);
    }
  }

  limpiarHtml(referencia) {
    const alerta = referencia.querySelector("p");
    if (alerta) {
      alerta.remove();
    }
  }
}
const addActividad = new Actividad();
const ui = new UI(dias);
ui.agregarDias();

let registroActividad = [];

document.addEventListener("DOMContentLoaded", () => {
  horaComienzo.addEventListener("blur", agregarActividad);
  horaFin.addEventListener("blur", agregarActividad);
  dia.addEventListener("blur", agregarActividad);
  actividad.addEventListener("blur", agregarActividad);
  formulario.addEventListener("submit", agregarActList);
  registroActividad = JSON.parse(localStorage.getItem('actividad')) || [];
  ui.addActividadList(registroActividad);
});

function agregarActividad(e) {
  e.preventDefault();
  if (e.target.value === "") {
    ui.mostrarMensaje(
      "Los campos estan vacios",
      "error",
      e.target.parentElement
    );
    return;
  }
  if (e.target.id === "hora_fin" && !validarHora(e.target.value)) {
    ui.mostrarMensaje(
      `La hora Final no tiene el formato adecuado`,
      "error",
      e.target.parentElement
    );
    return;
  }
  ui.limpiarHtml(e.target.parentElement);
}

function agregarActList(e) {
  e.preventDefault();
  const hora_comienzo = (document.querySelector("#hora_comienzo").value =
    horaActual());
  const hr_fin = document.querySelector("#hora_fin").value;
  const dia = document.querySelector("#dia").value.trim();
  const actividad = document.querySelector("#actividad").value.trim();

  if (hr_fin === "" || dia === "" || actividad === "") {
    ui.mostrarEnFormulario(`los campos estan vacios`, "error", e.target);
    return;
  }

  
  //DECLARACION DE MINUTOS Y SEGUNDOS 
  const convertir_array = hora_comienzo.split(':');
  const minuto_inicio = Number(convertir_array[0]);
  const segundo_inicio = Number(convertir_array[1]);

  //DACLARACION DE MINUTOS Y SEGUNDO DE FINAL
  const convertir_array_2 = hr_fin.split(':');
  const minuto_inicio_2 = Number(convertir_array_2[0]);
  const segundo_inicio_2 = Number(convertir_array_2[1]);
  //CONVERSION DE LA FECHA ACTUAL
  const fecha = new Date().getFullYear();
  const mes = new Date().getMonth();
  const day = new Date().getDay()
  
  const tiempo1 = new Date(fecha,mes,day,minuto_inicio,segundo_inicio);
  const tiempo2 = new Date(fecha,mes,day,minuto_inicio_2,segundo_inicio_2);


  const dif = tiempo2.getTime() - tiempo1.getTime();

  const array_c = hora_comienzo.split(":");
  const array_f = hr_fin.split(":", 2);


  if (Number(array_c[0]) > Number(array_f[0])) {
    ui.mostrarEnFormulario(
      `La hora final de la actividad no puede ser menor que la hora de inicio`,
      "error",
      e.target
    );
    return;
  }


  const objActividad = {
    id: Date.now(),
    hora_comienzo: (hora_comienzo.value = horaActual()),
    hr_fin,
    dia,
    actividad,
  };

  registroActividad = [...registroActividad, objActividad];
  
  addActividad.agregarActividad(registroActividad);
  ui.addActividadList(registroActividad);
  ui.notificacion(dif);
  formulario.reset();
}

function horaActual() {
  const date = new Date();
  const hora = date.getHours();
  const minuto = date.getMinutes();
  const result = `${hora}:${minuto}`;
  document.querySelector("#hora_comienzo").placeholder = result;
  return result;
}

setInterval(horaActual, 10);

function validarHora(hora) {
  const expresionR = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  const result = expresionR.test(hora);
  return result;
}

