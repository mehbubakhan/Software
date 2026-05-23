# Adoption Application Workflow

## Step‑by‑Step Flow
| Step | Frontend Page | Backend Process | DB Interaction | Notification | Role Responsible |
|------|---------------|----------------|----------------|--------------|------------------|
| 1. Browse Orphanages | `/dashboard/adoption#verification` (list) | `GET /adoption/orphanages` | Read `orphanages` | None | Parent |
| 2. View Child Profile | `/dashboard/adoption#children/:id` | `GET /adoption/children/:id` | Read `children` (public fields) | None | Parent |
| 3. Submit Application | `/dashboard/adoption#applications` (form) | `POST /adoption/applications` | Insert into `adoption_applications` (`status='submitted'`) | Email/SMS to Orphanage Admin | Parent |
| 4. Upload Documents | `/dashboard/adoption#documents` (upload UI) | `POST /adoption/documents` (multipart) | Insert rows in `adoption_documents` with `verified=false` | Push notification to Verification Officer | Parent |
| 5. Document Verification | – (admin UI) | `PATCH /adoption/documents/:id` mark `verified=true` | Update `adoption_documents` | Notify Orphanage Admin & Parent | Verification Officer |
| 6. Schedule Interview | `/dashboard/adoption#meetups` (calendar) | `POST /adoption/meetups` | Insert into `meetings` with `status='scheduled'` | Email/SMS to Parent & Counsellor | Orphanage Admin |
| 7. Conduct Video Meeting | Video call (WebRTC) | – | – | – | Counsellor & Parent |
| 8. Counselling Session | `/dashboard/adoption#counselling` | `POST /adoption/counselling_sessions` | Insert into `counselling_sessions` | Notify Legal Officer | Counsellor |
| 9. Legal Review | – (legal UI) | `POST /adoption/legal/approve` (internal) | Update `adoption_applications.status='approved'` | Notify Super Admin & Parent | Legal Officer |
| 10. Final Approval | – (super admin UI) | `PATCH /adoption/applications/:id/status` to `approved` (if needed) | Update status | Final acceptance email | Super Admin |
| 11. Payment (fees) | `/dashboard/adoption#payments` | `POST /adoption/payments` | Insert into `payments` | Receipt notification | Parent |
| 12. Completion | – | `PATCH /adoption/applications/:id/status` to `completed` | Update status, archive docs | Confirmation to all parties | System |

### Backend Details
- **Controllers** validate role via `permit` middleware.
- **Status Transitions** enforced in `adoptionController.updateApplicationStatus`.
- **Event Bus** (Node EventEmitter) emits `application.status.changed` → notification service.
- **Email Service** uses SendGrid; SMS via Twilio.

### UI Sketches (Glass‑morphism)
- Each step appears as a card in a vertical **Progress Timeline** with icons.
- Tabs on the left navigation (`Sidebar`) allow jumping to sections.
- Buttons use subtle gradients and hover shadows.

---
*All endpoints are listed in `api_specification.md`.*
