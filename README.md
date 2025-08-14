# Tân Trang Church Website

A responsive and user-friendly church website for **Tân Trang Parish**, designed to provide parishioners with easy access to news, liturgical schedules, and pastoral content.  
The project focuses on a clean UI/UX built with **Next.js** and **TypeScript**, integrated with a custom backend API for dynamic data display.

## Features

- 📰 **News Management** – Display and manage parish news articles.
- 📅 **Liturgical Calendar** – View liturgical year schedules and events.
- 📖 **Pastoral Content** – Access Bible readings and pastoral resources.
- 📱 **Responsive Design** – Optimized for desktop, tablet, and mobile.
- 🔗 **API Integration** – Seamless connection with backend (Node.js + PostgreSQL).
- 🌐 **SEO Friendly** – Server-side rendering for better search engine visibility.

## Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) – React Framework for SSR & SSG
- [TypeScript](https://www.typescriptlang.org/) – Static typing for JavaScript
- [SASS/SCSS](https://sass-lang.com/) – CSS preprocessor for modular styling

**Backend:**
- [Node.js](https://nodejs.org/) – Server runtime
- [PostgreSQL](https://www.postgresql.org/) – Relational database
- [Prisma ORM](https://www.prisma.io/) – Type-safe database accessv

## Project Structure
tantrang-frontend/
├── public/ # Static assets (images, icons, etc.)
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Next.js pages (routes)
│ ├── styles/ # SCSS styles
│ ├── utils/ # Helper functions
│ └── services/ # API call functions
└── package.json


## Installation & Setup

### 1. Clone the repositories
```bash
# Frontend
git clone https://github.com/mtuannguyen39/tantrang-frontend.git
cd tantrang-frontend

# Backend
git clone https://github.com/mtuannguyen39/tantrang-backend.git
```
### 2. Install dependencies
```bash
npm install
```
### 3. Configure environment variables
Create a .env.local file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
For the backend, configure .env according to your PostgreSQL setup.
### 4. Run the development servers
```bash
# Backend
npm run dev

# Frontend
npm run dev
```
The frontend will be available at http://localhost:3000.

## Deployment
The frontend can be deployed on platforms like Vercel or Netlify,
and the backend on Render, Railway, or Heroku.

## Project Overview Diagram

Below is a high-level overview of the Tân Trang Church Website architecture:

      ┌───────────────────────┐
      │   User's Browser      │
      │ (Desktop / Mobile)    │
      └──────────┬────────────┘
                 │
                 ▼
      ┌───────────────────────┐
      │  Next.js Frontend      │
      │  (TypeScript + SCSS)   │
      └──────────┬────────────┘
                 │ API Requests (REST)
                 ▼
      ┌───────────────────────┐
      │  Node.js Backend       │
      │  (Express + Prisma)    │
      └──────────┬────────────┘
                 │
                 ▼
      ┌───────────────────────┐
      │   PostgreSQL Database  │
      │ (News, Liturgical,     │
      │  Bible Content, etc.)  │
      └───────────────────────┘


**Flow Explanation:**
1. Users access the website via browser (desktop or mobile).
2. Frontend (Next.js) renders pages with server-side rendering (SSR) for better SEO and performance.
3. Frontend communicates with the backend API (Node.js + Express + Prisma).
4. Backend retrieves data from PostgreSQL and sends it back as JSON to the frontend.
5. Frontend displays dynamic content such as news, liturgical schedules, and Bible readings.
