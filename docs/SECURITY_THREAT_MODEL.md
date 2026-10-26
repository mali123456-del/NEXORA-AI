# NEXORA AI — Security Threat Model (STRIDE)

## 1. STRIDE Analysis
| Threat Category | Potential Vector | Mitigation in NEXORA AI |
|---|---|---|
| **Spoofing** | Forged user identity or token theft | Cryptographically scoped session tokens, Google Workspace OAuth Bearer tokens validated server-side. |
| **Tampering** | Parameter manipulation in security scans or agent tasks | Server-side validation of scan scope, schemas strictly typed in TypeScript, immutable audit trails. |
| **Repudiation** | Denying an authorized pentest or agent task execution | Structured audit log records with actor timestamp, IP, target scope, and explicit authorization signature. |
| **Information Disclosure** | Leakage of Gemini API key, prompt data, or customer PII | Zero client API key access; all GenAI calls proxy through server-side Express routes. |
| **Denial of Service (DoS)** | Recursive token consumption or expensive security scanning | Token budgets, per-minute request rate limiters, scan timeout limits, and plan quotas. |
| **Elevation of Privilege** | Normal user attempting admin actions or unauthorized target scanning | Role-Based Access Control (RBAC) with Owner, Admin, Security Analyst, Developer, and Member tiers. |

## 2. Ethical Hacking Lab Safety Controls
- **Mandatory Target Verification:** Scan requests must carry explicit authorization confirmations.
- **SSRF Defense:** Targets resolving to `127.0.0.1`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254` (cloud metadata), or `localhost` are rejected immediately unless explicitly authorized in isolated simulation mode.
- **Non-Destructive Rules:** Exploitation payloads and persistent backdoors are strictly prohibited; only passive banner analysis, header inspection, TLS configuration evaluation, and SAST heuristic checks are allowed.
