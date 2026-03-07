# AGENTS.md

## Project Overview

GerberViewer is a browser-based PCB Gerber file viewer and exporter. It renders Gerber/drill files to interactive previews and supports exporting to SVG/PNG.

## Tech Stack

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Language:** TypeScript
- **Build:** Vite
- **UI:** Ant Design Vue
- **i18n:** vue-i18n (English + Simplified Chinese)
- **Package Manager:** npm (use `npm install` to add dependencies, never edit package.json directly)
- **Node:** >= 20.19.0

## Commands

- `npm run dev` — Dev server (port 8080)
- `npm run build` — Typecheck + production build
- `npm run typecheck` — TypeScript type checking
- `npm run lint` — ESLint

Always run `npm run lint` and `npm run build` after changes to verify correctness.

## Directory Structure

```
src/
  components/    Reusable UI components (X-prefixed for custom ones)
  panels/        Feature-specific panel views
  composables/   Vue Composition API hooks (use* prefix)
  utils/         Pure utility functions
  i18n/          Language files and i18n setup
  App.vue        Root component
  main.ts        Entry point
```

## Code Conventions

### Vue Components

- Use `<script lang="ts" setup>` with Composition API
- Define props with `defineProps<Type>()`
- Component files use PascalCase (e.g., `GerberView.vue`, `RenderPanel.vue`)

### TypeScript

- Interfaces use `I` prefix (e.g., `IPosition`, `ISize`, `IScale`)
- Composables use `use` prefix (e.g., `useMouseEvents`, `useClientSize`)
- Single quotes for strings
- 2-space indentation, LF line endings

### Import Order

1. Type imports (`import type { ... }`)
2. Vue imports (`import { ref, computed } from 'vue'`)
3. Third-party libraries
4. Internal modules with `@/` alias

### Styles

- SCSS with CSS Modules: `<style lang="scss" module>`
- Access in template: `:class="$style.className"`
- Global styles in unscoped `<style lang="scss">`

## i18n

- Language files: `src/i18n/en.ts` (English), `src/i18n/zh-CN.ts` (Simplified Chinese)
- Available locales defined in `src/i18n/index.ts` (`locales` array)
- Default: English; auto-switches to Chinese if browser language starts with `zh`
- Use `$t('key')` in templates; use `useI18n()` + `t('key')` in script setup
- When adding UI text, add keys to both language files

## Git Commit Style

- Imperative present tense, capitalize first letter, no period
- Concise (3-8 words typically)
- Examples: `Add i18n support`, `Zoom towards pointer position`, `Hide tabs`

## CI/CD

- GitHub Actions deploys to GitHub Pages on push to master
- Pipeline: lint -> build -> deploy
