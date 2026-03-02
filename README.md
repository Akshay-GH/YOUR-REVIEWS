# 🕵️ Mystery Message

An anonymous feedback platform where users can receive anonymous messages through a unique shareable link. Built with **Next.js 16**, **MongoDB**, and **AI-powered** message suggestions.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **Anonymous Messaging** — Share your unique profile link and receive anonymous messages from anyone
- **AI-Powered Suggestions** — Generate engaging message suggestions using Groq (LLaMA 3.3 70B)
- **User Authentication** — Secure sign-up/sign-in with NextAuth.js (credentials provider)
- **Email Verification** — OTP-based email verification via Nodemailer (Gmail SMTP)
- **Dashboard** — Manage incoming messages, toggle message acceptance, and copy your profile link
- **Real-time Controls** — Accept/reject messages toggle, refresh messages, and delete messages
- **Responsive Design** — Fully responsive UI built with Tailwind CSS and shadcn/ui components

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
| ----------- | ----------------------------------------------- |
| Framework   | Next.js 16 (App Router)                         |
| Language    | TypeScript                                      |
| Database    | MongoDB Atlas + Mongoose                        |
| Auth        | NextAuth.js v4 (Credentials)                    |
| AI          | Vercel AI SDK + Groq (LLaMA 3.3 70B Versatile)  |
| Email       | Nodemailer (Gmail SMTP)                         |
| UI          | Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons |
| Validation  | Zod + React Hook Form                           |
| HTTP Client | Axios                                           |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/              # Authenticated routes
│   │   ├── dashboard/      # User dashboard
│   │   └── page.tsx        # Home page with message carousel
│   ├── (auth)/             # Auth routes
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── verify/[username]/
│   ├── api/
│   │   ├── accept-message/ # Toggle message acceptance
│   │   ├── auth/           # NextAuth configuration
│   │   ├── chat/           # AI message suggestions
│   │   ├── check-username-unique/
│   │   ├── delete-message/[messageId]/
│   │   ├── get-messages/
│   │   ├── send-messages/
│   │   ├── sign-up/
│   │   └── verify-code/
│   └── u/[username]/       # Public profile page
├── components/             # UI components
├── helpers/                # Email & session utilities
├── lib/                    # DB connection & utils
├── models/                 # Mongoose schemas
├── schemas/                # Zod validation schemas
└── types/                  # TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Gmail account with App Password
- Groq API key ([console.groq.com](https://console.groq.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-reviews.git
cd your-reviews
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI="your-mongodb-connection-string"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (Gmail SMTP)
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-gmail-app-password"

# AI (Groq)
GROQ_API_KEY="your-groq-api-key"
```

> **Gmail App Password:** Enable 2-Step Verification on your Google account, then generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 How It Works

1. **Sign Up** → Register with username, email, and password
2. **Verify Email** → Enter the 6-digit OTP sent to your email
3. **Dashboard** → Copy your unique profile link (`/u/your-username`)
4. **Share Link** → Anyone with the link can send you anonymous messages
5. **AI Suggestions** → Visitors can click "Suggest Messages" for AI-generated conversation starters
6. **Manage Messages** → View, refresh, and delete messages from your dashboard

---

## 📜 API Routes

| Method | Endpoint                          | Description                      |
| ------ | --------------------------------- | -------------------------------- |
| POST   | `/api/sign-up`                    | Register a new user              |
| POST   | `/api/verify-code`                | Verify email with OTP            |
| POST   | `/api/auth/[...nextauth]`         | NextAuth sign-in                 |
| GET    | `/api/check-username-unique`      | Check username availability      |
| GET    | `/api/accept-message`             | Get message acceptance status    |
| POST   | `/api/accept-message`             | Toggle message acceptance        |
| GET    | `/api/get-messages`               | Get all messages (authenticated) |
| POST   | `/api/send-messages`              | Send anonymous message           |
| DELETE | `/api/delete-message/[messageId]` | Delete a message                 |
| POST   | `/api/chat`                       | AI-generated message suggestions |

---

## 🧑‍💻 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📄 License

A learning project which taught me a lot of things (how to build a end to end full stack project )


---

<p align="center">Built with ❤️ using Next.js and TypeScript</p>
