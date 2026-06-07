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
    A["User Input (Code & Description)"] --> B["React Frontend"]
    B -->|1. POST Payload| C["Flask Backend"]
    C -->|2. Injects Pydantic Schema| D["Gemini 2.5 Flash"]
    D -->|3. Validated JSON String| C
    C -->|4. Forward Clean JSON| B
    B --> E["UI Layout & Mermaid Chart"] M_Render

1. Repository Setup & Clone

git clone <your-repository-url>
cd my-proof-of-work-project

2. Backend Installation (Flask)

cd backend
python -m venv venv

# Activate on Mac/Linux:
source venv/bin/activate
# Activate on Windows (Command Prompt):
# venv\Scripts\activate

pip install -r requirements.txt

Set your secret Gemini API key in your terminal environment:
# Mac/Linux:
export GEMINI_API_KEY="your_actual_api_key_here"
# Windows (Command Prompt):
# set GEMINI_API_KEY="your_actual_api_key_here"

Start the Flask server:
python app.py

3. Frontend Installation (React)
cd frontend
npm install
npm run dev

