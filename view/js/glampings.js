// Este archivo contiene la lógica para la gestión de glampings

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtenemos referencias a los elementos del DOM que vamos a utilizar
    const formGlamping = document.getElementById('form-glamping');
    const tablaGlampings = document.getElementById('tabla-glampings');
    const btnNuevoGlamping = document.getElementById('btn-nuevo-glamping');
    const btnCancelar = document.getElementById('btn-cancelar');
    
    // Campos del formulario
    const glampingId = document.getElementById('glamping-id');
    const glampingNombre = document.getElementById('glamping-nombre');
    const glampingCapacidad = document.getElementById('glamping-capacidad');
    const glampingPrecio = document.getElementById('glamping-precio');
    const glampingCaracteristicas = document.getElementById('glamping-caracteristicas');
    const glampingDisponible = document.getElementById('glamping-disponible');
    
    // Por defecto, ocultamos el formulario
    formGlamping.style.display = 'none';
    
    // Cargamos los glampings al iniciar la página
    cargarGlampings();
    
    // Evento para mostrar el formulario al hacer clic en "Nuevo Glamping"
    btnNuevoGlamping.addEventListener('click', function() {
        // Limpiamos el formulario
        limpiarFormulario();
        // Mostramos el formulario
        formGlamping.style.display = 'block';
    });
    
    // Evento para ocultar el formulario al hacer clic en "Cancelar"
    btnCancelar.addEventListener('click', function() {
        formGlamping.style.display = 'none';
    });
    
    // Evento para guardar un glamping al enviar el formulario
    formGlamping.addEventListener('submit', function(e) {
        // Prevenimos el comportamiento por defecto del formulario
        e.preventDefault();
        
        // Procesamos las características (convertir texto a array)
        const caracteristicasTexto = glampingCaracteristicas.value;
        const caracteristicasArray = procesarCaracteristicas(caracteristicasTexto);
        
        // Obtenemos los valores del formulario
        const glamping = {
            nombre: glampingNombre.value,
            capacidad: parseInt(glampingCapacidad.value),
            precioPorNoche: parseInt(glampingPrecio.value),
            caracteristicas: caracteristicasArray,
            disponible: glampingDisponible.value === 'true'
        };
        
        // Si hay un ID, significa que estamos editando un glamping existente
        if (glampingId.value) {
            glamping.id = parseInt(glampingId.value);
            actualizarGlamping(glamping);
        } else {
            // Si no hay ID, estamos creando un nuevo glamping
            crearGlamping(glamping);
        }
        
        // Ocultamos el formulario
        formGlamping.style.display = 'none';
    });
    
    // Función para procesar las características del textarea a un array
    function procesarCaracteristicas(texto) {
        // Dividimos el texto por saltos de línea
        const lineas = texto.split('\n');
        
        // Filtramos líneas vacías y recortamos espacios
        const caracteristicas = [];
        for (let i = 0; i < lineas.length; i++) {
            const linea = lineas[i].trim();
            if (linea) {
                caracteristicas.push(linea);
            }
        }
        
        return caracteristicas;
    }
    
    // Función para convertir un array de características a texto para el textarea
    function caracteristicasATexto(array) {
        return array.join('\n');
    }
    
    // Función para formatear el precio con separadores de miles
    function formatearPrecio(precio) {
        return precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    }
    
    // Función para mostrar las características como etiquetas
    function mostrarCaracteristicas(caracteristicas) {
        let html = '<div class="caracteristicas-container">';
        
        for (let i = 0; i < caracteristicas.length; i++) {
            html += `<span class="caracteristica-tag">${caracteristicas[i]}</span>`;
        }
        
        html += '</div>';
        return html;
    }
    
    // Función para cargar los glampings desde el archivo JSON
    function cargarGlampings() {
        // Utilizamos fetch para obtener los datos del archivo JSON
        fetch('../data/glampings.json')
            .then(response => {
                // Verificamos si la respuesta es correcta
                if (!response.ok) {
                    throw new Error('Error al cargar los glampings');
                }
                return response.json();
            })
            .then(glampings => {
                // Limpiamos la tabla
                tablaGlampings.innerHTML = '';
                
                // Recorremos el array de glampings
                for (let i = 0; i < glampings.length; i++) {
                    const glamping = glampings[i];
                    
                    // Creamos una fila para cada glamping
                    const fila = document.createElement('tr');
                    
                    // Clase de disponibilidad para aplicar estilos
                    const disponibilidadClase = glamping.disponible ? 'disponible' : 'no-disponible';
                    const disponibilidadTexto = glamping.disponible ? 'Disponible' : 'No disponible';
                    
                    // Agregamos las celdas con los datos del glamping
                    fila.innerHTML = `
                        <td>${glamping.id}</td>
                        <td>${glamping.nombre}</td>
                        <td>${glamping.capacidad} personas</td>
                        <td>${formatearPrecio(glamping.precioPorNoche)}</td>
                        <td>${mostrarCaracteristicas(glamping.caracteristicas)}</td>
                        <td class="${disponibilidadClase}">${disponibilidadTexto}</td>
                        <td>
                            <button class="btn-editar" data-id="${glamping.id}">Editar</button>
                            <button class="btn-eliminar" data-id="${glamping.id}">Eliminar</button>
                        </td>
                    `;
                    
                    // Añadimos la fila a la tabla
                    tablaGlampings.appendChild(fila);
                }
                
                // Agregamos eventos a los botones de editar y eliminar
                agregarEventosBotones();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar los glampings. Por favor, inténtalo de nuevo.');
            });
    }
    
    // Función para agregar eventos a los botones de editar y eliminar
    function agregarEventosBotones() {
        // Botones de editar
        const botonesEditar = document.querySelectorAll('.btn-editar');
        for (let i = 0; i < botonesEditar.length; i++) {
            botonesEditar[i].addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarGlamping(id);
            });
        }
        
        // Botones de eliminar
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        for (let i = 0; i < botonesEliminar.length; i++) {
            botonesEliminar[i].addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                if (confirm('¿Estás seguro de que deseas eliminar este glamping?')) {
                    eliminarGlamping(id);
                }
            });
        }
    }
    
    // Función para editar un glamping
    function editarGlamping(id) {
        // Obtenemos los datos del glamping
        fetch('../data/glampings.json')
            .then(response => response.json())
            .then(glampings => {
                // Buscamos el glamping por su ID
                let glampingEncontrado = null;
                for (let i = 0; i < glampings.length; i++) {
                    if (glampings[i].id === id) {
                        glampingEncontrado = glampings[i];
                        break;
                    }
                }
                
                if (glampingEncontrado) {
                    // Rellenamos el formulario con los datos del glamping
                    glampingId.value = glampingEncontrado.id;
                    glampingNombre.value = glampingEncontrado.nombre;
                    glampingCapacidad.value = glampingEncontrado.capacidad;
                    glampingPrecio.value = glampingEncontrado.precioPorNoche;
                    glampingCaracteristicas.value = caracteristicasATexto(glampingEncontrado.caracteristicas);
                    glampingDisponible.value = glampingEncontrado.disponible.toString();
                    
                    // Mostramos el formulario
                    formGlamping.style.display = 'block';
                } else {
                    alert('Glamping no encontrado');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos del glamping');
            });
    }
    
    // Función para crear un nuevo glamping
    function crearGlamping(glamping) {
        // En un entorno real, aquí haríamos una solicitud POST a un servidor
        // Para este ejemplo, simulamos el proceso modificando el archivo JSON local

        // Primero, obtenemos todos los glampings actuales
        fetch('../data/glampings.json')
            .then(response => response.json())
            .then(glampings => {
                // Generamos un nuevo ID (el máximo + 1)
                let maxId = 0;
                for (let i = 0; i < glampings.length; i++) {
                    if (glampings[i].id > maxId) {
                        maxId = glampings[i].id;
                    }
                }
                glamping.id = maxId + 1;
                
                // Agregamos el nuevo glamping al array
                glampings.push(glamping);
                
                // Simulamos la actualización del archivo (en un entorno real, esto se haría en el servidor)
                simularGuardadoArchivo(glampings)
                    .then(() => {
                        // Recargamos la lista de glampings
                        cargarGlampings();
                        alert('Glamping creado correctamente');
                    })
                    .catch(() => {
                        alert('Error al crear el glamping');
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para crear el glamping');
            });
    }
    
    // Función para actualizar un glamping existente
    function actualizarGlamping(glampingActualizado) {
        // Obtenemos todos los glampings actuales
        fetch('../data/glampings.json')
            .then(response => response.json())
            .then(glampings => {
                // Buscamos el índice del glamping a actualizar
                let indice = -1;
                for (let i = 0; i < glampings.length; i++) {
                    if (glampings[i].id === glampingActualizado.id) {
                        indice = i;
                        break;
                    }
                }
                
                if (indice !== -1) {
                    // Actualizamos el glamping en el array
                    glampings[indice] = glampingActualizado;
                    
                    // Simulamos la actualización del archivo
                    simularGuardadoArchivo(glampings)
                        .then(() => {
                            // Recargamos la lista de glampings
                            cargarGlampings();
                            alert('Glamping actualizado correctamente');
                        })
                        .catch(() => {
                            alert('Error al actualizar el glamping');
                        });
                } else {
                    alert('Glamping no encontrado');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para actualizar el glamping');
            });
    }
    
    // Función para eliminar un glamping
    function eliminarGlamping(id) {
        // Obtenemos todos los glampings actuales
        fetch('../data/glampings.json')
            .then(response => response.json())
            .then(glampings => {
                // Filtramos el array para eliminar el glamping
                const glampingsFiltrados = [];
                for (let i = 0; i < glampings.length; i++) {
                    if (glampings[i].id !== id) {
                        glampingsFiltrados.push(glampings[i]);
                    }
                }
                
                // Simulamos la actualización del archivo
                simularGuardadoArchivo(glampingsFiltrados)
                    .then(() => {
                        // Recargamos la lista de glampings
                        cargarGlampings();
                        alert('Glamping eliminado correctamente');
                    })
                    .catch(() => {
                        alert('Error al eliminar el glamping');
                    });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al obtener los datos para eliminar el glamping');
            });
    }
    
    // Función para limpiar el formulario
    function limpiarFormulario() {
        glampingId.value = '';
        glampingNombre.value = '';
        glampingCapacidad.value = '';
        glampingPrecio.value = '';
        glampingCaracteristicas.value = '';
        glampingDisponible.value = 'true';
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