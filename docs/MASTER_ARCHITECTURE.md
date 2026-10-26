# NEXORA AI — Master Architecture Specification

## 1. System Overview
NEXORA AI is an integrated, multi-tenant AI operating platform designed for subscription recurring revenue (SaaS) and acquisition readiness. The platform unifies twelve specialized modules behind a shared identity, security gateway, telemetry ledger, and context engine.

```
                          ┌───────────────────────────┐
                          │   Client Application UI   │
                          │   (React 19, Tailwind v4) │
                          │  12 Integrated Ecosystems │
                          └─────────────┬─────────────┘
                                        │ HTTPS / JSON / SSE
                                        ▼
                          ┌───────────────────────────┐
                          │    Express Gateway API    │
                          │   (server.ts / Node.js)   │
                          │ - Auth & Session Guard    │
                          │ - SSRF & Scope Guard      │
                          │ - Rate & Budget Limiter   │
                          └──────┬─────────────┬──────┘
                                 │             │
                ┌────────────────┴───┐     ┌───┴────────────────┐
                │ Server-Side GenAI  │     │ Storage & Services │
                │ (@google/genai SDK)│     │ - Audit Vault      │
                │ - gemini-4-argon   │     │ - Science Connect  │
                │ - gemini-3.8-flash │     │ - Tasks Connector  │
                │ - gemini-omni-flash│     │ - Threat Analyzer  │
                └────────────────────┘     └────────────────────┘
```

## 2. Core Pillars
1. **Zero Client-Side Secret Exposure:** All Gemini API keys (`process.env.GEMINI_API_KEY`) stay strictly isolated within Node.js Express server endpoints (`/api/ai/*`).
2. **Authorized Ethical Hacking:** Automated scans enforce pre-flight authorization verification, loopback/private IP blocking (SSRF guard), and safe non-destructive probing.
3. **Hardware Agnostic & Low-Resource Friendly:** Cloud-first inference ensures peak performance on lightweight client hardware (e.g., dual-core, 8GB RAM).
4. **Three.js 3D Visualizer:** Hardware-adaptive WebGL with RoomEnvironment reflections and non-occluding viewport dock.
5. **Bioscience Engine:** Native connectors to UniProt, AlphaFold DB, PubChem, and NCBI data sources.
