# BlogFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.1.

## Running the Blog Application (Full Stack)

This project is part of a full-stack blog application with a Go backend and an Angular frontend.

### 1. Start the Backend (blog-backend)

Open a terminal and run the following commands from the `blog-backend` directory:

```bash
make build         # Build the backend
make docker-run    # Start the database (if needed)
make run           # Start the backend server (default: http://localhost:8080)
```

### 2. Start the Frontend (blog-frontend)

Open another terminal and run the following commands from the `blog-frontend` directory:

```bash
npm install        # Install dependencies (only needed once)
ng serve           # Start the Angular dev server (http://localhost:4200)
```

The frontend will connect to the backend at `http://localhost:8080` by default.

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
