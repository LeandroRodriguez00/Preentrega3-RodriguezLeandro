document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("reservaForm");
  const buscarPorNombreBtn = document.getElementById("buscarNombreBtn");
  const mostrarBtn = document.getElementById("mostrarBtn");
  const borrarBtn = document.getElementById("borrarBtn");
  const resultadoDiv = document.getElementById("resultado");

  const verifyPassword = async () => {
  let isValid = false;
  while (!isValid) {
    const { value: formValues } = await Swal.fire({
      title: 'Iniciar Sesión',
      html: '<input id="username" class="swal2-input" placeholder="Nombre de usuario">' +
        '<input id="password" type="password" class="swal2-input" placeholder="Contraseña">',
      showCancelButton: true,
      confirmButtonText: 'Iniciar Sesión',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        if (username === "ladov" && password === "1234") {
          isValid = true;
        } else {
          Swal.showValidationMessage('Contraseña incorrecta');
          document.getElementById("username").value = "";
          document.getElementById("password").value = "";
        }
      },
      allowOutsideClick: false,
      onOpen: () => {
        const modal = document.querySelector(".swal2-modal");
        modal.addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            Swal.clickConfirm();
          }
        });
      },
    });

    if (formValues.dismiss === Swal.DismissReason.cancel) {
      break; 
    }
  }

  if (isValid) {
    Swal.fire({
      title: 'Redirigiendo',
      text: 'Por favor, espere...',
      onOpen: () => {
        Swal.showLoading();
      },
      showConfirmButton: false,
      allowOutsideClick: false,
    });

   
    setTimeout(() => {
      Swal.close(); 
      Swal.fire('Inicio de sesión exitoso');
      window.location.href = "../paginas/gestordereservas.html";
    }, 1000); 
  }
};

$(document).ready(function () {
  $("#openLoginModal").click(verifyPassword);
});
  

  const capacidadRestaurante = 50;
  let reservas = [];

  const savedReservas = localStorage.getItem("reservas");
  if (savedReservas) {
    reservas = JSON.parse(savedReservas);
  }

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    guardarReserva();
  });

  buscarPorNombreBtn.addEventListener("click", function () {
    buscarPorNombre();
  });

  mostrarBtn.addEventListener("click", function () {
    mostrarReservas();
  });

  borrarBtn.addEventListener("click", function () {
    borrarReserva();
  });

  function guardarReserva() {
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const personas = parseInt(document.getElementById("personas").value);
    const mensaje = document.getElementById("mensaje").value;
    const fechaActual = new Date();
    const fechaReserva = new Date(fecha);

    if (fechaReserva <= fechaActual) {
      resultadoDiv.textContent = "La fecha de reserva debe ser posterior a la fecha actual.";
    } else {
      const reservasParaHora = reservas.filter((reserva) => reserva.hora === hora);

      if (reservasParaHora.length >= capacidadRestaurante / 2) {
        resultadoDiv.textContent = "Lo siento, todas las reservas para esta hora están completas.";
      } else {
        const reserva = {
          nombre,
          email,
          telefono,
          fecha,
          hora,
          personas,
          mensaje,
        };

        reservas.push(reserva);

        localStorage.setItem("reservas", JSON.stringify(reservas));

        formulario.reset();
        resultadoDiv.textContent = "Reserva guardada con éxito.";
      }
    }
  }

  function buscarPorNombre() {
    const nombreBuscar = document.getElementById("nombreBuscar").value;
    const reservasEncontradas = reservas.filter((reserva) => reserva.nombre === nombreBuscar);

    resultadoDiv.innerHTML = '';

    if (reservasEncontradas.length > 0) {
      resultadoDiv.innerHTML = "<p>Reservas encontradas:</p>";
      for (const reserva of reservasEncontradas) {
        resultadoDiv.innerHTML += `<p>Nombre: ${reserva.nombre}</p>
                                  <p>Correo: ${reserva.email}</p>
                                  <p>Teléfono: ${reserva.telefono}</p>
                                  <p>Fecha: ${reserva.fecha}</p>
                                  <p>Hora: ${reserva.hora}</p>
                                  <p>Personas: ${reserva.personas}</p>
                                  <p>Mensaje: ${reserva.mensaje}</p>`;
      }
    } else {
      resultadoDiv.textContent = "No se encontraron reservas con ese nombre.";
    }
  }

  function mostrarReservas() {
    resultadoDiv.innerHTML = '';

    if (reservas.length > 0) {
      resultadoDiv.innerHTML = "<p>Reservas:</p>";
      for (const reserva of reservas) {
        resultadoDiv.innerHTML += `
          <div class="reserva">
            <p>Nombre: ${reserva.nombre}</p>
            <p>Correo: ${reserva.email}</p>
            <p>Teléfono: ${reserva.telefono}</p>
            <p>Fecha: ${reserva.fecha}</p>
            <p>Hora: ${reserva.hora}</p>
            <p>Personas: ${reserva.personas}</p>
            <p>Mensaje: ${reserva.mensaje}</p>
          </div>
        `;
      }
      resultadoDiv.scrollIntoView({ behavior: "smooth" });
    } else {
      resultadoDiv.textContent = "No hay reservas almacenadas.";
    }
  }

  function borrarReserva() {
    const nombreBorrar = document.getElementById("nombreBorrar").value;
    const reservaIndex = reservas.findIndex((reserva) => reserva.nombre === nombreBorrar);

    if (reservaIndex !== -1) {
      const reservaBorrada = reservas.splice(reservaIndex, 1)[0];
      localStorage.setItem("reservas", JSON.stringify(reservas));
      resultadoDiv.textContent = `Reserva de ${reservaBorrada.nombre} ha sido borrada.`;
    } else {
      resultadoDiv.textContent = "No se encontró ninguna reserva con ese nombre.";
    }
  }
});
