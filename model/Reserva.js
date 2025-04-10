/**
 * Clase que representa una reserva de glamping
 */
class Reserva {
    /**
     * Constructor de la clase Reserva
     * @param {number} id - Identificador único de la reserva
     * @param {number} clienteId - ID del cliente que realiza la reserva
     * @param {number} glampingId - ID del glamping reservado
     * @param {string} fechaInicio - Fecha de inicio de la reserva (formato YYYY-MM-DD)
     * @param {string} fechaFin - Fecha de fin de la reserva (formato YYYY-MM-DD)
     * @param {number} totalPagado - Monto total pagado por la reserva
     * @param {string} estado - Estado de la reserva (confirmada, pendiente, cancelada)
     */
    constructor(id, clienteId, glampingId, fechaInicio, fechaFin, totalPagado, estado) {
        this.id = id;
        this.clienteId = clienteId;
        this.glampingId = glampingId;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.totalPagado = totalPagado;
        this.estado = estado;
    }

    /**
     * Obtiene el id de la reserva
     * @returns {number} El id de la reserva
     */
    getId() {
        return this.id;
    }

    /**
     * Establece el id de la reserva
     * @param {number} id - El nuevo id de la reserva
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Obtiene el id del cliente
     * @returns {number} El id del cliente
     */
    getClienteId() {
        return this.clienteId;
    }

    /**
     * Establece el id del cliente
     * @param {number} clienteId - El nuevo id del cliente
     */
    setClienteId(clienteId) {
        this.clienteId = clienteId;
    }

    /**
     * Obtiene el id del glamping
     * @returns {number} El id del glamping
     */
    getGlampingId() {
        return this.glampingId;
    }

    /**
     * Establece el id del glamping
     * @param {number} glampingId - El nuevo id del glamping
     */
    setGlampingId(glampingId) {
        this.glampingId = glampingId;
    }

    /**
     * Obtiene la fecha de inicio de la reserva
     * @returns {string} La fecha de inicio de la reserva
     */
    getFechaInicio() {
        return this.fechaInicio;
    }

