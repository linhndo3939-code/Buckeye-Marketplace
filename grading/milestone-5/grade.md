# Lab Evaluation Report

**Student Repository**: `linhndo3939-code/Buckeye-Marketplace`
**Date**: April 25, 2026
**Rubric**: rubric.md

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                                              |
| ------------------- | ----- | ---- | -------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build api.csproj` succeeded. Server runs after `dotnet ef database update` and seeds users. |
| Frontend (React/TS) | ❌    | ✅   | `vite build` fails (import mismatch). Vite dev server starts without errors.                        |
| API Endpoints       | —     | ⚠️   | Most work; admin role enforcement broken; order history endpoint missing (404).                      |

### Frontend Build Failure

```
error during build:
Could not resolve "./pages/OrdersPage.jsx" from "src/App.jsx"
```

`App.jsx` imports `./pages/OrdersPage.jsx` but the actual file is `OrdersPage.js` (no `x` extension). Vite's dev server resolves this at runtime, but production build fails.

### API Endpoint Test Results

| Endpoint                          | Method | Auth         | Status | Expected | Result |
| --------------------------------- | ------ | ------------ | ------ | -------- | ------ |
| `/api/products`                   | GET    | None         | 200    | 200      | ✅     |
| `/api/auth/register`              | POST   | None         | 200    | 200      | ✅     |
| `/api/auth/login` (admin)         | POST   | None         | 200    | 200      | ✅     |
| `/api/auth/login` (student)       | POST   | None         | 200    | 200      | ✅     |
| `/api/orders` (no auth)           | POST   | None         | 401    | 401      | ✅     |
| `/api/products` (no auth)         | POST   | None         | 401    | 401      | ✅     |
| `/api/products` (student token)   | POST   | Student JWT  | 403    | 403      | ✅     |
| `/api/products` (admin token)     | POST   | Admin JWT    | 403    | 201      | ❌     |
| `/api/orders` (student token)     | POST   | Student JWT  | 200    | 200      | ✅     |
| `/api/orders/mine` (student)      | GET    | Student JWT  | 404    | 200      | ❌     |

**Root cause for admin 403**: `GenerateJwtToken()` in `AuthController.cs` does not include role claims in the JWT. Line 52 has the comment `// We'll add Role claims here later for the Admin requirement!` but role claims were never added.

**Root cause for orders/mine 404**: `OrdersController.cs` only defines `[HttpPost]` — there is no `[HttpGet]` endpoint for retrieving order history.

## 2. Rubric Scorecard

