Team Task Manager (Full-Stack)
A comprehensive web application designed for teams to create projects, assign tasks, and track progress with robust role-based access control.


Key Features
Authentication: Secure user onboarding via Signup and Login functionality.

Project & Team Management: Create and organize multiple projects and manage team members within them.

Task Management: Full suite for task creation, assignment to team members, and real-time status tracking.

Comprehensive Dashboard: Visual overview of all tasks, including status updates and highlighting overdue items.

Role-Based Access Control (RBAC): Distinct permissions and views for Admin and Member roles.

 Tech Stack
Frontend: React / Vite (Tailwind CSS)

Backend: Node.js / Express

Database: PostgreSQL (via Prisma ORM)

Deployment: Railway

Requirements & Architecture
RESTful APIs: Built with standard REST principles for reliable data handling.

Data Integrity: Implemented proper schema validations and relational database mapping.

Security: Middleware-based role validation to ensure users only access authorized data.

Local Setup
Clone the repository:

Bash
git clone [your-repo-link]
Install dependencies:

For Backend: cd backend && npm install

For Frontend: cd frontend && npm install

Environment Variables:
Create a .env file in the backend directory with your DATABASE_URL.

Run the application:

Backend: npm run dev

Frontend: npm run dev
