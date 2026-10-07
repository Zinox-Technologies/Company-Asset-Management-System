# API.md: Asset Management System API Contract

> DRAFT v0.1. Backend and frontend both build against this. Change it only by agreement and update this file in the same PR.

**Base URL (local):** `http://localhost:5000/api`
**Format:** JSON. Protected routes need header `Authorization: Bearer <token>`.

## Conventions

**Success response**
```json
{ "success": true, "data": { } }
```

**List response (paginated)**
```json
{ "success": true, "data": [ ], "page": 1, "limit": 20, "total": 134 }
```

**Error response**
```json
{ "success": false, "message": "Asset not found", "errors": [ ] }
```

| Code | Meaning |
|---|---|
| 200 / 201 | OK / Created |
| 400 | Validation error |
| 401 | Not logged in / bad token |
| 403 | Role not allowed |
| 404 | Not found |
| 409 | Conflict (e.g. asset not Available, duplicate serial) |

**List query params (where relevant):** `page`, `limit`, `search`, `sort`
Role shorthand below: **A** Admin, **I** IT, **H** HR, **M** Manager, **S** Staff, **All** any logged-in user.

---

## 1. Auth

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| POST | `/auth/login` | Public | Login with `{ email, password }`, returns `{ token, user }` |
| GET | `/auth/me` | All | Current user profile |
| PUT | `/auth/change-password` | All | `{ currentPassword, newPassword }` |

## 2. Users

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| GET | `/users` | A, I, H, M | List users (filter: `role`, `department`, `isActive`) |
| POST | `/users` | A | Create user `{ name, email, password, role, department }` |
| GET | `/users/:id` | A, I, H, M | Get one user |
| PUT | `/users/:id` | A | Update user |
| PATCH | `/users/:id/deactivate` | A | Deactivate (never hard-delete) |

## 3. Departments, Locations, Categories

Same pattern for each of `/departments`, `/locations`, `/categories`:

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| GET | `/<resource>` | All | List |
| POST | `/<resource>` | A | Create |
| PUT | `/<resource>/:id` | A | Update |

## 4. Assets

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| GET | `/assets` | A, I, H, M | List. Filters: `status`, `category`, `location`, `department`, `owner`, `assignee`, `warranty` (`active|expiring|expired`), `search` |
| POST | `/assets` | A, I | Register asset (auto-generates `assetId`) |
| GET | `/assets/mine` | All | Assets currently assigned to the logged-in user |
| GET | `/assets/:id` | A, I, H, M, S(own) | Asset details |
| PUT | `/assets/:id` | A, I | Update details (not `assetId`, not status directly) |
| GET | `/assets/:id/history` | A, I, H, M, S(own) | Combined timeline: assignments, transfers, maintenance |
| PATCH | `/assets/:id/status` | A, I | Set Lost / Damaged / Under Maintenance with `{ status, note }` |
| POST | `/assets/:id/dispose` | A, I | Dispose `{ reason, date }` |

**POST /assets body**
```json
{
  "category": "<categoryId>",
  "name": "Dell Latitude 5420",
  "model": "Latitude 5420",
  "serialNumber": "SN123456",
  "purchaseDate": "2026-01-15",
  "cost": 850000,
  "warrantyExpiry": "2028-01-15",
  "location": "<locationId>",
  "condition": "New",
  "owner": { "type": "Department", "ref": "<departmentId>" }
}
```

## 5. Assignments

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| POST | `/assignments` | A, I | Assign asset `{ asset, assignee, owner, notes }`. Asset must be `Available` |
| POST | `/assignments/:id/return` | A, I | Record return `{ conditionOnReturn, statusAfterReturn, notes }` |
| GET | `/assignments` | A, I, H, M | List (filter: `asset`, `assignee`, `active`) |
| GET | `/assignments/:id` | A, I, H, M | One assignment |

## 6. Transfers

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| POST | `/transfers` | A, I, H, M, S(own asset) | Request transfer `{ asset, newOwner, newAssignee, toLocation, reason }`; asset becomes `Pending Transfer` |
| GET | `/transfers` | A, I, H, M | List (filter: `status`, `asset`, `requestedBy`) |
| GET | `/transfers/pending` | A, M | Approval queue |
| GET | `/transfers/:id` | A, I, H, M | One transfer |
| PATCH | `/transfers/:id/approve` | A, M | Approve `{ note }`. Closes old assignment, opens new, updates owner/assignee, logs audit. Approver cannot be the requester |
| PATCH | `/transfers/:id/reject` | A, M | Reject `{ note }`. Asset returns to previous status |

**Rule:** approving or rejecting a non-`Pending` transfer returns **409**.

## 7. Maintenance

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| POST | `/maintenance` | A, I | Log `{ asset, type, description, vendor, cost, dateIn }` (asset moves to Under Maintenance) |
| PATCH | `/maintenance/:id/complete` | A, I | Complete `{ dateOut, cost, notes, statusAfter }` |
| GET | `/maintenance` | A, I, M | List (filter: `asset`, `type`) |
| GET | `/assets/:id/maintenance` | A, I, M | Maintenance history for one asset |

## 8. Dashboard and reports

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| GET | `/dashboard/summary` | A, I, H, M | Totals, counts by status, category, department, expiring warranties, pending transfers |
| GET | `/reports/assets` | A, I, H, M | Assets grouped by `groupBy=owner|employee|department|location|category|status` |
| GET | `/reports/warranty` | A, I, M | Warranty status list, param `days` (default 90) |
| GET | `/reports/transfers` | A, I, H, M | Transfers in a date range (`from`, `to`) |

## 9. Audit log

| Method | Endpoint | Roles | Purpose |
|---|---|---|---|
| GET | `/audit` | A, I | List (filter: `assetId`, `user`, `action`, `from`, `to`) |

## 10. Optional (later)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/assets/:id/qrcode` | QR image encoding the asset ID |
| GET | `/reports/export?format=xlsx|pdf` | Export report |
| POST | `/assignments/:id/acknowledge` | Employee acknowledgement of receipt |

---

## Status codes cheat sheet for key business errors

| Situation | Code | Message |
|---|---|---|
| Assign an asset that is not Available | 409 | "Asset is not available for assignment" |
| Transfer an asset already Pending Transfer | 409 | "Asset already has a pending transfer" |
| Approve own request | 403 | "You cannot approve your own request" |
| Touch a Disposed asset | 409 | "Asset is disposed and cannot be modified" |
| Duplicate serial number | 409 | "Serial number already exists" |
