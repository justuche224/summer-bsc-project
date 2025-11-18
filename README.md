# Summer BSC Project

A Next.js financial management application built with TypeScript, Better Auth, Drizzle ORM, and PostgreSQL.

## Table of Contents

- [Summer BSC Project](#summer-bsc-project)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation Guide](#installation-guide)
    - [1. Install Bun](#1-install-bun)
      - [Windows](#windows)
      - [macOS](#macos)
      - [Linux](#linux)
    - [2. Install PostgreSQL](#2-install-postgresql)
      - [Windows](#windows-1)
      - [macOS](#macos-1)
      - [Linux (Ubuntu/Debian)](#linux-ubuntudebian)
    - [3. Install pgAdmin](#3-install-pgadmin)
      - [Windows](#windows-2)
      - [macOS](#macos-2)
      - [Linux (Ubuntu/Debian)](#linux-ubuntudebian-1)
    - [4. Set Up PostgreSQL Database](#4-set-up-postgresql-database)
      - [Option A: Using pgAdmin (Recommended for beginners)](#option-a-using-pgadmin-recommended-for-beginners)
      - [Option B: Using Command Line](#option-b-using-command-line)
    - [5. Clone the Repository](#5-clone-the-repository)
    - [6. Install Dependencies](#6-install-dependencies)
    - [7. Configure Environment Variables](#7-configure-environment-variables)
      - [Generating BETTER\_AUTH\_SECRET](#generating-better_auth_secret)
    - [8. Push Database Schema](#8-push-database-schema)
    - [9. Run the Development Server](#9-run-the-development-server)
  - [Available Scripts](#available-scripts)
  - [Project Structure](#project-structure)
  - [Troubleshooting](#troubleshooting)
    - [Database Connection Issues](#database-connection-issues)
    - [Bun Installation Issues](#bun-installation-issues)
    - [Environment Variables Not Loading](#environment-variables-not-loading)
    - [Schema Push Fails](#schema-push-fails)
    - [Port Already in Use](#port-already-in-use)
  - [Additional Resources](#additional-resources)
  - [Support](#support)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Git** - For cloning the repository
- **Bun** - JavaScript runtime and package manager (installation instructions below)
- **PostgreSQL** - Database server (installation instructions below)
- **pgAdmin** - PostgreSQL administration tool (installation instructions below)

## Installation Guide

### 1. Install Bun

Bun is a fast JavaScript runtime and package manager. Follow the steps below for your operating system:

#### Windows

1. Open PowerShell as Administrator
2. Run the following command:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

3. Restart your terminal or run:

```powershell
refreshenv
```

4. Verify installation:

```powershell
bun --version
```

#### macOS

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, restart your terminal and verify:

```bash
bun --version
```

### 2. Install PostgreSQL

#### Windows

1. Download PostgreSQL from the official website: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. During installation:
   - Choose a password for the `postgres` superuser (remember this password!)
   - Keep the default port `5432` unless you have a conflict
   - Complete the installation
4. PostgreSQL service will start automatically

#### macOS

Using Homebrew:

```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Verify PostgreSQL is running:

```bash
psql --version
```

### 3. Install pgAdmin

pgAdmin is a graphical tool for managing PostgreSQL databases.

#### Windows

1. Download pgAdmin from: https://www.pgadmin.org/download/pgadmin-4-windows/
2. Run the installer and follow the setup wizard
3. During first launch, set a master password for pgAdmin

#### macOS

```bash
brew install --cask pgadmin4
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt install pgadmin4
```

### 4. Set Up PostgreSQL Database

#### Option A: Using pgAdmin (Recommended for beginners)

1. Open pgAdmin
2. Connect to your PostgreSQL server:

   - Right-click "Servers" → "Create" → "Server"
   - **General Tab:**
     - Name: `Local PostgreSQL` (or any name you prefer)
   - **Connection Tab:**
     - Host: `localhost`
     - Port: `5432`
     - Maintenance database: `postgres`
     - Username: `postgres`
     - Password: (the password you set during PostgreSQL installation)
   - Click "Save"

3. Create a new database:
   - Expand "Servers" → "Local PostgreSQL" → "Databases"
   - Right-click "Databases" → "Create" → "Database"
   - **General Tab:**
     - Database: `summer_db` (or your preferred name)
   - Click "Save"

#### Option B: Using Command Line

1. Open a terminal/command prompt
2. Connect to PostgreSQL:

```bash
psql -U postgres
```

3. Enter your PostgreSQL password when prompted
4. Create the database:

```sql
CREATE DATABASE summer_db;
```

5. Exit psql:

```sql
\q
```

### 5. Clone the Repository

```bash
git clone https://github.com/justuche224/summer-bsc-project.git
cd summer-bsc-project
```

### 6. Install Dependencies

Using Bun:

```bash
bun install
```

This will install all project dependencies listed in `package.json`.

### 7. Configure Environment Variables

1. Create a `.env` file in the root directory of the project:

```bash
# Windows PowerShell
New-Item .env

# macOS/Linux
touch .env
```

2. Open the `.env` file and add the following environment variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/summer_db

# Better Auth Secret (generate a secure random string)
BETTER_AUTH_SECRET=your-super-secret-key-here-minimum-32-characters-long

# CORS Origin (for development, use localhost)
CORS_ORIGIN=http://localhost:3000
```

#### Generating BETTER_AUTH_SECRET

You need a secure random string for `BETTER_AUTH_SECRET`. Here are a few ways to generate one:

**Using Node.js/Bun:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Using OpenSSL (if installed):**

```bash
openssl rand -hex 32
```

**Using PowerShell (Windows):**

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Replace `YOUR_PASSWORD` in `DATABASE_URL` with the PostgreSQL password you set during installation, and replace `summer_db` if you used a different database name.

**Example `.env` file:**

```env
DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/summer_db
BETTER_AUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
CORS_ORIGIN=http://localhost:3000
```

### 8. Push Database Schema

The project uses Drizzle ORM for database management. Push the schema to your database:

```bash
bun run db:push
```

This command will:

- Read the schema files from `src/db/schema/`
- Create all necessary tables in your PostgreSQL database
- Set up relationships and constraints

You should see output indicating successful table creation.

**Verify the schema was created:**

You can verify the tables were created using pgAdmin:

1. In pgAdmin, expand: `Servers` → `Local PostgreSQL` → `Databases` → `summer_db` → `Schemas` → `public` → `Tables`
2. You should see the following tables:
   - `user`
   - `session`
   - `account`
   - `verification`
   - `transactions`
   - `budgets`
   - `goals`
   - `alerts`

Alternatively, use the Drizzle Studio to view your database:

```bash
bun run db:studio
```

This will open a web interface at `http://localhost:4983` where you can browse your database.

### 9. Run the Development Server

Start the Next.js development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `bun run dev` - Start the development server with Turbopack
- `bun run build` - Build the application for production
- `bun run start` - Start the production server
- `bun run lint` - Run ESLint to check code quality
- `bun run db:push` - Push schema changes to the database
- `bun run db:studio` - Open Drizzle Studio to view/manage database
- `bun run db:generate` - Generate migration files from schema changes
- `bun run db:migrate` - Run pending migrations

## Project Structure

```
summer-bsc-project/
├── src/
│   ├── app/              # Next.js app router pages and API routes
│   ├── components/       # React components
│   │   └── ui/          # shadcn/ui components
│   ├── db/              # Database configuration and schemas
│   │   └── schema/      # Drizzle ORM schema definitions
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions and configurations
├── drizzle/             # Generated migration files
├── public/              # Static assets
└── .env                 # Environment variables (create this)
```

## Troubleshooting

### Database Connection Issues

**Error: "password authentication failed"**

- Verify your PostgreSQL password in the `DATABASE_URL`
- Ensure PostgreSQL service is running
- Check that the username is correct (default is `postgres`)

**Error: "database does not exist"**

- Verify the database name in `DATABASE_URL` matches the one you created
- Create the database if it doesn't exist (see step 4)

**Error: "connection refused"**

- Ensure PostgreSQL service is running:
  - Windows: Check Services app
  - macOS: `brew services list`
  - Linux: `sudo systemctl status postgresql`

### Bun Installation Issues

**Command not found after installation**

- Restart your terminal
- Add Bun to your PATH manually if needed
- Verify installation: `bun --version`

### Environment Variables Not Loading

- Ensure `.env` file is in the root directory (same level as `package.json`)
- Check for typos in variable names
- Restart the development server after changing `.env`

### Schema Push Fails

- Verify database connection string is correct
- Ensure database exists
- Check that you have proper permissions on the database
- Try running `bun run db:generate` first, then `bun run db:push`

### Port Already in Use

If port 3000 is already in use:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Or change the port in `package.json`:

```json
"dev": "next dev --turbopack -p 3001"
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Bun Documentation](https://bun.sh/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

If you encounter any issues not covered in this guide, please:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages carefully
3. Ensure all prerequisites are correctly installed
4. Verify environment variables are set correctly

---

**Happy coding!**
