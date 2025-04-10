// Este archivo contiene la lógica para la gestión de clientes

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtenemos referencias a los elementos del DOM que vamos a utilizar
    const formCliente = document.getElementById('form-cliente');
    const tablaClientes = document.getElementById('tabla-clientes');
    const btnNuevoCliente = document.getElementById('btn-nuevo-cliente');
    const btnCancelar = document.getElementById('btn-cancelar');
    
    // Campos del formulario
    const clienteId = document.getElementById('cliente-id');
    const clienteNombre = document.getElementById('cliente-nombre');
    const clienteEmail = document.getElementById('cliente-email');
    const clienteTelefono = document.getElementById('cliente-telefono');
    const clienteDocumento = document.getElementById('cliente-documento');
    
    // Por defecto, ocultamos el formulario
    formCliente.style.display = 'none';
    
    // Cargamos los clientes al iniciar la página
    cargarClientes();
    
    // Evento para mostrar el formulario al hacer clic en "Nuevo Cliente"
    btnNuevoCliente.addEventListener('click', function() {
        // Limpiamos el formulario
        limpiarFormulario();
        // Mostramos el formulario
        formCliente.style.display = 'block';
    });
    
    // Evento para ocultar el formulario al hacer clic en "Cancelar"
    btnCancelar.addEventListener('click', function() {
        formCliente.style.display = 'none';
    });
    
    // Evento para guardar un cliente al enviar el formulario
    formCliente.addEventListener('submit', function(e) {
        // Prevenimos el comportamiento por defecto del formulario
        e.preventDefault();
        
        // Obtenemos los valores del formulario
        const cliente = {
            nombre: clienteNombre.value,
            email: clienteEmail.value,
            telefono: clienteTelefono.value,
            documento: clienteDocumento.value
        };
        
        // Si hay un ID, significa que estamos editando un cliente existente
        if (clienteId.value) {
            cliente.id = parseInt(clienteId.value);
            actualizarCliente(cliente);
        } else {
            // Si no hay ID, estamos creando un nuevo cliente
            crearCliente(cliente);
        }
        
        // Ocultamos el formulario
        formCliente.style.display = 'none';
    });
    
    // Función para cargar los clientes desde el archivo JSON
    function cargarClientes() {
        // Utilizamos fetch para obtener los datos del archivo JSON
        fetch('../data/clientes.json')
            .then(response => {
                // Verificamos si la respuesta es correcta
                if (!response.ok) {
                    throw new Error('Error al cargar los clientes');
                }
                return response.json();
            })
            .then(clientes => {
                // Limpiamos la tabla
                tablaClientes.innerHTML = '';
                
                // Recorremos el array de clientes
                for (let i = 0; i < clientes.length; i++) {
                    const cliente = clientes[i];
                    
                    // Creamos una fila para cada cliente
                    const fila = document.createElement('tr');
                    
                    // Agregamos las celdas con los datos del cliente
                    fila.innerHTML = `
                        <td>${cliente.id}</td>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.documento}</td>
                        <td>
                            <button class="btn-editar" data-id="${cliente.id}">Editar</button>
                            <button class="btn-eliminar" data-id="${cliente.id}">Eliminar</button>
                        </td>
                    `;
                    
                    // Añadimos la fila a la tabla
                    tablaClientes.appendChild(fila);
                }
                
                // Agregamos eventos a los botones de editar y eliminar
                agregarEventosBotones();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar los clientes. Por favor, inténtalo de nuevo.');
            });
    }
    
    // Función para agregar eventos a los botones de editar y eliminar
    function agregarEventosBotones() {
        // Botones de editar
        const botonesEditar = document.querySelectorAll('.btn-editar');
        for (let i = 0; i < botonesEditar.length; i++) {
            botonesEditar[i].addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarCliente(id);
            });
        }
        
        // Botones de eliminar
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        for (let i = 0; i < botonesEliminar.length; i++) {
            botonesEliminar[i].addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
                    eliminarCliente(id);
                }
            });
        }
    }
    
    // Función para editar un cliente
    function editarCliente(id) {
        // Obtenemos los datos del cliente
        fetch('../data/clientes.json')
            .then(response => response.json())
            .then(clientes => {
                // Buscamos el cliente por su ID
                let clienteEncontrado = null;
                for (let i = 0; i < clientes.length; i++) {
                    if (clientes[i].id === id) {
                        clienteEncontrado = clientes[i];
                        break;
                    }
                }
                
                if (clienteEncontrado) {
                    // Rellenamos el formulario con los datos del cliente
                    clienteId.value = clienteEncontrado.id;
                    clienteNombre.value = clienteEncontrado.nombre;
                    clienteEmail.value = clienteEncontrado.email;
                    clienteTelefono.value = clienteEncontrado.telefono;
                    clienteDocumento.value = clienteEncontrado.documento;
                    
                    // Mostramos el formulario
                    formCliente.style.display = 'block';
                } else {
                    alert('Cliente no encontrado');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos del cliente');
            });
    }
    
    // Función para crear un nuevo cliente
    function crearCliente(cliente) {
        // En un entorno real, aquí haríamos una solicitud POST a un servidor
        // Para este ejemplo, simulamos el proceso modificando el archivo JSON local

        // Primero, obtenemos todos los clientes actuales
        fetch('../data/clientes.json')
            .then(response => response.json())
            .then(clientes => {
                // Generamos un nuevo ID (el máximo + 1)
                let maxId = 0;
                for (let i = 0; i < clientes.length; i++) {
                    if (clientes[i].id > maxId) {
                        maxId = clientes[i].id;
                    }
                }
                cliente.id = maxId + 1;
                
                // Agregamos el nuevo cliente al array
                clientes.push(cliente);
                
                // Simulamos la actualización del archivo (en un entorno real, esto se haría en el servidor)
                simularGuardadoArchivo(clientes)
                    .then(() => {
                        // Recargamos la lista de clientes
                        cargarClientes();
                        alert('Cliente creado correctamente');
                    })
                    .catch(() => {
                        alert('Error al crear el cliente');
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para crear el cliente');
            });
    }
    
    // Función para actualizar un cliente existente
    function actualizarCliente(clienteActualizado) {
        // Obtenemos todos los clientes actuales
        fetch('../data/clientes.json')
            .then(response => response.json())
            .then(clientes => {
                // Buscamos el índice del cliente a actualizar
                let indice = -1;
                for (let i = 0; i < clientes.length; i++) {
                    if (clientes[i].id === clienteActualizado.id) {
                        indice = i;
                        break;
                    }
                }
                
                if (indice !== -1) {
                    // Actualizamos el cliente en el array
                    clientes[indice] = clienteActualizado;
                    
                    // Simulamos la actualización del archivo
                    simularGuardadoArchivo(clientes)
                        .then(() => {
                            // Recargamos la lista de clientes
                            cargarClientes();
                            alert('Cliente actualizado correctamente');
                        })
                        .catch(() => {
                            alert('Error al actualizar el cliente');
                        });
                } else {
                    alert('Cliente no encontrado');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para actualizar el cliente');
            });
    }
    
    // Función para eliminar un cliente
    function eliminarCliente(id) {
        // Obtenemos todos los clientes actuales
        fetch('../data/clientes.json')
            .then(response => response.json())
            .then(clientes => {
                // Filtramos el array para eliminar el cliente
                const clientesFiltrados = [];
                for (let i = 0; i < clientes.length; i++) {
                    if (clientes[i].id !== id) {
                        clientesFiltrados.push(clientes[i]);
                    }
                }
                
                // Simulamos la actualización del archivo
                simularGuardadoArchivo(clientesFiltrados)
                    .then(() => {
                        // Recargamos la lista de clientes
                        cargarClientes();
                        alert('Cliente eliminado correctamente');
                    })
                    .catch(() => {
                        alert('Error al eliminar el cliente');
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para eliminar el cliente');
            });
    }
    
    // Función para limpiar el formulario
    function limpiarFormulario() {
        clienteId.value = '';
        clienteNombre.value = '';
        clienteEmail.value = '';
        clienteTelefono.value = '';
        clienteDocumento.value = '';
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
}); 