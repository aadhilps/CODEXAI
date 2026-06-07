import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
from schema import ProofOfWorkResponse

app = Flask(__name__)
# Allows the React frontend to communicate with this backend securely
CORS(app)

# Initialize the Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # If this triggers, we need to set your API key in the terminal!
    raise ValueError("GEMINI_API_KEY environment variable not set!")

client = genai.Client(api_key=api_key)

SYSTEM_PROMPT = """
You are a Principal Systems Architect. Developers submit their raw, messy source code files and project description to you.
Your task is to analyze these inputs and return a structured, production-grade project portfolio suite.

Guidelines:
1. Infer the true architecture from the source code, tracking data from input to output.
2. Generate a valid Mermaid.js flowchart script. You MUST use a Top-Down layout (`graph TD`). Do NOT use `graph LR`.
CRITICAL MERMAID RULES:
- Do NOT include markdown fences (```mermaid).
- You MUST use simple alphanumeric IDs for nodes (e.g., A, B, C, N1).
- You MUST put the actual complex file names inside double quotes for the labels.
- Example of VALID syntax: A["frontend/src/App.jsx"] --> B["backend/app.py"]
3. Formulate EXACTLY 3 critical engineering trade-offs. Keep pros and cons to EXACTLY one short, punchy sentence each. Do not write paragraphs.
4. Draft a highly professional System Architecture README segment.
5. Provide actionable technical interview talking points.
"""


@app.route('/api/analyze-project', methods=['POST'])
def analyze_project():
    try:
        data = request.json
        raw_code_payload = data.get("code_payload", "")
        brief_desc = data.get("git_log", "No git history provided.")

        if not raw_code_payload:
            return jsonify({"error": "No source code payload provided for analysis."}), 400

        user_content = f"RAW SOURCE CODE FILES:\n{raw_code_payload}\n\nBRIEF DESCRIPTION:\n{brief_desc}"

        # Call Gemini API with Structured Outputs enabled
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=ProofOfWorkResponse,
                temperature=0.2,  # Keep temperature low so it is analytical, not highly creative
            ),
        )

        # Return the clean JSON back to the frontend
        return response.text, 200, {'Content-Type': 'application/json'}

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Runs the server on port 5000
    app.run(port=5000, debug=True)
