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
- For Supabase: A Supabase account (free tier available)
- For MySQL: A MySQL database server

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stockmaster
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase for Authentication

1. Create a new project on [Supabase](https://supabase.com/)
2. Get your project URL and anon key from the Supabase dashboard
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Set Up MySQL with Prisma

1. Set up a MySQL database server
2. Update your `.env.local` file with your MySQL connection string:

```env
DATABASE_URL=mysql://user:password@localhost:3306/stockmaster
```

3. Run Prisma migrations to set up the database schema:
   ```bash
   npx prisma migrate dev
   ```

4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

### 5. Set Up Database Schema

Since StockMaster now uses MySQL exclusively for data operations, you only need to set up the MySQL database schema:

1. Ensure your MySQL database is set up
2. Run the Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run seed` - Seeds the database with demo data

## Project Structure

```
src/
├── app/          # Next.js app router pages
├── components/   # React components
├── lib/          # Utility functions and data providers
├── types/        # TypeScript types
└── models/       # Data models (if using Prisma)
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | Required for authentication |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key | Required for authentication |
| SUPABASE_URL | Supabase project URL (server-side) | Required for authentication |
| SUPABASE_ANON_KEY | Supabase anon key (server-side) | Required for authentication |
| DATABASE_URL | MySQL connection string | Required for data operations |

## Seeding Demo Data

To populate your database with sample products and operations:

```bash
npm run seed
```

This will create sample products and operations to help you get started.

## Database Architecture

StockMaster uses a hybrid database architecture:

- **Supabase**: Used exclusively for authentication (login, signup, password reset, OTP verification)
- **MySQL with Prisma**: Used for all data operations (products, operations, stock moves, etc.)

Both services are required for the application to function properly.

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Database**: MySQL (via Prisma)
- **Authentication**: Supabase Auth
- **ORM**: Prisma
- **Deployment**: Vercel (recommended)

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)