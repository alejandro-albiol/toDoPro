# Todo Pro
Todo Pro es una aplicación de lista de tareas desarrollada con Node.js, Express, TypeScript, JavaScript, HTML y CSS. Utiliza PSQL para la gestión de la base de datos y la autenticación de usuarios. Este proyecto está diseñado para ayudar a los usuarios a gestionar sus tareas de manera eficiente y segura.

Este es mi primer proyecto personal a modo de reto de programación. Para validar y reforzar mis habilidades en el desarrollo de aplicaciones con herramientas web.

Para probar la aplicación se debe instalar PostgreSQL.

### Creación de la base de datos

A continuación estos son los comandos para crear a base de datos:

    -- Crear la base de datos toDoPro

    CREATE DATABASE toDoPro;

    -- Conectarse a la base de datos toDoPro

    \c toDoPro

    -- Crear la tabla users
    
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

    -- Crear la tabla tasks

    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );


### Ejecución de la Aplicación

1. Clona el repositorio:

    (SSH)
    ```bash
    git clone <git@github.com:alejandro-albiol/toDoPro.git>
    ```
    (HTTP)
    ```bash
    git clone <https://github.com/alejandro-albiol/toDoPro.git>
    ```

2. Navega hasta el directorio del proyecto.

    ```bash
    cd toDoPro
    ```
3. Instala las dependencias:

    ```bash
    npm install
    ```

4. Configura las variables de entorno para la conexión a la base de datos en el archivo .env en la raiz del proyecto. Asegúrate de tener la configuración correcta para PostgreSQL.

    ```bash
    DB_USER=exampleuser    
    DB_HOST=examplehost
    DB_NAME=exampledb
    DB_PASSWORD=examplepassword
    DB_PORT=exampleport
    ```

5. Inicia la aplicación:

    ```bash
    npm start
    ```

### Configuración de Variables de Entorno

Para que la aplicación funcione correctamente, asegúrate de configurar las siguientes variables de entorno en un archivo `.env` en la raíz del proyecto:

```plaintext
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
GROQ_API_KEY=your_groq_api_key
```

- `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`: Configuración de la base de datos PostgreSQL.
- `GROQ_API_KEY`: Clave API para la integración con GROQ.

### Integración con GROQ AI

Esta aplicación utiliza GROQ AI para proporcionar recomendaciones inteligentes en la gestión de tareas. Para configurar la integración:

1. Obtén una API key de GROQ en https://console.groq.com
2. Añade tu GROQ_API_KEY al archivo .env
3. Las recomendaciones de IA estarán disponibles en el panel de tareas

### Seguridad

- Todas las contraseñas se almacenan hasheadas usando bcrypt
- Las variables de entorno sensibles nunca deben compartirse o subirse al repositorio
- El archivo .env está incluido en .gitignore para prevenir exposición de credenciales

### Estructura del Proyecto

```
todopro/
├── src/
│   ├── backend/
│   │   ├── configuration/   # Configuración de DB y servidor
│   │   ├── controllers/     # Lógica de controladores
│   │   ├── middlewares/     # Validadores y middleware
│   │   ├── models/         # DTOs y modelos
│   │   ├── routes/        # Rutas de la API
│   │   └── services/      # Lógica de negocio
│   └── frontend/
│       ├── handlers/      # Manejadores de eventos
│       └── services/     # Servicios del cliente
├── public/
│   ├── styles/          # Archivos CSS
│   └── scripts/        # JavaScript compilado
└── build/             # Código compilado
```

### Características Principales

- CRUD completo de usuarios y tareas
- Autenticación básica con contraseñas hasheadas
- Interfaz responsive y moderna
- Validación de datos en frontend y backend
- Integración con GROQ AI para recomendaciones
- Arquitectura en capas siguiendo principios SOLID

### Scripts Disponibles

- `npm start`: Inicia la aplicación
- `npm run dev`: Inicia el servidor en modo desarrollo con hot-reload
- `npm run build`: Compila el proyecto completo
- `npm run lint`: Ejecuta el linter
- `npm run format`: Formatea el código

### Tecnologías Utilizadas

- Backend: Node.js, Express, TypeScript
- Frontend: TypeScript, HTML5, CSS3
- Base de datos: PostgreSQL
- Herramientas: ESLint, Prettier
- IA: GROQ API
