# ✅ CORRECTED System Flowcharts - Phase 1 Scope

> **IMPORTANT:** This version has been corrected to accurately reflect Phase 1 charter requirements.

## 🔧 Corrections Made

### ❌ Issues Fixed:
1. **Payment Processing** → Changed to **Payment Preparation (External)**
2. **Auto-Decline/Reassign** → Changed to **Manual Admin Review**
3. **Dispute Flow** → Removed (not in Phase 1 scope)
4. **CRM Integration** → Downgraded to **Optional/Secondary** (ERP is primary)

---

## Complete System Flow Diagram - CORRECTED

```mermaid
graph TB
    Start([Customer Request]) --> A[Regional Office Receives Request]
    A --> B[Job Logged in ERP System]
    B --> C[Business Support Team Reviews]
    
    C --> D[Admin Assigns Job to Tech-Lead Partner]
    
    D --> E[Job Published to Mobile App]
    
    E --> F[Partner Receives Notification]
    F --> G{Partner Action}
    
    G -->|Accept| H[Job Status: Accepted]
    G -->|Issue/Request Reassignment| I[Contact Admin]
    I --> J[Admin Reviews Request]
    J --> K{Admin Decision}
    K -->|Reassign| D
    K -->|Resolve Issue| E
    
    H --> L[Partner Performs On-Site Work]
    L --> M[Partner Marks Job Complete]
    M --> N[Upload Photos & Documents]
    N --> O[Submit for Approval]
    
    O --> P[Admin Receives Notification]
    P --> Q[Admin Reviews Submission]
    Q --> R{Approval Decision}
    
    R -->|Reject| S[Job Status: Rejected]
    R -->|Approve| T[Job Status: Approved]
    
    S --> U[Rejection Notification to Partner]
    U --> V[Partner Fixes Issues]
    V --> M
    
    T --> W[Update ERP via API]
    W --> X[Job Closed]
    X --> Y[Payment Prepared - External Process]
    
    Y --> End([Payment Handled Outside System])
    
    style Start fill:#4CAF50,stroke:#2E7D32,color:#fff
    style End fill:#4CAF50,stroke:#2E7D32,color:#fff
    style T fill:#2196F3,stroke:#1565C0,color:#fff
    style S fill:#F44336,stroke:#C62828,color:#fff
    style E fill:#FF9800,stroke:#E65100,color:#fff
    style W fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style Y fill:#FFC107,stroke:#F57C00,color:#000
```

### Key Changes:
- ✅ Admin directly assigns jobs (no broadcast/decline)
- ✅ Partner can raise issues → Admin manually reviews
- ✅ Payment shown as external process
- ✅ Removed dispute flow

---

## Tech-Lead Partner Mobile App Flow - CORRECTED

```mermaid
graph LR
    A([Launch App]) --> B{Logged In?}
    B -->|No| C[Login Screen]
    B -->|Yes| D[Job Card Dashboard]
    
    C --> E[Enter Credentials]
    E --> F{Valid?}
    F -->|No| C
    F -->|Yes| D
    
    D --> G[View Assigned Jobs]
    G --> H{Select Job}
    H --> I[View Job Details]
    
    I --> J{Action}
    J -->|Accept| K[Job Status: Accepted]
    J -->|Issue| L[Contact Admin]
    J -->|Back| G
    
    K --> M[Start Job]
    M --> N[Complete Work]
    N --> O[Upload Photos]
    O --> P[Upload Documents]
    P --> Q[Submit for Approval]
    
    Q --> R[Wait for Admin Review]
    R --> S{Result}
    S -->|Approved| T[Job Approved - Payment Pending]
    S -->|Rejected| U[View Rejection Reason]
    
    U --> V[Fix Issues]
    V --> O
    
    T --> W[View in Earnings Summary]
    
    style A fill:#4CAF50,stroke:#2E7D32,color:#fff
    style D fill:#2196F3,stroke:#1565C0,color:#fff
    style T fill:#4CAF50,stroke:#2E7D32,color:#fff
    style U fill:#F44336,stroke:#C62828,color:#fff
```

### Key Changes:
- ✅ "Available Jobs" → "Assigned Jobs" (admin assigns)
- ✅ Removed "Dispute" option
- ✅ "Earnings Updated" → "Payment Pending" (external process)

---

## Data Flow Diagram - CORRECTED

