# Backend Architecture Overview

This document describes the high-level architecture of the Go blog backend service.

---

```mermaid
flowchart TD
    subgraph Client/API Consumer
        A[Frontend (Angular) or API Client]
    end

    subgraph Backend [Go Blog Backend]
        B1[HTTP Router (e.g., chi, gorilla/mux)]
        B2[Handlers / Controllers]
        B3[Services / Business Logic]
        B4[Data Access Layer (Repository)]
        B5[Database Models]
    end

    subgraph Database
        C[(PostgreSQL/MySQL/SQLite)]
    end

    A -->|HTTP REST API| B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 <-->|SQL Queries| C
```

---

## Layer Descriptions

- **Client/API Consumer**: The frontend app (Angular) or any HTTP client that interacts with the backend.
- **HTTP Router**: Handles routing of API requests to the correct handler/controller.
- **Handlers/Controllers**: Receive HTTP requests, parse inputs, call services, and return responses.
- **Services/Business Logic**: Contain core logic for blog post management, validation, etc.
- **Data Access Layer**: Responsible for querying and updating the database.
- **Database Models**: Structs representing tables/records.
- **Database**: The actual database (PostgreSQL, MySQL, SQLite, etc.).

---

For more details on running the application, see the `README.md` and `docs/RUNNING_FULLSTACK.md`.
