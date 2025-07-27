# URL Analyzer Frontend

A modern React-based web application for URL analysis, built with TypeScript, Vite, and Tailwind CSS.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Key Features](#key-features)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Styling](#styling)
- [Docker Support](#docker-support)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

This frontend application provides a user-friendly interface for analyzing URLs. Users can sign up, sign in, and perform comprehensive URL analysis through an intuitive dashboard interface.

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (or npm/yarn as alternatives)
- **Backend API**: The backend server should be running on `http://localhost:8000`

## 🚀 Quick Start

1. **Navigate to Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser**:
   Visit `http://localhost:5173` to see the application

## 📁 Project Structure

```
Frontend/
├── public/                     # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-user.jpg
│   └── ...
├── scripts/
│   └── generate-env.js        # Environment file generator
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── analysis-modal.tsx
│   │   └── protected-route.tsx
│   ├── config/
│   │   └── environment.ts     # Auto-generated environment config
│   ├── contexts/
│   │   └── auth-context.tsx   # Authentication context
│   ├── hooks/
│   │   └── use-url-analysis.ts # Custom hooks
│   ├── interfaces/
│   │   └── api.interface.ts   # TypeScript interfaces
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   ├── pages/                # Application pages
│   │   ├── Dashboard.tsx
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   ├── services/             # API services
│   │   ├── api-client.ts
│   │   ├── auth.service.ts
│   │   ├── url.service.ts
│   │   └── index.ts
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── docker-compose.yml        # Docker configuration
├── Dockerfile               # Docker build instructions
├── nginx.conf               # Nginx configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## 🔧 Environment Configuration

The application uses an automated environment configuration system:

### Environment Variables

Set these environment variables (prefixed with `VITE_`):

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000
VITE_APP_NAME="URL Analyzer"
VITE_APP_VERSION=1.0.0
VITE_AUTH_STORAGE_KEY=webAnalyzer_auth
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true
```

### Auto-Generated Configuration

The `scripts/generate-env.js` script automatically:
- Reads all `VITE_` prefixed environment variables
- Generates TypeScript interfaces
- Creates type-safe environment configuration
- Validates required variables

The generated `src/config/environment.ts` provides:
```typescript
export const env = {
  apiBaseUrl: 'http://localhost:8000/api/v1',
  apiTimeout: 30000,
  appName: 'URL Analyzer',
  // ... other config
}
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build production-ready application |
| `pnpm build:prod` | Build optimized production application |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint for code quality checks |
| `pnpm gen:env` | Generate environment configuration file |
| `pnpm docker:build` | Build Docker image for production |
| `pnpm docker:prod` | Start production containers |
| `pnpm docker:prod:build` | Build and optionally start production setup |

## 🔄 Development Workflow

1. **Environment Setup**: Run `pnpm gen:env` to generate environment configuration
2. **Development**: Use `pnpm dev` for development with hot reload
3. **Code Quality**: Run `pnpm lint` to check for issues
4. **Building**: Use `pnpm build` for production builds

### Hot Reload

Vite provides instant hot module replacement (HMR) for:
- React components
- CSS/Tailwind changes
- TypeScript files
- Environment variables (after regeneration)

## ✨ Key Features

### Authentication System
- **Sign Up**: User registration with validation
- **Sign In**: User authentication with JWT tokens
- **Protected Routes**: Route-level authentication guards

### URL Analysis
- **Dashboard Interface**: Clean, modern dashboard design
- **URL Input**: Intuitive URL submission interface
- **Analysis Results**: Comprehensive analysis display
- **Modal System**: Analysis results in modal dialogs

### UI/UX
- **Responsive Design**: Mobile-first responsive layout
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## 🔌 API Integration

### API Client Structure

```typescript
// services/api-client.ts
- Base HTTP client configuration
- Request/response interceptors
- Error handling
- Authentication headers

// services/auth.service.ts
- User authentication
- Token management
- User registration

// services/url.service.ts
- URL analysis operations
- Result retrieval
```

### Authentication Flow

1. User submits credentials
2. Frontend sends request to `/auth/login`
3. Backend returns JWT tokens
4. Tokens stored in localStorage
5. Subsequent requests include auth headers
6. Protected routes check authentication status

## 🎨 Styling

### Tailwind CSS
- **Utility-first**: Comprehensive utility classes
- **Custom Configuration**: Extended theme in `tailwind.config.ts`
- **Responsive Design**: Mobile-first breakpoints
- **Dark Mode**: Theme switching support

### shadcn/ui Components
- **Pre-built Components**: High-quality, accessible components
- **Customizable**: Easy theming and customization
- **Consistent Design**: Unified design system
- **TypeScript Support**: Full type safety

### Component Library
```
components/ui/
├── button.tsx          # Button variations
├── input.tsx           # Form inputs
├── card.tsx            # Card containers
├── dialog.tsx          # Modal dialogs
├── form.tsx            # Form components
└── ...                 # Other UI components
```

## 🐳 Docker Support

### Development
```bash
# Start development environment
docker-compose up
```

### Production

#### Quick Start
```bash
# Copy and configure production environment
cp .env.production.sample .env.production
# Edit .env.production with your production values

# Build and start production containers
pnpm docker:prod:build
```

#### Manual Setup
```bash
# Build production image with environment variables
docker build \
  --build-arg VITE_API_BASE_URL=https://your-api.com/api/v1 \
  --build-arg VITE_APP_NAME="URL Analyzer" \
  -t url-analyzer-frontend:latest .

# Start production containers
docker-compose -f docker-compose.prod.yml up -d
```

#### Production Scripts
- **Windows**: `.\scripts\build-prod.ps1`
- **Linux/Mac**: `./scripts/build-prod.sh`

### Environment Variables in Docker

The Dockerfile automatically:
1. Accepts build arguments for all `VITE_` environment variables
2. Runs `pnpm gen:env` to generate environment configuration
3. Builds the application with proper environment variables

### Docker Features
- **Multi-stage build**: Optimized production images
- **Health checks**: Container health monitoring
- **Volume support**: Persistent nginx logs
- **Network isolation**: Secure container communication
- **Traefik labels**: Ready for reverse proxy setup

### Nginx Configuration
- Static file serving with compression
- SPA routing support (fallback to index.html)
- Security headers
- Cache optimization
- Log rotation

## 🔧 Troubleshooting

### Common Issues

**1. Environment variables not loading**
```bash
# Regenerate environment file
pnpm gen:env
```

**2. API connection issues**
```bash
# Check backend is running on localhost:8000
# Verify VITE_API_BASE_URL in environment
```

**3. Build failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

**4. TypeScript errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Development Tips

1. **Hot Reload Issues**: Restart dev server if HMR stops working
2. **Environment Changes**: Regenerate environment file after changes
3. **API Debugging**: Check browser network tab for API requests
4. **Component Issues**: Use React Developer Tools for debugging

### Performance Optimization
- **Bundle Analysis**: Use `vite-bundle-analyzer` for optimization
- **Image Optimization**: Optimize images in public directory
- **Tree Shaking**: Vite automatically removes unused code

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [React Hook Form Documentation](https://react-hook-form.com/)

---

**Happy coding! 🚀**

For questions or issues, please check the troubleshooting section or refer to the project documentation.
