import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector("#eliminar-proyecto");
if (btnEliminar) {
  btnEliminar.addEventListener("click", (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    console.log(urlProyecto);
    Swal.fire({
      title: "Deseas borrar este Proyecto?",
      text: "Un proyecto eliminado no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si,borrar",
      cancelButtonText: "No,Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        //Enviar peticion a axios
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        console.log(url);
        axios.delete(url, { params: { urlProyecto } }).then((res) => {
          console.log(res);
          Swal.fire(
            "Proyecto Eliminado!",
            res.data,
            "success"
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 2500);
        }).catch(()=>{
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text: 'No se pudo eliminar el Proyecto'
            })
        })
      }
    });
  });
}

export default btnEliminar;
