# EcoSphere — System Workflows and User Interface Specification

EcoSphere (VerdantIQ) is a machine learning-driven Environmental Decision Support and Sustainability Intelligence Platform. This document outlines the end-to-end operational workflows of the system and details the application's pages, features, interactive actions, and underlying system behaviors.

---
 
## 1. System Roles and Access Control

To support institutional, community, and individual usage, the system defines three primary roles:

| Role | Description | Access Level |
| :--- | :--- | :--- |
| **Standard User** | Individuals or households logging activities, using the digital twin, optimization engine, and participating in challenges. | Personal Dashboard, Trackers, Digital Twin, Optimizer, Chat Assistant, Challenges. |
| **Institution Admin** | Representatives of educational campuses, organizations, or residential societies managing group metrics. | Institutional Dashboard, Member Management, Campus Challenge Builder, Verification Queue. |
| **System Admin** | Global administrators maintaining system integrity and service health. | Global Settings, ML Model Telemetry, Database Config, Global Audit logs. |

---

## 2. End-to-End System Workflows

The following Mermaid diagram illustrates the data flow and step-by-step processes within the EcoSphere platform, starting from user input to ML/AI analysis and verification:

```mermaid
graph TD
    %% Roles
    User([Standard User])
    InstAdmin([Institution Admin])
    
    %% Input and Tracking
    User -->|1. Register & Profile| Onboarding[Onboarding & Profile Wizard]
    Onboarding -->|Creates| Twin[Household Digital Twin]
    User -->|2. Log Activity| Log[Activity Tracker Page]
    
    %% Data Tier
    Log -->|Store Metrics| DB[(PostgreSQL & PostGIS Database)]
    Log -->|Upload Evidence| S3[(MinIO / S3 Object Storage)]
    
    %% Machine Learning & Optimization Services
    DB -->|Fetch History| MLService[FastAPI ML Service]
    MLService -->|Train & Predict| Predictions[XGBoost & scikit-learn Predictions]
    Predictions -->|Forecast Consumption| OptEngine[Google OR-Tools Constraint Solver]
    
    %% AI & Generation
    OptEngine -->|Optimal Tradeoffs| GenAI[GenAI OpenAI/Groq Connector]
    GenAI -->|Explanations & Reports| ExplainPanel[Explainable AI Engine]
    
    %% Frontend Rendering
    Predictions -->|Render Charts| UI[React Dashboard & Analytics]
    ExplainPanel -->|Render Suggestions| UI
    
    %% Challenge & Verification Loop
    User -->|3. Join Challenge & Upload Proof| VerifyPortal[Verification Portal]
    VerifyPortal -->|EXIF Metadata & QR Check| AuditQueue[Verification Queue]
    InstAdmin -->|4. Audit Evidence| AuditQueue
    AuditQueue -->|Approve Action| Rewards[Points & Leaderboard Engine]
    Rewards -->|Update Analytics| UI
```

### Core Workflows Details

#### Workflow 1: User Onboarding and Digital Twin Initialization
1. The user registers an account and fills out an initial questionnaire (number of household members, appliances in use, standard commute modes, average utility bills).
2. The React client submits this payload to the Spring Boot REST API.
3. Spring Boot writes the profile details to PostgreSQL and initializes the baseline **Household Digital Twin** structure.
4. The system calculates an initial baseline carbon footprint score to serve as a benchmark.

#### Workflow 2: Daily Activity Tracking & Logging
1. The user navigates to the tracker and inputs resource usage (e.g., electricity kWh, transport mileage, water volume, waste weights).
2. The user can optionally upload an image (e.g., utility bill or waste segregation photo) to PostgreSQL/S3.
3. The React app performs client-side validation and dispatches the log to Spring Boot.
4. Spring Boot persists the log entry and triggers asynchronous analytics updates.

