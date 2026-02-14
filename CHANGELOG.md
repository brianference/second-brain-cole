# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

#### BUG-001: Navigation and Search Functionality Issues

**Issues Fixed:**
1. **Navigation links not working correctly**
   - Sidebar section selection was not filtering memories
   - The `currentSection` state was being set but never used to filter content
   - Now memories are properly filtered by source (mem0, supermemory, file, task) when selecting sidebar sections

2. **Search functionality issues**
   - Search query was being tracked in state but never applied to filter memories
   - Now search filters memories by title, content, and tags in real-time
   - Search status indicator shows current search query in the status bar

3. **Timeline view not filtering**
   - Timeline entries were not being filtered based on section or search
   - Now timeline entries are filtered alongside the grid view

**Technical Changes:**
- Added `useMemo` hooks for efficient filtering of memories and timeline entries
- Implemented `sectionToSource` mapping for sidebar section to source filtering
- Search now filters by title, content, and tags (case-insensitive)
- Both grid and timeline views now respect the current section and search filters

**Code Changes:**
- `app/page.tsx`: Added filtering logic for memories and timeline entries based on `currentSection` and `searchQuery`
- Used `useMemo` for performance optimization when filtering large datasets

**Deployment:**
- Deployed to: https://second-brain-cole.pages.dev
- Build: Successful
- All tests passing

---

## Previous Releases

*(Initial release notes to be added)*