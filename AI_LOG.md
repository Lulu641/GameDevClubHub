# GameDevClubHub — Complete AI Usage Log
# Code2College | AI Engineering | Full Stack Web
# Project: GameDevClubHub
# Dates: October 13–15, 2026 (so far)
## AI tools used: ChatGPT and Codex

I verified everything on my own time and reviewed any code created by Codex or ChatGPT.

## October 13, 2026 — Session 2

### Entry 1 — React Task Board

**What I asked AI:**
I asked Codex to review my existing GameDevClubHub project and help me create a functional task management system using React.

**What AI provided:**
Codex created a basic task board with three sample tasks, completion buttons, and a counter that updates when tasks are completed.

**What was fixed:**
The original project was a basic Vite starter. Codex added the task board functionality.

**How it was verified:**
Codex successfully ran build and lint checks. Automated testing confirmed the completed-task counter updated correctly. I also personally reviewed the implementation and tested the task board to confirm that tasks displayed properly and the completion counter responded correctly when tasks were marked complete or reopened.

### Entry 2 — React Router

**What I asked AI:**
I asked Codex to add React Router so users could navigate between the Dashboard, Tasks, and About pages without completely reloading the website.

**What AI provided:**
Codex installed React Router, created the three pages, and added navigation links.

**What was fixed:**
The project previously lacked page routing. Codex implemented navigation while preserving the existing task board.

**How it was verified:**
Codex successfully ran build and lint checks and verified that all three routes rendered correctly. I independently tested the navigation between Dashboard, Tasks, and About in my browser. I confirmed that each page loaded correctly, navigation worked without full-page reloads, and the existing task board remained functional.

### Entry 3 — Reusable React Components

**What I asked AI:**
I asked Codex to create a reusable TaskCard component that uses props to display task information.

**What AI provided:**
Codex created a TaskCard component displaying task titles, descriptions, and completion status.

**What was fixed:**
Task information was moved into reusable components instead of repeating the same interface code.

**How it was verified:**
Codex tested that TaskCard displayed the correct information and responded to its callback. I reviewed the component code and verified that task titles, descriptions, and completion statuses appeared correctly. I also tested the completion buttons to confirm that each task responded independently.

### Entry 4 — React State Management

**What I asked AI:**
I asked Codex to use React's useState to manage task completion and update the completed-task counter.

**What AI provided:**
Codex implemented state management that updates tasks immediately when they are completed or reopened.

**What was fixed:**
Codex corrected an issue where navigating away from the Tasks page reset task completion.

**How it was verified:**
Automated tests confirmed that task completion updated correctly and remained consistent while navigating between pages. I also manually completed and reopened tasks, checked that the counter updated immediately, and navigated between pages to confirm the completion state was preserved. I reviewed the state management code to understand how useState handled these updates.

### Entry 5 — JSON Data and Dynamic Rendering

**What I asked AI:**
I asked Codex to create a JSON file containing realistic Game Development Club assignments and display them dynamically using .map().

**What AI provided:**
Codex created five sample club assignments in JSON and connected them to the task board.

**What was fixed:**
The previous hardcoded task array was replaced with JSON-based data.

**How it was verified:**
Codex confirmed that all five tasks appeared correctly and had unique IDs. I personally reviewed the JSON file and compared its contents with the tasks displayed in the application. I confirmed that all five assignments rendered correctly and that the .map() implementation displayed the task information as expected.

### Entry 6 — Testing and Project Review

**What I asked AI:**
I asked Codex to review the project's requirements, check for errors, run tests, and update the documentation.

**What AI provided:**
Codex added automated tests, updated the README, and documented the project's milestone progress.

**What was fixed:**
Codex improved test coverage and project documentation.

**How it was verified:**
The production build and lint checks passed, along with all seven automated tests. I independently reviewed the project files, checked the documentation, and manually tested the implemented features in my browser. I confirmed that the task board, navigation, and completion functionality worked as expected.

---

## October 15, 2026 — Session 3

### Lesson 10: Feature Complete and Verification

### Entry 7 — Dynamic Task Rendering (M4)

**What I asked AI:**
I asked Codex to improve the existing task board by displaying task information dynamically, including titles, descriptions, statuses, and estimated effort points.

**What AI provided:**
Codex updated the task data and reused the existing TaskCard component to display information through React props and .map().

**What was fixed:**
Codex simplified task status management and removed redundant completion data.

