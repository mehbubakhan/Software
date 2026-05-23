# Role‑Based Access Matrix

| Role | Permissions | Dashboard Features | Data Accessible | Primary Actions |
|------|-------------|-------------------|----------------|-----------------|
| **Parent / User** | `view` children, `apply` adoption, `upload` personal documents, `view` own applications, `schedule` meetings, `participate` in counselling, `pay` fees | **Parent Dashboard** – Applied children, status tracker, uploaded documents, upcoming meetings, counselling sessions, notifications, payment history | Own profile, submitted applications, uploaded documents, meeting schedule, counselling notes (own only) | Submit application, upload documents, accept meeting invite, join video call, pay fees, view notifications |
| **Orphanage Admin** | `create`/`update` children, `review` applications, `verify` documents, `schedule` meetings, `assign` counsellors, `approve`/`reject` applications, `view` analytics | **Orphanage Dashboard** – Child management, application queue, document verification panel, meeting calendar, counsellor assignment, status updates, analytics | All children in managed orphanage, all applications for those children, uploaded documents, meeting logs, counsellor notes, audit logs | Add/edit child profiles, change adoption status, verify documents, create meet‑ups, assign counsellors, generate reports |
| **Super Admin** | `manage` users & roles, `view` all modules, `override` decisions, `configure` system settings, `audit` logs | **Super Admin Dashboard** – System analytics, user management, role assignment, compliance reports, global notifications, backup/restore | Entire system data across all orphanages, users, applications, payments, logs | Create/delete users, assign roles, change system parameters, view/clear audit logs, trigger system‑wide alerts |
| **Counsellor** | `view` assigned parents & children, `schedule` counselling sessions, `record` notes, `evaluate` readiness | **Counselling Dashboard** – Session calendar, parent/child profiles, readiness scoring, notes repository, notifications | Assigned parents/children, their application status, meeting history | Book counselling session, write notes, submit readiness score, send reminders |
| **Verification Officer** | `access` uploaded documents, `validate` authenticity, `approve`/`reject` verification, `log` actions | **Verification Dashboard** – Document queue, verification status, audit trail, alerts | All uploaded documents for applications, verification logs | Review documents, mark as verified or rejected, add comments, trigger next workflow step |
| **Legal/Documentation Officer** | `review` legal contracts, `finalize` adoption paperwork, `store` signed docs, `ensure` compliance | **Legal Dashboard** – Contract templates, signed document repository, compliance checklist, notifications | Legal documents, signed agreements, compliance records | Generate legal contract, capture signatures, archive documents, audit compliance |

### Interaction Flow
1. **Parent** → submits application → **Orphanage Admin** reviews.
2. **Orphanage Admin** → flags documents → **Verification Officer** validates.
3. **Verification Officer** → marks verified → **Counsellor** schedules interview.
4. **Counsellor** → conducts session, records readiness → **Legal Officer** drafts contract.
5. **Legal Officer** → final approval → **Super Admin** can override if needed.
6. Throughout, **Notifications** keep all parties informed.

All endpoints are protected by the `auth` middleware (JWT) and the `permit` role‑check middleware.
