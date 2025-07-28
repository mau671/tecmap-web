# Copilot Instructions for TecMap Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a modern web application built with:
- **Astro 4** as the main framework
- **Tailwind CSS 4** for styling (using @import instead of @tailwind directives)
- **shadcn/ui** for accessible UI components
- **React 19** for interactive components (using Astro Islands)
- **TypeScript** for type safety
- **pnpm** as package manager
- **Lucide React** for icons

## Project Structure

```
/src
  /components
    /ui           # shadcn/ui components (Badge, Card, etc.)
    CurriculumMap.tsx  # Main interactive component
  /data
    curriculum.ts # Curriculum data and types
  /lib
    utils.ts     # Utility functions (cn function for class merging)
  /pages
    index.astro  # Main page
  /styles
    globals.css  # Global styles with Tailwind CSS 4 import
```

## Key Guidelines

1. **Astro Islands**: Use `client:load` directive for interactive React components
2. **Tailwind CSS 4**: Use `@import "tailwindcss"` instead of traditional @tailwind directives
3. **Component Imports**: Use absolute imports with path mappings (e.g., `@/components/ui/card`)
4. **Type Safety**: Maintain strict TypeScript types for curriculum data
5. **Accessibility**: Follow shadcn/ui patterns for accessible components
6. **State Management**: Use localStorage for persistence and React state for interactivity
7. **Educational Context**: This is for TEC Costa Rica university students

## Specific Features

- Interactive curriculum map showing subject blocks
- Click to change subject status: Pending → In Progress → Completed
- Prerequisite validation (subjects unlock when prereqs are met)
- Local storage persistence for progress
- Responsive design for mobile and desktop
- Progress tracking with credit counts

## Code Style

- Use TypeScript with strict mode
- Follow React hooks patterns
- Use functional components with proper TypeScript types
- Implement proper error boundaries and loading states
- Keep components modular and reusable
- Use semantic HTML and ARIA attributes for accessibility

When suggesting code changes, always consider the educational context and ensure the application remains intuitive for university students tracking their academic progress.
