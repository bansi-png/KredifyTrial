# KredifyTrial

## **KREDIFY — Privacy-First Alternative Credit System**

> **"Get credit for who you are, not just what's on file."**

---

### Overview

Kredify is a fintech prototype built for the **Dolphin Fund Venture Challenge (NEXUS 2026)** 

It addresses a critical global problem:

> **1.4 billion adults are “credit invisible”**
> They lack formal credit history and are denied access to loans — despite being financially responsible. 

Kredify introduces a new approach:
A **privacy-first TrustScore™ powered by Zero-Knowledge Proofs (ZKPs)**.

---

### Problem

Traditional credit systems:

* Only consider loan repayment history
* Ignore real-world financial behavior
* Exclude gig workers, renters, and informal earners

Examples of ignored signals:

* UPI transaction consistency
* Rent payment history
* Utility bill payments
* Chit fund participation

**Result:** Millions of creditworthy individuals remain invisible.

---

### Solution

Kredify allows users to:

1. Connect alternative financial data sources
2. Generate cryptographic proofs (ZK proofs)
3. Produce a **TrustScore™**
4. Share only the score — not raw data

Lenders get **verified trust**
Users retain **complete privacy**

---

### Key Innovation: Zero-Knowledge Proofs

Kredify uses ZK proofs to:

* Validate financial behavior
* Prevent data exposure
* Eliminate need for raw transaction sharing

**Translation:**
You can prove you're creditworthy *without revealing your financial history.*

---

### Features

#### 1. Onboarding Flow

* Multi-step UI to connect:

  * UPI history
  * Rent receipts
  * Utility bills
  * Chit fund participation

#### 2. TrustScore™ Engine

* Dynamic scoring system
* Tier-based classification:

  * Bronze
  * Silver
  * Gold
  * Platinum

#### 3. Split-View Transparency

* Left: Raw user data (private)
* Right: ZK-verified TrustScore certificate

#### 4. Lender Marketplace

* Loan offers unlocked based on TrustScore tier
* Simulated fintech ecosystem

---

### Tech Stack

* **Frontend:** Next.js / React
* **UI:** Custom component system + animated flows
* **Prototype:** Interactive HTML + JSX components  
* **Concept Layer:** Zero-Knowledge Proof-based verification

---

### How It Works (Flow)

1. User connects financial data sources
2. System assigns weighted score points
3. Score is normalized → TrustScore™
4. ZK proof validates authenticity
5. Lenders receive only:

   * Score
   * Tier
   * Verification badge

---

### Example Scoring Logic

| Data Source   | Contribution |
| ------------- | ------------ |
| UPI History   | +28 points   |
| Rent Payments | +22 points   |
| Utility Bills | +18 points   |
| Chit Funds    | +20 points   |
| Salary Slips  | +12 points   |

Final score determines eligibility tiers and loan access.

---

### Market Opportunity

* 1.4 billion credit-invisible individuals
* Massive underserved fintech market
* Particularly relevant in:

  * India
  * Southeast Asia
  * Africa

---

### Team

* **Bansi Jhala**
* **Niomi Langaliya**

---

### Built For

Dolphin Fund — Venture Capital Challenge
NEXUS 2026, Rising Youth Network India 

---

### Future Scope

* Real ZK circuit implementation
* API integrations with financial platforms
* AI-based behavioral risk modeling
* Cross-border credit identity

---

### Final Thought

> The problem isn’t that people lack creditworthiness.
> The problem is that the system can’t see it.