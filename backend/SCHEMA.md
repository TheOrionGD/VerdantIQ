# EcoSphere (VerdantIQ) MongoDB Database Schema Specification

This document details the MongoDB collections, document models, geospatial indexes, and index justifications for EcoSphere (VerdantIQ).

## 1. Collections Overview

| Collection Name | Document Entity | Description | Key Indexes |
|---|---|---|---|
| `users` | `User` | Application users and RBAC roles | `email` (Unique) |
| `household_twins` | `HouseholdTwin` | Baseline resource footprint & digital twin parameters | `userId` (Unique) |
| `activity_logs` | `ActivityLog` | Tracked carbon offsets (transport, energy, water, waste, trees) | `userId`, `institutionId`, `location` (2dsphere) |
| `challenges` | `Challenge` | Institutional sustainability goals & rewards | `institutionId`, `active` |
| `verifications` | `Verification` | Proof evidence submissions for admin review | `userId`, `institutionId`, `status` |
| `institutions` | `Institution` | Academic/corporate campuses with polygon geofence bounds | `name`, `campusBoundary` (2dsphere) |
| `notifications` | `Notification` | System & anomaly alert notifications | `userId`, `createdAt` |

## 2. Geospatial Indexes & Index Justifications

* **`activity_logs.location` (`2dsphere`)**:
  - **Why**: Enables MongoDB `$geoNear` and `$geoWithin` spatial aggregation queries for calculating tree planting points, mapping tree clusters on Leaflet/Mapbox maps, and calculating total carbon sequestration within specific geographic campus radii.
* **`institutions.campusBoundary` (`2dsphere`)**:
  - **Why**: Used by the GIS verification service to perform polygon containment checks, validating whether geotagged photo evidence uploaded by a user falls inside an institution's official boundary.
* **`users.email` (`unique`)**:
  - **Why**: Enforces single-account uniqueness during registration and optimizes O(1) user lookups during JWT authentication filter execution.
* **`household_twins.userId` (`unique`)**:
  - **Why**: Guarantees a one-to-one relationship between a user account and their digital twin baseline configuration.

## 3. Sample Document JSON Shapes

### User Document
```json
{
  "_id": "66a6a12b918f",
  "email": "student@greenfield.edu",
  "passwordHash": "$2a$10$...",
  "fullName": "Alex Rivera",
  "role": "STANDARD_USER",
  "institutionId": "inst-seed-101",
  "createdAt": "2026-07-28T12:00:00Z"
}
```

### ActivityLog Document (GeoJSON Point)
```json
{
  "_id": "act-501",
  "userId": "66a6a12b918f",
  "institutionId": "inst-seed-101",
  "category": "trees",
  "co2SavedKg": 25.0,
  "amount": 5.0,
  "unit": "trees",
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  },
  "timestamp": "2026-07-28T12:00:00Z"
}
```

### Verification Document
```json
{
  "_id": "ver-701",
  "userId": "usr-std-user-1",
  "challengeId": "chal-1",
  "institutionId": "inst-seed-101",
  "photoUrl": "https://storage.verdantiq.io/evidence/tree-1.jpg",
  "status": "PENDING",
  "timestamp": "2026-07-28T12:00:00Z"
}
```
