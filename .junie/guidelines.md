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

#### Additional Development Information

1. **Code Style**:
    - **Indentation**: The project uses **4 spaces** for indentation.
    - **Naming**: Use PascalCase for React components and camelCase for functions and variables.
    - **Tailwind CSS**: Follow the utility-first approach. Use the `globals.css` for base styles and Tailwind classes
      for everything else.
    - **TypeScript**: Use strict typing where possible. Avoid using `any`.

2. **Architecture**:
    - The project uses the Next.js **App Router** (`src/app`).
    - UI components should ideally be placed in a `src/components` directory (if created).
    - Business logic should be separated from components when it becomes complex.

3. **Debugging**:
    - Use the standard browser DevTools for client-side debugging.
    - For server-side logic (Server Components, API Routes), use `console.log` or a debugger attached to the Node.js
      process.

#### Code Quality Guidelines

1. Apply Secure Coding Everywhere, Always:
   - Security rules must be applied consistently across the entire codebase.
   - No shortcuts, no exceptions for “small” features, and no skipping security because something seems internal or
     low-risk.

2. Enforce Least Privilege and Core Safeguards:
   - Limit access strictly to what is required and implement essential protections such as input validation, data
     cleaning, output encoding, CSRF defenses, request throttling, secure login flows, safe session handling, and
     proper
     secret storage.

3. Build and Test Against the OWASP Top 10 Risks:
   - Design the system to meet OWASP ASVS standards and explicitly test for the OWASP Top 10 security risks, including
     injection attacks, broken authentication, sensitive data exposure, insecure architecture, misconfigurations,
     outdated libraries, identity failures, data integrity issues, server-side request forgery, and missing logging or
     monitoring.

4. Lock Down Every API and Backend Endpoint:
   - For any new or modified endpoint, enforce strong server-side validation, permission checks, and safe error
     handling. Errors should be informative for developers but must never reveal system internals or stack traces to
     users.

5. Never Store Secrets in Code:
   - Credentials, API keys, tokens, and sensitive configuration values must never be written directly into source
     files.
     All secrets should be injected securely through environment variables or a dedicated secret manager.

6. Verify Dependencies Before Making Changes:
   - Before modifying or adding code, confirm that all libraries, imports, variables, and references are valid,
     current,
     and compatible. Remove unused or outdated dependencies that could introduce vulnerabilities.

7. Implement Defensive Error Handling Everywhere:
   - All functions must include proper error handling, null checks, and safe fallback behavior. The application should
     never crash or expose sensitive information due to unexpected input or missing data.

8. Treat All User Input as Potentially Dangerous:
   - Every user-controlled value must be validated, sanitized, and encoded before being processed, stored, or returned.
     This includes form inputs, URL parameters, headers, file uploads, and API payloads.

9. Control and Review All Outputs:
   - Ensure responses are type-safe, properly formatted, and free from sensitive data. Avoid unsafe serialization,
     prevent accidental data exposure, and maintain compatibility with existing system components.

10. Make No Unrelated Code Changes:
   - Changes must be limited strictly to the intended scope. Do not modify routes, logic, styles, or behaviors that are
     unrelated to the feature or fix being implemented.

11. Require Clean Builds Only:
   - The final code must compile and run without any errors or warnings. Warnings are not optional and should be treated
     as issues to resolve.

12. Perform Full QA and Regression Testing:
   - After implementation, thoroughly test all application flows on both desktop and mobile to confirm existing behavior
     remains unchanged and new functionality works as expected.

13. Run Security and Vulnerability Checks:
   - Execute OWASP Top 10 validation tests, dependency vulnerability scans, and confirm authentication flows, form
     submissions, API requests, and database interactions behave securely and correctly.

14. Verify Frontend, Logs, and Headers:
   - Check responsive design, console logs for errors or warnings, accessibility compliance, secure headers (such as
     CSP, HSTS, and X-Frame-Options), and ensure no personally identifiable information appears in logs.

15. Confirm Protections Are Actively Working:
   - Validate that rate limiting, CSRF protection, CORS policies, and abuse prevention mechanisms are enabled and
     functioning as expected.

16. Deploy Only After Everything Passes:
   - Only save or deploy the application once all quality checks, security validations, and tests pass with zero
     critical
  or high-severity issues.
