# NEXORA AI — API Reference & Contract Specification

## Base URL
All API requests are routed through `/api/*` on the server runtime.

### 1. AI Intelligence Core
- `POST /api/ai/chat`
  - **Body:** `{ prompt: string, model?: string, history?: Array<{role, content}>, systemInstruction?: string, enableSearch?: boolean, enableThinking?: boolean, feature?: string }`
  - **Models Supported:**
    - `gemini-4-argon`: High-reasoning and complex coding tasks, automatically enabled when `enableThinking: true` with `ThinkingLevel.HIGH`.
    - `gemini-3.8-flash`: Fast, reliable general reasoning and Google Search Grounding (`enableSearch: true`).
    - `gemini-3.1-flash-lite`: Ultra low latency tasks.
  - **Response:** `{ text: string, model: string, groundingMetadata: object | null }`

- `POST /api/ai/analyze-image`
  - **Body:** `{ imageBase64: string, mimeType?: string, prompt?: string }`
  - **Model:** `gemini-4-argon`
  - **Response:** `{ text: string }`

- `POST /api/ai/generate-image`
  - **Body:** `{ prompt: string, aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4', imageSize?: '1K' | '2K' | '4K' }`
  - **Model:** `gemini-nano-banana-2.1` / `gemini-3-pro-image-preview`
  - **Response:** `{ imageUrl: string, text: string, imageSize: string, aspectRatio: string }`

- `POST /api/ai/animate-video`
  - **Body:** `{ imageBase64: string, mimeType?: string, motionPrompt?: string, aspectRatio?: '16:9' | '9:16' }`
  - **Model:** `gemini-omni-1.1-flash` via Gemini Interactions API
  - **Response:** `{ videoUrl: string, aspectRatio: string, status: 'completed' }`

- `POST /api/ai/tts`
  - **Body:** `{ text: string, voice?: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' }`
  - **Model:** `gemini-3.8-flash-lite-tts`
  - **Response:** `{ audioUrl: string }`

### 2. Ethical Hacking & Defensive Security
- `POST /api/security/scan`
  - **Body:** `{ targetUrl: string, authorized: boolean, scopeNotes?: string, scanType?: string }`
  - **Security Gate:** Enforces SSRF defense (blocks RFC1918, loopback, link-local, cloud metadata IP ranges). Requires `authorized: true`.
  - **Checks:** OWASP CSP, HSTS, XFO, MIME sniffing, tech disclosures, latency, HTTP status.
  - **Response:** `{ targetUrl, httpStatus, responseTimeMs, securityScore, findings: [], headersSample, aiSummary }`

- `POST /api/security/sast`
  - **Body:** `{ code: string, language?: string }`
  - **Engine:** Combined rule-based regex patterns (hardcoded secrets, eval, SQLi, weak crypto) + deep code audit via `gemini-4-argon`.
  - **Response:** `{ totalIssues: number, issues: [], aiReview: string }`

### 3. Bioscience Engine
- `GET /api/science/protein/:id`
  - **Response:** UniProt canonical metadata + AlphaFold structure prediction URLs and pLDDT scores.
- `GET /api/science/compound/:name`
  - **Response:** PubChem CID, canonical SMILES, formula, and molecular weight.

### 4. Workspace & Google Tasks
- `GET /api/workspace/tasks`
- `POST /api/workspace/tasks`
- `PATCH /api/workspace/tasks/:id`
- `DELETE /api/workspace/tasks/:id`

### 5. Telemetry & Audit
- `GET /api/health`
- `GET /api/telemetry/usage`
- `GET /api/security/audit-logs`
