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
            Swal.showValidationMessage('Contraseña incorrecta, vuelva a ingresar los datos');
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
      return new Promise((resolve) => {
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
          resolve();
        }, 1000);
      });
    }
  };

  $(document).ready(function () {
    $("#openLoginModal").click(() => {
      verifyPassword()
        .then(() => {
        })
        .catch((error) => {
          
          console.error(error);
        });
    });
  });
  async function contarPersonasReservadas() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (response.ok) {
        const users = await response.json();

      
        const totalPersonasReservadas = users.length;
        return totalPersonasReservadas;
      } else {
        throw new Error('Error al obtener la lista de usuarios');
      }
    } catch (error) {
      console.error(error);
      return 0; 
    }
  }

  
  contarPersonasReservadas()
    .then((total) => {
      document.getElementById('totalReservas').innerText = `Total Reservas: ${total}`;
      
    })
    .catch((error) => {
      console.error(error);
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

    const totalPersonasReserva = reservas.reduce((total, reserva) => total + reserva.personas, 0);
    if (totalPersonasReserva + personas <= capacidadRestaurante) {
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
    } else {
      resultadoDiv.textContent = "El restaurante ya no tiene capacidad para realizar reservas";
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
      resultadoDiv.textContent = "No hay reservas guardadas.";
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