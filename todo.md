## Task 1: Prepare Plan Data and Billing Toggle
- Goal: Implement state-managed billing toggle and update plan structure.
- Context: `frontend/src/app/pricing/page.tsx` needs a `billingPeriod` ('monthly' | 'yearly') state. The `plans` array should include `priceMonthly` and `priceYearly`. A new toggle switch component (Framer Motion) should control this state.

### Actions:
1. Initialize `useState` for `billingPeriod` in `PricingPage`.
2. Update the `plans` array to store `priceMonthly` (e.g., 'Rs.0') and `priceYearly` (e.g., 'Rs.0').
3. Create a `BillingToggle` component using `framer-motion`.
4. Replace the hardcoded `/month` label with logic based on the `billingPeriod` state.
