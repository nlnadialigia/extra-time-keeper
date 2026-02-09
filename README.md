![Logo](https://ik.imagekit.io/l7cwocexhc/readme/extra-time-keeper_Ee9FWyJLX.jpg)

<h2  align="center">

![Github last commit](https://img.shields.io/github/last-commit/nlnadialigia/twitter-ui-masterclass?color=004aad&style=plastic)
![GitHub repo size](https://img.shields.io/github/repo-size/nlnadialigia/twitter-ui-masterclass?color=004aad&style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/nlnadialigia/twitter-ui-masterclass?style=plastic&color=004aad)
[![License](https://img.shields.io/github/license/nlnadialigia/twitter-ui-masterclass?color=004aad&logoColor=004aad&style=plastic)](./LICENSE)

</h2>

# 🕐 Extra Time Keeper

> 📖 [Versão em Português](docs/README-pt.md)

Overtime and time-off tracking system built with Next.js, Prisma, and PostgreSQL.

## 🚀 Technologies

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma 7
- **Authentication:** NextAuth v4
- **UI:** Shadcn/UI + Tailwind CSS
- **Table:** AG-Grid Community
- **PDF:** @react-pdf/renderer
- **Package Manager:** pnpm

## 📋 Prerequisites

- Node.js 18+
- pnpm
- Docker and Docker Compose (for PostgreSQL)

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone <your-repository>
cd extra-time-keeper
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit the `.env` file and configure:
- `DATABASE_URL`: PostgreSQL connection URL
- `NEXTAUTH_SECRET`: Secret key (generate with `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (optional, for OAuth)

4. **Start the database:**
```bash
docker-compose up -d
```

5. **Run migrations:**
```bash
npx prisma migrate dev --name init
```

6. **Generate Prisma Client:**
```bash
npx prisma generate
```

## 🏃 Running the Project

### Development
```bash
pnpm dev
```

Access: [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
pnpm build
pnpm start
```

## 📊 Features

- ✅ **Authentication**
  - Email/password login
  - Google OAuth login
  - User registration
  - Strong password validation
  - Secure sessions with NextAuth

- ✅ **Time Management**
  - Overtime registration
  - Time-off registration
  - Automatic balance calculation
  - Interactive table view (AG-Grid)

- ✅ **Export**
  - PDF report generation
  - Direct browser download

## 🗂️ Project Structure

```
extra-time-keeper/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── actions/           # Server Actions
│   │   ├── api/auth/          # NextAuth API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Login page
│   ├── components/
│   │   ├── overtime/          # Overtime components
│   │   └── ui/                # Shadcn/UI components
│   └── lib/
│       ├── auth.ts            # NextAuth configuration
│       └── db.ts              # Prisma client
├── docs/                      # Additional documentation
├── docker-compose.yml         # PostgreSQL configuration
└── prisma.config.ts           # Prisma 7 configuration
```

## 🔐 Authentication

The system uses NextAuth v4 with two providers:

1. **Credentials:** Email and password stored in database
2. **Google OAuth:** Social login (requires configuration)

## 🗄️ Database

### Main Models

- **User:** System users
- **TimeEntry:** Time records (overtime and time-off)
- **Account/Session:** Authentication management

### Useful Commands

```bash
# View database
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (CAUTION!)
npx prisma migrate reset
```

## 📝 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run linter
```

## 🚧 Additional Information

- [Admin](docs/ADMIN.md)
- [Google OAuth Setup](docs/configuracao-google-oauth.md)

## 📄 License

This project is private and for internal use.

---

## 👩💼 Author

<img src="https://ik.imagekit.io/l7cwocexhc/me/cartao%202026_NNfOVg17g.png" width="300px;" alt="Picture"/>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[![Linkedin](https://img.shields.io/badge/-Linkedin-004aad?style=plastic&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/nlnadialigia/)](https://www.linkedin.com/in/nlnadialigia)&nbsp;&nbsp;
[![Instagram](https://img.shields.io/badge/Instagram-004aad?style=plastic&logo=instagram&logoColor=white)](https://www.instagram.com/nl.nadia.ligia)&nbsp;&nbsp;
[![Email](https://img.shields.io/badge/-Email-004aad?style=plastic&logo=Gmail&logoColor=white&link=mailto:nlnadialigia@gmail.com)](mailto:nlnadialigia@gmail.com)&nbsp;&nbsp;