| #   | Requirement                                         | Points | Status     | Evidence                                                                                                            |
| --- | --------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| 1a  | Registration and login endpoints                    | 2      | ✅ Met     | `AuthController.cs` — `Register()` (L24) and `Login()` (L35) both work; tested with seeded accounts and new registration. |
| 1b  | JWT token generation                                | 1      | ✅ Met     | `AuthController.cs` — `GenerateJwtToken()` (L47) creates signed HS256 JWT with name/id claims.                     |
| 1c  | Password hashing                                    | 1      | ✅ Met     | `Program.cs` — Uses ASP.NET Identity (`AddIdentityCore<IdentityUser>`) which hashes passwords automatically.        |
| 1d  | Role-based authorization                            | 1      | ❌ Not Met | `AuthController.cs` L52 — Role claims not added to JWT. Comment says "We'll add Role claims here later!" Admin gets 403 on all role-protected endpoints. |
| 2a  | JWT middleware configured                           | 1      | ✅ Met     | `Program.cs` L34–43 — `AddAuthentication(JwtBearerDefaults)` and `AddJwtBearer()` properly configured; `UseAuthentication()` in pipeline (L63). |
| 2b  | [Authorize] on protected endpoints                  | 1      | ✅ Met     | `OrdersController.cs` L10 — `[Authorize]` on class. `ProductsController.cs` L41,50,60 — `[Authorize(Roles = "Admin")]` on CUD endpoints. |
| 2c  | Admin role enforcement + proper error codes         | 1      | ❌ Not Met | Role claims missing from JWT means `[Authorize(Roles = "Admin")]` always returns 403, even for admin users. 401/403 codes are correct for unauthenticated/unauthorized, but admin can never succeed. |
| 3a  | Login/registration pages                            | 2      | ✅ Met     | `Auth.jsx` — Combined login/register form with toggle; posts to `/api/auth/login` and `/api/auth/register`.         |
| 3b  | Token storage and auth context                      | 1      | ✅ Met     | `Auth.jsx` L33 — `localStorage.setItem('userToken', data.token)`. `App.jsx` L12–19 — Axios interceptor attaches Bearer token. |
| 3c  | Protected routes + auto token inclusion             | 1      | ❌ Not Met | No frontend route protection exists. All routes (`/cart`, `/orders`, `/login`) are accessible without auth. No `ProtectedRoute` component or auth guard. Axios interceptor handles token inclusion (partial credit for that). |
| 4a  | POST /api/orders creates order from cart            | 2      | ✅ Met     | `OrdersController.cs` — `CreateOrder()` accepts `List<OrderItemDto>`, creates `Order` with items, saves to DB, returns orderId+total. Tested: status 200, `{"orderId":1,"total":50}`. |
| 4b  | Checkout page with shipping form                    | 1      | ❌ Not Met | No dedicated checkout page or shipping form. `CartPage.jsx` has a "Proceed to Checkout" button that directly posts the order — no shipping address or form fields. |
| 4c  | Order confirmation + cart cleared                   | 1      | ✅ Met     | `CartPage.jsx` L38 — `alert("Order Placed Successfully!")` and L41 — `clearCart()` called after successful order.    |
| 4d  | Order history page                                  | 1      | ❌ Not Met | `OrdersPage.js` exists and fetches `GET /api/orders/mine`, but that endpoint does not exist in `OrdersController.cs` (404). The backend only has `[HttpPost]`. |
| 5a  | Admin dashboard with role restriction               | 1      | ❌ Not Met | No admin dashboard page, component, or route exists in the frontend. No files matching `Admin*` found.              |
| 5b  | Product management CRUD                             | 2      | ❌ Not Met | Backend has `[HttpPost]`, `[HttpPut]`, `[HttpDelete]` on `ProductsController.cs` with `[Authorize(Roles = "Admin")]`, but: (1) role claims broken so admin gets 403, (2) no frontend admin UI to manage products. |
| 5c  | Order status management                             | 1      | ❌ Not Met | No order status field on `Order` model. No endpoint to update order status. No admin UI for order management.        |
| 6a  | Automated tests pass (3+ unit, 1+ integration, 3+ frontend, 1 E2E) | 1 | ❌ Not Met | Backend: 3 unit tests pass (`OrderLogicTests.cs`), but no integration tests. Frontend: zero test files — no vitest/jest config, no `.test.*` or `.spec.*` files. No Playwright setup. |
| 6b  | Security practices (3+) documented                  | 1      | ❌ Not Met | No `SUBMISSION.md` file. No documented security practices. JWT key committed in `appsettings.json`.                  |
| 7a  | Clean organization and patterns                     | 1      | ✅ Met     | MVC pattern followed; Models, Controllers separated; frontend has components/pages/context structure.                 |
| 7b  | AI usage documented                                 | 1      | ✅ Met     | `AI-USAGE.md` present at root — documents use of Gemini for JWT config, Identity setup, testing strategy, and debugging. Includes human oversight statement. |

**Total: 12 / 25**

## 3. Detailed Findings

### Item #1d: Role-based authorization (1 pt)

**What was expected**: JWT tokens include role claims so `[Authorize(Roles = "Admin")]` works correctly.
**What was found**: `AuthController.cs` L47–65 — `GenerateJwtToken()` creates claims for Name and NameIdentifier only. Line 52 has comment `// We'll add Role claims here later for the Admin requirement!` but no role claim is ever added. Decoded admin JWT confirms no role claim present.
**Gap**: Need to add `await _userManager.GetRolesAsync(user)` and include each role as a `ClaimTypes.Role` claim.

### Item #2c: Admin role enforcement + proper error codes (1 pt)

**What was expected**: Admin endpoints return 200/201 for admin users, 403 for non-admins.
**What was found**: Because role claims are missing from the JWT, all authenticated users receive 403 on `[Authorize(Roles = "Admin")]` endpoints, including the actual admin user.
**Gap**: Fixing item #1d (adding role claims to JWT) would fix this automatically.

