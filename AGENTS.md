# ⬥ MOAI AGENTIC INTEGRITY & HANDOFF PROTOCOLS (CL-1.1 compliant)

Welcome, **Agentic Claude AI**, collaboration partner on the **Genesis Verse Reactor Workspace**. 

This document serves as the live, system-injected instruction profile (`AGENTS.md`). It outlines critical system architecture constraints, the Moai CL-1.1 model scale compliance standards, and the engineering principles required to maintain this workspace.

---

## 🛠️ CORE SYSTEM ARCHITECTURE

The platform is a highly polished, full-stack hybrid reactive system:
1. **Frontend (React v18 + Vite)**: Renders the active reactor workspace and core monitoring interfaces.
2. **Backend (Express + Tsx/Esbuild)**: Manages API request proxying and handles production delivery via a bundled CommonJS backend (`dist/server.cjs` on port `3000`).
3. **Core Substructures**:
   - **Three-Dimensional Viewer (`/src/components/ThreeDimensionalViewer.tsx`)**: High-performance procedural-vertex 2D/3D canvas rendering engine with advanced shaders, bounding wireframes, and high-fidelity snapshot exports.
   - **Janes Golem MFG (`/src/components/JanesGolemGuide.tsx`)**: Manufacturing and design suite for custom tactical blueprints.
   - **Forge Deploy View (`/public/CST_Character_Viewer_Controller.html`)**: HTML5 Babylon.js simulation suite with peripheral-mapped physical rigs.

---

## 📐 MOAI CL-1.1 SCALING & BOUNDS STANDARD

All procedural meshes reconstructed inside the `ThreeDimensionalViewer` must conform to the **Moai CL-1.1 scale laws** to maintain topological alignment across sub-views.

### 1. Spatial Measurement Calculation
* **Vertices Iteration**: Mesh bounds are calculated dynamically at coordinate change by evaluating the logical extrema (`minX`, `maxX`, `minY`, `maxY`, `minZ`, `maxZ`) of the procedural mesh vertices.
* **Mathematical Calibration**: Real-world physics scale metrics require multiplying canonical coordinates by a **`1.5x` scale coefficient** to project sizing into real space (meters `m` and cubic volume `m³`).
* **Equations**:
  $$\text{Span}_X = (X_{\max} - X_{\min}) \times 1.5$$
  $$\text{Span}_Y = (Y_{\max} - Y_{\min}) \times 1.5$$
  $$\text{Span}_Z = (Z_{\max} - Z_{\min}) \times 1.5$$
  $$\text{Volume} = \text{Span}_X \times \text{Span}_Y \times \text{Span}_Z$$

### 2. 3D projection Overlay
* When `showMeasurements` is active, the engine must overlay a 12-edge dashed bounding box wireframe representing the spatial boundaries of the model.
* Midpoint labels for width (X), height (Y), and depth (Z) must be calculated, transformed into 2D camera coordinates, and rendered alongside custom background blocks to preserve accessibility against highly dynamic active shaders.

### 3. Environment Chamber Color Customization
* The canvas viewport background is governed by state vectors:
  - `bgOption`: Preset configurations. Supported models: `abyss` (geothermal amber/deep charcoal), `slate` (corporate high-tech navy), `warm` (forge magma red), `nebula` (cybernetic violet), `moss` (layline forest green), or `custom` (free hexa selection).
  - `customBgColor`: Hexadecimal string tracking the exact bespoke color.
* **Snapshot Fidelity Requirement**: Any changes to backgrounds must be successfully synchronized with the offscreen canvas scaling element (`takeSnapshotRef`). High-resolution exports must match the active environment custom bounds.

---

## ✍️ STYLING & DESIGN GUIDELINES

