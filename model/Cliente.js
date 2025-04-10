/**
 * Clase que representa un cliente
 */
class Cliente {
    /**
     * Constructor de la clase Cliente
     * @param {number} id - Identificador único del cliente
     * @param {string} nombre - Nombre completo del cliente
     * @param {string} email - Correo electrónico del cliente
     * @param {string} telefono - Número telefónico del cliente
     * @param {string} documento - Número de documento del cliente
     */
    constructor(id, nombre, email, telefono, documento) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.documento = documento;
    }

    /**
     * Obtiene el id del cliente
     * @returns {number} El id del cliente
     */
    getId() {
        return this.id;
    }

    /**
     * Establece el id del cliente
     * @param {number} id - El nuevo id del cliente
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Obtiene el nombre del cliente
     * @returns {string} El nombre del cliente
     */
    getNombre() {
        return this.nombre;
    }

    /**
     * Establece el nombre del cliente
     * @param {string} nombre - El nuevo nombre del cliente
     */
    setNombre(nombre) {
        this.nombre = nombre;
    }

    /**
     * Obtiene el email del cliente
     * @returns {string} El email del cliente
     */
    getEmail() {
        return this.email;
    }

    /**
     * Establece el email del cliente
     * @param {string} email - El nuevo email del cliente
     */
    setEmail(email) {
        this.email = email;
    }

    /**
     * Obtiene el teléfono del cliente
     * @returns {string} El teléfono del cliente
     */
    getTelefono() {
        return this.telefono;
    }

    /**
     * Establece el teléfono del cliente
     * @param {string} telefono - El nuevo teléfono del cliente
     */
    setTelefono(telefono) {
        this.telefono = telefono;
    }

    /**
     * Obtiene el documento del cliente
     * @returns {string} El documento del cliente
     */
    getDocumento() {
        return this.documento;
    }

    /**
     * Establece el documento del cliente
     * @param {string} documento - El nuevo documento del cliente
     */
    setDocumento(documento) {
        this.documento = documento;
    }

    /**
     * Convierte los datos del cliente a formato JSON
     * @returns {Object} Objeto con los datos del cliente
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            telefono: this.telefono,
            documento: this.documento
        };
    }

    /**
     * Guarda el cliente actual en el archivo clientes.json
     * @returns {boolean} true si el cliente se guardó correctamente, false en caso contrario
     */
    guardar() {
        const fs = require('fs');
        const path = require('path');
        
        try {
            // Ruta al archivo JSON de clientes
            const rutaArchivo = path.join(__dirname, '../data/clientes.json');
            
            // Leer el contenido actual del archivo
            let clientes = [];
            if (fs.existsSync(rutaArchivo)) {
                const contenido = fs.readFileSync(rutaArchivo, 'utf8');
                clientes = JSON.parse(contenido);
            }
            
            // Obtener el ID más alto para asignar uno nuevo si es necesario
            const maxId = clientes.reduce((max, cliente) => 
                cliente.id > max ? cliente.id : max, 0);
            
            // Si el cliente no tiene ID, asignarle uno nuevo
            if (!this.id) {
                this.id = maxId + 1;
            }
            
            // Verificar si el cliente ya existe para actualizarlo
            const index = clientes.findIndex(c => c.id === this.id);
            
            if (index !== -1) {
                // Actualizar cliente existente
                clientes[index] = this.toJSON();
            } else {
                // Agregar nuevo cliente
                clientes.push(this.toJSON());
            }
            
            // Guardar el archivo actualizado
            fs.writeFileSync(rutaArchivo, JSON.stringify(clientes, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Error al guardar el cliente:', error);
            return false;
        }
    }

    /**
     * Obtiene todos los clientes del archivo clientes.json
     * @returns {Array} Array de objetos Cliente
     */
    static obtenerClientes() {
        const fs = require('fs');
        const path = require('path');
        
        try {
            // Ruta al archivo JSON de clientes
            const rutaArchivo = path.join(__dirname, '../data/clientes.json');
            
            // Verificar si el archivo existe
            if (!fs.existsSync(rutaArchivo)) {
                console.error('El archivo de clientes no existe');
                return [];
            }
            
            // Leer el contenido del archivo
            const contenido = fs.readFileSync(rutaArchivo, 'utf8');
            
            // Convertir el contenido a un array de objetos JSON
            const clientesJson = JSON.parse(contenido);
            
            // Crear un array para almacenar los objetos Cliente
            const clientes = [];
            
            // Recorrer cada objeto JSON y convertirlo a un objeto Cliente
            for (let i = 0; i < clientesJson.length; i++) {
                const clienteJson = clientesJson[i];
                const cliente = new Cliente(
                    clienteJson.id,
                    clienteJson.nombre,
                    clienteJson.email,
                    clienteJson.telefono,
                    clienteJson.documento
                );
                clientes.push(cliente);
            }
            
            return clientes;
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
            return [];
        }
    }

    /**
     * Crea una instancia de Cliente a partir de un objeto JSON
     * @param {Object} json - Objeto con los datos del cliente
     * @returns {Cliente} Una nueva instancia de Cliente
     */
    static fromJSON(json) {
        return new Cliente(
            json.id,
            json.nombre,
            json.email,
            json.telefono,
            json.documento
        );
    }
}

// Exportamos la clase para poder usarla en otros archivos
module.exports = Cliente; 