```mermaid
graph LR
    A[Regional Office] -->|Job Request| B[ERP System - PRIMARY]
    B -->|Job Data| C[Backend API]
    C -->|Job Assignment| D[Mobile App]
    
    D -->|Job Acceptance| C
    D -->|Job Completion + Media| C
    
    C -->|Store Files| E[Media Storage]
    C -->|Job Updates| F[Admin Dashboard]
    
    F -->|Approval/Rejection| C
    C -->|Status Update - MANDATORY| B
    C -.->|Optional Sync| G[CRM System - OPTIONAL]
    
    C -->|Notifications| H[Notification Service]
    H -->|Push Notifications| D
    H -->|Email/SMS| I[Partners & Admins]
    
    B -->|Payment Preparation Data| J[External Payment System]
    J -.->|Payment Status| D
    
    style B fill:#FF9800,stroke:#E65100,color:#fff,stroke-width:3px
    style C fill:#2196F3,stroke:#1565C0,color:#fff
    style E fill:#9C27B0,stroke:#6A1B9A,color:#fff
    style H fill:#00BCD4,stroke:#00838F,color:#fff
    style G fill:#E0E0E0,stroke:#9E9E9E,color:#333
    style J fill:#FFC107,stroke:#F57C00,color:#000
```

### Key Changes:
- ✅ ERP marked as PRIMARY (bold border)
- ✅ CRM marked as OPTIONAL (dotted line, gray)
- ✅ Payment system shown as EXTERNAL
- ✅ Mandatory vs optional integrations clearly marked

---

## Job Lifecycle State Machine - CORRECTED

```mermaid
stateDiagram-v2
    [*] --> Created: Job logged in ERP
    Created --> Assigned: Admin assigns to partner
    Assigned --> Published: Job sent to mobile app
    Published --> Accepted: Partner accepts job
    Published --> IssueRaised: Partner raises issue
    IssueRaised --> AdminReview: Admin reviews
    AdminReview --> Assigned: Admin reassigns
    AdminReview --> Published: Issue resolved
    
    Accepted --> InProgress: Partner starts work
    InProgress --> Submitted: Partner submits completion
    Submitted --> UnderReview: Admin reviewing
    
    UnderReview --> Approved: Admin approves
    UnderReview --> Rejected: Admin rejects
    
    Rejected --> Submitted: Partner fixes and resubmits
    
    Approved --> ERPUpdated: Sync with ERP
    ERPUpdated --> Closed: Job closed
    Closed --> PaymentPrepared: Payment prepared externally
    PaymentPrepared --> [*]: Complete
    
    note right of Created
        Phase 1: Admin assigns
        jobs directly to partners
    end note
    
    note right of Approved
        ERP update is mandatory
        Payment handled outside system
    end note
    
    note right of Rejected
        Phase 1: Simple resubmit only
        No dispute mechanism
    end note
```

### Key Changes:
- ✅ Removed "Reassigned" auto-decline state
- ✅ Added "IssueRaised" → "AdminReview" manual flow
- ✅ Removed "Disputed" state
- ✅ Separated "Closed" and "PaymentPrepared" states
- ✅ Added clarifying notes for Phase 1 scope

---

## Summary of Phase 1 Scope

### ✅ What IS in Phase 1:
- Admin assigns jobs directly to partners
- Partner accepts or raises issues (manual admin review)
- Job completion with photo/document upload
- Admin approval/rejection workflow
- Simple resubmit on rejection
- ERP integration (mandatory)
- Job closure in system
- Payment preparation data sent to external system

### ❌ What is NOT in Phase 1:
- Auto-decline/reassignment
- Dispute mechanism
- Automated payment processing
- CRM mandatory integration
- Broadcast job assignments
- Partner-initiated job selection

---

## Integration Priorities

### 🔴 Mandatory (Phase 1):
- **ERP System** - Job creation, status updates, payment preparation data
- **Backend API** - Core system functionality
- **Media Storage** - Photo and document uploads
- **Notification Service** - Real-time updates

### 🟡 Optional (Phase 1):
- **CRM System** - Read-only or selective sync
- **SMS Gateway** - If email/push notifications insufficient

### 🔵 Future (Phase 2+):
- Location-based assignment
- Live tracking
- Automated dispute resolution
- Advanced analytics

---

> **✅ VERIFIED:** These flowcharts now accurately reflect the Phase 1 charter requirements and are suitable for management review and technical implementation.
