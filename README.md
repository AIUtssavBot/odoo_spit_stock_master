# StockMaster

StockMaster is a modern inventory management system built with Next.js and TypeScript. It uses Supabase exclusively for authentication (login/signup with email and OTP verification) while using MySQL with Prisma for all other data operations. It provides a comprehensive solution for tracking products, managing stock operations, and monitoring inventory health.

## Features

- Real-time inventory dashboard with KPIs
- Product management (create, read, update, delete)
- Stock operations (incoming receipts, outgoing deliveries, internal transfers)
- Stock adjustments and validation
- Low stock alerts and notifications
- Responsive UI with Tailwind CSS
- Supabase for authentication only
- MySQL with Prisma for all data operations

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn
# StockMaster

A modern inventory management UI built with Next.js and TypeScript. Authentication (email/OTP) is handled by Supabase while application data (products, stock moves, operations) is stored in MySQL and accessed via Prisma.

Repository: https://github.com/AIUtssavBot/odoo_spit_stock_master

## Quick start (PowerShell)

1. Clone the repo and install dependencies

```powershell
git clone https://github.com/AIUtssavBot/odoo_spit_stock_master.git
cd odoo_spit_stock_master
npm install
```

2. Create a `.env.local` in the project root with the required variables (examples below).

3. Setup the database and Prisma client

```powershell
# create/migrate the database schema
npx prisma migrate dev

# generate Prisma client
npx prisma generate
```

Start a local MySQL (Docker example)

If you don't have MySQL running locally, you can quickly start one with Docker (example):

```powershell
docker run --name stockmaster-mysql \
	-e MYSQL_ROOT_PASSWORD=rootpassword \
	-e MYSQL_DATABASE=stockmaster \
	-p 3306:3306 \
	-d mysql:8.0

# wait a few seconds for MySQL to initialize, then check the container is healthy:
docker ps --filter "name=stockmaster-mysql"
docker logs stockmaster-mysql --tail 50
```

Prisma CLI and environment variables

Prisma CLI commands may not automatically pick up `.env.local`. Two common approaches when running Prisma commands from PowerShell:

- Use the `--env-file` flag (supported by recent Prisma versions):

```powershell
npx prisma migrate dev --env-file=.env.local
```

- Or export the DATABASE_URL into the PowerShell environment for the current session:

```powershell
$env:DATABASE_URL = 'mysql://root:rootpassword@localhost:3306/stockmaster'
npx prisma migrate dev
```

The project seed script uses dotenv to load `.env.local`, so `npm run seed` will work once `.env.local` exists and the DB is reachable.

4. (Optional) Seed demo data

```powershell
npm run seed
```

5. Run the development server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment variables

Create `.env.local` with at least the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=mysql://user:password@host:3306/database_name
```

Notes:
- Use Supabase only for authentication; the app expects Prisma + MySQL for application data.
- If you use a managed MySQL (RDS, PlanetScale, etc.), ensure Prisma is compatible with the provider's connection options.

## Scripts

- `npm run dev` — run dev server (Next.js)
- `npm run build` — build for production
- `npm run start` — run built app
- `npm run seed` — seed the database (project-specific script)

## Project layout (important folders)

```
src/
├─ app/           # Next.js App Router pages
├─ components/    # React UI components
├─ lib/           # Supabase client and data providers
└─ prisma/        # Prisma schema and migrations
```

## Database & auth

- Authentication: Supabase Auth (email / OTP flows). See `src/lib/supabaseClient.ts` for the client setup.
- Data: MySQL via Prisma. Migrations live under `prisma/migrations`.

## Contributing

- Fork the repo, create a feature branch, make changes, and submit a PR.
- Please update/add tests where applicable and keep changes small and focused.

## License

No license specified. Add a `LICENSE` file to make the intended license explicit.

---

If you'd like, I can also:
- add a `.env.example` file with placeholders,
- add a minimal `CONTRIBUTING.md`, or
- open a PR with these README changes (I can commit & push them for you).

Happy hacking!