# Antigravity Project Customizations & Rules

### Responsive Layouts & Class Consistency
- **Verify Class Mapping**: Always verify that the class names referenced in CSS media queries are correctly and completely applied to the corresponding JSX/HTML elements. When layout overlap or alignment issues occur on mobile or specific breakpoints, audit the elements first to check for missing class definitions.

### TypeScript Compilation & Hook Safety
- **useEffect Return Paths**: Ensure that `useEffect` hooks either return a cleanup function unconditionally, or explicitly return `undefined` in all paths, to avoid compilation failures when TypeScript's `noImplicitReturns` constraint is enabled.
