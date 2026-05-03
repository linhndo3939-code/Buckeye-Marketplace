# Lab Evaluation Report

**Student Repository**: `linhndo3939-code/Buckeye-Marketplace`  
**Date**: April 25, 2026  
**Rubric**: rubric.md (Milestone 4)

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                                      |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Backend (.NET)      | ✅    | ✅   | `dotnet build api.csproj` succeeded. Server starts on http://localhost:5000 (required roll-forward to .NET 10 runtime).                    |
| Frontend (React/TS) | ❌    | ✅   | `npm run build` fails — `App.jsx` imports `./pages/OrdersPage.jsx` but the file is `OrdersPage.js`. Vite dev server starts without errors. |
| API Endpoints       | —     | ⚠️   | See endpoint details below.                                                                                                                |

### Frontend Build Error

```
Could not resolve "./pages/OrdersPage.jsx" from "src/App.jsx"
```

`App.jsx` line 8 imports `OrdersPage.jsx` but the actual file is `src/pages/OrdersPage.js` (`.js` extension, not `.jsx`).

### API Endpoint Tests

| Endpoint                       | Method | Status | Result                                  |
| ------------------------------ | ------ | ------ | --------------------------------------- |
| `/api/products`                | GET    | 200    | Returns 8 products ✅                   |
| `/api/cart`                    | GET    | 200    | Returns cart object with items array ✅ |
| `/api/cart` (add item)         | POST   | 200    | Item added to cart ✅                   |
| `/api/cart/{cartItemId}` (qty) | PUT    | 404    | Endpoint not implemented ❌             |
| `/api/cart/{id}` (remove item) | DELETE | 404    | Endpoint not implemented ❌             |
| `/api/cart/clear`              | DELETE | 204    | Cart cleared successfully ✅            |

## 2. Rubric Scorecard

