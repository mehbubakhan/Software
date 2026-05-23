# Document Upload System

## Overview
Parents must upload a set of required documents for each adoption application. The system stores files securely, validates type/size, and tracks verification status.

## Upload Flow
1. **Frontend** – Multi‑file upload component on `/dashboard/adoption#documents`. Uses `FormData` and posts to `POST /adoption/documents`.
2. **Backend** – `adoptionController.uploadDocument` receives the file, validates mime/type, scans for viruses (ClamAV), then uploads to Cloudinary (or AWS S3) with a **private** ACL.
3. **Storage** – Files stored with a generated UUID filename, path: `adoption/{applicationId}/{docType}/{uuid}`.
4. **Database** – Row inserted into `adoption_documents` with `verified = false`.
5. **Verification** – Verification Officer views pending docs via `/dashboard/verification`. They can **Approve** (sets `verified=true`, `verified_by`, `verified_at`) or **Reject** (adds comment, notifies parent).
6. **Notifications** – On approval/rejection, events fire to the Notification Service which pushes a real‑time alert and an email.

## Security
- **Encryption at rest** – Cloudinary/S3 encrypts objects with AES‑256.
- **Access control** – Signed, short‑lived URLs (5‑min) for download. Only users with appropriate role can request a signed URL (`GET /adoption/documents/:id/download`).
- **Virus scanning** – Every upload runs through ClamAV before storage.
- **Audit log** – Every upload, verification, and download creates an entry in `audit_logs`.

## API Endpoints
| Method | Path | Role | Description |
|--------|------|------|-------------|
| `POST` | `/adoption/documents` | `parent` | Upload one or multiple documents. |
| `GET`  | `/adoption/documents/:id` | `verification_officer` | Retrieve metadata. |
| `GET`  | `/adoption/documents/:id/download` | `parent`, `verification_officer`, `legal_officer` | Get signed URL for file download. |
| `PATCH`| `/adoption/documents/:id` | `verification_officer` | Mark verified / rejected, add comment. |

## Validation Rules
- Allowed mime types: `application/pdf`, `image/jpeg`, `image/png`.
- Max file size: **10 MB** per document.
- Required doc types for each application: National ID, Passport, Income Proof, Marriage Certificate (if married), Police Clearance, Medical Certificate.

## UI/UX Notes
- Show a progress bar per file.
- After upload, display status badge (Pending → Verified / Rejected).
- Provide a tooltip with verification officer comments.

---
*All related tables are defined in `database_schema.md`.*
