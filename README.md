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
