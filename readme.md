# predictKaro — Frontend

A **Neubrutalist prediction market** web app built with React + Vite.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Data Fetching | [TanStack Query v5](https://tanstack.com/query) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (Vite plugin) |
| Language | TypeScript 5 |
| Fonts | Space Grotesk · Space Mono · Material Symbols (Google Fonts) |

## Project Structure

```
predictor-frontend/
├── index.html               # Vite root HTML (fonts + icons preloaded)
├── vite.config.ts           # Vite + @tailwindcss/vite + path alias (@/)
├── tsconfig.json            # Bundler mode TypeScript config
├── package.json
└── src/
    ├── main.tsx             # Entry: QueryClientProvider + BrowserRouter
    ├── App.tsx              # Route definitions
    ├── index.css            # Tailwind + custom design tokens / utilities
    └── pages/
        ├── HomePage.tsx         # / — Market listings + portfolio summary
        ├── LoginPage.tsx        # /login — Sign-in form
        ├── CreateAccountPage.tsx # /create-account — Registration form
        └── MarketPage.tsx       # /market — Market detail + trade panel
```

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other available commands:

```bash
npm run build      # Production build (tsc + vite build)
npm run preview    # Preview production build locally
npm run lint       # ESLint
```

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Market grid, category filters, portfolio table |
| `/login` | Login | Username + password sign-in, Google OAuth |
| `/create-account` | Create Account | Registration with username, email, password |
| `/market` | Market Detail | Probability chart, trade panel, activity log |

## Design System

The app uses a **Neubrutalist** aesthetic defined in `src/index.css`:

- **Colors**: `--color-primary` (#CCFF00 lime), `--color-secondary` (#8A2BE2 purple), accent red/green
- **Shadows**: `shadow-neubrutal`, `shadow-neubrutal-lg`, `shadow-neubrutal-lime`, `shadow-neubrutal-purple`
- **Utilities**: `.neubrutal-border`, `.neubrutalist-shadow`, `.slanted-display`, `.vertical-text`
- **Typography**: Space Grotesk (display) · Space Mono (mono)
- **Borders**: All radii set to `0px` for the brutalist squared-off look

yello