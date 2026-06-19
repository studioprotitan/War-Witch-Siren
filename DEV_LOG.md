# GENESIS VERSE — SYSTEM DEV LOG & ROLLBACK REGISTRY

This dev log serves as a persistent historical record of the system's architecture, feature rollouts, and version states. It outlines specific structural checkpoints and rollback procedures in case of runtime variance or critical service failures.

---

## 🛠️ CORE SYSTEM ARCHITECTURE Overview

The application functions as a highly-polished, full-stack hybrid platform:
1. **Frontend (React v18 + Vite)**: Renders the active reactor workspace (including interactive spatial controls, threat heatmaps, dynamic layout visualizations, and narrative logs) and embeds micro-views.
2. **Backend (Express + Tsx/Esbuild)**: Houses API proxying routes, handles static file resolution, and controls the production-bundled CommonJS server entrypoint (`dist/server.cjs`).
3. **Dedicated Interactive Subfields**:
   - **Janes Golem MFG (`/src/components/JanesGolemGuide.tsx`)**: Specialized Golem blueprint assembly workspace.
   - **Forge Deploy Tab (`/public/CST_Character_Viewer_Controller.html`)**: Babylon.js 3D character inspector with an integrated player controller and keybound skeletal/animation state machines.

---

## 📅 VERSION RELEASE REGISTRY & INTEGRATION REGISTER

