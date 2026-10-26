# NEXORA AI — Phase 0 Independent Repository Audit

**Audit Date:** October 26, 2026  
**Auditor:** NEXORA AI Principal Software Architect & QA Lead  
**Scope:** Architecture, Git State, Dependencies, Endpoints, Theme System, Global Search, Security Boundaries.

---

## 1. Environment & Architecture Baseline

- **Runtime & Engine:** Node.js v22 LTS, Express v4.21, React v19.0.1, TypeScript v7.0.2, Vite v8.3.0.
- **Styling Architecture:** Tailwind CSS v4 with custom dark/light theme layer, CSS design tokens, and reduced-motion compliance.
- **AI Integrations:** Google GenAI TypeScript SDK (`@google/genai` v2.4.0) with server-side proxy routes:
  - `gemini-4-argon` (Thinking Level: High for code synthesis and deep reasoning).
  - `gemini-3.8-flash` (Google Search Grounding for live web queries and header assessments).
  - `gemini-3.8-flash-lite-tts` (1-second natural speech synthesis).
  - `gemini-nano-banana-2.1` (1K, 2K, 4K visual generation).
  - `gemini-omni-1.1-flash` (Image-to-video animation).
- **Workspace & Third-Party APIs:**
  - Google Tasks API proxy with local offline ledger fallback and destructive action confirmation gates.
  - UniProt REST API (Bioinformatics protein annotations).
  - AlphaFold DB REST API (3D structural prediction coordinates).
  - PubChem PUG REST API (Chemical IUPAC and SMILES structures).

---

## 2. Global State & Context Providers

1. **`ThemeProvider` (`src/context/ThemeContext.tsx`):**
   - Modes: `'dark' | 'light' | 'system'`.
   - System detection: `window.matchMedia('(prefers-color-scheme: dark)')` with real-time change listener.
   - Persistence: `localStorage.getItem('nexora_theme_mode')`.
   - Contrast & Overrides: Configured in `src/index.css` with accessibility tokens and `prefers-reduced-motion` overrides.
   - Status: **VERIFIED**.

2. **`NotificationProvider` (`src/context/NotificationContext.tsx`):**
   - Accessible toast container (`role="region"`, `aria-live="polite"`).
   - Individual notifications (`role="status"`, dismiss controls).
   - Status: **VERIFIED**.

3. **`EcosystemStatusProvider` (`src/context/EcosystemStatusContext.tsx`):**
   - Dynamic real-time connectivity status (`online`, `syncing`, `offline`) per ecosystem.
   - Navigation status indicator dots connected to active background network tasks.
   - Status: **VERIFIED**.

---

## 3. Global Search & Command Palette System

- **Shortcut Support:** `Cmd+K` and `Ctrl+K` registered globally, plus visible trigger button in `Header.tsx`.
- **Searchable Index:** Real indexed content in `src/data/searchIndex.ts`:
  - All 12 ecosystem views and descriptions.
  - 11 real technical documentation files in `/docs`.
  - Operational actions (scans, CTF submissions, task queue, audit logs, theme toggling, persona switching).
  - Settings and quota management.
- **Categorization:** `All`, `Ecosystems`, `Actions`, `Documentation`, `Settings`.
- **In-App Doc Viewer:** `DocViewerModal.tsx` backed by server route `GET /api/docs/:name`.
- **Status:** **VERIFIED**.

---

## 4. Security & Isolation Controls

- **SSRF Defense:** Comprehensive private, loopback, multicast, CGNAT, and cloud metadata blocking (`0.0.0.0/8`, `10.0.0.0/8`, `100.64.0.0/10`, `127.0.0.0/8`, `169.254.0.0/16`, `172.16.0.0/12`, `192.168.0.0/16`, `198.18.0.0/15`, `224.0.0.0/4`, `240.0.0.0/4`, IPv6 `::1`, ULA `fc00::/7`, link-local `fe80::/10`, multicast `ff00::/8`, and IPv4-mapped IPv6 `::ffff:`).
- **DNS Rebinding Defense:** Pre-flight DNS resolution before connections with manual redirect following (`redirect: 'manual'`) re-validating every redirect hop.
- **Target Authorization:** Server-validated scope tickets issued at `/api/security/authorize`. Client `authorized: true` alone is rejected.
- **CTF Flag Verification:** Constant-time SHA-256 hash matching (`crypto.timingSafeEqual`), replay prevention ledger, and 5-attempt/min sliding-window brute-force limiter (`HTTP 429`).
- **Audit Ledger:** Server-side immutable event ledger at `/api/security/audit-logs`.
- **Status:** **VERIFIED**.
