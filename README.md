# Personal Finance Tracker (modular)

This repo contains three modules: `dashboard`, `expenses`, and `income`. Each module has its own `package.json` and tests.

CI is configured in `.github/workflows/ci.yml` to run tests for each module in parallel with a Node.js matrix and a final build job that runs only if all tests pass.
