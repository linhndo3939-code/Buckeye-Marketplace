# Lab Evaluation Report

**Student Repository**: `linhndo3939-code/Buckeye-Marketplace`
**Date**: 2026-03-22
**Rubric**: grading/milestone-3/rubric.md

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                        |
| ------------------- | ----- | ---- | ---------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build api.csproj` succeeded. Server starts and responds on port 5000 |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` (vite build) succeeded. Dev server starts on port 5173       |
| API Endpoints       | —     | ✅   | See details below                                                            |

**API Endpoint Tests:**

| Endpoint              | Status | Result                                               |
| --------------------- | ------ | ---------------------------------------------------- |
| GET /api/products     | 200    | Returns JSON array of 8 products with correct shape  |
| GET /api/products/1   | 200    | Returns single product: "Hibbeler Dynamics Textbook" |
| GET /api/products/999 | 404    | Correctly returns 404 for non-existent product       |

### Project Structure Comparison

| Expected  | Found    | Status |
| --------- | -------- | ------ |
| /backend  | /backend | ✅     |
| /frontend | /client  | ❌     |
| /docs     | /docs    | ✅     |

> **Note**: The rubric specifies `/frontend` but the student used `/client`. The frontend directory is named `client` instead of the expected `frontend`.

## 2. Rubric Scorecard

| #   | Requirement                          | Points | Status | Evidence                                                                                                                                                      |
| --- | ------------------------------------ | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React Product List Page              | 5      | ✅ Met | `client/src/App.jsx` L29–63 — ProductList fetches and displays products; loading state (L51); empty state (L53); ProductCard molecule (L5–27)                 |
| 2   | React Product Detail Page            | 5      | ✅ Met | `client/src/App.jsx` L65–122 — Separate route `/product/:id` (L129); shows title, price, category, seller, description, postedDate; Back to List link (L96)   |
| 3   | API Endpoint: GET /api/products      | 5      | ✅ Met | `backend/Controllers/ProductsController.cs` L114–117 — Returns `Ok(_products)` (200); in-memory `List<Product>` data store (L13–112); correct JSON array      |
| 4   | API Endpoint: GET /api/products/{id} | 5      | ✅ Met | `backend/Controllers/ProductsController.cs` L119–128 — Returns single product by ID; returns `NotFound()` (404) for unknown ID; verified via endpoint testing |
| 5   | Frontend-to-API Integration          | 5      | ✅ Met | `client/src/App.jsx` L34, L73 — Both components fetch from `http://localhost:5000/api/products`; no hardcoded data; catch blocks handle errors                |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Missing root `.gitignore`**: The repository has no root-level `.gitignore` file. The .NET `bin/` and `obj/` directories (40 files) are committed to version control, as well as `node_modules/.package-lock.json` and root `package.json`/`package-lock.json`. See cleanup instructions below.

- **Spurious root `package.json`**: An empty `{}` `package.json` and its `package-lock.json` exist at the repository root along with a `node_modules/` directory. These serve no purpose and should be removed from the repo.

- **All components in a single file**: `client/src/App.jsx` contains `ProductCard`, `ProductList`, `ProductDetail`, and `App` all in one file. For Atomic Design (referenced from M2), these should be split into separate files under an organized component hierarchy (e.g., `components/molecules/ProductCard.jsx`, `pages/ProductList.jsx`).

- **Hardcoded API base URL**: `client/src/App.jsx` uses `http://localhost:5000` directly in fetch calls (lines 34 and 73). Extract this to an environment variable or config constant (e.g., `VITE_API_URL`) for maintainability.

- **No error state UI for users**: The catch blocks in both `ProductList` (L39–42) and `ProductDetail` (L80–82) log errors to console but do not display an error message to the user. The list falls through to the empty state, which is passable, but an explicit error state would be better UX.

- **Directory naming mismatch**: The rubric solution layout standard expects `/frontend` but the project uses `/client`. Renaming to match the standard improves consistency.

- **Missing fields on detail page**: `condition` and `imageUrl` are available from the API but are not displayed on the Product Detail page. Including all available product fields provides a more complete user experience.

## 6. Git Practices Coaching (Non-Scoring)

- **Meaningful commit messages**: Commit messages like "Final Submission for Milestone 3: Connected Frontend and Backend" and "M3: Final Vertical Slice" are descriptive and convey purpose. Good practice.

- **Incremental development**: The history shows iterative work across multiple commits (model creation, folder reorganization, integration, README updates). This is good use of version control.

- **Build artifacts committed**: The `backend/bin/` and `backend/obj/` directories (40 tracked files) and root `node_modules/` are committed. These should never be in version control. Always add a `.gitignore` before the first commit.

- **"Add files via upload" commits**: Several commits use GitHub's file upload feature ("Add files via upload"). Prefer using `git add`/`git commit` from the command line or IDE for better control and more descriptive messages.

---

## Required Cleanup: `.gitignore` and Tracked Artifacts

The following files need to be removed from the repository and a proper `.gitignore` added. Run these commands from the repository root:

### Step 1: Create a root `.gitignore`

Create a file named `.gitignore` in the repository root with the following contents:

```
# .NET
backend/bin/
backend/obj/
*.user
*.suo

# Node
node_modules/
dist/

# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
```

### Step 2: Remove tracked artifacts from Git (without deleting local files)

```bash
# Remove .NET build artifacts from tracking
git rm -r --cached backend/bin/
git rm -r --cached backend/obj/

# Remove root node_modules from tracking
git rm -r --cached node_modules/

# Remove the spurious root package files
git rm package.json
git rm package-lock.json
```

### Step 3: Commit the cleanup

```bash
git add .gitignore
git commit -m "Add .gitignore and remove tracked build artifacts"
```

> **Important**: `git rm --cached` removes files from Git tracking only — your local files will remain intact. After this, the `.gitignore` will prevent them from being re-added.

---

**25/25** — All rubric requirements are fully met. The coaching notes above (`.gitignore`, component organization, hardcoded URLs, directory naming, error UI) are suggestions for professional growth, not scoring deductions.