**How it was verified:**
Automated tests confirmed that task information rendered correctly, task IDs were unique, and no console warnings occurred during the tested interactions. I also manually reviewed the updated task data and checked that titles, descriptions, statuses, and effort points displayed correctly in the application. I verified that the information matched the underlying data and that the reusable components continued functioning properly.

### Entry 8 — Interactive Task Management (M4)

**What I asked AI:**
I asked Codex to implement adding, removing, completing, and reopening tasks using React state. I also requested live task counts and an empty-state message.

**What AI provided:**
Codex created an interactive task form, task controls, and live statistics displaying task counts and estimated effort points.

**What was fixed:**
Codex added form validation to prevent invalid task information and ensured state updates were handled correctly.

**How it was verified:**
Automated tests confirmed that tasks could be added, removed, completed, and reopened. The tests also checked input validation and the empty state. I personally tested these features by adding tasks, changing their completion status, and removing them. I checked that the task counts and effort totals updated correctly after each action. I also verified that invalid form inputs were rejected and that the empty-state message appeared when no tasks remained.

### Entry 9 — Express Backend and API (M5)

**What I asked AI:**
I asked Codex to create a Node.js and Express backend that provides task data through an API and connects to my React frontend.

**What AI provided:**
Codex created an Express server with a /api/tasks endpoint returning JSON. It also connected the frontend using fetch() and added loading and error handling.

**What was fixed:**
Codex corrected a JSON-loading issue discovered during integration testing.

**How it was verified:**
Codex tested the API using real HTTP requests and confirmed it returned the expected five tasks. Additional tests confirmed error handling and successful frontend integration. I independently reviewed the backend implementation and verified that the application successfully received and displayed task data from the API. I also checked the API response to confirm that it returned valid JSON containing the expected task information.

### Entry 10 — Dashboard Integration and UI Improvements

**What I asked AI:**
I asked Codex to connect the dashboard to the task management system and improve the website's responsiveness, accessibility, and design.

**What AI provided:**
Codex added live statistics showing total tasks, completed tasks, remaining tasks, and estimated effort points. It also improved the layout and interface elements.

**What was fixed:**
Codex ensured dashboard statistics were calculated from the current task data instead of using separate counters.

**How it was verified:**
Automated tests confirmed dashboard information updated correctly when tasks changed and remained consistent during navigation. I manually tested the dashboard by adding, completing, reopening, and removing tasks. I verified that the total, completed, remaining, and effort statistics updated correctly. I also reviewed the layout and navigation in my browser to ensure the interface displayed properly and remained functional.

### Entry 11 — Final Verification and Documentation

**What I asked AI:**
I asked Codex to verify the M4–M5 requirements, run all available tests, fix errors, and update the AI usage log and project documentation.

**What AI provided:**
Codex expanded the automated tests, added backend integration testing, updated the README, and documented the project's acceptance criteria.

**What was fixed:**
Codex resolved linting problems, an API integration issue, and a React state update warning.

**How it was verified:**
Codex reported the following results:

- Production build: Passed
- Lint checks: Passed
- Frontend and integration tests: 26 passed
- Backend tests: 2 passed
- Total automated tests: 28 passed
- API response: HTTP 200, valid JSON
- Git changes: No commits or pushes

In addition to Codex's automated testing, I personally reviewed the completed project and manually verified the implemented features against the acceptance criteria. I tested task creation, removal, completion, navigation, dashboard statistics, and data rendering. I also reviewed the frontend and backend code to understand the changes made by AI. My manual testing confirmed that the features worked as expected, and I completed my final review of the application.

---

## Final AI Usage Reflection

Throughout these sessions, I used ChatGPT to help plan development tasks and Codex to implement and test features in my GameDevClubHub application.

AI assisted with React components, routing, state management, JSON data, an Express backend, and automated testing. The biggest improvements were turning the original starter application into an interactive task management system and connecting it to a functioning API.

Codex also helped identify and correct programming issues during development. However, I did not rely solely on AI-generated results. I personally reviewed the code and independently tested the application's functionality to confirm that the implemented features met the project's requirements.

Through this process, I gained a better understanding of how React components, state management, routing, and backend APIs work together in a full-stack application. I also learned the importance of verifying AI-generated code instead of assuming that it works correctly.

I have completed my manual verification of the project's current features and reviewed the acceptance criteria. My next step is to prepare GameDevClubHub for Project Demos and make any final adjustments needed before presenting.
