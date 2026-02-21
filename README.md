# Horizn

## Introduction

Horizn is a web application built with React, Vite, and TypeScript. It provides a structured platform for managing and displaying information using a modular and extensible component-based architecture. The repository is organized to support clear separation of logic, presentation, and assets, making it suitable for scalable frontend development.

## Features

- Modular React component structure
- TypeScript for robust type safety
- Vite-based fast development environment
- Organized asset and utility management
- Theming support for light and dark modes
- State management with context and custom hooks
- Customizable icon system
- Support for global application settings

## Requirements

- Node.js (version 18 or higher)
- npm (version 9 or higher) or compatible package manager

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Arjun-SN04/horizn.git
   cd horizn
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

- Main configuration files are located at the project root and in the `src/config` directory.
- Modify `src/config/theme.ts` to customize application themes.
- Update `src/config/app.ts` for application-specific constants.

### Environment Variables

- Create a `.env` file at the root if environment-specific settings are required.
- Use standard Vite environment variable naming (e.g., `VITE_API_URL`).

## Usage

### Development

To start the development server:

```bash
npm run dev
```

Access the application at `http://localhost:5173`.

### Production Build

To build for production:

```bash
npm run build
```

The output will be generated in the `dist` directory.

### Linting

To run code linting:

```bash
npm run lint
```

### Application Structure

- `src/components`: Reusable UI components such as Button, Card, Header, Sidebar, and ThemeSwitcher.
- `src/assets`: Static assets including images and SVG icons.
- `src/config`: Theming and application configuration files.
- `src/context`: Application context and state providers.
- `src/hooks`: Custom React hooks for state and effect management.
- `src/icons`: Custom SVG icon components.
- `src/pages`: Top-level pages for routing.
- `src/utils`: Utility functions and helpers.
- `src/App.tsx`: Main application entry point.
- `src/main.tsx`: Vite bootstrapping and React DOM rendering.

### Theming

- The application supports both light and dark themes.
- The ThemeSwitcher component allows toggling between themes.
- Theme values and class names are defined in `src/config/theme.ts`.

### State Management

- Uses React context to provide global state.
- Custom hooks in `src/hooks` manage and access the context.

### Icons

- Custom icon components are stored in `src/icons`.
- Icons are React components returning SVG markup.

### Routing

- Page-level components are in `src/pages`.
- Main routing logic is handled in `src/App.tsx`.

## Contributing

- Fork the repository and create your feature branch.
- Commit your changes with clear messages.
- Ensure code passes linting and builds successfully.
- Open a pull request with a detailed description.

---

Horizn is designed to be modular, extensible, and developer-friendly, supporting rapid frontend development with modern tooling and best practices.
