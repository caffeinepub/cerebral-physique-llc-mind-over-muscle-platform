# Specification

## Summary
**Goal:** Make the Workout Library muscle-group cards, per-exercise media/text, and Blog content easy for admins to update regularly, with changes persisted.

**Planned changes:**
- Add admin editing for Workout Library muscle-group cards so each group can store and display admin-managed image and description (with fallback to current defaults when not set).
- Update Exercise Management to allow saving per-exercise image/video as either site asset paths (/assets/...) or external URLs (https://...), while keeping required-field validation and providing a sensible display fallback if media is missing/unreachable.
- Make Blog editing clearly accessible for admins by linking from the public Blog area to the existing BlogManagement workflow (create/edit/publish/unpublish/delete), while keeping all admin controls hidden from non-admin users.

**User-visible outcome:** Admins can regularly update muscle-group card images/descriptions, update exercise images/videos/text using either uploaded asset paths or external URLs, and quickly access blog post management from the Blog page; non-admins can only view content.