### Item #3c: Protected routes + auto token inclusion (1 pt)

**What was expected**: Frontend routes like `/cart`, `/orders` are protected — unauthenticated users are redirected to login.
**What was found**: `App.jsx` — All `<Route>` elements are unconditionally rendered. No `ProtectedRoute` wrapper or auth check on route level. The Axios interceptor (`App.jsx` L12–19) does attach the token automatically.
**Gap**: Need a `ProtectedRoute` component that checks for token in localStorage and redirects to `/login` if absent.

### Item #4b: Checkout page with shipping form (1 pt)

**What was expected**: A checkout page with shipping address form fields.
**What was found**: `CartPage.jsx` L12 — `handleCheckout()` posts order directly on button click. No shipping form, no address input, no separate checkout page/route.
**Gap**: Need a `/checkout` route with a form collecting shipping details before order submission.

### Item #4d: Order history page (1 pt)

**What was expected**: A working order history page that displays past orders.
**What was found**: `OrdersPage.js` exists and calls `GET /api/orders/mine`, but `OrdersController.cs` has no `[HttpGet]` endpoint. The request returns 404.
**Gap**: Add a `[HttpGet("mine")]` action to `OrdersController` that filters orders by the authenticated user's ID.

### Item #5a: Admin dashboard with role restriction (1 pt)

**What was expected**: A dedicated admin dashboard page restricted to admin users.
**What was found**: No admin-related frontend components, pages, or routes exist. No files matching `Admin*` found in the client directory.
**Gap**: Create an admin dashboard page/route with role-based access control.

### Item #5b: Product management CRUD (2 pts)

**What was expected**: Admin UI for creating, editing, and deleting products.
**What was found**: Backend has POST/PUT/DELETE endpoints on `ProductsController.cs` with `[Authorize(Roles = "Admin")]`, but (1) admin role enforcement is broken due to missing JWT role claims, and (2) no frontend admin UI exists to invoke these endpoints.
**Gap**: Fix JWT role claims and build an admin product management UI.

### Item #5c: Order status management (1 pt)

**What was expected**: Admin ability to view and update order statuses.
**What was found**: `Order.cs` has no `Status` property. No endpoint for listing all orders or updating status. No admin order management UI.
**Gap**: Add a `Status` field to the Order model, create admin endpoints for listing/updating orders, and build admin UI.

### Item #6a: Automated tests (1 pt)

**What was expected**: 3+ backend unit tests, 1+ integration test, 3+ frontend tests, 1 Playwright E2E spec — all passing.
**What was found**: Backend has 3 meaningful unit tests in `OrderLogicTests.cs` (pass with roll-forward). No integration tests. Zero frontend test files — no test runner configured in `package.json`, no vitest/jest dependency, no `.test.*` files. No Playwright setup.
**Gap**: Add integration tests, install vitest, write 3+ frontend component tests, install Playwright and write 1+ E2E spec.

### Item #6b: Security practices documented (1 pt)

**What was expected**: `SUBMISSION.md` with 3+ documented security practices; no secrets committed.
**What was found**: No `SUBMISSION.md`. JWT key `A_Very_Long_Temporary_Key_For_Testing_123!` is committed in `appsettings.json` L9. Fallback key also hardcoded in `AuthController.cs` L55.
**Gap**: Create `SUBMISSION.md`, document security practices, remove JWT key from committed files, use user-secrets only.

## 4. Action Plan

