document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("reservaForm");
  const buscarPorNombreBtn = document.getElementById("buscarNombreBtn");
  const mostrarBtn = document.getElementById("mostrarBtn");
  const borrarBtn = document.getElementById("borrarBtn");
  const resultadoDiv = document.getElementById("resultado");

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
      resultadoDiv.textContent = "El restaurante ha alcanzado su capacidad máxima, sin embargo puede venir y anotarse en lista de espera";
    }
  }

  function buscarPorNombre() {
    const nombreBuscar = document.getElementById("nombreBuscar").value.toLowerCase ();
    const reservasEncontradas = reservas.filter((reserva) => reserva.nombre.toLowerCase () === nombreBuscar);

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
    const nombreBorrar = document.getElementById("nombreBorrar").value.toLowerCase ();
    const reservaIndex = reservas.findIndex((reserva) => reserva.nombre.toLowerCase () === nombreBorrar);

    if (reservaIndex !== -1) {
      const reservaBorrada = reservas.splice(reservaIndex, 1)[0];
      localStorage.setItem("reservas", JSON.stringify(reservas));
      resultadoDiv.textContent = `Reserva de ${reservaBorrada.nombre} ha sido borrada.`;
    } else {
      resultadoDiv.textContent = "No se encontró ninguna reserva con ese nombre.";
    }
  }
});