### [v2.1.0] — Environment Chamber Backdrop Customizer (Current Production Head)
* **Timestamp**: 2026-06-18T11:40:00-07:00
* **Commit Reference**: `HEAD` (Integration of background environment controls)
* **Changes Delivered**:
  - Implemented dynamic background controls within the `ThreeDimensionalViewer` control panel footer.
  - Registered 5 preconfigured chemical/atmospheric chamber backdrops: Abyss (#0d0b08), Slate (#0b0f19), Warm (#180808), Nebula (#10081c), and Moss (#08120b).
  - Provided a native, high-fidelity color picker offering infinite custom `#HEX` background configuration.
  - Linked background values dynamically into offscreen scaling canvas elements to preserve matching environment backgrounds during high-resolution snapshot capture and PNG export cycles.

### [v2.0.0] — Spatial Measurement Overlay & Dimensional Bounds
* **Timestamp**: 2026-06-18T08:15:00-07:00
* **Commit Reference**: `HEAD` (Integration of spatial measurement overlays)
* **Changes Delivered**:
  - Built an approximate spatial calculation engine to calculate model height, width, and depth bounds using 1.5x scaling metrics to project physical sizing in real-world meters.
  - Engineered an interactive, modular `#measurement-overlay-status-card` panel within the 3D HUD featuring a toggle system (`showMeasurements`) to mute or project guidance curves.
  - Programmed a 3D bounding wireframe overlay rendering 12 calculated edges directly onto active canvas rendering loops with custom labels aligned at projected vertical and horizontal midpoints.

### [v1.9.0] — Ambient World Resonance & Synapse Dispatcher
* **Timestamp**: 2026-06-17T04:45:00-07:00
* **Commit Reference**: `HEAD` (Integration of Ambient audio & Enter Forge sweep)
* **Changes Delivered**:
  - Engineered direct interactive synthesizers and LFO modulators in `/src/components/HeroLandingPage.tsx` using Web Audio API to play low-frequency machinery hums and atmospheric resonations on first page-interaction.
  - Placed an elegant header toggle button `[ AMBIENCE ACTIVE ]` with custom neon reactive state lights helping users control sound states easily.
  - Spliced dramatic rising frequency sweeps, high resonant "Ping" signals, and bass gravitational drops on "Enter the Forge" CTA trigger on-click.
  - Added a highly-styled asynchronous worldlands generation screen, visualizing progress bars, loaded milestones, and Ley line synchronization milestones over a 1.2-second progression.

### [v1.8.0] — Faction Legend Registry & Matrix Key
* **Timestamp**: 2026-06-17T04:38:00-07:00
* **Commit Reference**: `HEAD` (Integration of Faction Legend context view)
* **Changes Delivered**:
  - Designed the interactive `⬥ FACTION KEY` popup overlay inside the "Decrypted Anomalous Memory Logs" panel context.
  - Registered 9 distinct cognitive network factions (CST, ERT, SWC, SFG, COR, AST, GWC, STC, SBM) mapped with exact colored signature dots, acronyms, and detailed lore role definitions.
  - Spliced transition dynamics into the state `isFactionLegendOpen` toggle allowing users to swap between standard memory tracks and the faction index key instantly.

### [v1.7.0] — Low-Frequency Decryption Hum immersion
* **Timestamp**: 2026-06-17T04:35:00-07:00
* **Commit Reference**: `HEAD` (Hum immersion Sound Effect)
* **Changes Delivered**:
  - Configured custom interactive audio generator `playDecryptionHum` exploiting browser Web Audio native APIs.
  - Spliced harmonic sine/triangle wave profiles and automated logarithmic volume envelopes to construct a gentle 60Hz power grid hum on decryption logging events.
  - Hardened play limits to ignore browser security or system blocks cleanly via graceful `try {} catch` structures.

### [v1.6.0] — Ley Line Resonance Visualizer
* **Timestamp**: 2026-06-17T04:33:00-07:00
* **Commit Reference**: `v1.6.0` (Integration of Ley Line Resonance overlay)
* **Changes Delivered**:
  - Engineered 'Ley Line Resonance' overlay layered directly on top of the Transmutation image viewport.
  - Programmed fluid SVG tracks with custom wavy keyframe movements (`leyWave1`, `leyWave2`) and concentric pulse ring animations.
  - Linked the filter animation base state dynamically to the active character's 'psi' power rating using inline custom styling variables (`--psi-hue`) mapped via `parsePsiToHue`.

### [v1.5.0] — Microsecond Formatted Decrypted Logs
* **Timestamp**: 2026-06-17T04:30:00-07:00
* **Commit Reference**: `HEAD` (Integration of Decoded Timestamps)
* **Changes Delivered**:
  - Engineered direct UTC extraction matching the requested `14:32:05 UTC` pattern using standard date handlers.
  - Linked the live display directly into the "Decrypted Anomalous Memory Logs" section inside `src/App.tsx`.

### [v1.4.0] — Hero Landing Page & Cognitive Gate
* **Timestamp**: 2026-06-17T04:25:00-07:00
* **Commit Reference**: `HEAD` (Integration of Hero Landing Page)
* **Changes Delivered**:
  - Engineered the highly-styled modular landing page in `/src/components/HeroLandingPage.tsx`.
  - Configured the static asset asset representation using `/public/genesis-verse-hero-page-a.png`.
  - Implemented the `hasEntered` gating state within `/src/App.tsx` ensuring users are first visually welcomed before entering the core Abyssum Reactor dashboard.
  - Programmed high-fidelity aesthetic enhancements, including custom animations, glowing layout accents, and an interactive "Enter the Forge" trigger CTA.
* **Verification Status**: Passed visual quality checks and production compiled successfully.

### [v1.3.0] — Forge Deploy Integration
* **Timestamp**: 2026-06-17T04:10:00-07:00
* **Commit Reference**: `v1.3.0` (Integration of CST Character Viewer)
* **Changes Delivered**:
  - Provisioned the public folder static page `/public/CST_Character_Viewer_Controller.html` to load a 3D field unit view.
  - Linked the sub-context to a responsive navigation tab (`activeTab: 'forgeDeploy'`).
  - Embedded the Babylon.js simulation suite via a secure sandbox `<iframe>` with full peripheral input support.
* **Verification Status**: Passed `tsc --noEmit` and production compiled successfully.

### [v1.2.0] — Train Route Radar & Incident Heatmap Refinement
* **Timestamp**: 2026-06-16T14:30:00-07:00
* **Changes Delivered**:
  - Added periodic incursion-pulse animations to active hazard sectors overlaying the Train Route Radar SVG coordinates.
  - Linked satellite sub-nodes (Depot, Yard, Junction) for the selected train station directly to active layline vectors.
  - Rendered hover details via relative-positioned tooltips mirroring live synchronization stats and station authority levels.

### [v1.1.0] — Decrypted Memory Logs & Multi-Faction Filtering
* **Timestamp**: 2026-06-16T14:22:00-07:00
* **Changes Delivered**:
  - Engineered selective dropdown sorting inside the Anomalous Memory Logs dashboard.
  - Enabled instant sorting partitions for factions (`SIREN WITCH CORPS`, `CST — ERT TEAM`).

### [v1.0.0] — Genesis Baseline Setup
* **Timestamp**: 2026-06-16T11:00:00-07:00
* **Changes Delivered**:
  - Initialized Express-Vite full-stack loop binding to Port 3000.
  - Added Lucide React dashboard icon sets, Tailwind core style imports, and basic reactor field workspace views.

---

## 🔄 BACKREST / ROLLBACK RECOVERY INSTRUCTIONS

In case of runtime faults or deployment regression, utilize this guide to return to stable system states.

### Step 1: Identify Target Release State
Review the registry above and select the correct targeting hash or version tag.

### Step 2: Roll Back Frontend Code States
If returning to **v1.8.0 (Pre-ambient audio & transition loading)**:
1. Revert files matching changes in `/src/components/HeroLandingPage.tsx`:
   - Delete state hooks `isAudioActive`, `isAssembling`, and `assemblyProgress`.
   - Take out references/refs to `AudioContext`, `oscillators`, and `gainNodes`.
   - Remove helper audio synthesis functions `startAmbience`, `stopAmbience`, `toggleAmbience`, and `playEnterForgeSoundscape`.
   - Remove the `isAssembling` ternary loader screen and replace buttons with direct `onEnter` callback handlers.

If returning to **v1.7.0 (Pre-faction legend view)**:
1. Revert files matching changes in `src/App.tsx`:
   - Delete the state variable hook `isFactionLegendOpen`.
   - Strip out the `isFactionLegendOpen ? ... : ...` ternary condition and toggle button from inside the `DECRYPTED ANOMALOUS MEMORY LOGS` container element, returning it to standard list behavior.

If returning to **v1.6.0 (Pre-low-frequency hum sound)**:
1. Revert files matching changes in `src/App.tsx`:
   - Delete the `playDecryptionHum` function declaration and call trigger inside `handleRefImageGenerated`.

If returning to **v1.5.0 (Pre-Ley Line visualizer)**:
1. Revert files matching changes in `src/App.tsx`:
   - Delete the `<style>` block containing `@keyframes leyWave1`, `@keyframes leyWave2`, and `.animate-ley-color-shift`.
   - Strip the `Ley Line Resonance Visualizer Overlay` JSX div inside the transmutation container viewport block.
   - Remove the `parsePsiToHue` function declaration under target imports.

If returning to **v1.3.0 (Pre-Hero landing page)**:
1. Revert files matching changes in `src/App.tsx`:
   - Delete the `hasEntered` state variable hook from the main App component.
   - Remove the early `if (!hasEntered) { return <HeroLandingPage ... /> }` return block.
   - Strip the `HeroLandingPage` import from the top imports declaration.
2. Safe-delete `/src/components/HeroLandingPage.tsx` using the file deletion utility.

If returning to **v1.2.0 (Pre-Forge Deploy Tab & Pre-Hero Page)**:
1. Revert files matching changes in `src/App.tsx`:
   - Set initial `activeTab` back to only `'reactor' | 'golemGuide'`.
   - Remove the `activeTab === 'forgeDeploy'` button rendering bloc.
   - Delete the `forgeDeploy` body main block embedding the static `iframe`.
   - Complete standard v1.3.0 rollback steps listed above.
2. Safe-delete `/public/CST_Character_Viewer_Controller.html` and `/src/components/HeroLandingPage.tsx`.

### Step 3: Run Validation & Diagnostic Suite
After making targeted manual code modifications or checked-out state returns, verify file structural consistency:
```bash
# 1. Clean build configurations and re-verify syntax & typescript definitions
npm run lint

# 2. Re-trigger full production packaging & compile pipeline
npm run build
```

### Step 4: Full Server Recycle
Whenever environment contexts or backend routers might be modified, restart the dev environment to purge stale processes:
- In the developer hub interface, trigger the server restart event to cycle port allocations.
