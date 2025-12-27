# Contributing Guidelines

Thank you for considering contributing to the Birthday Cards App! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/semana_tec.git
   cd semana_tec
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp env_example .env.local
   # Edit .env.local with your credentials
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your changes.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
npm run lint
```

## Code Style Guidelines

### General Principles

1. **Modular Code**: Break code into small, reusable functions and components
2. **Clear Naming**: Use descriptive, self-documenting names
3. **Comments**: Add comments for complex logic, not obvious code
4. **Type Safety**: Use TypeScript types and interfaces
5. **Environment Variables**: Never hard-code sensitive data

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Functions/Variables**: camelCase (`getUserData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Files**: kebab-case for utilities (`auth-helper.ts`)
- **Interfaces/Types**: PascalCase with `I` prefix for interfaces (`IUser`, `UserData`)

### File Organization

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable React components
│   └── [pages]/          # Page components
├── lib/
│   ├── constants/        # Constants and configuration
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
```

### Component Structure

```tsx
/**
 * Brief description of what the component does
 */
"use client"; // Only if needed

import { useState } from "react";
import type { ComponentProps } from "@/lib/types";

interface MyComponentProps {
  title: string;
  onSubmit?: () => void;
}

export default function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    // Implementation
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Utility Function Structure

```typescript
/**
 * Brief description of what the function does
 * @param paramName - Description of parameter
 * @returns Description of return value
 */
export function myUtilityFunction(paramName: string): boolean {
  // Implementation
  return true;
}
```

## Testing Guidelines

- Write tests for all new features and utilities
- Aim for >80% code coverage
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

### Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    const input = "test";
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

## Submitting Changes

1. **Ensure all tests pass**
   ```bash
   npm test
   npm run lint
   ```

2. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure CI checks pass

## Reporting Bugs

When reporting bugs, include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

## Suggesting Features

When suggesting features, include:

- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Any potential drawbacks

## Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update type definitions as needed
- Keep CONTRIBUTING.md current

## Checklist Before Submitting PR

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No linting errors
- [ ] Commit messages follow convention
- [ ] PR description is clear

## Need Help?

- Open an issue for questions
- Check existing documentation
- Review closed PRs for examples

Thank you for contributing!
