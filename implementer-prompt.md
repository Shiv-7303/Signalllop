You are an expert React developer specializing in Next.js and UI/UX.

Task: Implement state-managed billing toggle and update plan structure.

Context: 
- Modify: `frontend/src/app/pricing/page.tsx`
- Implement `useState` for `billingPeriod` ('monthly' | 'yearly').
- Update `plans` data structure to include `priceMonthly` and `priceYearly`.
- Create a reusable `BillingToggle` component using `framer-motion` to switch between monthly and yearly.
- Ensure the toggle switch is styled with modern aesthetics and matches the Zova design system.
- Update plan card prices and labels based on the toggle state.
- Follow TDD: add a test or verification step (if possible via simple test script) or ensure clear visual verification steps.

Constraints:
- Follow established project coding style.
- Use `framer-motion` for the toggle.
- Maintain consistent design language (glassmorphism).

Please implement this task.
