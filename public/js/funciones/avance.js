import Swal from "sweetalert2";

export const actualizarAvance = () => {
  //Selecionar las tareas existentes
  const tareas = document.querySelectorAll("li.tarea");
  if (tareas.length) {
    //Seleccionar las tareas completadas
    const tareasCompletadas = document.querySelectorAll("i.completo");
    //Calcular avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    //mostrar avance
    const porcentaje = document.querySelector("#porcentaje");
    porcentaje.style.width = avance + "%";
    if (avance === 100) {
      Swal.fire(
        "Completaste el Proyecto",
        "Felicidades has terminado tus Tareas",
        "success"
      );
    }
  }
};
