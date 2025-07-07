# Project blog-backend

This is the Go backend for the Blog application, providing a REST API for managing blog posts and users.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

See [`../docs/RUNNING_FULLSTACK.md`](../docs/RUNNING_FULLSTACK.md) for how to run both backend and frontend together.

### Requirements

- Go 1.20+ (or your version)
- Docker (for database container)
- Make

### Makefile Commands

- **Build and test everything:**  
  `make all`
- **Build the backend:**  
  `make build`
- **Run the backend:**  
  `make run`
- **Start the DB container:**  
  `make docker-run`
- **Shutdown DB container:**  
  `make docker-down`
- **Integration tests:**  
  `make itest`
- **Run DB migrations:**  
  Migrations run automatically when the server starts. The backend uses an embedded migration system that applies SQL files from the `internal/database/migrations` directory in order.

### Environment

- Copy `.env.example` to `.env` and edit as needed.
- Default backend runs on `http://localhost:8080`.

### Example API Call

```bash
curl http://localhost:8080/api/posts
```

---

For more details on running the full stack, see [`../docs/RUNNING_FULLSTACK.md`](../docs/RUNNING_FULLSTACK.md).
```bash
make watch
```

Run the test suite:
```bash
make test
```

Clean up binary from the last build:
```bash
make clean
```