    /**
     * Establece la fecha de inicio de la reserva
     * @param {string} fechaInicio - La nueva fecha de inicio de la reserva
     */
    setFechaInicio(fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    /**
     * Obtiene la fecha de fin de la reserva
     * @returns {string} La fecha de fin de la reserva
     */
    getFechaFin() {
        return this.fechaFin;
    }

    /**
     * Establece la fecha de fin de la reserva
     * @param {string} fechaFin - La nueva fecha de fin de la reserva
     */
    setFechaFin(fechaFin) {
        this.fechaFin = fechaFin;
    }

    /**
     * Obtiene el total pagado por la reserva
     * @returns {number} El total pagado por la reserva
     */
    getTotalPagado() {
        return this.totalPagado;
    }

    /**
     * Establece el total pagado por la reserva
     * @param {number} totalPagado - El nuevo total pagado por la reserva
     */
    setTotalPagado(totalPagado) {
        this.totalPagado = totalPagado;
    }

    /**
     * Obtiene el estado de la reserva
     * @returns {string} El estado de la reserva
     */
    getEstado() {
        return this.estado;
    }

    /**
     * Establece el estado de la reserva
     * @param {string} estado - El nuevo estado de la reserva
     */
    setEstado(estado) {
        this.estado = estado;
    }

    /**
     * Calcula la duración de la reserva en días
     * @returns {number} La duración de la reserva en días
     */
    calcularDuracion() {
        const inicio = new Date(this.fechaInicio);
        const fin = new Date(this.fechaFin);
        const diferenciaTiempo = fin.getTime() - inicio.getTime();
        const diferenciaDias = diferenciaTiempo / (1000 * 3600 * 24);
        return Math.ceil(diferenciaDias);
    }

    /**
     * Convierte los datos de la reserva a formato JSON
     * @returns {Object} Objeto con los datos de la reserva
     */
    toJSON() {
        return {
            id: this.id,
            clienteId: this.clienteId,
            glampingId: this.glampingId,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin,
            totalPagado: this.totalPagado,
            estado: this.estado
        };
    }

    /**
     * Guarda la reserva actual en el archivo reservas.json
     * @returns {boolean} true si la reserva se guardó correctamente, false en caso contrario
     */
    guardar() {
        const fs = require('fs');
        const path = require('path');
        
        try {
            // Ruta al archivo JSON de reservas
            const rutaArchivo = path.join(__dirname, '../data/reservas.json');
            
            // Leer el contenido actual del archivo
            let reservas = [];
            if (fs.existsSync(rutaArchivo)) {
                const contenido = fs.readFileSync(rutaArchivo, 'utf8');
                reservas = JSON.parse(contenido);
            }
            
            // Obtener el ID más alto para asignar uno nuevo si es necesario
            const maxId = reservas.reduce((max, reserva) => 
                reserva.id > max ? reserva.id : max, 0);
            
            // Si la reserva no tiene ID, asignarle uno nuevo
            if (!this.id) {
                this.id = maxId + 1;
            }
            
            // Verificar si la reserva ya existe para actualizarla
            const index = reservas.findIndex(r => r.id === this.id);
            
            if (index !== -1) {
                // Actualizar reserva existente
                reservas[index] = this.toJSON();
            } else {
                // Agregar nueva reserva
                reservas.push(this.toJSON());
            }
            
            // Guardar el archivo actualizado
            fs.writeFileSync(rutaArchivo, JSON.stringify(reservas, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Error al guardar la reserva:', error);
            return false;
        }
    }

    /**
     * Obtiene todas las reservas del archivo reservas.json
     * @returns {Array} Array de objetos Reserva
     */
    static obtenerReservas() {
        const fs = require('fs');
        const path = require('path');
        
        try {
            // Ruta al archivo JSON de reservas
            const rutaArchivo = path.join(__dirname, '../data/reservas.json');
            
            // Verificar si el archivo existe
            if (!fs.existsSync(rutaArchivo)) {
                console.error('El archivo de reservas no existe');
                return [];
            }
            
            // Leer el contenido del archivo
            const contenido = fs.readFileSync(rutaArchivo, 'utf8');
            
            // Convertir el contenido a un array de objetos JSON
            const reservasJson = JSON.parse(contenido);
            
            // Crear un array para almacenar los objetos Reserva
            const reservas = [];
            
            // Recorrer cada objeto JSON y convertirlo a un objeto Reserva
            for (let i = 0; i < reservasJson.length; i++) {
                const reservaJson = reservasJson[i];
                const reserva = new Reserva(
                    reservaJson.id,
                    reservaJson.clienteId,
                    reservaJson.glampingId,
                    reservaJson.fechaInicio,
                    reservaJson.fechaFin,
                    reservaJson.totalPagado,
                    reservaJson.estado
                );
                reservas.push(reserva);
            }
            
            return reservas;
        } catch (error) {
            console.error('Error al obtener las reservas:', error);
            return [];
        }
    }

    /**
     * Obtiene una reserva por su ID
     * @param {number} id - ID de la reserva a buscar
     * @returns {Reserva|null} La reserva encontrada o null si no existe
     */
    static obtenerReservaPorId(id) {
        const reservas = Reserva.obtenerReservas();
        
        // Recorrer el array de reservas para encontrar la que coincida con el ID
        for (let i = 0; i < reservas.length; i++) {
            if (reservas[i].getId() === id) {
                return reservas[i];
            }
        }
        
        // Si no se encuentra, retornar null
        return null;
    }

    /**
     * Obtiene las reservas de un cliente específico
     * @param {number} clienteId - ID del cliente
     * @returns {Array} Array de objetos Reserva del cliente
     */
    static obtenerReservasPorCliente(clienteId) {
        const reservas = Reserva.obtenerReservas();
        const reservasCliente = [];
        
        // Recorrer el array de reservas para encontrar las del cliente
        for (let i = 0; i < reservas.length; i++) {
            if (reservas[i].getClienteId() === clienteId) {
                reservasCliente.push(reservas[i]);
            }
        }
        
        return reservasCliente;
    }

    /**
     * Obtiene las reservas de un glamping específico
     * @param {number} glampingId - ID del glamping
     * @returns {Array} Array de objetos Reserva del glamping
     */
    static obtenerReservasPorGlamping(glampingId) {
        const reservas = Reserva.obtenerReservas();
        const reservasGlamping = [];
        
        // Recorrer el array de reservas para encontrar las del glamping
        for (let i = 0; i < reservas.length; i++) {
            if (reservas[i].getGlampingId() === glampingId) {
                reservasGlamping.push(reservas[i]);
            }
        }
        
        return reservasGlamping;
    }

    /**
     * Crea una instancia de Reserva a partir de un objeto JSON
     * @param {Object} json - Objeto con los datos de la reserva
     * @returns {Reserva} Una nueva instancia de Reserva
     */
    static fromJSON(json) {
        return new Reserva(
            json.id,
            json.clienteId,
            json.glampingId,
            json.fechaInicio,
            json.fechaFin,
            json.totalPagado,
            json.estado
        );
    }
}

// Exportamos la clase para poder usarla en otros archivos
module.exports = Reserva; 