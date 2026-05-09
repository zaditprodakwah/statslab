# 🤖 AI CODER DIRECTIVES & IMPLEMENTATION ROADMAP
**Project:** StatsLab V1 - Dasbor Statistika Interaktif
**Framework:** React 18 (CSR) + Vite + Tailwind CSS + Chart.js

## 1. PROJECT PHILOSOPHY (CONTEXT FOR AI)
Before writing or modifying any code, you must understand the "Triple Helix" philosophy of this project. Every component must serve these three pillars:
1. **Cognitive Load Theory (CLT):** UI must be minimalist. Maintain "Zero Layout Shift" (elements should not jump during load) and keep animations/transitions under 50ms to reduce *Extraneous Load*.
2. **Data Literacy (Watson-Callingham):** Gamification is strictly linear (Level 1 to 6). Do not allow skipping levels.
3. **Islamic Epistemology:** - `useTabayyun.js`: Represents data verification. This is the math engine for anomaly detection.
   - `useAmanah.js`: Represents visual integrity. This controls the `yMin` scale of Chart.js (0 for honest, undefined for truncated).

## 2. CORE MECHANICS TO PRESERVE (DO NOT BREAK)
When refactoring, ensure the following core features remain intact:
- **Global Error Boundaries:** The `ErrorBoundary` and `ModuleErrorBoundary` in `App.jsx` are critical for graceful degradation. Do not remove them.
- **Expert Validation Hub:** The hidden portal (`ExpertValidationHub.jsx`) uses `@media print` for PDF generation. Any CSS changes must not break the print layout.
- **Data Persistence:** The application relies heavily on `localStorage` to save gamification progress and module states.

## 3. IMPLEMENTATION ROADMAP (ACTION ITEMS)

### Phase 1: State Management Refactor (High Priority)
**Problem:** `App.jsx` is currently bloated with gamification triggers (`handleDataChange`, `handleModuleChange`, `handleTabayyun`, etc.).
**Action:**
- Extract the gamification orchestration into a dedicated Context API (e.g., `GamificationContext.jsx` and `GamificationProvider`).
- Implement a Reducer or Observer pattern so child components (like `ZiswafModule.jsx`) can dispatch gamification events (e.g., `dispatch({ type: 'DATA_CHANGED' })`) without passing deeply nested callbacks from `App.jsx`.

### Phase 2: LocalStorage Optimization
**Problem:** The `useEffect` in `App.jsx` synchronizes `moduleData` to `localStorage` on every single state change. This will cause performance hits as data grows.
**Action:**
- Create a custom hook `useDebounceSave` or implement a `lodash/debounce` wrapper for the `localStorage.setItem` call (recommended delay: 500ms - 1000ms).

### Phase 3: Dynamic Tabayyun Thresholds (Math Engine Upgrade)
**Problem:** `useTabayyun.js` currently uses a hardcoded, static threshold for anomaly detection (`Math.abs(mean - median) > median * 0.3`).
**Action:**
- Upgrade the statistical logic to calculate the **Interquartile Range (IQR)** or **Standard Deviation**.
- Make the threshold dynamic based on the actual variance/spread of the current dataset, improving the scientific rigor of the anomaly detection.

### Phase 4: API Resilience & Fallback
**Problem:** The app will fetch data from Google Sheets via SheetDB API. SheetDB has strict rate limits for free tiers.
**Action:**
- Implement a caching layer (e.g., `SWR` or `React Query`) to minimize unnecessary API calls.
- Create a fallback mechanism: If the SheetDB API fails (429 Too Many Requests or 500 Error), the app must gracefully fall back to a local static `presetData.js` JSON file without crashing.

## 4. STRICT CODING GUIDELINES FOR AI
- **No Heavy Libraries:** Do not install heavy state management libraries like Redux unless absolutely necessary. Stick to React Context + Hooks for this scale.
- **Tailwind Only:** Use Tailwind CSS utility classes. Avoid creating custom CSS files unless it's for `@media print` specifics or complex keyframe animations that Tailwind can't handle efficiently.
- **Console Logs:** Clean up debugging `console.log` statements after implementation, except for critical error catches in the Error Boundaries.