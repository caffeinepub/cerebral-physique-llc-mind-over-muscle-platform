# Specification

## Summary
**Goal:** Expand the workout library with ~20 real exercises per muscle group, add exercise detail modals with embedded form videos, and introduce a workout routine builder feature.

**Planned changes:**
- Expand backend exercise data to include ~20 real, factual exercises per muscle group across all 10 muscle groups (chest, back, shoulders, biceps, triceps, legs, glutes, core, forearms, calves), each with name, muscle group, benefits, form description, difficulty, equipment, image URLs, and video URLs
- Add backend CRUD support for user workout routines (createRoutine, getMyRoutines, updateRoutine, deleteRoutine), scoped per authenticated user principal
- Update WorkoutLibraryPage to display all ~20 exercises per muscle group in a responsive grid/list of cards, each showing the exercise image, name, and benefits summary
- Make each exercise card clickable to open a detail modal showing full benefits, form description, equipment, difficulty, and an embedded video (YouTube iframe or HTML5 video)
- Add an "Add to Routine" button on each exercise card; build a collapsible sidebar/bottom panel showing the active routine with remove controls; prevent duplicate entries and show a visual indicator when an exercise is already added
- Persist routines to the backend for authenticated users and to localStorage for guests
- Add ~45 new semi-realistic exercise illustration images as static assets

**User-visible outcome:** Users can browse ~20 exercises per muscle group with images and benefit summaries, click any exercise to view full details and a form demonstration video, and build a personal workout routine by adding/removing exercises — which is saved automatically for logged-in users or stored locally for guests.
