AI Usage Log - Buckeye Marketplace
Course: CSE 4630

Student: Linh Do

🤖 AI Tool Used
Gemini (Google) - Used as a technical consultant for deployment, debugging, and documentation.

🛠️ Technical Assistance Received
Azure Deployment Troubleshooting:

Problem: Encountered a 403 Forbidden error when deploying the .NET 8 backend from VS Code to an Azure App Service in the Canada Central region.

AI Guidance: Assisted in identifying that the "F1 Free" tier was stuck in a stopped state. Guided the process of enabling SCM Basic Auth Publishing in the Azure Portal.

Resolution: Assisted in the decision to scale up to a Basic B1 plan in the East US region to bypass platform-level resource restrictions.

Backend Configuration:

Guided the setup of Environment Variables in the Azure Portal for ConnectionStrings__DefaultConnection and JwtSettings__Secret to ensure the API could connect to Azure SQL securely without hardcoding credentials.

CI/CD Pipeline:

Helped refine the GitHub Actions workflow for automated deployment from the main branch to Azure Static Web Apps and App Services.

⚖️ Human Oversight & Validation
Verification: I manually tested all API endpoints using Swagger locally before attempting the cloud deployment.

Decision Making: When the Free Tier failed, I made the executive decision to use my Azure credits to upgrade to a Basic tier to ensure project availability for the grading deadline.

Security: I ensured that no sensitive secrets or connection strings were committed to the public GitHub repository by using Azure's "Environment Variables" feature as recommended.

---

To create that file, simply create a new file in your root folder (the one containing backend and api.Tests) and name it AI-USAGE.md.

Paste the following content into it:

AI-USAGE.md
Project: Buckeye Marketplace

Student: Linh Do

Course: CSE 4630

How AI Was Used:
I used Gemini (Google) as a collaborative coding partner throughout Milestone 5 to assist with the following tasks:

JWT Configuration: Assisted in configuring the JwtBearer middleware and setting up the logic to pull secrets from builder.Configuration instead of hard-coding strings.

Identity & Seeding: Helped implement the IdentityCore setup, including password requirement configuration and the automatic seeding logic for Admin and Student accounts.

Testing Strategy: Guided the creation of xUnit unit tests for the Order logic and assisted in troubleshooting folder structure issues to ensure dotnet test ran correctly.

Debugging: Provided real-time troubleshooting for .NET version compatibility issues and project reference errors.

Human Oversight:
All code generated or suggested by the AI was reviewed, manually integrated, and tested locally to ensure it met the specific rubric requirements and functioned correctly within the existing Buckeye-Marketplace architecture.
