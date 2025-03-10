---

# Document Management Backend

A NestJS-based backend service for user authentication, document management, and ingestion control, integrated with a PostgreSQL database via Prisma and a Python backend for ingestion processing.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Roles and Permissions](#roles-and-permissions)
- [APIs](#apis)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## Project Overview
This project is a backend service designed to manage user authentication and document-related operations, including CRUD (Create, Read, Update, Delete) and ingestion processes. It uses a microservices-friendly architecture to interact with an external Python backend for document ingestion. The system enforces role-based authorization with three roles: **Admin**, **Editor**, and **Viewer**, secured via JWT authentication.

---

## Features
- **User Authentication**: Register and login with JWT-based authentication.
- **Document Management**: CRUD operations for documents with file upload support.
- **Ingestion Control**: Trigger and track document ingestion processes in a Python backend.
- **Role-Based Access**: Permissions enforced for Admin, Editor, and Viewer roles.
- **Database**: PostgreSQL integration via Prisma for persistent storage.

---

## Roles and Permissions

The system defines three roles with distinct permissions within document management:

- **Admin**: Full control over all documents (CRUD) and ingestion processes (trigger and manage all). Full control over all users (CRUD)
- **Editor**: Can create and update all documents).
- **Viewer**: Read-only access to all documents; no ingestion or modification capabilities.

---

## APIs

### Authentication
- **POST /auth/register**
  - Registers a new user.
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Roles: Public (no JWT required).

- **POST /auth/login**
  - Logs in a user and returns a JWT.
  - Body: `{ "username": "string", "password": "string" }`
  - Roles: Public.

- **POST /auth/logout**
  - Revokes the current JWT (blacklisted).
  - Headers: `Authorization: Bearer <token>`
  - Roles: Authenticated users.

### User Management
- **POST /user**
  - Creates a new user.
  - Body: `{ "username": "string", "email": "string", "password": "string", "role": "ADMIN | EDITOR | VIEWER" }`
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin only.

- **GET /user**
  - Retrieves all users.
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin only.

- **GET /user/:id**
  - Retrieves a specific user by ID.
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin only.

- **PATCH /user/:id**
  - Updates a user’s role.
  - Body: `{ "role": "ADMIN | EDITOR | VIEWER" }`
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin only.

- **DELETE /user/:id**
  - Deletes a user.
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin only.

### Document Management
- **POST /document/upload**
  - Uploads a new document.
  - Body: `multipart/form-data` with `file` (file), `title` (string).
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin, Editor.

- **GET /document**
  - Retrieves all documents.
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin, Editor, Viewer.

- **GET /document/:id**
  - Retrieves a specific document by ID.
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin, Editor, Viewer.

- **PATCH /document/:id**
  - Updates a document’s title or file.
  - Body: `multipart/form-data` with `file` (file), `title` (string)`
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin, Editor.

- **DELETE /document/:id**
  - Deletes a document.
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin only.

### Ingestion Control
- **POST /document/:id/ingestion/start**
  - Triggers ingestion for a document in the Python backend.
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin.

- **GET /document/ingestion/:processId**
  - Retrieves the status of an ingestion process.
  - Headers: `Authorization: Bearer <token>`
  - Roles: Admin.

---

## Tech Stack
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer (`@nestjs/platform-express`)
- **Validation**: `class-validator` and `ValidationPipe`

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL (local or cloud, e.g., Neon)


### Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd doc-mgmt
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgres://username:password@host:port/dbname?sslmode=require
   JWT_SECRET=your-very-secret-key
   JWT_EXPIRES_IN=1h
   ```

4. **Set Up Database**:
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev --name init
     ```
   - Generate Prisma client:
     ```bash
     npx prisma generate
     ```

5. **Run the Application**:
   ```bash
   npm run start:dev
   ```
   - The server will run on `http://localhost:3000`.

---

## Usage

1. **Register a User**:
   ```bash
   curl -X POST http://localhost:3000/auth/register \
   -H "Content-Type: application/json" \
   -d '{"username": "admin", "email": "admin@example.com", "password": "secret123"}'
   ```
   - Role defaults to `"viewer"`
   - Manually set the role to `"admin"` for the first time in the database.

2. **Login**:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
   -H "Content-Type: application/json" \
   -d '{"username": "admin", "password": "secret123"}'
   ```
   - Returns a JWT token.

3. **Create a User (Admin)**:
   ```bash
   curl -X POST http://localhost:3000/user \
   -H "Authorization: Bearer <token>" \
   -H "Content-Type: application/json" \
   -d '{"username": "editor1", "email": "editor1@example.com", "password": "secret123", "role": "EDITOR"}'
   ```

3. **Upload a Document (Admin/Editor)**:
   ```bash
   curl -X POST http://localhost:3000/document/upload \
   -H "Authorization: Bearer <token>" \
   -F "file=@/path/to/document.pdf" \
   -F "title=My Document"
   ```

4. **View Documents (All Roles)**:
   ```bash
   curl -X GET http://localhost:3000/document \
   -H "Authorization: Bearer <token>"
   ```

5. **Trigger Ingestion (Admin)**:
   ```bash
   curl -X POST http://localhost:3000/document/1/ingestion/start \
   -H "Authorization: Bearer <token>"
   ```

---

## Future Enhancements
- **Privacy Control**: Add a `public` flag to documents to limit Viewer visibility.
- **Track Document Changes**: Link the document with the owner and track who made the changes to the document.
- **Revoked JWT Cleanup**: Add a logic to cleanup revoked JWT from database.
- **Cloud Storage**: Replace local file storage with AWS S3 or similar.
- **Ingestion Callback**: Add an endpoint for the Python backend to update ingestion status.
- **Pagination**: Implement pagination for `GET /documents`.

---

## Contributing
Feel free to submit issues or pull requests to enhance this project. Ensure any changes align with the role-based permissions and microservices architecture.

---