Every sub-component must look crafted and deliberate:
* **Tailwind Utility Classes Only**: Avoid custom stylesheets, separate `.css` modules, or runtime dynamic CSS-in-JS properties. Override native items cleanly using Tailwind modifiers.
* **High-Contrast Dark Theme Aesthetics**: The interface utilizes an eye-safe volcanic charcoal background matched with neon/cybernetic state indicators (Orange Forge/Acronym Amber `#c46a1a`, Core Cyan `#1a9490`). Do not introduce low-contrast text or unaligned UI grids.
* **Icon Set**: All vector graphics must import directly from `lucide-react`. Custom inline SVG vectors or unstandardized packages are strictly prohibited.
* **Touch Target & negative space**: Maintain a minimum `44px` cursor hitbox for click/touch components, and leverage generous negative layout borders to build rhythmic depth.

---

## ⚡ CODING & RUNTIME SANCTIONS

To avoid runtime discrepancies, always obey the following structural rules:
1. **Never Consolidate Everything in `App.tsx`**: Modularize logical blocks by creating dedicated children components in `/src/components/` and declaring shared TypeScript interfaces early inside `/src/types.ts`.
2. **Infinite Re-render Prevention**: Guard all `useEffect` blocks against cyclic state propagation. Specify primitive, static variables in dependency arrays rather than dynamic objects or functions.
3. **No Unrequested Presets Or Slogans**: Do not incorporate unprompted marketing copy, commercial brand taglines, or complex route-switching systems. Execute the requested features with extreme visual precision.
4. **Port 3000 Ingress Rules**: The dev and production servers are hardbound to listen on IP `0.0.0.0` and Port `3000`. Do not modify this mapping under any circumstance.

---

## 🏁 POST-EDITS RUNTIME VERIFICATION

Always run this three-step verification checklist before concluding any active cycle:
```bash
# 1. Run typescript compile check and general diagnostics
npm run lint

# 2. Compile full production esbuild & vite package assets
npm run build

# 3. Recycle dev server in case of background router/variable changes
# (Trigger dev server restart from the AI Studio Control Panel)
```

---

## 🌌 PHASE 14 COMPLIANCE & CANONICAL SSOT (STYX RISING DIRECTIVE)

The project has transitioned into a **deterministic operating platform** where every subsystem operates under a shared constitutional architecture. All agents must enforce the following ground-truth definitions.

### 1. Subsystem Role Isolation
* **Oracle (The Semantic Nervous System)**: Generates and indexes world knowledge, material taxonomy (`MI_`, `TEX_`, `GEO_`), relationships, and lore. **Never** executes gameplay actions or authorizes trades.
* **Sentinel (The Governance Engine)**: Monitors runtime integrity, fraud/wash trading, operator trust, MTD provenance validation, and security auditing. Interacts with WealthSpring solely via a read-only adapter.
* **WGE (The World Synthesizer)**: Instantiates the procedural layout, districts, and station geometry deterministically from seeds based on Oracle definitions. **Never** invents lore.
* **WealthSpring**: Operates as independent Studio IP providing passive, high-fidelity intelligence telemetry (risk analysis, trends, market surveillance) directly into Sentinel without participating in the player progression loop.

### 2. The Canonical Pipeline
No asset bypasses validation. The authoritative pipeline for all Genesis Verse items is:
$$\text{Concept} \longrightarrow \text{Forge Network} \longrightarrow \text{Manufacturing} \longrightarrow \text{MTD Generation} \longrightarrow \text{Card Captor Registration} \longrightarrow \text{Sentinel Validation} \longrightarrow \text{ABEX–GDEX Listing}$$

### 3. Card Captor Registry & MTD v2 Specifications
* **Card Captor**: Serves as the authoritative, persistent identity service tracking operator dossiers, NFT pilot identification, station clearance levels, and active tactical decks.
* **MTD v2**: Every manufactured asset must contain a complete provenance passport including station of origin, builder, material composition metadata (`MI_`), rig contracts, and a cryptographic Sentinel integrity signature.

### 4. ABEX-GDEX Access Control
Marketplace listing, liquidity provision, and banking actions are strictly locked. Access requires earning the specialized operational certification: **MTD Ash Construct: ABEX Banker** (which requires trust audits, economic competency tests, and active clearance).

The system compiles successfully, all security parameters conform perfectly to Moai physical scale and structural integrity guidelines. Project with absolute confidence!
