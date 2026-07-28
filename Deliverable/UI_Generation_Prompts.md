# EcoSphere — Spatial UI Generation Prompts (AI + Canvas Spec)

This document contains copy-pasteable, highly detailed prompts to generate the React frontend for the EcoSphere platform. It replaces traditional navigation interfaces (sidebars, menus, footers) with an **AI Omnibar + Spatial Workspace Canvas** layout. The styling uses the **Emerald Oasis** Light Mode theme.

> [!NOTE]
> **Backend Service Integration Status (Phases 0–10 Completed ✅)**:
> All workspace nodes specified in Part 2 below are fully wired to production-ready microservice REST endpoints:
> - **Spring Boot Core (`:8080`)**: Auth, Onboarding Baseline, Activity Logs, OCR Bill Reader, PDF Statements, Community Aggregations, EXIF Verification, Notifications & Real-Time SSE Stream (`/api/v1/notifications/stream`), Pre-Shaped Chart Data & System Telemetry (`/api/v1/admin/telemetry`).
> - **FastAPI ML & Solvers (`:8000`)**: XGBoost Consumption Forecasts, Scikit-learn Anomaly Explanations, Google OR-Tools MILP Solver, ML Pipeline Telemetry (`/api/v1/ml/telemetry`).
> - **Groq AI Layer**: Context-Grounded Llama-3.3 Assistant (`/api/v1/assistant/chat`).

---


## Part 1: Master Theme & Spatial Workspace Canvas Prompt
*Use this prompt first to generate the fullscreen interactive canvas, the floating Groq AI Omnibar, and the spatial zoom/pan mechanics.*