#### Workflow 3: Behavioral Pattern Learning & Forecasting (ML Pipeline)
1. Every evening, the FastAPI microservice runs background routines to analyze user logging patterns.
2. An XGBoost model trains on historical utility logs to forecast energy, water, and transport consumption for the upcoming week and month.
3. The output predictions are stored in a Redis cache for sub-second retrieval times on the user dashboard.

#### Workflow 4: Sustainability Optimization & Simulation
1. The user navigates to the Optimizer page and sets optimization parameters (e.g., "Reduce carbon footprint by 15% under a budget of ₹1,500").
2. Spring Boot forwards these parameters along with predicted user habits to the FastAPI backend.
3. FastAPI invokes a Google OR-Tools constraint program to identify the mathematically optimal combination of sustainability actions (e.g., swapping to LEDs, reducing private commutes, implementing rainwater harvesting).
4. The generated recommendations are passed to the GenAI layer (OpenAI/Groq) to format them into natural, understandable guides.

#### Workflow 5: Eco Challenge Completion and Evidence Verification
1. The user joins a local sustainability challenge (e.g., "Cycle 15 km this week" or "Log 100% waste segregation").
2. Upon completing the challenge, the user uploads evidence (e.g., GPS track image, photos of segregated bins, or scans a location QR code).
3. The Spring Boot backend checks the uploaded file's EXIF metadata to verify matching geolocations (via PostGIS) and timestamps.
4. For community challenges, the evidence goes to the Institution Admin's verification queue. Once approved, rewards are disbursed and leaderboards update dynamically.

---

## 3. Application Page Specifications

Below is the detailed specification of all planned application pages, listing their features, interactive actions, and behind-the-scenes system behavior.

---

### Page 1: Onboarding & Carbon Profiling Wizard (`/onboarding`)
*   **Purpose**: Register new users, establish their sustainability baselines, and initialize their household digital twins.
*   **UI Components & Features**:
    *   Dynamic multi-step form progress tracker.
    *   Form widgets for household size, appliances count, energy billing info, dietary habits, and typical transport modes.
    *   Visual representation of the user's estimated initial carbon score comparison against national averages.
*   **Interactive Actions**:
    *   `Next / Previous`: Navigate form steps with validation.
    *   `Calculate Baseline`: Submits questionnaires to backend.
    *   `Submit`: Completes registration, redirects to dashboard.
*   **System Behavior (Under-the-Hood)**:
    *   Spring Boot receives profile questionnaire, parses parameters, and uses built-in conversion algorithms to compute initial footprint bounds.
    *   Creates a new household digital twin configuration record in PostgreSQL.

---

### Page 2: Personal Sustainability Dashboard (`/dashboard`)
*   **Purpose**: The central command center showing current sustainability status, quick logs, notifications, and AI assistant alerts.
*   **UI Components & Features**:
    *   Large, interactive central **Eco-Score Dial** indicating the user's weekly rating.
    *   **Resource Widgets** displaying real-time metrics for: Water, Electricity, Transport, Waste, and Rewards.
    *   **Risk Alerts Feed**: Live warnings about deteriorating sustainability habits (e.g., "Water usage is 20% higher than average this week").
    *   **Quick-Log Modal**: Pop-up card for immediate resource entry.
*   **Interactive Actions**:
    *   `Quick Log`: Opens the quick tracking modal.
    *   `Dismiss Alert`: Hides an alert, teaching the system user preference.
    *   `View Analytics`: Redirects the user to the details panel for that specific resource.
*   **System Behavior (Under-the-Hood)**:
    *   Fetches cached scores from Redis for optimal performance.
    *   Invokes the FastAPI recommendation ranker to prioritize tips shown in the dashboard sidebar based on user logs.

---

### Page 3: Daily Activity Tracker (`/tracker`)
*   **Purpose**: Allow manual data entry for all environmental actions and utility usage.
*   **UI Components & Features**:
    *   Categorized tabs: `[Transport]`, `[Electricity]`, `[Water]`, `[Waste]`, `[Tree Planting]`.
    *   Electricity/Water: Numerical inputs (kWh, gallons) or file upload area for utility bills.
    *   Transport: Map route picker or dropdown selection of vehicles (Electric car, Hybrid car, Gasoline, Bus, Bike, Walk) and distances.
    *   Waste: Scale weights or count sliders for Plastic, Organic, Paper, and Glass.
    *   Tree Planting: Form for sapling name, photo attachment, and auto-geolocation fetch.
