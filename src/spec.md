# Specification

## Summary
**Goal:** Add per-day tracking for water glasses and protein scoops on the Diet tab, saved locally per selected date.

**Planned changes:**
- Add a per-date water glasses tracker on the Diet tab with increment/decrement controls and a visible integer total.
- Add a per-date protein scoops tracker on the Diet tab showing 0/2, 1/2, 2/2 with quick controls to mark/undo scoops (max 2).
- Implement React Query query keys and hooks for reading/updating both trackers, persisting to localStorage keyed by (principal, date) when authenticated and a stable anonymous key + date when not authenticated.

**User-visible outcome:** On the Diet tab, users can select a date and record how many glasses of water they drank and track up to two protein scoops for that day; values persist after reload and switch correctly when changing dates.
