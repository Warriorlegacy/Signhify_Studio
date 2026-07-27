# Security Policy

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Signhify, please report it privately.

**Do not** open a public GitHub issue for security vulnerabilities.

Email: Piyushrajsingh092@gmail.com

You can expect an acknowledgement within 24 hours and a fix timeline within 72 hours depending on severity.

## Scope

- Authentication and authorization bypass
- Data exposure or leakage
- Injection vulnerabilities (SQL, XSS, SSRF)
- API key or secret exposure
- RLS policy bypass in Supabase

## Out of Scope

- Rate limiting concerns on public endpoints
- Missing security headers on non-critical pages
- Self-XSS

## Encryption

Signhify uses AES-256-GCM client-side encryption for user API keys (BYOK). Encryption keys never touch our server logs or database.
