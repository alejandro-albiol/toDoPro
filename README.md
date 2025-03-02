# toDoPro

toDoPro is a simple yet powerful task manager that leverages AI to help you prioritize and manage your tasks effectively. This is my first full-stack application, built with a hexagonal architecture and organized as a monorepo. It includes a backend, frontend, and database integration.
## Features

- Task Management: Create, read, update, and delete tasks with ease.

- User Authentication: Secure user registration and login with hashed passwords.

- AI-Powered Prioritization: Integrates with GROQ AI to provide intelligent task recommendations.

- Responsive Design: A modern and user-friendly interface that works across devices.

- Validation: Robust data validation on both the frontend and backend.

- SOLID Architecture: Follows SOLID principles for maintainable and scalable code.

## Technologies Used
- Backend

- Node.js

- Express

- TypeScript

## Frontend

- TypeScript

- HTML5

- CSS3

## Database

- PostgreSQL

## Tools

- ESLint

- Prettier

## AI Integration

- GROQ API

## Project Structure

    todopro/
    ├── backend/
    │   ├── src/
    │   │   ├── auth/           # Authentication module
    │   │   ├── config/         # App configuration
    │   │   ├── docs/           # Swagger documentation
    │   │   ├── middlewares/    # Middlewares and validators
    │   │   ├── routes/         # Static and api routes
    │   │   ├── shared/         # Shared services and models
    │   │   ├── tasks/          # Tasks related services
    │   │   └── users/          # Users related services
    │   └── tests/
    │       ├── config/         # Tests configuration
    │       ├── integration/    # Integration tests
    │       └── unit/           # Unitary tests
    ├── frontend/
    │   └── src/                # Frontend Typescript handlers
    └── public/
        ├── styles/             # CSS files
        └── js/                 # Compiled JavaScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)

- PostgreSQL (v12 or higher)

- GROQ API Key (Get it from GROQ Console)

### Installation

Clone the repository:

    git clone:
    
        https://github.com/alejandro-albiol/toDoPro.git

        

Navigate to the project directory:

    cd toDoPro

Install dependencies:

    npm install

Set up the database:

Create a PostgreSQL database named todopro.

Run the following SQL commands to create the required tables:


    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );


    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

Configure environment variables:
Create a .env file in the backend directory and add the following variables:

    DB_USER=your_db_user
    DB_HOST=your_db_host
    DB_NAME=your_db_name
    DB_PASSWORD=your_db_password
    DB_PORT=5432
    GROQ_API_KEY=your_groq_api_key

Run the application:

    npm start

Available Scripts

    npm run dev: Builds and start the project in development mode.

    npm run build: Builds the project.

    npm run lint: Runs the linter to check for code issues.

    npm run format: Formats the code using Prettier.

    npm run typedoc: Generate backend docs

### AI Integration (GROQ)

toDoPro uses GROQ AI to provide intelligent task recommendations. To enable this feature:

- Obtain an API key from [GROQ].

- Add the GROQ_API_KEY to your .env file.

AI recommendations will be available in the task management interface.

### Security

Password Hashing: All passwords are hashed using argon2.

Environment Variables: Sensitive credentials are stored in .env, which is excluded from version control via .gitignore.

Validation: Input validation is implemented on both the frontend and backend to prevent malicious data.


### Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Commit your changes and push the branch.

Submit a pull request with a detailed description of your changes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.

### Acknowledgments

- GROQ: For providing the AI API used in this project.

- Node.js and Express: For enabling a robust backend.

- PostgreSQL: For reliable and scalable database management.

Thank you for checking out toDoPro! If you have any questions or feedback, feel free to reach out.

[GROQ]: https://console.groq.com/keys