1. **[2pts] Product management CRUD (5b)**: Fix JWT role claims first (see #2), then build an admin product management page in React with forms for Create, Edit, Delete that call the existing backend endpoints.
2. **[1pt] Role-based authorization (1d)**: In `AuthController.cs` `GenerateJwtToken()`, call `await _userManager.GetRolesAsync(user)` and add each role as `new Claim(ClaimTypes.Role, role)` to the claims list. This also fixes item 2c.
3. **[1pt] Admin role enforcement (2c)**: Fixed automatically by #2 above.
4. **[1pt] Order history page (4d)**: Add `[HttpGet("mine")]` to `OrdersController` that returns orders filtered by `ClaimTypes.NameIdentifier`. The frontend `OrdersPage.js` already calls this endpoint.
5. **[1pt] Checkout page with shipping form (4b)**: Create a `/checkout` route with a shipping address form. Move the order submission logic from `CartPage.jsx` to this new page.
6. **[1pt] Admin dashboard (5a)**: Create an `/admin` route with a dashboard component. Check the user's role (decode JWT or store role in context) and restrict access.
7. **[1pt] Order status management (5c)**: Add a `Status` string property to `Order.cs`, run a migration, add `GET /api/orders` (admin) and `PUT /api/orders/{id}/status` endpoints, and build admin UI.
8. **[1pt] Protected routes (3c)**: Create a `ProtectedRoute` wrapper component that checks `localStorage.getItem('userToken')` and redirects to `/login` if absent. Wrap `/cart`, `/orders`, `/checkout` routes.
9. **[1pt] Automated tests (6a)**: Install vitest + @testing-library/react, write 3+ frontend component tests. Write 1+ backend integration test using `WebApplicationFactory`. Install Playwright and write 1 E2E spec.
10. **[1pt] Security practices documented (6b)**: Create `SUBMISSION.md`, document 3+ security practices. Remove JWT key from `appsettings.json`. Fix the `.jsx`/`.js` extension mismatch so production build passes.

## 5. Code Quality Coaching (Non-Scoring)

- **JWT key committed in source**: `appsettings.json` L9 contains the JWT signing key in plain text. `AuthController.cs` L55 also has a hardcoded fallback key. These should be in user-secrets only, never committed. Run `git grep -i "Jwt:Key"` to verify removal.

- **Products stored in static list**: `ProductsController.cs` uses a `static readonly List<Product>` instead of the database. This means product CRUD changes are lost on restart and the `Products` DbSet is unused. Inject `AppDbContext` and query from the database.

- **Cart stored in static list**: `CartController.cs` uses a `static List<CartItem>` — same issue as products. All users share one cart in memory and data is lost on restart.

- **Debug artifacts left in code**: `Auth.jsx` contains multiple `console.log("!!! DEBUG: ...")` statements (L25–27, L32, L35) and a debug-oriented `alert()` on L39. These should be removed before submission.

- **Frontend build broken**: `App.jsx` L7 imports `./pages/OrdersPage.jsx` but the file is `OrdersPage.js`. This breaks `vite build`. Rename the file or fix the import.

- **Order total calculated from client-provided prices**: `OrdersController.cs` L31 — `items.Sum(item => item.Price)` trusts the price sent by the client. Should look up actual prices from the database to prevent price manipulation.

- **No input validation on auth DTOs**: `RegisterDto` and `LoginDto` have no validation attributes. Consider adding `[Required]` and `[EmailAddress]` annotations.

- **CORS wide open**: `Program.cs` L53 — `AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()` is too permissive for production. Should restrict to the frontend's origin.

## 6. Git Practices Coaching (Non-Scoring)

- **Large monolithic commits**: Commits like "Complete Milestone 5: Added Security, Admin CRUD, and Unit Tests" bundle many features into one commit. Break work into smaller, focused commits (e.g., one for auth backend, one for tests, one for admin endpoints).

- **Incomplete work committed**: The comment "We'll add Role claims here later" was committed and never followed up on. Use a task tracker or TODO comments with a pre-push check to catch unfinished work.

- **Branch strategy**: Work was done on `main` rather than a feature branch. The `milestone-5` branch exists locally but is not on the remote. Use feature branches and pull requests for better traceability.

- **Meaningful messages improving**: Messages like "Final seed logic for admin and student users" and "Added AI-USAGE.md for rubric compliance" are descriptive — keep this up while making commits more granular.

---

**12/25** — Core authentication (login, registration, JWT generation, password hashing) works, and the basic order creation flow functions. However, missing JWT role claims break all admin functionality, the order history endpoint is absent, there is no admin frontend UI, no checkout page, no protected routes, no frontend tests, and no Playwright E2E specs. The coaching notes above (committed secrets, static data stores, debug artifacts, client-trusted prices, wide-open CORS) are suggestions for professional growth, not scoring deductions.
