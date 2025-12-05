# Contributing to Route X

Thank you for your interest in contributing to Route X! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- Clear, descriptive title
- Detailed description of proposed functionality
- Examples of how it would be used
- Benefits to users

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Add tests if applicable
4. Ensure the test suite passes
5. Make sure your code lints
6. Create a pull request

## 💻 Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/route-x.git
cd route-x

# Add upstream remote
git remote add upstream https://github.com/Harshlilha/route-x.git

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation updates
- `refactor/what-changed` - Code refactoring

### Commit Messages

Follow conventional commits:

```
feat: add new supplier filter
fix: resolve chart rendering issue
docs: update API documentation
style: format code with prettier
refactor: simplify RAG service
test: add unit tests for chat
chore: update dependencies
```

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new files
- Define interfaces for all data structures
- Avoid `any` types
- Use meaningful variable names

### React

- Use functional components
- Use hooks (useState, useEffect, etc.)
- Keep components small and focused
- Extract reusable logic into custom hooks

### CSS

- Use Tailwind CSS utility classes
- Follow existing color scheme
- Ensure responsive design
- Test on multiple screen sizes

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Maintain existing test coverage
- Test edge cases
- Use descriptive test names

## 📝 Documentation

- Update README.md for significant changes
- Add JSDoc comments for functions
- Update API documentation
- Include code examples

## ✅ Checklist

Before submitting a PR:

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Responsive design verified

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📧 Contact

- GitHub Issues: [Route X Issues](https://github.com/Harshlilha/route-x/issues)
- Email: harsh@routex.com

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
