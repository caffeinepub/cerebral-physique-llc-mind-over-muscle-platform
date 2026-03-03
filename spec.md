# Specification

## Summary
**Goal:** Fix the WorkoutLibraryPage so that each muscle group section correctly displays its associated exercises instead of showing zero.

**Planned changes:**
- Diagnose and fix the data mapping/filtering logic in WorkoutLibraryPage that causes exercise counts to show as zero for every muscle group
- Audit the `useQueries.ts` hooks and backend exercise query to ensure the muscle group identifier field is consistent between backend and frontend
- Ensure the frontend grouping logic matches exercises to their muscle group using the same key/ID returned by the backend
- Verify React Query hooks return a non-empty list of exercises when exercises exist in the canister

**User-visible outcome:** Each muscle group section in the Workout Library displays all its associated exercises with correct names, images/videos, and details — no section shows zero exercises anymore.
