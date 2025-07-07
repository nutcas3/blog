# Blog Application

A full-stack blog application with a Go backend API and Angular frontend.

![Blog Homepage](./docs/images/Screenshot%20from%202025-07-07%2004-13-58.png)

*Screenshot: The blog homepage showing recent posts*

## Overview

This project consists of two main components:
- **Backend**: A Go REST API with PostgreSQL database
- **Frontend**: An Angular single-page application with Tailwind CSS and Angular Material

## Documentation

- [Running the Full Stack](./docs/RUNNING_FULLSTACK.md) - Instructions for running both backend and frontend
- [Backend Architecture](./docs/ARCHITECTURE.md) - Overview of the Go backend architecture
- [Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md) - Overview of the Angular frontend architecture

## Quick Start

### Backend

```bash
cd blog-backend
make docker-run   # Start the database
make run          # Build and run the backend (migrations run automatically)
```

The backend will be available at http://localhost:8080

![Backend API](./docs/images/Screenshot%20from%202025-07-07%2004-14-07.png)
*Screenshot: Example of the backend API response*

### Frontend

```bash
cd blog-frontend
npm install       # Only needed once
ng serve          # Start the Angular development server
```

The frontend will be available at http://localhost:4200

## Features

### Search Functionality
![Search Feature](./docs/images/Screenshot%20from%202025-07-07%2004-14-53.png)
*Screenshot: Searching for blog posts with real-time results*

### Responsive Design
![Responsive Design](./docs/images/Screenshot%20from%202025-07-07%2004-14-59.png)
*Screenshot: The blog application on mobile and desktop views*

### Post Management
![Post Editor](./docs/images/Screenshot%20from%202025-07-07%2004-15-30.png)
*Screenshot: Creating and editing blog posts with rich text editor*

Additional features:
- Create, read, update, and delete blog posts
- Tailwind CSS for modern styling
- Angular Material components
- RESTful API with Go
- Automatic database migrations

## Component Documentation

For more detailed information about each component:

- [Backend Documentation](./blog-backend/README.md)
- [Frontend Documentation](./blog-frontend/README.md)
