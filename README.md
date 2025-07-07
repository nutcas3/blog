# Blog Application

A full-stack blog application with a Go backend API and Angular frontend.

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

### Frontend

```bash
cd blog-frontend
npm install       # Only needed once
ng serve          # Start the Angular development server
```

The frontend will be available at http://localhost:4200

## Features

- Create, read, update, and delete blog posts
- Search functionality
- Responsive design with Tailwind CSS
- Material Design components
- RESTful API
- Database migrations

## Component Documentation

For more detailed information about each component:

- [Backend Documentation](./blog-backend/README.md)
- [Frontend Documentation](./blog-frontend/README.md)
