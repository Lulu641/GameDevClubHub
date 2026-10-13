# AI Usage Log

## October 13, 2026 — React task board checkpoint

This is a draft record of assistance, not a completed student verification entry.

- **Asked:** Help continue GameDevClubHub by inspecting `client`, choosing a small verifiable feature, and keeping a truthful AI log.
- **Got:** Repository inspection and a local React task board with three sample tasks, completion/reopen buttons, a derived count, and a walkthrough. The assistant found the committed Vite starter and no backend or database. Exact M3–M4 requirements remain unconfirmed.
- **Fixed:** Pending my review. I have not yet reported a correction or rejection. After reviewing, record the exact change I made and why, or truthfully say I accepted the draft unchanged and explain the code I checked.
- **Verified:** Assistant checks: production build and lint passed; browser count went 0 → 1 → 2 → 1 after completing two tasks and reopening one with Enter; the third task stayed unchanged; refresh reset all tasks to 0; no browser warnings/errors were captured. My own verification is pending. Add my actual results after running the checklist in `BUILD_CHECKPOINT.md`; do not present the assistant's checks as mine.

## October 13, 2026 — React Router step

- **Asked:** Add only React Router, Dashboard/Tasks/About pages, and navigation without full-page reloads. Explain the files and how I can verify it; do not commit or push.
- **Got:** React Router installed; BrowserRouter around App; a navigation bar using Link; Routes connecting `/`, `/tasks`, and `/about` to separate page files; the previous task board moved to Tasks; a simple unknown-URL fallback; and a navigation walkthrough.
- **Fixed:** Pending my personal review. Record any exact change or rejection and why. If I accept the implementation unchanged, say that honestly and describe the code I reviewed.
- **Verified:** Assistant checks: build and lint passed; route rendering checks confirmed all three page headings and navigation links, plus the unknown-URL fallback; HTTP checks confirmed Vite serves the app at all three direct URLs. The app's browser policy blocked the assistant's local preview, so live clicks, Back/Forward, and proof of no document reload remain unverified by the assistant. My own browser checks are pending; record actual observations from `ROUTER_CHECKPOINT.md` here.

## October 13, 2026 — Remaining M3–M4 work

The following four requests were handled together after I asked the assistant to finish the remaining work. These entries record actual outputs, not separate prompts I have to submit later. Personal Fixed/Verified fields remain pending.

### Reusable component and props

- **Asked:** Finish the TaskCard milestone with title, description, completion status, and props; keep the code beginner-friendly.
- **Got:** `client/src/components/TaskCard.jsx`; Tasks passes each card title, description, completed, and an onToggle callback. The card displays the passed information and calls the callback when clicked.
- **Fixed:** Pending personal review. Record any change or rejection and the reason; if I accept it unchanged, say so honestly.
- **Verified:** Assistant test confirmed a custom card displays its supplied description/status and calls its supplied callback once. Build and lint passed. Pending personal verification.

### Completion state and counter

- **Asked:** Finish useState task completion with an immediate completed-task count and immutable updates while keeping routing working.
- **Got:** State moved into App so it survives route changes. The functional setter maps to a new array and copies the changed task. Tasks derives the count from the current task data. Assistant fixed the prior behavior where leaving Tasks reset completion.
- **Fixed:** Pending personal review. The cross-page state fix was made by the assistant, not by me.
- **Verified:** Assistant tests completed two tasks, reopened one, checked the count and untouched tasks, confirmed frozen imported data was not mutated, and confirmed completion survives navigation. A whole-app remount resets demo state as expected. Pending personal verification.

### JSON and dynamic rendering

- **Asked:** Create at least five realistic club assignments in JSON and render them with .map(), maintaining state and routing.
- **Got:** `client/src/data/tasks.json` with five tasks. App imports it as initial state; Tasks maps the current tasks into TaskCard components with stable ID keys. The old hardcoded array was removed.
- **Fixed:** Pending personal review. Review the sample assignments and record any wording I actually change.
- **Verified:** Assistant tests confirmed at least five valid tasks with unique IDs and that every JSON title/description appears in the rendered list. Pending personal verification.

### Final review, testing, and saved work

- **Asked:** Review all five checklist items, run checks, fix errors, document actual assistance, and save the project without committing or pushing.
- **Got:** Milestone review in `MILESTONE_WRAPUP.md`, updated README, test script and seven meaningful tests, truthful log entries, and a complete source package. No Express or SQLite implementation; no commits or pushes.
- **Fixed:** Pending personal review. I have not yet reported a correction, rejection, or acceptance after reviewing the final implementation.
- **Verified:** Assistant ran production build, Oxlint, and the complete Vitest suite: build passed, lint passed, 7/7 tests passed. These were automated checks using a simulated DOM. The app's browser policy prevented live preview testing; real navigation, Back/Forward, keyboard checks, console inspection, and the Network-panel reload check remain pending. Pending personal verification and transfer into my Codespace/GitHub workflow.

