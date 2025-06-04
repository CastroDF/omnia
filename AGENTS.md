### Project Name

**Omnia**

---

### Description

Omnia is a platform that provides **3D render hosting** services with **Augmented Reality (AR)** integration.

---

### Main Workflow

1. **Authenticated users** (via Google login) can **upload 3D files** (`.obj` and `.mtl`) through a private dashboard.
2. Files are stored securely in **AWS S3**.
3. For each uploaded render, a **public link** is generated that enables real-time **AR visualization** through a dedicated landing page.
4. **Two core products**:
   - **Render Hosting**: Shareable links for social media, websites, and ads.
   - **Product Digitization Service** (future feature): We convert physical products into AR-ready 3D models.

---

### Users

- Authentication handled by **NextAuth.js** with **Google OAuth**.
- Each user can only access their own renders via a private dashboard.

---

### Tech Stack

- **Next.js 15** (App Router, Server Actions)
- **TypeScript**
- **MongoDB** (user and render metadata storage)
- **AWS S3** (file storage)
- **Chakra UI** (UI framework)
- **Three.js** (3D model preview)
- **NextAuth.js** (authentication)
- **Codex** (for CI/CD and workspace management)

---

### CI/CD Pipeline (Codex)

- Install dependencies (`npm install`)
- Type checking (`npx tsc --noEmit`)
- Lint checks (`npm run lint`)
- Production build (`npm run build`)
- Development server (`npm run dev`)

---

### Main Routes

- `/dashboard/renders` — User’s render list
- `/dashboard/renders/upload` — Upload new renders
- `/dashboard/renders/[id]` — View render details
- `/render/[slug]` — Public landing page to view the 3D model in AR (no login required)

---

### Security

- All `/dashboard` routes are protected by user authentication.
- Users can only access renders associated with their `userId`.

---

### Commit Message Format

All commits must follow this format:
`OMNIA: <File/Feature Name>`

**Example:**
OMNIA: Add AGENTS.md
OMNIA: Setup NextAuth Google Provider
OMNIA: Implement Render Upload API

---

### Pull Request Format

#### TITLE

#### DESCRIPTION

Briefly describe what this Pull Request introduces, modifies, or fixes.

#### SUMMARY

Provide a checklist or bullet points summarizing the key changes introduced by this PR.

---

### Short Summary for Codex Agents

> _"Omnia is a SaaS platform where users upload 3D models (`.obj`/`.mtl`), hosted on AWS S3, and generate public AR visualization links. Users manage their renders in a private dashboard secured by Google login. Stack: Next.js 15, TypeScript, MongoDB, AWS S3, Chakra UI, Three.js."_
