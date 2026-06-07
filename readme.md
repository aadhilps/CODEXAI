# CODEXAI: Principal Systems Architect AI

An automated portfolio suite generator designed for software engineers. This application accepts unstructured, raw source code payloads along with an optional git log or project description, analyzes the codebase using the **Gemini 2.5 Flash** model, and transforms it into a structured, production-grade project portfolio suite—complete with interactive **Mermaid.js** architecture flowcharts.

---

## 🛠️ Technology Stack

### Backend
- **Python / Flask**: Core API web server orchestration.
- **Google GenAI SDK**: Interface layer leveraging `gemini-2.5-flash`.
- **Pydantic**: Structural schema validation enforcing strict JSON outputs.
- **Flask-CORS**: Secure Cross-Origin Resource Sharing handling.

### Frontend
- **React (TypeScript) / Vite**: Blazing fast single-page client interface.
- **Tailwind CSS**: Modern utility-first styling layout.
- **Mermaid.js**: Dynamic, client-side architectural flowchart compiler.

---

## 📐 System Architecture & Data Flow

The platform uses a decoupled, three-tier architecture that enforces structural boundaries between data handling, server logic, and foundation model inference:

```mermaid
graph TD
    subgraph Frontend Layer [React & Tailwind CSS]
        UI["ProjectAnalyzer Component"]
        M_Render["Mermaid.js Engine"]
    end

    subgraph Backend Layer [Flask Application]
        API["/api/analyze-project (POST)"]
        Pyd_Schema["Pydantic Output Blueprint"]
    end

    subgraph AI Foundation Layer
        Gemini["Gemini 2.5 Flash API"]
    end

    UI -->|1. Messy Code Payload| API
    API -->|2. Injects Model Constraints| Gemini
    Gemini -.->|3. Grammar-Constrained JSON| Pyd_Schema
    Pyd_Schema -->|4. Validated Type String| API
    API -->|5. Forward Native JSON| UI
    UI -->|Extracts Chart Code| M_Render