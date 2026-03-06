# Contact Manager

A professional, production-ready Contact Management application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Contact Management**: Create, view, edit, and delete contacts
- **Rich Contact Details**: Store name, email, address, company, job title, and notes
- **Persistent Storage**: All data is stored in browser localStorage - survives page refreshes
- **Global Search**: Search across all contact fields in real-time
- **Advanced Filtering**: Filter by company and job title
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional UI**: Clean, enterprise-grade interface with subtle feedback

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd contact-manager
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks + localStorage

## Data Model

```typescript
interface Contact {
  id: string;
  fullName: string;
  email: string;
  address: string;
  company: string;
  jobTitle: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

## Architecture

```
src/
├── app/              # Next.js pages
├── components/
│   ├── ui/          # Reusable UI components
│   └── contacts/    # Contact-specific components
├── hooks/           # Custom React hooks
├── lib/             # Storage utilities
└── types/           # TypeScript definitions
```

## Limitations

- Data is stored only in the browser's localStorage
- No cross-device synchronization
- Clearing browser data will remove all contacts
- No import/export functionality (manual data entry only)

## License

MIT