*   **Interactive Actions**:
    *   `Upload Bill Document`: Extracts text using OCR APIs (or stores for admin auditing).
    *   `Fetch Current Location`: Requests browser location permission to pin coordinates.
    *   `Log Entry`: Submits form data to the backend.
*   **System Behavior (Under-the-Hood)**:
    *   Calculates carbon footprint additions on-the-fly based on conversion coefficients.
    *   Stores geolocations in PostgreSQL using PostGIS geometry columns to support spatial queries.

---

### Page 4: Behavioral Predictions & Analytics (`/analytics`)
*   **Purpose**: Display ML-driven predictive dashboards and explainable resource forecasts.
*   **UI Components & Features**:
    *   **Interactive Forecast Graphs** (using Apache ECharts): Dotted line charts showing predicted usage vs. solid lines for actual past usage.
    *   **Trend Highlights**: Text cards summarizing behavioral predictions (e.g., "Electricity usage predicted to spike by 15% next weekend due to temperature patterns").
    *   **Explainable AI Section**: Generative explanations on why scores changed and what factors influenced predictions.
*   **Interactive Actions**:
    *   `Toggle Range`: Filter graphs between 7 Days, 30 Days, or 6 Months.
    *   `Ask AI 'Why?'`: Opens dialog explaining specific consumption anomalies in normal text.
    *   `Export Data`: Generates CSV/Excel files of historical logs.
*   **System Behavior (Under-the-Hood)**:
    *   Spring Boot queries the FastAPI service for forecasted curves. FastAPI feeds historical logs into XGBoost models trained on this user's data.
    *   The GenAI layer combines model outputs and prompt templates to generate context-rich natural language explanations of the predicted anomalies.

---

### Page 5: Household Digital Twin & Simulation Lab (`/digital-twin`)
*   **Purpose**: Run virtual sustainability experiments to evaluate potential household upgrades.
*   **UI Components & Features**:
    *   Interactive floorplan schematic showing appliances, power sources, water systems.
    *   **Upgrade Library Panel**: List of simulated items (e.g., Solar Panel installation, LED Bulb conversion, Rainwater Harvester, Smart Thermostats).
    *   **Scenario Comparison Table**: Real-time evaluation dashboard showing: Est. Cost, Expected Carbon Offset, Water Saved, and ROI (Months).
*   **Interactive Actions**:
    *   `Add/Remove Upgrade`: Drags an upgrade into the active household simulator.
    *   `Configure Parameter`: Edits specific upgrade properties (e.g., square footage of solar panels).
    *   `Run Simulation`: Computes the hypothetical twin outcome.
    *   `Generate Comparative Report`: Requests the AI assistant to summarize the best financial-ecological path.
*   **System Behavior (Under-the-Hood)**:
    *   The digital twin simulator runs model calculations based on household properties.
    *   Uses mathematical coefficients scaled to the user's localized weather history (OpenWeather API integration) to predict solar output and rainwater collection rates.

---

### Page 6: Cross-Domain Optimization Engine (`/optimizer`)
*   **Purpose**: Find the best multi-resource saving strategy within budget and priority constraints.
*   **UI Components & Features**:
    *   **Constraint Form**: Sliders to set target monthly sustainability budget, energy reductions, and water targets.
    *   **Priority Toggles**: Weight sliders for carbon minimization, financial cost savings, and convenience.
    *   **Optimized Plan Display**: An automated, chronological action plan generated by the optimizer.
*   **Interactive Actions**:
    *   `Configure Priorities`: Adjust parameters and click "Generate Optimal Strategy".
    *   `Accept & Apply Plan`: Automatically converts optimized strategies into active personal goals in the Goal Planner.
