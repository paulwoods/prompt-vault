### Project Guidelines

#### Build and Configuration Instructions

This project is built with **Next.js** (App Router), **TypeScript**, and **Tailwind CSS**.

1. **Environment Setup**:
    - Ensure you have Node.js installed (LTS recommended).
    - Install dependencies:
      ```bash
      npm install
      ```

2. **Development Server**:
    - Start the development server:
      ```bash
      npm run dev
      ```
    - The application will be available at `http://localhost:3000`.

3. **Build**:
    - To create a production build:
      ```bash
      npm run build
      ```
    - To start the production server:
      ```bash
      npm run start
      ```

4. **Linting**:
    - Run ESLint to check for code quality issues:
      ```bash
      npm run lint
      ```

#### Testing Information

Currently, the project does not have a testing framework explicitly listed in `package.json`. However, **Vitest** is
recommended for its speed and compatibility with Next.js.

1. **Running Tests**:
    - You can run tests using `npx vitest` without a permanent installation:
      ```bash
      npx vitest run
      ```
    - To run in watch mode:
      ```bash
      npx vitest
      ```

2. **Adding New Tests**:
    - Create files with the `.test.ts` or `.test.tsx` extension.
    - Use `describe`, `it`/`test`, and `expect` from `vitest`.
    - Example of a simple test:
      ```typescript
      import { describe, it, expect } from 'vitest';
 
      describe('Basic Logic', () => {
        it('should perform addition correctly', () => {
          expect(1 + 1).toBe(2);
        });
      });
      ```

3. **Test Demonstration**:
    - A temporary test file `test-check.test.ts` was used to verify the environment. It can be executed with
      `npx vitest run test-check.test.ts`.