```text
Act as a senior frontend engineer. Build a fullscreen, interactive Spatial Canvas Workspace UI shell in React + Tailwind CSS for "EcoSphere", a premium sustainability intelligence platform, using the "Emerald Oasis" Light Mode design system.

1. Eliminate Traditional Layouts:
- DO NOT use traditional sidebars, top headers, footers, hamburgers, or menu bars. The workspace should look like an endless visual sandbox (similar to Figma or Miro).

2. Fullscreen Spatial Canvas Layout:
- Base: Fullscreen container `w-screen h-screen overflow-hidden bg-[#F3F7F5] (Fresh Sage White)` featuring a subtle SVG background dot grid (`bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]`).
- The user can pan (click-and-drag) and zoom (mouse scroll) the workspace.
- The platform pages float as large, visually interconnected card-nodes:
  * Central Node: Personal Dashboard
  * Satellites (clustered in orbit around center): Onboarding Wizard, Daily Activity Tracker, Predictions & Analytics, Digital Twin Lab, Optimization Engine, Eco Challenges, Community Portal, Settings, Admin Console.
- Render thin, glowing organic SVG paths (`stroke-[#0F766E]/20` with animation dashes) connecting the Daily Activity Tracker node to the Predictions Node, and the Predictions Node to the Optimization Node, visualizing the data flow.

3. Spatial Zoom & Focus Mechanics:
- When a user clicks or double-clicks a floating Node, the canvas smoothly pans and zooms (`scale-[1]`) to center and focus that node on screen, while adding a blur backdrop (`backdrop-blur-sm`) to surrounding cards.
- While focused, display a soft floating "Exit to Workspace" (pinch-out icon) button at the top-left of the screen to zoom out to the bird's-eye canvas view (`scale-[0.25]`).

4. Central Floating AI Omnibar (Groq Powered):
- Anchor a premium floating search/conversation input bar at the bottom-center of the viewport (`fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md shadow-xl border border-slate-200/80 rounded-full w-full max-w-2xl px-6 py-4 flex items-center gap-4 z-50`).
- Features a glowing green Groq status badge, mic input icon, and text query field.
- Navigator behavior: Typing "go to Twin Lab" initiates a smooth canvas pan and zoom animation focusing on the Digital Twin Node.
- Action behavior: Typing "log 5 miles walk" highlights the Tracker Node with a neon-green pulse and flashes a success toast saying "+10 Points saved".
```

---

## Part 2: Workspace Node UI Prompts

---

### Node 1: Onboarding & Carbon Profiling Wizard Node
```text
Build the Onboarding & Carbon Profiling Wizard Workspace Node for EcoSphere.

1. Canvas Presentation:
- Zoomed-out scale: Shows up as an active capsule labeled "Step 1: Get Started — Compute Carbon Baseline" with a pulsing Emerald Mint outline.
- Zoomed-in scale: Expands to a clean 4-step wizard card (`w-[500px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg`):
  - Step 1: House members and typical diet selector buttons (Vegan, Vegetarian, Mixed).
  - Step 2: Numeric input fields for average electric and water bills.
  - Step 3: Vehicle transit mode tiles and miles sliders.
  - Step 4: Loading screen with a green circular spinner, transforming into a baseline carbon dashboard comparison gauge.

2. Canvas Action:
- Completing the baseline automatically unlocks connecting glowing visual lines to the Main Dashboard and Digital Twin nodes on the canvas.
```

---

### Node 2: Personal Dashboard Node (Center Hub)
```text
Build the Personal Dashboard Node, which sits at the center of the EcoSphere spatial canvas.

1. Layout & Styling:
- Card Dimensions: `w-[750px] bg-white rounded-3xl border border-slate-200/60 p-8 shadow-xl`.
- Central Element: A large, interactive radial Dial indicating the user's weekly Eco-Score (current score: 68 out of 100, colored green to red gradient).
- Metrics Grid: 3 small interactive widgets displaying:
  - Electricity widget: kWh usage with a subtle Amber warning badge.
  - Water widget: Gallons usage progress bar.
  - Transport widget: Gasoline vs Green mileage split.
- Live Feed Overlay: A list of dynamic AI Risk alerts (e.g. "Water consumption is 20% higher than your daily limit. Tap to optimize").

2. Navigation:
- Clicking any widget pans and zooms the canvas directly to its detailed tracking or forecasting node.
```

---

### Node 3: Daily Activity Tracker Node
```text
Build the Daily Activity Tracker Node designed to receive inputs both manually and via the AI Omnibar.

1. Design & Layout:
- Card Dimensions: `w-[700px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg`.
- Tabbed interface switcher: [Transport, Energy, Water, Waste, Trees].
- Transport: Vehicle mode dropdown (gasoline, EV, bicycle, walking) and distance slider.
- Energy/Water: Input values for kWh or Gallons, and a drag-and-drop utility bill OCR uploader slot.
- Waste: Sliding weight scales for Organic, Plastics, and Paper.
- Trees: Upload photo preview and coordinates text block.

2. Omnibar Integration:
- Include a visual green flash animation (`animate-pulse`) on the inputs when they are successfully auto-filled by commands from the central AI Omnibar.
```

---

### Node 4: Behavioral Predictions & Analytics Node
```text
Build the Behavioral Predictions & Analytics Workspace Node.

1. Presentation:
- Card Dimensions: `w-[800px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg`.
- Analytics graphs displaying actual history as a solid Forest Teal line, and XGBoost predictions as a dotted Emerald Mint line.
- A card toggle for [7 Days, 30 Days, 6 Months].

2. Explainable AI Drawer:
- A toggleable drawer at the bottom of the card displaying human-readable reasoning: "Your score decreased because transport emissions spiked by 42%. Reducing one car trip this week is predicted to return you to your goal."
- Link back: A button labeled "Ask Omnibar to solve this" that focuses focus on the central AI Omnibar with prepopulated query text.
```

---

### Node 5: Household Digital Twin & Simulation Node
```text
Build the Household Digital Twin & Simulation Workspace Node.

1. Interface Sandbox:
- Card Dimensions: `w-[900px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg flex gap-6`.
- Left Side: Interactive 2D schematic of a house (Roof, Garage, Kitchen). Hovering over areas highlights upgrade slots.
- Right Side: Checklist of upgrades: [Solar Panels (5kW), Swap to LEDs, Rainwater Tank, EV Smart Charger].
- Bottom Panel: Real-time scenario calculator displaying estimated cost, carbon offsets, water savings, and ROI duration in months.

2. Canvas Feedback:
- Adding or removing items visually places icons (e.g. little solar panels, green lightbulbs) onto the 2D house schematic.
```

---

### Node 6: Cross-Domain Optimization Engine Node
```text
Build the Cross-Domain Optimization Engine Node.

1. Configuration Panel:
- Card Dimensions: `w-[750px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg`.
- Input parameters: Monthly target budget slider ($0 - $500), optimization goals (Carbon minimization vs Cost savings).

2. Output Timeline:
- Renders an automated, step-by-step roadmap generated by the Google OR-Tools engine.
- Steps appear as a visual timeline of recommended investments: "1. Install LEDs ($40) -> 2. Switch to public transit on Tuesdays -> 3. Add Rainwater Harvester next month".
- Click "Apply Goals" to synchronize with the dashboard node.
```

---

### Node 7: Eco Challenges & Verification Node
```text
Build the Eco Challenges & Verification Workspace Node.

1. Layout Elements:
- Card Dimensions: `w-[800px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg flex gap-6`.
- Left Side: Active Challenge grid (e.g., "Commute green for 5 days"). Displays points, time remaining, and joining action.
- Right Side: Verification desk. Drag-and-drop file slot for photos, timestamp displays, and a mock QR-Code validation scanner popup.
- Leaderboard sidepanel showing personal and group standings with green badge icons.
```

---

### Node 8: Groq Conversational Assistant Node
```text
Build the expanded Groq Conversational AI Assistant interface node.

1. Layout Integration:
- Card Dimensions: `w-[650px] h-[550px] bg-white rounded-2xl border border-slate-100 p-6 shadow-lg`.
- Chat panel with scrollable messages.
- The interface expands directly beside whichever workspace card the user currently focuses, acting as a side-by-side split screen decision assistant.

2. Features:
- Render structured markdown tables, bullet items, and micro-charts directly within the assistant's speech bubbles.
```

---

### Node 9: Community & Institutional Portal Node
```text
Build the Community & Institutional Portal Node.

1. Canvas Presentation:
- Situated to the top-right of the dashboard.
- Displays campus/society aggregated statistics (Total CO₂ avoided, trees planted).
- Department ranking bar charts.
- Clicking "Pledge" adds the user's details to the public scrollboard.
```

---

### Node 10: Reports & Settings Node
```text
Build the Reports & Settings Workspace Node.

1. Form Layout:
- Card Dimensions: `w-[600px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg`.
- Configuration forms for goal thresholds and alerts thresholds.
- Monthly PDF archive grid listing generated reports with immediate download triggers.
```

---

### Node 11: Institution Admin Dashboard Node
```text
Build the Institution Admin Dashboard Node.

1. Administration Tools:
- Card Dimensions: `w-[900px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg`.
- Auditing desks listing pending user challenge uploads. Clicking a request reveals geotag map matches, uploaded images, and time tags.
- Action triggers: "Approve" (Green) and "Reject" (Red) buttons.
- Challenge builder panel to deploy campus-wide events.
```

---

### Node 12: System Admin Console Node
```text
Build the System Admin Console Node.

1. Details & Panel:
- Card Dimensions: `w-[950px] bg-white rounded-2xl border border-slate-100 p-8 shadow-lg`.
- Telemetry grids showing system health, MongoDB latency, and scikit-learn/XGBoost model training error stats.
- Variable configuration matrices (kg CO₂ coefficients) with immediate database updates.
- "Retrain ML Models" run scheduler triggers.
```
