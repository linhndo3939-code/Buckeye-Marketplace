# AI Usage Log - Buckeye Marketplace
**Course:** CSE 4630  
**Student:** Linh Do  

## 🚀 Milestone 6: Final Deployment (May 1, 2026)
### 🤖 AI Tool Used
Gemini (Google) - Technical consultant for deployment and debugging.

### 🛠️ Technical Assistance Received
* **Azure Deployment:** Troubleshot 403 errors and assisted in scaling to the Basic B1 tier in the East US region.
* **Configuration:** Guided setup of Environment Variables for secure database connection strings.

### ⚖️ Human Oversight & Validation
I manually verified the API locally before deployment and made the decision to upgrade the service plan to ensure the project was live for the deadline.

---

## 🏗️ Milestone 5: Backend Logic & Security
### 🤖 AI Tool Used
Gemini (Google) - Collaborative coding partner.

### 🛠️ Technical Assistance Received
* **JWT Configuration:** Assisted in configuring JwtBearer middleware and pulling secrets from configuration.
* **Identity & Seeding:** Helped implement IdentityCore setup and automatic seeding for Admin/Student accounts.
* **Testing:** Guided the creation of xUnit tests for the Order logic.

### ⚖️ Human Oversight & Validation
All suggested code was reviewed and manually integrated to meet the specific rubric requirements.

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
