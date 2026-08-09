# Contributing to StatsLab EdTech Ecosystem

First off, thank you for considering contributing to StatsLab! We welcome researchers, educators, and developers to help build the first open-source Islamic-based EdTech R&D ecosystem in Indonesia.

## How Can I Contribute?

### 1. Submitting New Datasets (`packages/datasets`)
We welcome contextual JSON datasets (e.g., Islamic finance, environmental statistics, madrasah data) that can be used for learning statistics.
- Datasets must be authentic and properly cited (*Tabayyun*).
- Must include metadata (title, category, islamic_value, description).
- Submit via the Dataset Proposal Issue template.

### 2. Improving Web App UI/UX (`apps/web`)
Help us optimize the cognitive load for students using our dashboards.
- We use **Next.js 15**, **Tailwind CSS**, and **Recharts**.
- Ensure any UI addition adheres to Sweller's Cognitive Load Theory (keep it clean, avoid extraneous load).
- Do not break the data structure required by Layer 1 (Research Prototype).

### 3. Psychometric & Data Analysis (`packages/analysis`)
Contribute open-source R/Python scripts for analyzing student data.
- Scripts for Rasch Model (`eRm` / `TAM`), CFA (`lavaan`), or System Usability Scale calculations.
- Help us maintain reproducible academic standards.

## Pull Request Process

1. Fork the repo and create your branch from `main`.
2. Ensure you have installed dependencies via `pnpm install`.
3. If you've added code that should be tested, add tests.
4. If you've changed APIs, update the documentation.
5. Ensure the test suite passes (`pnpm lint` and `pnpm build`).
6. Issue that pull request!

## Code & Ethical Standards

In StatsLab, we uphold the principles of:
- **Amanah**: Honest representation of code and data. Do not manipulate research data.
- **Tabayyun**: Verify the sources of your datasets before submitting them.

By contributing to StatsLab, you agree that your contributions will be licensed under its MIT (for code) and CC-BY 4.0 (for data/instruments) licenses.
