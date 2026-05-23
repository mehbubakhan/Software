# Status Tracker Documentation

## Overview
The **Status Tracker** provides a unified view of an adoption application's lifecycle. It displays a visual timeline and triggers notifications at each transition.

## Status Enum
```sql
CREATE TYPE adoption_status AS ENUM (
  'submitted',
  'under_review',
  'documents_verified',
  'meeting_scheduled',
  'counselling',
  'legal_review',
  'approved',
  'rejected',
  'completed'
);
```

## State Transition Rules
| Current | Action | New | Allowed Roles |
|---------|--------|-----|----------------|
| `submitted` | Verify documents | `documents_verified` | verification_officer |
| `documents_verified` | Schedule interview | `meeting_scheduled` | orphanage_manager |
| `meeting_scheduled` | Conduct meeting | `counselling` | counsellor |
| `counselling` | Submit readiness score | `legal_review` | counsellor |
| `legal_review` | Approve / Reject | `approved` / `rejected` | legal_officer |
| `approved` | Payment received | `completed` | parent |
| `rejected` | – | – | – |

## UI – Timeline Component (React)
```jsx
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const statusSteps = [
  { key: 'submitted', label: 'Application Submitted', icon: <FaCheckCircle className="text-green-500"/> },
  { key: 'documents_verified', label: 'Documents Verified', icon: <FaCheckCircle/> },
  { key: 'meeting_scheduled', label: 'Interview Scheduled', icon: <FaClock/> },
  { key: 'counselling', label: 'Counselling Session', icon: <FaClock/> },
  { key: 'legal_review', label: 'Legal Review', icon: <FaClock/> },
  { key: 'approved', label: 'Approved', icon: <FaCheckCircle/> },
  { key: 'rejected', label: 'Rejected', icon: <FaTimesCircle className="text-red-500"/> },
  { key: 'completed', label: 'Completed', icon: <FaCheckCircle/> },
];

export default function StatusTimeline({ currentStatus }) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {statusSteps.map(step => (
        <div key={step.key} className="flex items-center">
          <div className={`p-2 rounded-full ${step.key === currentStatus ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-600'}`}> {step.icon} </div>
          <span className={`ml-2 ${step.key === currentStatus ? 'font-bold text-violet-700' : 'text-gray-500'}`}>{step.label}</span>
        </div>
      ))}
    </div>
  );
}
```

## Notification Triggers (Event‑Driven)
- On status change, `application.status.changed` event emitted.
- **Notification Service** listens and creates a row in `notifications` with payload `{ applicationId, newStatus }`.
- Push via Firebase Cloud Messaging and email via SendGrid.
- Parents receive a clickable link that opens the **Parent Dashboard** focused on the relevant step.

## Audit Logging
Every transition records:
```json
{ "user_id": <id>, "action": "status_change", "target_table": "adoption_applications", "target_id": <appId>, "details": { "from": "submitted", "to": "documents_verified" }, "created_at": "2026-05-23T..." }
```

---
*All related tables are defined in `database_schema.md`.*
