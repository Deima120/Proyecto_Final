# Sistema de Gestión de Reservas Glamping

## Descripción del Proyecto

Este sistema de gestión permite administrar reservas de alojamientos tipo Glamping. Está diseñado con fines educativos para estudiantes de programación que están aprendiendo Programación Orientada a Objetos con JavaScript.

El proyecto utiliza únicamente HTML, CSS y JavaScript puro (vanilla), sin frameworks ni librerías externas, para facilitar la comprensión de los conceptos básicos de programación.

## Estructura del Proyecto

El proyecto está organizado en tres carpetas principales: 
Sistema-Glamping/
├── data/ # Almacena los archivos JSON con los datos
│ ├── clientes.json # Información de los clientes
│ ├── glampings.json # Información de los alojamientos disponibles
│ └── reservas.json # Registro de las reservas realizadas
├── model/ # Clases de modelo (POO)
│ ├── Cliente.js # Clase para gestionar clientes
│ ├── Glamping.js # Clase para gestionar glampings
│ └── Reserva.js # Clase para gestionar reservas
└── view/ # Interfaces de usuario
├── css/
│ └── estilos.css # Estilos generales de la aplicación
├── js/
│ ├── clientes.js # Lógica para la gestión de clientes
│ ├── glampings.js# Lógica para la gestión de glampings
│ └── reservas.js # Lógica para la gestión de reservas
├── index.html # Página principal
├── clientes.html # Página de gestión de clientes
├── glampings.html # Página de gestión de glampings
└── reservas.html # Página de gestión de reservas


## Características Principales

### 1. Gestión de Clientes
- Registro de nuevos clientes
- Visualización, edición y eliminación de clientes existentes
- Almacenamiento de datos en formato JSON

### 2. Gestión de Glampings
- Registro de nuevos alojamientos tipo glamping
- Control de capacidad, precio y características
- Gestión de disponibilidad de cada glamping

### 3. Gestión de Reservas
- Creación de reservas asociando clientes con glampings
- Cálculo automático de precios según duración y tarifa
- Control de estados (confirmada, pendiente, cancelada)
- Filtrado de reservas por diferentes criterios

## Aspectos Técnicos

### Paradigma de Programación Orientada a Objetos
El proyecto implementa conceptos fundamentales de POO:
- **Clases**: Definición de objetos Cliente, Glamping y Reserva
- **Encapsulamiento**: Métodos getter/setter para acceder a las propiedades
- **Serialización**: Conversión entre objetos y formato JSON

### Persistencia de Datos
- Almacenamiento local mediante archivos JSON
- Simulación de operaciones CRUD (Create, Read, Update, Delete)

### Interfaz de Usuario
- Diseño responsivo con CSS puro
- Interactividad mediante JavaScript vanilla
- Validación de formularios en el cliente

## Cómo Utilizar el Sistema

1. **Página de Inicio**: Accede a las diferentes secciones del sistema
2. **Gestión de Clientes**: Agrega, modifica o elimina información de clientes
3. **Gestión de Glampings**: Administra los alojamientos disponibles
4. **Gestión de Reservas**: Crea y gestiona las reservas vinculando clientes con glampings

## Consideraciones Educativas

Este proyecto ha sido diseñado específicamente para fines educativos, con las siguientes características:

- **Código Comentado**: Todas las clases y funciones incluyen comentarios detallados
- **Enfoque Gradual**: Desde conceptos básicos hasta implementaciones más complejas
- **Sin Dependencias**: No requiere conocimientos previos de frameworks o librerías
- **Operaciones Simuladas**: Las operaciones de guardado son simuladas para facilitar el aprendizaje en navegador

## Extensiones Posibles

Los estudiantes pueden expandir este proyecto de varias formas:

1. Implementar un backend real con Node.js para almacenar los datos
2. Añadir autenticación de usuarios y diferentes roles (admin, cliente)
3. Implementar un sistema de notificaciones por correo electrónico
4. Crear un panel de estadísticas y reportes
5. Añadir un sistema de valoraciones para los alojamientos

## Requisitos para Ejecutar el Proyecto

- Cualquier navegador web moderno
- No se requieren instalaciones adicionales para el frontend
- Para simular un servidor se recomienda usar la extensión "Live Server" de Visual Studio Code

## Autor

Este proyecto fue creado como material didáctico para estudiantes de programación.

---

**Nota**: En un entorno de producción real, este sistema requeriría un backend para gestionar la persistencia de datos. La implementación actual simula estas operaciones con fines educativos.