| #   | Requirement                              | Points | Status     | Evidence                                                                                                                                                                                                                                |
| --- | ---------------------------------------- | ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------- |
| 1a  | useReducer or Context API for cart state | 2      | ⚠️ Partial | `CartContext.jsx` — Uses Context API with `useState` (not `useReducer`). Context exists and wraps the app via `CartProvider` in `main.jsx`. Award 1 of 2.                                                                               |
| 1b  | Add, update quantity, remove operations  | 2      | ⚠️ Partial | `CartContext.jsx` — `addToCart` and `removeFromCart` and `clearCart` exist, but no update-quantity operation. Award 1 of 2.                                                                                                             |
| 1c  | Cart count in header + calculated totals | 1      | ✅ Met     | `App.jsx` L63 — Header shows `View Cart ({cart?.length                                                                                                                                                                                  |     | 0})`. `CartPage.jsx`L10 — Total calculated via`reduce`. |
| 2a  | GET /api/cart                            | 1      | ✅ Met     | `CartController.cs` L16-19 — Returns `Cart` object with items list. Verified returns 200.                                                                                                                                               |
| 2b  | POST /api/cart (add item)                | 1      | ✅ Met     | `CartController.cs` L22-33 — Accepts `CartItem`, handles duplicate ProductId by incrementing quantity. Verified returns 200.                                                                                                            |
| 2c  | PUT /api/cart/{cartItemId} (update qty)  | 1      | ❌ Not Met | `CartController.cs` — No `[HttpPut]` endpoint exists. Returns 404 when tested.                                                                                                                                                          |
| 2d  | DELETE endpoints (item + clear)          | 1      | ⚠️ Partial | `CartController.cs` L35-39 — `DELETE /api/cart/clear` works (204). No `DELETE /api/cart/{id}` for individual item removal. Award 0.5 of 1.                                                                                              |
| 2e  | Proper status codes and responses        | 1      | ⚠️ Partial | GET returns 200 with cart object ✅. POST returns 200 (should be 201 Created) ⚠️. DELETE/clear returns 204 ✅. Missing endpoints return 404 ❌. Award 0.5 of 1.                                                                         |
| 3a  | Cart/CartItem EF entities                | 2      | ✅ Met     | `Cart.cs` — Cart model with `Items`, `TotalPrice`, `TotalItems`. `CartItem.cs` — Entity with `[Key]`, `ProductId`, `Product`, `Quantity`, `UserId`. Both well-defined.                                                                  |
| 3b  | Relationships and navigation properties  | 1      | ✅ Met     | `CartItem.cs` L12-13 — `ProductId` FK and `Product?` navigation property. `AppDbContext.cs` L16 — `DbSet<CartItem>` registered.                                                                                                         |
| 3c  | Migrations applied, data persists        | 1      | ❌ Not Met | `CartController.cs` L12 — Uses `private static List<CartItem>` (in-memory static list), NOT the database. Data does not persist across restarts. Migrations exist for the CartItems table but the controller never uses `AppDbContext`. |
| 4a  | Real API replaces mock/localStorage      | 2      | ❌ Not Met | `CartContext.jsx` — All cart operations use local `useState` only. No `fetch` or `axios` calls to `/api/cart`. Cart state is purely in-memory React state.                                                                              |
| 4b  | All cart operations call API             | 2      | ❌ Not Met | `CartContext.jsx` — `addToCart`, `removeFromCart`, `clearCart` all modify local state directly. None call the backend API.                                                                                                              |
| 4c  | State synchronization                    | 1      | ❌ Not Met | No sync between frontend state and backend. Frontend never fetches cart from API, never sends cart changes to API.                                                                                                                      |
| 5a  | Loading states                           | 1      | ⚠️ Partial | `App.jsx` L23 — `Loading products...` when products is null. `App.jsx` L51 — Loading fallback for cart context. No loading states for cart operations themselves. Award 0.5 of 1.                                                       |
| 5b  | Error messages and edge cases            | 1      | ⚠️ Partial | `CartPage.jsx` L43 — Checkout error alert. `CartPage.jsx` L16 — Login required alert. Empty cart message shown. But no error handling for cart API failures (since API isn't called). Award 0.5 of 1.                                   |
| 5c  | Success feedback                         | 1      | ✅ Met     | `CartPage.jsx` L33 — Alert with order ID on successful checkout.                                                                                                                                                                        |
| 6a  | Clean component structure                | 1      | ✅ Met     | Separate `pages/`, `components/`, `context/` directories. Dedicated `CartPage.jsx`, `CartContext.jsx`. Reasonable organization.                                                                                                         |
| 6b  | Service layer / custom hooks             | 1      | ❌ Not Met | No cart service layer or custom hooks. `authService.js` exists but no cart equivalent. API URLs hardcoded directly in components.                                                                                                       |
| 6c  | AI usage documented                      | 1      | ✅ Met     | `AI-USAGE.md` — Documents use of Gemini for JWT, Identity, testing, and debugging. Includes human oversight statement.                                                                                                                  |

**Total: 13 / 25**

## 3. Detailed Findings

### Item #2c: PUT /api/cart/{cartItemId} (update qty)

**What was expected**: A `PUT /api/cart/{cartItemId}` endpoint to update the quantity of a cart item.  
**What was found**: `CartController.cs` has only `[HttpGet]`, `[HttpPost]`, and `[HttpDelete("clear")]` methods. No `[HttpPut]` method exists.  
**Gap**: The entire PUT endpoint is missing. No way to update item quantity via API.

### Item #2d: DELETE endpoints (item + clear)

**What was expected**: Both a DELETE endpoint for removing a single item and a DELETE endpoint for clearing the entire cart.  
**What was found**: `CartController.cs` L35-39 — `DELETE /api/cart/clear` is implemented. No `DELETE /api/cart/{id}` exists for individual item removal.  
**Gap**: Individual item DELETE endpoint is missing.

### Item #3c: Migrations applied, data persists

**What was expected**: Cart data stored in the database via EF Core, persisting across server restarts.  
**What was found**: `CartController.cs` L12 uses `private static List<CartItem> _cartItems = new List<CartItem>()` — a static in-memory list. The controller does not inject or use `AppDbContext`. While `CartItem` entity and migrations exist (table created in `InitialCreate` migration), the controller never touches the database.  
**Gap**: Controller must use `AppDbContext` and EF Core for persistence instead of a static list.

### Item #4a/4b/4c: Frontend-Backend Integration

**What was expected**: Frontend cart operations (add, remove, update, clear) should call the backend API, and the frontend state should sync with the database.  
**What was found**: `CartContext.jsx` contains zero API calls. All methods (`addToCart`, `removeFromCart`, `clearCart`) only manipulate local React `useState`. The only API call in `CartPage.jsx` is to `/api/orders` for checkout — not to `/api/cart`.  
**Gap**: The entire frontend-backend integration for cart operations is missing. Cart is effectively still a mock/local-only implementation.

### Item #6b: Service layer / custom hooks

**What was expected**: A service layer file (e.g., `cartService.js`) or custom hooks encapsulating API calls.  
**What was found**: `authService.js` exists for auth but no equivalent for cart. API URLs are hardcoded in components (e.g., `'http://localhost:5000/api/products'` in `App.jsx`, `'http://localhost:5000/api/orders'` in `CartPage.jsx`).  
**Gap**: Create a `cartService.js` to centralize cart API calls.

## 4. Action Plan

1. **[5pts] Frontend-Backend Integration**: In `CartContext.jsx`, replace local `useState` operations with API calls using `axios` or `fetch` to `http://localhost:5000/api/cart`. `addToCart` should POST, `removeFromCart` should DELETE, `clearCart` should DELETE /clear. Add a `fetchCart` function called on mount via `useEffect`.

2. **[1pt] PUT /api/cart/{cartItemId}**: Add an `[HttpPut("{id}")]` method to `CartController.cs` that accepts a quantity update and modifies the matching `CartItem`.

3. **[1pt] DELETE /api/cart/{id}**: Add an `[HttpDelete("{id}")]` method to `CartController.cs` that removes a single cart item by its ID.

4. **[1pt] Database Persistence**: Inject `AppDbContext` into `CartController` (via constructor injection) and replace the static `_cartItems` list with EF Core queries (`_context.CartItems`). Ensure all endpoints read/write from the database.

5. **[1pt] useReducer for cart state**: Refactor `CartContext.jsx` to use `useReducer` instead of `useState` for more robust state management with defined action types (ADD, REMOVE, UPDATE, CLEAR, SET).

6. **[1pt] Update quantity operation**: Add an `updateQuantity` function to `CartContext.jsx` that calls the new PUT endpoint.

7. **[1pt] Service layer**: Create `cartService.js` with functions like `getCart()`, `addItem()`, `updateItem()`, `removeItem()`, `clearCart()` wrapping the API calls.

8. **[0.5pt] Loading states for cart ops**: Add loading indicators while cart API calls are in progress.

9. **Fix build**: Rename `OrdersPage.js` to `OrdersPage.jsx` (or change the import in `App.jsx` to `.js`) to fix the frontend production build.

## 5. Code Quality Coaching (Non-Scoring)

- **Static in-memory data in controllers**: `CartController.cs` and `ProductsController.cs` both use static lists instead of the database. This means data is shared across all users and lost on restart. Migrate both to use `AppDbContext`.

- **Hardcoded API URLs**: `App.jsx`, `CartPage.jsx`, `OrdersPage.js`, and `authService.js` all hardcode `http://localhost:5000`. Create a shared constant or use Vite's environment variables (`import.meta.env.VITE_API_URL`) to centralize the base URL.

- **JWT key in appsettings.json**: `appsettings.json` contains the JWT signing key in plain text (`"A_Very_Long_Temporary_Key_For_Testing_123!"`). This should only be in user-secrets or environment variables, never committed to source control.

- **File extension inconsistency**: `OrdersPage.js` uses `.js` while all other JSX components use `.jsx`. This causes the production build to fail. Be consistent with extensions.

- **Cart item count logic**: `App.jsx` L63 uses `cart?.length` which counts array entries, not item quantities. If the same product is added twice as separate array entries, the count is inflated. With proper quantity tracking, use `cart.reduce((sum, item) => sum + item.quantity, 0)`.

## 6. Git Practices Coaching (Non-Scoring)

- **Meaningful commit messages**: Commit messages like "Milestone 4: Completed Vertical Slice with React Router and Cart Context" and "Complete Milestone 5: Added Security, Admin CRUD, and Unit Tests" are descriptive, which is good. However, they represent very large batches of work.

- **Incremental commits**: Most milestones appear as single large commits rather than incremental progress. For example, all of Milestone 4 work is in commit `548c1b9`. Breaking work into smaller commits (e.g., "Add Cart model and EF migration", "Add CartController with GET/POST", "Add CartContext with useReducer") would better demonstrate the development process and make debugging easier.

- **Mixing milestone work**: Some commits mix work from different milestones (e.g., M5 code appears to be built on top of incomplete M4 cart integration). Completing each milestone fully before starting the next helps maintain clean history.

---

**13/25** — The Cart/CartItem models and basic Context structure are in place, but the core milestone requirement — connecting the frontend cart to the backend API — is missing. The cart controller uses a static list instead of the database, and the React cart context never calls the API. The action plan above prioritizes the frontend-backend integration (5 pts) and missing endpoints (2 pts) as the highest-impact fixes. The coaching notes above (hardcoded URLs, JWT key exposure, file extension consistency, incremental commits) are suggestions for professional growth, not scoring deductions.
