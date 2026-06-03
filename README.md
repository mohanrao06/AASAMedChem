**AASA MedChem — Marketplace for Lab Supplies**

**Overview**
- **Purpose:** A Next.js (App Router) marketplace for buyers and sellers of lab/chemical supplies with seller product management, buyer ordering, and an admin dashboard.
- **Primary features:** multi-role auth (ADMIN/SELLER/BUYER), unit-aware inventory and pricing, admin metrics and order visibility, product CRUD for sellers, order placement for buyers.

**Quick Start**
- **Install & run:**

```bash
npm install
npm run dev
```

- Open: [http://localhost:3000](http://localhost:3000)

**Seed & inspect data**
- Seed script: [prisma/seed.js](prisma/seed.js) — creates test users and many sample products.
- Run seed manually:

```bash
node prisma/seed.js
```

- Inspect DB: Prisma Studio runs at http://localhost:5555 (started via `npx prisma studio`).

**Credentials (seeded)**
- Admin: `admin@test.com` / `admin123`
- Seller: `seller@test.com` / `seller123` (also `seller1@test.com`, `seller2@test.com`)
- Buyer: `buyer@test.com` / `buyer123` (also `buyer2@test.com`)

**Project layout (important files)**
- **Frontend pages:** [app/page.tsx](app/page.tsx), [app/login/page.tsx](app/login/page.tsx), [app/seller/page.tsx](app/seller/page.tsx), [app/buyer/page.tsx](app/buyer/page.tsx), [app/admin/page.tsx](app/admin/page.tsx)
- **API routes:** [app/api/products/route.ts](app/api/products/route.ts), [app/api/orders/route.ts](app/api/orders/route.ts), [app/api/admin/orders/route.ts](app/api/admin/orders/route.ts), [app/api/admin/stats/route.ts](app/api/admin/stats/route.ts)
- **Database / Prisma:** [prisma/schema.prisma](prisma/schema.prisma), [prisma/seed.js](prisma/seed.js)
- **Lib / helpers:** [lib/conversions.ts](lib/conversions.ts), [lib/prisma.ts](lib/prisma.ts)

**Data model & units strategy**
- **Storage:** Quantities and prices stored using Prisma `Decimal` / PostgreSQL `Decimal(20,6)` for precision.
- **Base units:** weight -> grams (`G`), volume -> milliliters (`ML`), count -> `UNIT`.
- **Price normalization:** `pricePerUnit` is stored per base unit (INR per g / per mL / per unit). API routes convert seller input to base units on create/update.
- **Where conversions live:** `app/api/products/route.ts` (product save), `app/api/orders/route.ts` (order create), and `lib/conversions.ts` (conversion helpers).

**Admin features**
- Admin dashboard shows counts (buyers, sellers, products, orders) and `totalOrderValue` aggregated from orders.
- Orders include item details with product name and requested quantity/unit for easy review.

**Testing & development notes**
- Use seeded accounts to exercise each role. Seller accounts can create/update products (choose unit + price); buyers can place orders specifying quantity & unit.
- If you change Prisma schema, run migrations or `npx prisma db push` and `npx prisma generate`.

**Recommended improvements**
- Replace JavaScript Number arithmetic with a Decimal library (`decimal.js` or Big.js) for server-side money math.
- Add pagination and filtering to product list endpoints for scalability.
- Add authentication (JWT/session) that persists across page loads (current seed/demo uses simple lookup for dev convenience).

**Deploy**
- Deploy to Vercel or any Node provider that supports Next.js. Ensure environment variables (database URL) are set and Prisma migrations are applied.

**Contact / next steps**
- I can: add more realistic seeded data, push these changes to GitHub, or implement decimal arithmetic for money calculations. Tell me which you prefer.

---
Generated and edited by the development assistant. See `prisma/seed.js` and `lib/conversions.ts` for conversion details.

