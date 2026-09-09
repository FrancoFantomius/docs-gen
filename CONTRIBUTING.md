# Contributing to @francofantomius/docs-gen

Thank you for your interest in contributing to `@francofantomius/docs-gen`! We welcome contributions, bug reports, documentation improvements, and feature requests.

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0 or higher
- [npm](https://www.npmjs.com/) v9.0 or higher
- [Git](https://git-scm.com/)

### Clone & Install

```bash
git clone https://github.com/FrancoFantomius/docs-gen.git
cd docs-gen
npm install
```

### Useful Scripts

- `npm run dev`: Start the documentation development server with hot-reload at `http://localhost:3000`.
- `npm run build`: Compile the documentation directory (`docs/`) into the `_site/` directory using Vite.
- `npm run preview`: Preview the compiled `_site/` directory locally.

---

## Making Changes

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes**: Ensure your code adheres to standard modern ES modules conventions.
3. **Test your changes**: Run `npm run build` and ensure there are no build warnings or syntax issues.
4. **Commit with clear messages**: Use concise, descriptive commit messages (e.g. `feat: add custom hero badge support`).
5. **Push to your fork** and submit a **Pull Request**.

---

## Reporting Issues

If you find a bug or have a suggestion:
1. Check the [Issues](https://github.com/FrancoFantomius/docs-gen/issues) tab to see if the issue has already been reported.
2. If not, open a new issue using the **Bug Report** or **Feature Request** template.

---

## License

By contributing to `@francofantomius/docs-gen`, you agree that your contributions will be licensed under the [MIT License](LICENSE).