*   **System Behavior (Under-the-Hood)**:
    *   Invokes Google OR-Tools on the FastAPI server, executing mixed-integer linear programming (MILP) to find the optimal combination of behavioral adjustments and hardware upgrades under constraints.
    *   Outputs are saved to the user's profile database.

---

### Page 7: Eco Challenges & Verification Portal (`/challenges`)
*   **Purpose**: Community-building page for users to compete in sustainability challenges and upload proof of completion.
*   **UI Components & Features**:
    *   **Available Challenges**: Grid of active cards (e.g., "Commute green for 5 consecutive days").
    *   **Individual & Group Leaderboards**: Ranks users and institutions based on points.
    *   **Verification Upload Console**: Form to select the challenge, input notes, upload image, or scan a location QR code.
*   **Interactive Actions**:
    *   `Join Challenge`: Opts into a challenge.
    *   `Scan QR Code`: Opens the device camera to read validation QRs at official eco-stations.
    *   `Upload Evidence`: Submits files and triggers EXIF analysis.
*   **System Behavior (Under-the-Hood)**:
    *   Spring Boot reads the uploaded image's EXIF data to verify that the timestamp and location match the challenge criteria.
    *   For institution-only challenges, it pushes the verification request into the queue of the Institution Admin.
    *   Distributes points and updates Postgres leaderboard tables upon approval.

---

### Page 8: AI Environmental Decision Assistant (`/assistant`)
*   **Purpose**: Provide a conversational chatbot that assists with sustainability decisions and explains environmental impacts.
*   **UI Components & Features**:
    *   Standard messaging panel with prompt bubbles.
    *   **Quick Query Chips**: One-click queries like "Which plastics can I recycle?", "Compare bicycle vs. train commute footprint for 20km".
    *   **Inline Chart Previews**: Renders charts directly within the chat window when explaining predictions.
*   **Interactive Actions**:
    *   `Send Message`: Sends user query.
    *   `Click Query Chip`: Immediately triggers a pre-set request.
    *   `Export Conversation`: Prints chat log.
*   **System Behavior (Under-the-Hood)**:
    *   Spring Boot routes queries to the OpenAI/Groq API, supplying a comprehensive context system prompt containing the user's current environmental stats, localized weather/AQI details, and platform capability schemas.

---

### Page 9: Community & Institutional Portal (`/community`)
*   **Purpose**: Provide transparency, reports, and rankings for organizations like universities or corporations.
*   **UI Components & Features**:
    *   **Institution Dashboard**: Displays campus-wide metrics (Total CO₂ avoided, trees planted, water recycled).
    *   **Campus-Wide Goals Tracker**: Shows progress towards institutional goals (e.g., "Reduce campus electricity by 10% by September").
    *   **Community Forums**: Discussion cards containing local sustainability ideas and events.
*   **Interactive Actions**:
    *   `Pledge Action`: Joins a community green pledge.
    *   `Create Event Listing`: Allows community members to submit clean-up or planting drives.
*   **System Behavior (Under-the-Hood)**:
    *   Spring Boot executes database aggregation queries (`SUM`, `AVG` grouped by institution ID) to supply real-time aggregated metrics.

---

### Page 10: Reports & Settings (`/settings`)
*   **Purpose**: Manage user details, configure target sustainability goals, and export PDF reports.
*   **UI Components & Features**:
    *   Form fields for password changes, profile data, and notifications setup.
    *   **Goal Planner Dashboard**: Interactive milestones editor.
    *   **Reports Hub**: List of past monthly sustainability reports.
*   **Interactive Actions**:
    *   `Save Settings`: Saves profile data.
    *   `Update Milestones`: Modifies monthly target savings.
    *   `Download PDF Report`: Triggers generation and download of a PDF statement.
*   **System Behavior (Under-the-Hood)**:
    *   `Download PDF Report` triggers Spring Boot's Apache PDFBox service, which aggregates historical data, ML prediction metrics, and AI-generated summaries into a highly formatted, print-ready PDF document stored temporarily in MinIO/S3.

