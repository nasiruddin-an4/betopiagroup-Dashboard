# Betopia Admin Dashboard (UI)

This is the **administrative dashboard UI** (Next.js) for managing Betopia Group website content.

Backend API lives in the separate project/folder: `betopia-group-server/backend`.

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (default: `http://localhost:6003/api`)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (optional) in `.env.local`:

### Development

Run the dashboard:

```bash
npm run dev
```

Open `http://localhost:6005`.

## Notes

- API requests to `/api/*` and `/uploads/*` are proxied to the backend via `next.config.js` rewrites.
