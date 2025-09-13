# Development Commands

## Build Commands
- `pnpm run build` - Build both CSS and TypeScript
- `pnpm run css:build` - Build CSS only
- `pnpm run css:watch` - Watch CSS files for changes

## Development
- `pnpm run dev` - Start development server with CSS watching

## Linting & Type Checking
- `pnpm run lint` - ESLint check
- `pnpm run typecheck` - TypeScript check

## Tailwind CSS Setup
The project uses Tailwind CSS v3 with:
- PostCSS configuration for processing
- Custom blog-focused components in `src/styles/main.css`
- Typography plugin for markdown content
- File watching for automatic rebuilds
- CSS output to `public/styles/main.css`

## Project Structure
- `src/styles/main.css` - Main CSS entry point
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `src/scripts/build-css.ts` - CSS build script
- `src/scripts/watch-css.ts` - CSS watch script
