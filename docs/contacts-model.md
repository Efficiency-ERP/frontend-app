# Contacts Data Model

This document outlines a pragmatic schema for managing contacts (customers and suppliers) and notes for how to store them in the database. It favors a unified `contacts` table with role tagging for simplicity and extensibility.

## Overview

- Single `contacts` table with a `type` (enum: `customer` | `supplier` | `both`).
- Optional related tables for addresses and organizations if needed.
- Balance semantics:
  - Positive balance → customer AR (they owe you).
  - Negative balance → supplier AP (you owe them).
  - Zero → settled.

## Suggested SQL Schema

```sql
CREATE TYPE contact_type AS ENUM ('customer', 'supplier', 'both');

CREATE TABLE contacts (
  id              VARCHAR(64) PRIMARY KEY,
  type            contact_type NOT NULL,
  name            TEXT NOT NULL,
  company         TEXT,
  email           TEXT NOT NULL,
  phone           TEXT,
  status          TEXT NOT NULL DEFAULT 'active', -- 'active' | 'inactive'
  balance         NUMERIC(12,2) DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_company ON contacts(company);
```

### Optional Tables

```sql
CREATE TABLE contact_addresses (
  id          SERIAL PRIMARY KEY,
  contact_id  VARCHAR(64) REFERENCES contacts(id) ON DELETE CASCADE,
  label       TEXT, -- billing, shipping, office
  line1       TEXT,
  line2       TEXT,
  city        TEXT,
  state       TEXT,
  postal_code TEXT,
  country     TEXT
);

CREATE TABLE organizations (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  vat_number  TEXT,
  website     TEXT
);

ALTER TABLE contacts ADD COLUMN organization_id INTEGER REFERENCES organizations(id);
```

## Suggested Prisma Model (if applicable)

```prisma
enum ContactType { customer supplier both }

model Contact {
  id             String      @id
  type           ContactType
  name           String
  company        String?
  email          String
  phone          String?
  status         String      @default("active")
  balance        Decimal?    @default(0)
  lastActivityAt DateTime?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  addresses      ContactAddress[]
  organization   Organization?
}

model ContactAddress {
  id        Int     @id @default(autoincrement())
  contact   Contact @relation(fields: [contactId], references: [id])
  contactId String
  label     String?
  line1     String?
  line2     String?
  city      String?
  state     String?
  postalCode String?
  country   String?
}

model Organization {
  id       Int     @id @default(autoincrement())
  name     String
  vatNumber String?
  website  String?
  contacts Contact[]
}
```

## Notes

- Keep emails unique if business rules require it; otherwise, index for fast lookups.
- Use `type = both` when a contact is both a customer and supplier (common in B2B).
- Consider soft deletes with a `deleted_at` column if you need auditability.
- Derive balances from ledger entries if you have a full accounting subsystem; the `balance` column can be a cached value.

## Frontend Mapping

- The Contacts page displays: id, name, company, type, email, phone, balance, last activity.
- Positive vs negative balance is shown with currency formatting and can be color‑coded.