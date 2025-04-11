/**
 * Controlador para la gestión de clientes
 */
class ClienteController {
    /**
     * Constructor del controlador de clientes
     */
    constructor() {
        // Inicialización si es necesaria
    }

    /**
     * Obtiene todos los clientes
     * @returns {Array} Lista de todos los clientes
     */
    obtenerTodos() {
        return Cliente.obtenerClientes();
    }

    /**
     * Busca un cliente por su ID
     * @param {number} id - ID del cliente a buscar
     * @returns {Cliente|null} El cliente encontrado o null si no existe
     */
    buscarPorId(id) {
        return Cliente.obtenerClientePorId(id);
    }

    /**
     * Busca un cliente por su documento
     * @param {string} documento - Documento del cliente a buscar
     * @returns {Cliente|null} El cliente encontrado o null si no existe
     */
    buscarPorDocumento(documento) {
        const clientes = this.obtenerTodos();
        return clientes.find(c => c.getDocumento() === documento);
    }

    /**
     * Crea un nuevo cliente
     * @param {Object} datosCliente - Datos del nuevo cliente
     * @returns {Cliente} El cliente creado
     */
    crear(datosCliente) {
        const cliente = new Cliente(
            null, // El ID se asignará automáticamente en el método guardar
            datosCliente.nombre,
            datosCliente.email,
            datosCliente.telefono,
            datosCliente.documento
        );
        
        // Verificar si ya existe un cliente con el mismo documento
        const clienteExistente = this.buscarPorDocumento(datosCliente.documento);
        if (clienteExistente) {
            throw new Error('Ya existe un cliente con ese documento');
        }
        
        cliente.guardar();
        return cliente;
    }

    /**
     * Actualiza los datos de un cliente existente
     * @param {number} id - ID del cliente a actualizar
     * @param {Object} datosCliente - Nuevos datos del cliente
     * @returns {Cliente|null} El cliente actualizado o null si no existe
     */
    actualizar(id, datosCliente) {
        const cliente = this.buscarPorId(id);
        
        if (!cliente) {
            return null;
        }
        
        // Verificar si el documento ya existe en otro cliente
        if (datosCliente.documento && datosCliente.documento !== cliente.getDocumento()) {
            const clienteExistente = this.buscarPorDocumento(datosCliente.documento);
            if (clienteExistente && clienteExistente.getId() !== cliente.getId()) {
                throw new Error('Ya existe otro cliente con ese documento');
            }
        }
        
        // Actualizar sólo los campos que vienen en los datos
        if (datosCliente.nombre) cliente.setNombre(datosCliente.nombre);
        if (datosCliente.email) cliente.setEmail(datosCliente.email);
        if (datosCliente.telefono) cliente.setTelefono(datosCliente.telefono);
        if (datosCliente.documento) cliente.setDocumento(datosCliente.documento);
        
        cliente.guardar();
        return cliente;
    }

    /**
     * Elimina un cliente
     * @param {number} id - ID del cliente a eliminar
     * @returns {boolean} true si se eliminó correctamente, false en caso contrario
     */
    eliminar(id) {
        // Verificar si el cliente existe
        const cliente = this.buscarPorId(id);
        if (!cliente) {
            return false;
        }
        
        // Verificar si el cliente tiene reservas
        const reservaController = new ReservaController();
        const reservasCliente = reservaController.obtenerReservasCliente(id);
        
        if (reservasCliente.length > 0) {
            throw new Error(`No se puede eliminar el cliente porque tiene ${reservasCliente.length} reservas asociadas`);
        }
        
        // Eliminar el cliente del almacenamiento
        const clientes = this.obtenerTodos();
        const clientesFiltrados = clientes.filter(c => c.getId() !== id);
        
        // Guardar la lista actualizada de clientes
        localStorage.setItem('clientes', JSON.stringify(clientesFiltrados.map(c => c.toJSON())));
        
        return true;
    }

    /**
     * Valida los datos de un cliente
     * @param {Object} datosCliente - Datos del cliente a validar
     * @returns {Object} Objeto con los errores encontrados, vacío si no hay errores
     */
    validar(datosCliente) {
        const errores = {};
        
        // Validar nombre
        if (!datosCliente.nombre || datosCliente.nombre.trim() === '') {
            errores.nombre = 'El nombre es obligatorio';
        }
        
        // Validar email
        if (!datosCliente.email || datosCliente.email.trim() === '') {
            errores.email = 'El email es obligatorio';
        } else if (!this.validarFormatoEmail(datosCliente.email)) {
            errores.email = 'El formato del email no es válido';
        }
        
        // Validar teléfono
        if (!datosCliente.telefono || datosCliente.telefono.trim() === '') {
            errores.telefono = 'El teléfono es obligatorio';
        }
        
        // Validar documento
        if (!datosCliente.documento || datosCliente.documento.trim() === '') {
            errores.documento = 'El documento es obligatorio';
        }
        
        return errores;
    }
    
    /**
     * Valida el formato de un email
     * @param {string} email - Email a validar
     * @returns {boolean} true si el formato es válido, false en caso contrario
     */
    validarFormatoEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
} 