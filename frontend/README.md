# Watkins AI Frontend

Next.js frontend for the Watkins AI e-commerce growth engine.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main dashboard & all modules
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
├── lib/
│   ├── api.ts          # API client & endpoints
│   └── store.ts        # Zustand state management
└── styles/
    └── globals.css     # Global styles with Tailwind
```

## 🎨 Features

- **Modern UI** with Tailwind CSS
- **Server & Client Components** for optimal performance
- **State Management** with Zustand
- **API Integration** with React Query
- **Type Safety** with TypeScript
- **Responsive Design** for all devices

## 🔨 Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

Proprietary - Watkins AI
