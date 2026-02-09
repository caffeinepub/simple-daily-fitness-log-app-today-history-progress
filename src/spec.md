# Specification

## Summary
**Goal:** Add a Workout Progress chart to the Progress screen to visualize workout completion over the last 30 days.

**Planned changes:**
- Add a new “Workout Progress” section/card on the Progress tab alongside the existing Weight Progress section.
- Implement a simple 30-day timeline chart (SVG/React) showing workout completion status per day using existing app styling (Tailwind + shadcn Card).
- Add empty/loading/error UI states for the Workout Progress chart with English messaging (including an explicit empty state when no data exists).
- Create a React Query hook to fetch workout completion status for a given start/end date range, using centralized query keys for caching/invalidations.
- Fix/complete the backend date-range workout completion query to return actual (YYYY-MM-DD, Bool) completion values for the authenticated user for every day in the inclusive range, in chronological order.

**User-visible outcome:** On the Progress tab, users see both Weight Progress and a new Workout Progress chart that displays workout completion across the last 30 days, with clear loading and empty-state messaging when applicable.