---

### Page 11: Institution Admin Dashboard (`/admin/institution`)
*   **Purpose**: Allow institution admins to monitor campus-wide behavior, manage challenges, and audit user evidence.
*   **UI Components & Features**:
    *   **Members Directory**: List of registered users under this institution.
    *   **Auditing Desk**: Cards representing pending challenge submissions requiring manual review.
    *   **Challenge Creator Form**: Input panels to define a challenge name, duration, description, points reward, and verification rules (e.g., GPS metadata required, image required).
*   **Interactive Actions**:
    *   `Approve / Reject Evidence`: Validates user evidence submissions.
    *   `Launch Campus Challenge`: Saves and publishes a challenge to the campus portal.
    *   `Generate ESG Report`: Compiles organizational metrics into audit logs.
*   **System Behavior (Under-the-Hood)**:
    *   Spring Boot handles multi-tenant access checks to ensure an admin can only see or edit members and logs belonging to their own organization.

---

### Page 12: System Admin Console (`/admin/system`)
*   **Purpose**: Oversee global system configuration, model performance, and API consumption logs.
*   **UI Components & Features**:
    *   **System Health Telemetry**: CPU, memory, database connection pools, Redis latency statistics.
    *   **ML Model Telemetry Panel**: Lists scikit-learn and XGBoost model version statistics, average error rates, and last retraining times.
    *   **Global Variables Editor**: Editable matrix of environmental coefficients (e.g., kg of CO₂ per kWh of grid energy, per liter of gas, etc.).
*   **Interactive Actions**:
    *   `Trigger Model Re-training`: Forces FastAPI to fetch updated user history and run retraining routines.
    *   `Update Emission Factors`: Edits conversion parameters and flushes Redis caches to recalculate carbon metrics.
*   **System Behavior (Under-the-Hood)**:
    *   Spring Boot calls scheduler jobs or sends asynchronous commands via FastAPI REST API to start model training operations.

---

## 4. Design System & Premium Color Palette

To deliver a premium, state-of-the-art visual experience, EcoSphere adopts a modern, nature-inspired tech aesthetic. Below is the curated color palette using TailwindCSS configurations, HEX values, and HSL tokens.

### Theme: "Emerald Oasis" (Premium Light Mode Primary)

| Color Role | Color Name | Hex Code | HSL Value | Visual Representation & Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Accent** | Emerald Mint | `#059669` | `hsl(162, 93%, 30%)` | Main highlights, carbon scores, success badges, primary action buttons, active navigation states. |
| **Secondary Accent**| Forest Teal | `#0F766E` | `hsl(175, 77%, 26%)` | Navigation sidebars, section headers, secondary actions, chart graphics. |
| **Main Background** | Fresh Sage White | `#F3F7F5` | `hsl(150, 12%, 96%)` | Soft, low-strain sage-tinted off-white background canvas. |
| **Surface Card** | Pure Alabaster | `#FFFFFF` | `hsl(0, 0%, 100%)` | Dialog overlays, widgets, popup logging cards, with drop-shadow overlays. |
| **Text Primary** | Deep Charcoal | `#0F172A` | `hsl(222, 47%, 11%)` | Main headers, numeric stats, primary labels. |
| **Text Secondary** | Slate Gray | `#475569` | `hsl(215, 16%, 35%)` | Subtext, unit annotations (e.g., "kg CO₂"), time labels, inactive states. |
| **Alert / Warning** | Amber Sun | `#D97706` | `hsl(35, 92%, 44%)` | Moderate footprint warnings, upcoming goal deadlines. |
| **Alert / Danger** | Crimson Red | `#DC2626` | `hsl(0, 72%, 51%)` | Critical carbon footprint spikes, failed challenges, high-waste notifications. |
| **Alert / Success**| Lime Forest | `#4D7C0F` | `hsl(84, 80%, 27%)` | Completed challenges, met goals, reward notifications. |
