# Daycare Backend (Node/Express)

This backend provides REST APIs for the Daycare Management System.

Setup:

1. Copy `.env.example` to `.env` and set DB credentials and `JWT_SECRET`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Ensure MySQL database exists and run migrations / create tables (see schema below).
4. Start server:

```bash
npm run dev
```

Basic DB schema (MySQL):

```sql
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(50));
CREATE TABLE children (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), parent_id INT, dob DATE, FOREIGN KEY(parent_id) REFERENCES users(id));
CREATE TABLE admissions (id INT AUTO_INCREMENT PRIMARY KEY, child_id INT, parent_id INT, status VARCHAR(50), created_at DATETIME, FOREIGN KEY(child_id) REFERENCES children(id), FOREIGN KEY(parent_id) REFERENCES users(id));
CREATE TABLE jobs (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), admin_id INT, vacancies INT, description TEXT, status VARCHAR(50), created_at DATETIME);
CREATE TABLE applications (id INT AUTO_INCREMENT PRIMARY KEY, job_id INT, nanny_id INT, status VARCHAR(50), created_at DATETIME);
CREATE TABLE activities (id INT AUTO_INCREMENT PRIMARY KEY, child_id INT, nanny_id INT, type VARCHAR(100), details TEXT, created_at DATETIME);
```

Endpoints (base `/api`):
- `POST /auth/signup` — register
- `POST /auth/login` — login (returns token)
- `POST /admissions/apply` — parent applies
- `GET /admissions/pending` — admin lists pending
- `POST /admissions/:id/decide` — admin approve/reject
- `POST /jobs/post` — admin posts job
- `POST /jobs/apply` — nanny applies
- `GET /jobs/:job_id/applications` — admin lists applications
- `POST /jobs/applications/:id/decide` — admin decide
- `POST /activities` — nanny adds activity
- `GET /activities/child/:child_id` — view child activities
- `GET /dashboard/*` — various summaries
