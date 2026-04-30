# Project Submission: Buckeye Marketplace

**Commit Hash:** [INSERT_YOUR_COMMIT_HASH_HERE]

## 1. Test Credentials
Please use these seeded accounts to verify authentication and role-based access:

| User Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@osu.edu | Admin123! |
| **Student** | student@osu.edu | Student123! |

## 2. Security Practices Applied
I have implemented the following security measures to protect the application:

1. **Role-Based Access Control (RBAC):** Backend endpoints are protected using `[Authorize(Roles = "Admin")]`. The JWT token was updated to include role claims, ensuring only authorized users can access administrative features.
2. **Password Hashing:** Integrated ASP.NET Core Identity to automatically hash passwords using PBKDF2, ensuring no plain-text passwords reside in the database.
3. **Frontend Route Protection:** Implemented a `ProtectedRoute` component in React to prevent unauthenticated users from accessing the Cart, Orders, or Admin pages.
4. **JWT Security:** Configured JWT tokens with a secure signing key and expiration times to prevent unauthorized session hijacking.

## 3. AI Usage Documentation
All AI assistance used for debugging, JWT configuration, and React state management is documented here:
- [AI-USAGE.md](./AI-USAGE.md)

## 4. Final Checklist Confirmation
- [x] `dotnet build` succeeds with no errors.
- [x] Production build (`npm run build`) is fixed (OrdersPage.jsx extension corrected).
- [x] Admin dashboard allows for product management.
- [x] Shipping form is included in the checkout flow.