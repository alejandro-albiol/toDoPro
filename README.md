# toDoPro
toDoPro es una aplicación de lista de tareas desarrollada con Node.js, Express, TypeScript, JavaScript, HTML y CSS. Utiliza Supabase para la gestión de la base de datos y la autenticación de usuarios. Este proyecto está diseñado para ayudar a los usuarios a gestionar sus tareas de manera eficiente y segura.

Este es mi primer proyecto personal a modo de reto de programación. Para validar y reforzar mis habilidades en el desarrollo de aplicaciones con herramientas web.

Para probar la aplicación se debe instalar PostgreSQL.

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

5. Inicia la aplicación:

    ```bash
    npm start
    ```
