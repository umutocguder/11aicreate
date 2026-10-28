# 11AICreate — Project Architecture & Standards

This document establishes the architecture, technology stack, execution commands, and development standards for the `11aicreate` multi-platform project.

---

## 1. Project Overview & Scope
- **Project Name**: 11AICreate Platform (`11aicreate`)
- **Brand Identity**: 11AICreate — Next-Gen AI Cinema & Visual Studio
- **Author & Copyright**: Created by 11Hopem (`https://11hopem.com`). All rights reserved.
- **Repository**: Private GitHub repository (`https://github.com/umutocguder/11aicreate`)
- **Platforms**:
  - **Web**: Next.js / Cyber Motion Animated Architecture
  - **iOS**: Swift 6 & SwiftUI (AVPlayer, StoreKit Paywall)
  - **Android**: Kotlin & Jetpack Compose (Material3, ExoPlayer)
  - **Backend**: Unified Supabase (PostgreSQL 15+, Auth, RLS, Storage)
- **Monetization Engine**: 1 Free Trial Generation Gate -> Multi-tier Subscription Paywall (`Starter $19`, `Pro $49`, `Enterprise $149`).

---

## 2. Core Architectural Standards
1. **Zero Turkish in Code (Rule 3)**:
   - All source code, variables, functions, classes, comments, docstrings, commit messages, and automated tests MUST be 100% English.
   - User communication with Umut is strictly in Turkish.
2. **Brand Identity & Attribution (Rule 9)**:
   - Every source file must contain the official `Created by 11Hopem` header.
   - Any brand attribution links in documentation or UI must point directly to `https://11hopem.com`.
   - Never use "Software Ltd. Şti." anywhere in any file.
3. **Mandatory 6-File Blueprint (Rule 4)**:
   - `AGENTS.md`, `CLAUDE.md`, `WORKLOG.md`, `README.md`, `.gitignore`, `.github/workflows/ci-cd.yml`.
4. **Mandatory Automated Testing (Rule 8)**:
   - Built on Node.js native test runner (`node --test tests/*.test.js`).
   - Zero-dependency verification for instantaneous execution.
   - All tests must pass 100% before any commit or push.
5. **Brand Assets & Favicon (Rule 13)**:
   - Unique high-resolution vector monogram logo in `assets/images/logo.svg`.
   - 1:1 synchronization between in-app brand identity and `public/favicon.svg`.
6. **Git Branch Model (15.10.2026 Model)**:
   - `master` = Production branch.
   - `dev` = UAT development branch.
   - Work lands on `dev`, then merges into `master`.

---

## 3. Tech Stack & Commands
- **Web Runtime**: Node.js (v20+ LTS) ES Modules.
- **iOS Runtime**: Xcode 16+, SwiftUI, iOS 17+.
- **Android Runtime**: Android Studio, Kotlin 2.0+, Jetpack Compose, API 24+.
- **Database**: Supabase PostgreSQL (`supabase/schema.sql`).
- **Telemetry**: Firebase Firestore REST (`hopem-software-cloud`).

### Command Reference
```bash
# Run automated test suite
npm test

# Run static lint and code header compliance checks
npm run lint

# Run autonomous SHA-256 backup
npm run backup

# Start local web development server
npm run dev
```
