# Running the Full Stack Blog Application

This guide explains how to run both the backend (Go) and frontend (Angular) applications for local development.

---

## 1. Start the Backend (`blog-backend`)

Open a terminal and run the following commands from the `blog-backend` directory:

```bash
make build         # Build the backend
make docker-run    # Start the database (if needed)
make run           # Start the backend server (default: http://localhost:8080)
```

---

## 2. Start the Frontend (`blog-frontend`)

Open another terminal and run the following commands from the `blog-frontend` directory:

```bash
npm install        # Install dependencies (only needed once)
ng serve           # Start the Angular dev server (http://localhost:4200)
```

The frontend will connect to the backend at `http://localhost:8080` by default.

---

## Notes
- You can open two terminals: one in `blog-backend`, one in `blog-frontend`, and run the above commands in each.
- Make sure Docker is running if you use `make docker-run` for the database.
- If you change backend ports, update the frontend API URL accordingly.

---

For more details, see the individual `README.md` files in each app directory.
