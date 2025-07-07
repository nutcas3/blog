# Frontend Architecture Overview

This document describes the high-level architecture of the Angular blog frontend application.

---

```mermaid
flowchart TD
    subgraph User
        A[Web Browser]
    end

    subgraph Frontend [Angular Blog Frontend]
        B1[Angular Components]
        B2[Angular Services]
        B3[Angular Router]
        B4[State/Forms]
        B5[UI Libraries (Material, Tailwind)]
    end

    subgraph API
        C[(Go Blog Backend REST API)]
    end

    A -->|HTTP(S) Requests| B1
    B1 --> B3
    B1 --> B4
    B1 --> B5
    B1 --> B2
    B2 -->|HTTP REST| C
```

---

## Layer Descriptions

- **Web Browser**: Where the user interacts with the Angular single-page application (SPA).
- **Angular Components**: UI building blocks (pages, lists, forms, etc.).
- **Angular Router**: Handles navigation and URL changes in the SPA.
- **Angular Services**: Handle business/data logic and HTTP communication with the backend.
- **State/Forms**: Manages local state, form input, and validation.
- **UI Libraries**: Angular Material for components, Tailwind CSS for utility-first styling.
- **Go Blog Backend REST API**: The backend service providing blog data and authentication.

---

For more details on running the application, see the `README.md` and `docs/RUNNING_FULLSTACK.md`.
