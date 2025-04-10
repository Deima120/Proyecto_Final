// Este archivo contiene la lógica para la gestión de reservas

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtenemos referencias a los elementos del DOM que vamos a utilizar
    const formReserva = document.getElementById('form-reserva');
    const tablaReservas = document.getElementById('tabla-reservas');
    const btnNuevaReserva = document.getElementById('btn-nueva-reserva');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnAplicarFiltros = document.getElementById('btn-aplicar-filtros');
    const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');
    
    // Campos del formulario
    const reservaId = document.getElementById('reserva-id');
    const reservaCliente = document.getElementById('reserva-cliente');
    const reservaGlamping = document.getElementById('reserva-glamping');
    const reservaFechaInicio = document.getElementById('reserva-fecha-inicio');
    const reservaFechaFin = document.getElementById('reserva-fecha-fin');
    const reservaTotal = document.getElementById('reserva-total');
    const reservaEstado = document.getElementById('reserva-estado');
    
    // Campos del resumen
    const resumenGlamping = document.getElementById('resumen-glamping');
    const resumenDuracion = document.getElementById('resumen-duracion');
    const resumenPrecio = document.getElementById('resumen-precio');
    const resumenTotal = document.getElementById('resumen-total');
    
    // Campos de filtro
    const filtroCliente = document.getElementById('filtro-cliente');
    const filtroGlamping = document.getElementById('filtro-glamping');
    const filtroEstado = document.getElementById('filtro-estado');
    const filtroFecha = document.getElementById('filtro-fecha');
    
    // Variables para almacenar datos cargados
    let clientesData = [];
    let glampingsData = [];
    let reservasData = [];
    
    // Por defecto, ocultamos el formulario
    formReserva.style.display = 'none';
    
    // Cargamos los datos necesarios al iniciar la página
    Promise.all([
        cargarClientes(),
        cargarGlampings()
    ]).then(() => {
        // Una vez cargados clientes y glampings, cargamos las reservas
        cargarReservas();
    });
    
    // Evento para mostrar el formulario al hacer clic en "Nueva Reserva"
    btnNuevaReserva.addEventListener('click', function() {
        // Limpiamos el formulario
        limpiarFormulario();
        // Mostramos el formulario
        formReserva.style.display = 'block';
    });
    
    // Evento para ocultar el formulario al hacer clic en "Cancelar"
    btnCancelar.addEventListener('click', function() {
        formReserva.style.display = 'none';
    });
    
    // Evento para actualizar el resumen de la reserva cuando cambian los datos
    reservaGlamping.addEventListener('change', actualizarResumen);
    reservaFechaInicio.addEventListener('change', actualizarResumen);
    reservaFechaFin.addEventListener('change', actualizarResumen);
    
    // Evento para calcular automáticamente el total cuando cambian las fechas
    reservaFechaFin.addEventListener('change', calcularTotal);
    
    // Evento para guardar una reserva al enviar el formulario
    formReserva.addEventListener('submit', function(e) {
        // Prevenimos el comportamiento por defecto del formulario
        e.preventDefault();
        
        // Obtenemos los valores del formulario
        const reserva = {
            clienteId: parseInt(reservaCliente.value),
            glampingId: parseInt(reservaGlamping.value),
            fechaInicio: reservaFechaInicio.value,
            fechaFin: reservaFechaFin.value,
            totalPagado: parseInt(reservaTotal.value),
            estado: reservaEstado.value
        };
        
        // Si hay un ID, significa que estamos editando una reserva existente
        if (reservaId.value) {
            reserva.id = parseInt(reservaId.value);
            actualizarReserva(reserva);
        } else {
            // Si no hay ID, estamos creando una nueva reserva
            crearReserva(reserva);
        }
        
        // Ocultamos el formulario
        formReserva.style.display = 'none';
    });
    
    // Eventos para los filtros
    btnAplicarFiltros.addEventListener('click', function() {
        cargarReservas(true); // true indica que estamos aplicando filtros
    });
    
    btnLimpiarFiltros.addEventListener('click', function() {
        // Limpiamos todos los campos de filtro
        filtroCliente.value = '';
        filtroGlamping.value = '';
        filtroEstado.value = '';
        filtroFecha.value = '';
        
        // Recargamos todas las reservas sin filtros
        cargarReservas();
    });
    
    // Función para actualizar el resumen de la reserva
    function actualizarResumen() {
        // Obtenemos el glamping seleccionado
        const glampingId = parseInt(reservaGlamping.value);
        let glamping = null;
        
        // Buscamos el glamping en nuestros datos
        for (let i = 0; i < glampingsData.length; i++) {
            if (glampingsData[i].id === glampingId) {
                glamping = glampingsData[i];
                break;
            }
        }
        
        if (glamping) {
            // Actualizamos la información del glamping en el resumen
            resumenGlamping.textContent = `Glamping: ${glamping.nombre}`;
            resumenPrecio.textContent = `Precio por noche: ${formatearPrecio(glamping.precioPorNoche)}`;
            
            // Calculamos la duración de la estancia
            const fechaInicio = new Date(reservaFechaInicio.value);
            const fechaFin = new Date(reservaFechaFin.value);
            
            if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
                // Calculamos la diferencia en días
                const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
                const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
                
                if (diferenciaDias > 0) {
                    // Actualizamos la duración y el total estimado
                    resumenDuracion.textContent = `Duración: ${diferenciaDias} días`;
                    const totalEstimado = diferenciaDias * glamping.precioPorNoche;
                    resumenTotal.textContent = `Total estimado: ${formatearPrecio(totalEstimado)}`;
                    
                    // Actualizamos el campo de total pagado
                    reservaTotal.value = totalEstimado;
                } else {
                    resumenDuracion.textContent = 'Duración: Las fechas no son válidas';
                    resumenTotal.textContent = 'Total estimado: $0';
                }
            } else {
                resumenDuracion.textContent = 'Duración: Selecciona ambas fechas';
                resumenTotal.textContent = 'Total estimado: $0';
            }
        } else {
            // Si no hay glamping seleccionado, mostramos valores por defecto
            resumenGlamping.textContent = 'Glamping: No seleccionado';
            resumenDuracion.textContent = 'Duración: 0 días';
            resumenPrecio.textContent = 'Precio por noche: $0';
            resumenTotal.textContent = 'Total estimado: $0';
        }
    }
    
    // Función para calcular el total automáticamente
    function calcularTotal() {
        // Obtenemos el glamping seleccionado
        const glampingId = parseInt(reservaGlamping.value);
        let glamping = null;
        
        for (let i = 0; i < glampingsData.length; i++) {
            if (glampingsData[i].id === glampingId) {
                glamping = glampingsData[i];
                break;
            }
        }
        
        if (glamping) {
            // Calculamos la duración y el total
            const fechaInicio = new Date(reservaFechaInicio.value);
            const fechaFin = new Date(reservaFechaFin.value);
            
            if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
                const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
                const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
                
                if (diferenciaDias > 0) {
                    const totalEstimado = diferenciaDias * glamping.precioPorNoche;
                    reservaTotal.value = totalEstimado;
                }
            }
        }
    }
    
    // Función para formatear el precio con separadores de miles
    function formatearPrecio(precio) {
        return precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    }
    
    // Función para formatear fechas
    function formatearFecha(fechaString) {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Función para cargar los clientes desde el archivo JSON
    function cargarClientes() {
        return fetch('../data/clientes.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los clientes');
                }
                return response.json();
            })
            .then(clientes => {
                clientesData = clientes;
                
                // Llenamos los selectores de clientes
                llenarSelectClientes(reservaCliente, clientes);
                llenarSelectClientes(filtroCliente, clientes, true);
                
                return clientes;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar los clientes. Por favor, inténtalo de nuevo.');
            });
    }
    
    // Función para cargar los glampings desde el archivo JSON
    function cargarGlampings() {
        return fetch('../data/glampings.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los glampings');
                }
                return response.json();
            })
            .then(glampings => {
                glampingsData = glampings;
                
                // Llenamos los selectores de glampings
                llenarSelectGlampings(reservaGlamping, glampings);
                llenarSelectGlampings(filtroGlamping, glampings, true);
                
                return glampings;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar los glampings. Por favor, inténtalo de nuevo.');
            });
    }
    
    // Función para llenar un select con opciones de clientes
    function llenarSelectClientes(selectElement, clientes, incluyeVacio = false) {
        // Limpiamos las opciones existentes (excepto la primera si incluyeVacio es false)
        if (incluyeVacio) {
            selectElement.innerHTML = '<option value="">Todos los clientes</option>';
        } else {
            selectElement.innerHTML = '<option value="">Selecciona un cliente</option>';
        }
        
        // Agregamos una opción por cada cliente
        for (let i = 0; i < clientes.length; i++) {
            const cliente = clientes[i];
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = `${cliente.nombre} (${cliente.documento})`;
            selectElement.appendChild(option);
        }
    }
    
    // Función para llenar un select con opciones de glampings
    function llenarSelectGlampings(selectElement, glampings, incluyeVacio = false) {
        // Limpiamos las opciones existentes (excepto la primera si incluyeVacio es false)
        if (incluyeVacio) {
            selectElement.innerHTML = '<option value="">Todos los glampings</option>';
        } else {
            selectElement.innerHTML = '<option value="">Selecciona un glamping</option>';
        }
        
        // Agregamos una opción por cada glamping
        for (let i = 0; i < glampings.length; i++) {
            const glamping = glampings[i];
            // Solo incluimos glampings disponibles para reservas
            if (selectElement === reservaGlamping && !glamping.disponible) {
                continue; // Saltamos los glampings no disponibles
            }
            const option = document.createElement('option');
            option.value = glamping.id;
            option.textContent = `${glamping.nombre} (${glamping.capacidad} personas)`;
            selectElement.appendChild(option);
        }
    }
    
    // Función para cargar las reservas desde el archivo JSON (con filtros opcionales)
    function cargarReservas(aplicarFiltros = false) {
        fetch('../data/reservas.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar las reservas');
                }
                return response.json();
            })
            .then(reservas => {
                reservasData = reservas;
                
                // Aplicamos filtros si es necesario
                if (aplicarFiltros) {
                    reservas = filtrarReservas(reservas);
                }
                
                // Limpiamos la tabla
                tablaReservas.innerHTML = '';
                
                // Recorremos el array de reservas
                for (let i = 0; i < reservas.length; i++) {
                    const reserva = reservas[i];
                    
                    // Buscamos los datos del cliente y glamping
                    const cliente = buscarCliente(reserva.clienteId);
                    const glamping = buscarGlamping(reserva.glampingId);
                    
                    // Si no encontramos el cliente o glamping, continuamos con la siguiente reserva
                    if (!cliente || !glamping) continue;
                    
                    // Clase para el estado
                    const estadoClase = `estado-${reserva.estado}`;
                    
                    // Creamos una fila para cada reserva
                    const fila = document.createElement('tr');
                    
                    // Fechas formateadas
                    const fechaInicio = formatearFecha(reserva.fechaInicio);
                    const fechaFin = formatearFecha(reserva.fechaFin);
                    
                    // Agregamos las celdas con los datos de la reserva
                    fila.innerHTML = `
                        <td>${reserva.id}</td>
                        <td>
                            ${cliente.nombre}
                            <span class="info-detalle">${cliente.documento}</span>
                        </td>
                        <td>
                            ${glamping.nombre}
                            <span class="info-detalle">${glamping.capacidad} personas</span>
                        </td>
                        <td>
                            Del ${fechaInicio} al ${fechaFin}
                        </td>
                        <td>${formatearPrecio(reserva.totalPagado)}</td>
                        <td><span class="${estadoClase}">${capitalizar(reserva.estado)}</span></td>
                        <td>
                            <button class="btn-editar" data-id="${reserva.id}">Editar</button>
                            <button class="btn-eliminar" data-id="${reserva.id}">Eliminar</button>
                        </td>
                    `;
                    
                    // Añadimos la fila a la tabla
                    tablaReservas.appendChild(fila);
                }
                
                // Agregamos eventos a los botones de editar y eliminar
                agregarEventosBotones();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar las reservas. Por favor, inténtalo de nuevo.');
            });
    }
    
    // Función para filtrar reservas según los criterios seleccionados
    function filtrarReservas(reservas) {
        const clienteId = filtroCliente.value ? parseInt(filtroCliente.value) : null;
        const glampingId = filtroGlamping.value ? parseInt(filtroGlamping.value) : null;
        const estado = filtroEstado.value;
        const fecha = filtroFecha.value;
        
        // Filtramos las reservas que cumplen con todos los criterios seleccionados
        return reservas.filter(reserva => {
            // Filtro por cliente
            if (clienteId && reserva.clienteId !== clienteId) {
                return false;
            }
            
            // Filtro por glamping
            if (glampingId && reserva.glampingId !== glampingId) {
                return false;
            }
            
            // Filtro por estado
            if (estado && reserva.estado !== estado) {
                return false;
            }
            
            // Filtro por fecha
            if (fecha) {
                // Comparamos si la fecha de inicio de la reserva es mayor o igual que la fecha seleccionada
                if (reserva.fechaInicio < fecha) {
                    return false;
                }
            }
            
            // Si pasa todos los filtros, incluimos la reserva
            return true;
        });
    }
    
    // Función para buscar un cliente por su ID
    function buscarCliente(id) {
        for (let i = 0; i < clientesData.length; i++) {
            if (clientesData[i].id === id) {
                return clientesData[i];
            }
        }
        return null;
    }
    
    // Función para buscar un glamping por su ID
    function buscarGlamping(id) {
        for (let i = 0; i < glampingsData.length; i++) {
            if (glampingsData[i].id === id) {
                return glampingsData[i];
            }
        }
        return null;
    }
    
    // Función para capitalizar la primera letra de un texto
    function capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    // Función para agregar eventos a los botones de editar y eliminar
    function agregarEventosBotones() {
        // Botones de editar
        const botonesEditar = document.querySelectorAll('.btn-editar');
        for (let i = 0; i < botonesEditar.length; i++) {
            botonesEditar[i].addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarReserva(id);
            });
        }
        
        // Botones de eliminar
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        for (let i = 0; i < botonesEliminar.length; i++) {
            botonesEliminar[i].addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
                    eliminarReserva(id);
                }
            });
        }
    }
    
    // Función para editar una reserva
    function editarReserva(id) {
        // Buscamos la reserva en nuestros datos
        let reservaEncontrada = null;
        for (let i = 0; i < reservasData.length; i++) {
            if (reservasData[i].id === id) {
                reservaEncontrada = reservasData[i];
                break;
            }
        }
        
        if (reservaEncontrada) {
            // Rellenamos el formulario con los datos de la reserva
            reservaId.value = reservaEncontrada.id;
            reservaCliente.value = reservaEncontrada.clienteId;
            reservaGlamping.value = reservaEncontrada.glampingId;
            reservaFechaInicio.value = reservaEncontrada.fechaInicio;
            reservaFechaFin.value = reservaEncontrada.fechaFin;
            reservaTotal.value = reservaEncontrada.totalPagado;
            reservaEstado.value = reservaEncontrada.estado;
            
            // Actualizamos el resumen
            actualizarResumen();
            
            // Mostramos el formulario
            formReserva.style.display = 'block';
        } else {
            alert('Reserva no encontrada');
        }
    }
    
    // Función para crear una nueva reserva
    function crearReserva(reserva) {
        // En un entorno real, aquí haríamos una solicitud POST a un servidor
        // Para este ejemplo, simulamos el proceso modificando el archivo JSON local

        // Primero, obtenemos todas las reservas actuales
        fetch('../data/reservas.json')
            .then(response => response.json())
            .then(reservas => {
                // Generamos un nuevo ID (el máximo + 1)
                let maxId = 0;
                for (let i = 0; i < reservas.length; i++) {
                    if (reservas[i].id > maxId) {
                        maxId = reservas[i].id;
                    }
                }
                reserva.id = maxId + 1;
                
                // Agregamos la nueva reserva al array
                reservas.push(reserva);
                
                // Simulamos la actualización del archivo (en un entorno real, esto se haría en el servidor)
                simularGuardadoArchivo(reservas)
                    .then(() => {
                        // Recargamos la lista de reservas
                        cargarReservas();
                        alert('Reserva creada correctamente');
                    })
                    .catch(() => {
                        alert('Error al crear la reserva');
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para crear la reserva');
            });
    }
    
    // Función para actualizar una reserva existente
    function actualizarReserva(reservaActualizada) {
        // Obtenemos todas las reservas actuales
        fetch('../data/reservas.json')
            .then(response => response.json())
            .then(reservas => {
                // Buscamos el índice de la reserva a actualizar
                let indice = -1;
                for (let i = 0; i < reservas.length; i++) {
                    if (reservas[i].id === reservaActualizada.id) {
                        indice = i;
                        break;
                    }
                }
                
                if (indice !== -1) {
                    // Actualizamos la reserva en el array
                    reservas[indice] = reservaActualizada;
                    
                    // Simulamos la actualización del archivo
                    simularGuardadoArchivo(reservas)
                        .then(() => {
                            // Recargamos la lista de reservas
                            cargarReservas();
                            alert('Reserva actualizada correctamente');
                        })
                        .catch(() => {
                            alert('Error al actualizar la reserva');
                        });
                } else {
                    alert('Reserva no encontrada');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para actualizar la reserva');
            });
    }
    
    // Función para eliminar una reserva
    function eliminarReserva(id) {
        // Obtenemos todas las reservas actuales
        fetch('../data/reservas.json')
            .then(response => response.json())
            .then(reservas => {
                // Filtramos el array para eliminar la reserva
                const reservasFiltradas = [];
                for (let i = 0; i < reservas.length; i++) {
                    if (reservas[i].id !== id) {
                        reservasFiltradas.push(reservas[i]);
                    }
                }
                
                // Simulamos la actualización del archivo
                simularGuardadoArchivo(reservasFiltradas)
                    .then(() => {
                        // Recargamos la lista de reservas
                        cargarReservas();
                        alert('Reserva eliminada correctamente');
                    })
                    .catch(() => {
                        alert('Error al eliminar la reserva');
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para eliminar la reserva');
            });
    }
    
    // Función para limpiar el formulario
    function limpiarFormulario() {
        reservaId.value = '';
        reservaCliente.value = '';
        reservaGlamping.value = '';
        reservaFechaInicio.value = '';
        reservaFechaFin.value = '';
        reservaTotal.value = '';
        reservaEstado.value = 'confirmada'; // Valor por defecto
        
        // Limpiamos también el resumen
        resumenGlamping.textContent = 'Glamping: No seleccionado';
        resumenDuracion.textContent = 'Duración: 0 días';
        resumenPrecio.textContent = 'Precio por noche: $0';
        resumenTotal.textContent = 'Total estimado: $0';
    }
    
    // Función que simula el guardado del archivo JSON
    // En un entorno real, esto sería una solicitud al servidor
    function simularGuardadoArchivo(datos) {
        return new Promise((resolve, reject) => {
            // Simulamos una operación asíncrona
            setTimeout(() => {
                try {
                    // En un entorno real, aquí se haría una solicitud al servidor
                    // Para este ejemplo, simplemente mostramos los datos en la consola
                    console.log('Datos a guardar:', datos);
                    
                    // En un entorno de backend real, aquí se escribiría el archivo
                    // Pero en el navegador no podemos escribir archivos directamente
                    // Para este ejemplo, asumimos que el guardado fue exitoso
                    resolve();
                } catch (error) {
                    console.error('Error al simular guardado:', error);
                    reject(error);
                }
            }, 500); // Simulamos un retraso de medio segundo
        });
    }
    
    // Función auxiliar para calcular la duración en días entre dos fechas
    function calcularDuracionEnDias(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diferenciaTiempo = fin.getTime() - inicio.getTime();
        return Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    }
    
    // Configuramos valores mínimos para las fechas (no permitir fechas pasadas)
    const hoy = new Date().toISOString().split('T')[0];
    reservaFechaInicio.min = hoy;
    reservaFechaInicio.addEventListener('change', function() {
        // La fecha de fin debe ser posterior a la fecha de inicio
        reservaFechaFin.min = reservaFechaInicio.value;
        // Si la fecha de fin es anterior a la nueva fecha de inicio, la ajustamos
        if (reservaFechaFin.value && reservaFechaFin.value < reservaFechaInicio.value) {
            reservaFechaFin.value = reservaFechaInicio.value;
        }
        actualizarResumen();
    });
});