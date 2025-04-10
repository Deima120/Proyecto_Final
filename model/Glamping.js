/**
 * Clase que representa un glamping
 */
class Glamping {
    /**
     * Constructor de la clase Glamping
     * @param {number} id - Identificador único del glamping
     * @param {string} nombre - Nombre del glamping
     * @param {number} capacidad - Cantidad de personas que pueden alojarse
     * @param {number} precioPorNoche - Precio por noche del glamping
     * @param {Array} caracteristicas - Lista de características del glamping
     * @param {boolean} disponible - Indica si el glamping está disponible
     */
    constructor(id, nombre, capacidad, precioPorNoche, caracteristicas, disponible) {
        this.id = id;
        this.nombre = nombre;
        this.capacidad = capacidad;
        this.precioPorNoche = precioPorNoche;
        this.caracteristicas = caracteristicas;
        this.disponible = disponible;
    }

    /**
     * Obtiene el id del glamping
     * @returns {number} El id del glamping
     */
    getId() {
        return this.id;
    }

    /**
     * Establece el id del glamping
     * @param {number} id - El nuevo id del glamping
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Obtiene el nombre del glamping
     * @returns {string} El nombre del glamping
     */
    getNombre() {
        return this.nombre;
    }

    /**
     * Establece el nombre del glamping
     * @param {string} nombre - El nuevo nombre del glamping
     */
    setNombre(nombre) {
        this.nombre = nombre;
    }

    /**
     * Obtiene la capacidad del glamping
     * @returns {number} La capacidad del glamping
     */
    getCapacidad() {
        return this.capacidad;
    }

    /**
     * Establece la capacidad del glamping
     * @param {number} capacidad - La nueva capacidad del glamping
     */
    setCapacidad(capacidad) {
        this.capacidad = capacidad;
    }

    /**
     * Obtiene el precio por noche del glamping
     * @returns {number} El precio por noche del glamping
     */
    getPrecioPorNoche() {
        return this.precioPorNoche;
    }

    /**
     * Establece el precio por noche del glamping
     * @param {number} precioPorNoche - El nuevo precio por noche del glamping
     */
    setPrecioPorNoche(precioPorNoche) {
        this.precioPorNoche = precioPorNoche;
    }

    /**
     * Obtiene las características del glamping
     * @returns {Array} Las características del glamping
     */
    getCaracteristicas() {
        return this.caracteristicas;
    }

    /**
     * Establece las características del glamping
     * @param {Array} caracteristicas - Las nuevas características del glamping
     */
    setCaracteristicas(caracteristicas) {
        this.caracteristicas = caracteristicas;
    }

    /**
     * Verifica si el glamping está disponible
     * @returns {boolean} true si el glamping está disponible, false en caso contrario
     */
    isDisponible() {
        return this.disponible;
    }

    /**
     * Establece la disponibilidad del glamping
     * @param {boolean} disponible - La nueva disponibilidad del glamping
     */
    setDisponible(disponible) {
        this.disponible = disponible;
    }

    /**
     * Convierte los datos del glamping a formato JSON
     * @returns {Object} Objeto con los datos del glamping
     */
    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            capacidad: this.capacidad,
            precioPorNoche: this.precioPorNoche,
            caracteristicas: this.caracteristicas,
            disponible: this.disponible
        };
    }

    /**
     * Guarda el glamping actual en el archivo glampings.json
     * @returns {boolean} true si el glamping se guardó correctamente, false en caso contrario
     */
    guardar() {
        const fs = require('fs');
        const path = require('path');
        
        try {
            // Ruta al archivo JSON de glampings
            const rutaArchivo = path.join(__dirname, '../data/glampings.json');
            
            // Leer el contenido actual del archivo
            let glampings = [];
            if (fs.existsSync(rutaArchivo)) {
                const contenido = fs.readFileSync(rutaArchivo, 'utf8');
                glampings = JSON.parse(contenido);
            }
            
            // Obtener el ID más alto para asignar uno nuevo si es necesario
            const maxId = glampings.reduce((max, glamping) => 
                glamping.id > max ? glamping.id : max, 0);
            
            // Si el glamping no tiene ID, asignarle uno nuevo
            if (!this.id) {
                this.id = maxId + 1;
            }
            
            // Verificar si el glamping ya existe para actualizarlo
            const index = glampings.findIndex(g => g.id === this.id);
            
            if (index !== -1) {
                // Actualizar glamping existente
                glampings[index] = this.toJSON();
            } else {
                // Agregar nuevo glamping
                glampings.push(this.toJSON());
            }
            
            // Guardar el archivo actualizado
            fs.writeFileSync(rutaArchivo, JSON.stringify(glampings, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Error al guardar el glamping:', error);
            return false;
        }
    }

    /**
     * Obtiene todos los glampings del archivo glampings.json
     * @returns {Array} Array de objetos Glamping
     */
    static obtenerGlampings() {
        const fs = require('fs');
        const path = require('path');
        
        try {
            // Ruta al archivo JSON de glampings
            const rutaArchivo = path.join(__dirname, '../data/glampings.json');
            
            // Verificar si el archivo existe
            if (!fs.existsSync(rutaArchivo)) {
                console.error('El archivo de glampings no existe');
                return [];
            }
            
            // Leer el contenido del archivo
            const contenido = fs.readFileSync(rutaArchivo, 'utf8');
            
            // Convertir el contenido a un array de objetos JSON
            const glampingsJson = JSON.parse(contenido);
            
            // Crear un array para almacenar los objetos Glamping
            const glampings = [];
            
            // Recorrer cada objeto JSON y convertirlo a un objeto Glamping
            for (let i = 0; i < glampingsJson.length; i++) {
                const glampingJson = glampingsJson[i];
                const glamping = new Glamping(
                    glampingJson.id,
                    glampingJson.nombre,
                    glampingJson.capacidad,
                    glampingJson.precioPorNoche,
                    glampingJson.caracteristicas,
                    glampingJson.disponible
                );
                glampings.push(glamping);
            }
            
            return glampings;
        } catch (error) {
            console.error('Error al obtener los glampings:', error);
            return [];
        }
    }

    /**
     * Obtiene un glamping por su ID
     * @param {number} id - ID del glamping a buscar
     * @returns {Glamping|null} El glamping encontrado o null si no existe
     */
    static obtenerGlampingPorId(id) {
        const glampings = Glamping.obtenerGlampings();
        
        // Recorrer el array de glampings para encontrar el que coincida con el ID
        for (let i = 0; i < glampings.length; i++) {
            if (glampings[i].getId() === id) {
                return glampings[i];
            }
        }
        
        // Si no se encuentra, retornar null
        return null;
    }

    /**
     * Crea una instancia de Glamping a partir de un objeto JSON
     * @param {Object} json - Objeto con los datos del glamping
     * @returns {Glamping} Una nueva instancia de Glamping
     */
    static fromJSON(json) {
        return new Glamping(
            json.id,
            json.nombre,
            json.capacidad,
            json.precioPorNoche,
            json.caracteristicas,
            json.disponible
        );
    }
}

// Exportamos la clase para poder usarla en otros archivos
module.exports = Glamping; 