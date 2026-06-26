# Booking Orchestration Platform

A production-grade, distributed microservices architecture built to orchestrate high-concurrency booking workflows. The system is designed around four independently deployable services communicating over HTTP and Redis message queues, with strong guarantees around data consistency, race condition prevention, and end-to-end request traceability.

Built with Node.js, TypeScript, Express, Sequelize, Prisma, Redis (Redlock + BullMQ), and MySQL.

---

## High-Level Architecture

`mermaid
graph TD
    Client([Client Application])
    
    Gateway["UserService (API Gateway)"]
    BookingSvc["BookingService (Orchestrator)"]
    PropertySvc["PropertyService (Listings)"]
    NotifSvc["NotificationService (Worker)"]
    
    UserDB[(MySQL: Users)]
    BookingDB[(MySQL: Bookings)]
    PropertyDB[(MySQL: Properties)]
    
    Redis[(Redis Cache & Redlock)]
    BullMQ[BullMQ Message Queue]

    Client -->|HTTP Requests| Gateway
    Gateway -->|Proxy /bookings| BookingSvc
    Gateway -->|Proxy /properties| PropertySvc
    
    BookingSvc -.->|GET /users/:id| Gateway
    BookingSvc -.->|GET /properties/:id| PropertySvc
    
    BookingSvc -->|Acquire Lock| Redis
    BookingSvc -->|Enqueue Job| BullMQ
    BullMQ -->|Consume Job| NotifSvc
    
    Gateway --> UserDB
    BookingSvc --> BookingDB
    PropertySvc --> PropertyDB
`

---

## Service Breakdown

| Service | Port | ORM | Database | Role |
|---|---|---|---|---|
| **UserService** | 3000 | Sequelize | irbnb_dev | API Gateway, Authentication, Proxy |
| **BookingService** | 3001 | Prisma | irbnb_booking_dev | Reservations, Locking, Idempotency |
| **PropertyService** | 3002 | Sequelize | irbnb_property_dev | Property Listings, RBAC |
| **NotificationService** | 3004 | None | None | Async Email Worker (BullMQ) |

---

## How Concurrency Is Managed

One of the central design challenges in any booking platform is preventing two users from booking the same property for overlapping dates at the exact same time. This platform solves it using a two-phase strategy:

### Phase 1: Distributed Pessimistic Locking (Redlock)

When a booking request arrives, the BookingService constructs a deterministic lock resource string based on the property ID and the requested date range:

`
property:{propertyId}:{checkInDate}:{checkOutDate}
`

It then acquires a distributed lock on this resource using the **Redlock algorithm** across Redis. If a second concurrent request targets the same property and overlapping dates, it will be blocked at the lock acquisition layer and will fail gracefully with a conflict error.

### Phase 2: Double-Check After Lock

Even after acquiring the lock, the service performs a second database query (getOverlappingBookings) to verify that no confirmed booking was inserted in the gap between the initial check and the lock acquisition. This double-check pattern eliminates any remaining window for race conditions.

### Idempotency Keys (Preventing Double Submissions)

The booking flow is split into two steps: **create** and **confirm**. The create step returns a cryptographic idempotencyKey. The confirm step uses a database transaction with a SELECT ... FOR UPDATE (pessimistic row-level lock) on the idempotency key row. If the key is already marked as inalized, the request is rejected. This guarantees that even if a user double-clicks the confirm button, the booking is only finalized once.
