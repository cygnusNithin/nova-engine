# Nova Engine

Nova Engine is a browser-based 3D engine and editor inspired by the architecture and workflow of engines such as Unity and Unreal Engine.

The long-term goal is to build our own engine/editor platform first, and then build the Nova social-world / interactive city application on top of it.

The city is not the engine.

The engine is the foundation that powers the city.

---

# Nova Engine — Master Architecture & Roadmap

## Current Stage

> **CURRENT: Phase 5 — Transform Gizmo**
>
> Status: **IN PROGRESS**
>
> The Entity, Scene, Selection, Inspector, and basic Transform foundations are operational.
> The current focus is hardening the transform gizmo and making editor manipulation reliable.

---

# PART I — ENGINE FOUNDATION

## Phase 1 — Engine Architecture

**Status: COMPLETE**

Engine lifecycle

- Engine
- EngineProvider
- EngineContext
- Engine configuration
- World
- Scene
- Entity
- Component
- Transform
- Object3D relationship
- Event system
- System/update loop

Architecture:

```text
Nova Engine
    │
    ├── Engine
    │
    ├── World
    │
    ├── Scene
    │
    ├── Entity
    │
    ├── Component
    │
    ├── Transform
    │
    ├── Object3D
    │
    ├── Events
    │
    └── Systems

    ## Phase 2 — Entity & Scene Architecture

Status: COMPLETE

Responsibilities:

Entity lifecycle
EntityManager
SceneGraph
SceneNode
Parent/child relationship
Entity ↔ Object3D synchronization
Component lifecycle
Scene ownership
Entity registration
Entity spawning
Entity removal

Architecture:

World
 │
 └── SceneGraph
       │
       └── Root Entity
             │
       ┌─────┴─────┐
       │           │
    Entity A    Entity B
       │
       ├── Transform
       ├── Components
       └── Object3D
             │
             └── Three.js children


## Phase 3 — Editor Object Foundation

Status: COMPLETE

Responsibilities:

Editable entities
Transform authority
Inspector
Hierarchy
Entity metadata
Bounds foundation
Selection state
Entity/Object3D editing relationship

The editor operates on Entities rather than directly treating arbitrary Three.js objects as the authoritative world objects.

## Phase 4 — Selection System

Status: COMPLETE

Responsibilities:

Canvas-relative raycasting
Entity picking
Selected entity ID
Hierarchy selection
Inspector selection
Deselection
Selection events
Hit resolution

Architecture:

Pointer
   │
   ▼
Canvas-relative coordinates
   │
   ▼
Raycaster
   │
   ▼
Object3D
   │
   ▼
Entity
   │
   ▼
selectedEntityId
   │
   ├── Hierarchy
   ├── Inspector
   └── Gizmo
PART II — EDITOR CORE
## Phase 5 — Transform Gizmo

Status: IN PROGRESS — CURRENT PHASE

The current implementation already contains the basic gizmo architecture.

Move
X axis
Y axis
Z axis
XY plane
XZ plane
YZ plane
Gizmo interaction
Raycaster
Drag controller
Drag planes
Move controller
Hover controller
Gizmo state
Gizmo events
Pointer interaction
Remaining work
Axis hit priority
Plane hit priority
Pointer capture
Drag start lifecycle
Drag update lifecycle
Drag end lifecycle
Correct drag-plane calculation
Transform synchronization
Prevent accidental scene/object movement
Hover highlighting
Gizmo visibility state
Selection changes during interaction
Camera-relative gizmo behavior
Robust edge-case handling
Visual polish

Target:

             Y
             ↑
             │
             │
             ●──────────→ X
            ╱
           ╱
          Z

        XY / XZ / YZ
## Phase 6 — Editor Camera

Status: NOT STARTED

Build a professional editor camera system.

Camera controls
Orbit
Pan
Zoom
WASD fly
Camera-relative movement
Camera speed
Near/far handling
Stable camera state
Editor commands
Focus selected
Frame selected
Focus all
Camera shortcuts

Architecture:

Editor Camera
    │
    ├── Orbit
    ├── Pan
    ├── Zoom
    ├── Fly
    ├── Focus Selected
    ├── Frame Selected
    └── Focus All
Phase 7 — Transform System

Status: NOT STARTED

Transform becomes a proper engine-level system rather than only a gizmo feature.

Transform
Position
Rotation
Scale
Local space
World space
Parent-relative transforms
Local/world conversion
Quaternion/Euler policy
Negative scale handling
Transform constraints
Transform synchronization
Snapping foundation
Position snapping
Rotation snapping
Scale snapping

Architecture:

Entity
 │
 └── Transform
       │
       ├── Position
       ├── Rotation
       ├── Scale
       │
       ├── Local Space
       └── World Space
Phase 8 — Hierarchy System

Status: NOT STARTED

Build a real Unity/Unreal-style hierarchy editor.

Hierarchy
Tree hierarchy
Expand/collapse
Parent
Unparent
Reparent
Drag-and-drop hierarchy
Child transforms
Preserve world transform
Preserve local transform
Hierarchy selection
Recursive deletion

Architecture:

Scene
 │
 └── Root
      │
      ├── City
      │    ├── Road
      │    ├── Building
      │    └── Building
      │
      └── Player
PART III — PROFESSIONAL EDITOR
Phase 9 — Visual Editor System

Status: NOT STARTED

Visual systems
Selection outline
Bounding box
Pivot
Transform handles
Grid
Axes
Hover highlighting
Gizmo scaling
Depth behavior
Local/world orientation
Object bounds

Existing architecture:

EditorVisualManager
    │
    ├── EditorVisualService
    ├── OutlineRenderer
    ├── BoundingBoxRenderer
    └── PhysicsRenderer
Phase 10 — Editor Input & Shortcuts

Status: NOT STARTED

Shortcuts
Q = Selection
W = Move
E = Rotate
R = Scale
F = Frame Selected
Delete = Delete
Ctrl+D = Duplicate
Ctrl+Z = Undo
Ctrl+Y = Redo
Modifiers
Shift
Ctrl
Alt
Temporary snapping
Multi-selection modifiers
Keyboard focus management
Phase 11 — Snapping

Status: NOT STARTED

Move snapping
Grid snapping
Configurable increments
Rotation snapping
Degree increments
Configurable increments
Scale snapping
Configurable increments
Advanced snapping
Vertex snapping
Surface snapping
Temporary snapping modifier
Phase 12 — Multi-Selection

Status: NOT STARTED

Selection
Ctrl selection
Shift selection
Selection array
Hierarchy-aware selection
Group transformation
Shared bounds
Shared pivot
Group movement
Group rotation
Group scaling
Phase 13 — History

Status: NOT STARTED

Implement a proper command/action architecture.

History
Command system
Action system
Undo
Redo
Transform history
Create history
Delete history
Reparent history
Multi-selection history
Transaction-based drag history
History stack
History limits

Architecture:

Editor Action
     │
     ▼
Command
     │
 ┌───┴───┐
Undo    Redo
PART IV — ENGINE CORE SUBSYSTEMS
Phase 14 — Resource & Asset System

Status: NOT STARTED

Existing foundation:

AssetManager
LoadingManager
ModelCache
TextureCache

Complete system:

Asset registry
Async loading
Asset references
Dependency tracking
Resource lifecycle
Unloading
Materials
Geometry
Textures
Models
Model instancing
Error handling
Loading progress

Architecture:

Asset
 │
 ├── Model
 ├── Texture
 ├── Material
 ├── Geometry
 └── Audio
Phase 15 — Renderer

Status: NOT STARTED

Build the actual renderer subsystem.

Renderer
Renderer configuration
WebGL capability detection
Shadows
Tone mapping
Color management
Render layers
Render settings
Quality settings
Resolution scaling
Performance modes
Mobile rendering mode
Post-processing architecture

Target:

Renderer
 │
 ├── WebGL
 ├── Shadows
 ├── Lighting
 ├── Color Management
 ├── Quality
 ├── Resolution
 └── Performance
Phase 16 — Physics

Status: NOT STARTED

Physics
Rapier integration
Rigid bodies
Colliders
Triggers
Character controller
Collision layers
Physics materials
Fixed timestep
Interpolation
Raycasts
Spatial queries
Physics ↔ Entity synchronization

Architecture:

Entity
 │
 ├── Transform
 ├── Collider
 └── Rigidbody
       │
       ▼
    Physics
Phase 17 — Input System

Status: NOT STARTED

Input
Keyboard
Mouse
Touch
Gamepad
Action mapping
Axis mapping
Input contexts
Editor/game input separation
Pointer lock

Architecture:

Hardware
   │
   ▼
Input Manager
   │
   ├── Keyboard
   ├── Mouse
   ├── Touch
   └── Gamepad
          │
          ▼
    Action / Axis Mapping
Phase 18 — Scene Serialization

Status: NOT STARTED

A real editor must be able to save and load worlds.

Architecture:

Nova Scene
    │
    ├── Entities
    ├── Components
    ├── Transforms
    ├── Hierarchy
    └── Asset References
           │
           ▼
      Scene File
Features
Save scene
Load scene
Clone scene
Entity serialization
Component serialization
Transform serialization
Hierarchy serialization
Asset references
Versioning
Migration
JSON format
Future binary format
Phase 19 — Prefab / Template System

Status: NOT STARTED

Unity-style reusable objects.

Prefab
 │
 ├── Entity
 ├── Children
 ├── Components
 ├── Materials
 └── Transform
Features
Create prefab
Instantiate prefab
Prefab overrides
Nested prefabs
Prefab updates
Prefab variants
Phase 20 — Component Architecture

Status: NOT STARTED

Expand the existing component foundation.

Entity
 │
 ├── Transform
 ├── MeshRenderer
 ├── Collider
 ├── Rigidbody
 ├── Script
 ├── Light
 ├── Camera
 ├── Audio
 └── Custom Components
Component lifecycle
Create
  ↓
Initialize
  ↓
Enable
  ↓
Start
  ↓
Update
  ↓
Disable
  ↓
Destroy
PART V — NOVA RUNTIME
Phase 21 — Runtime / Play Mode

Status: NOT STARTED

Separate editor and runtime states.

EDITOR MODE
 │
 ├── Hierarchy
 ├── Inspector
 ├── Gizmos
 ├── Editor Camera
 └── Editing

        ↓ PLAY

RUNTIME MODE
 │
 ├── Player
 ├── NPCs
 ├── Physics
 ├── Interactions
 ├── Stores
 └── Game Logic
Runtime controls
Play
Pause
Stop
Restart
Runtime isolation
Editor/runtime state separation
Phase 22 — Scripting System

Status: NOT STARTED

Entity
   │
   ▼
ScriptComponent
   │
   ▼
User Script
   │
   ├── start()
   ├── update()
   ├── lateUpdate()
   └── fixedUpdate()

The existing ScriptComponent becomes the foundation for the scripting ecosystem.

Phase 23 — Animation

Status: NOT STARTED

Animation clips
Animation mixer
State machines
Skeletal animation
Blend trees
Animation events
Phase 24 — Audio

Status: NOT STARTED

Audio assets
Audio source
Audio listener
3D positional audio
Attenuation
Music
Sound effects
Phase 25 — Navigation & AI

Status: NOT STARTED

Important for the Nova city/social world.

Navigation
Navmesh
Pathfinding
NPC navigation
Obstacle avoidance
AI
AI state machines
Pedestrian behavior
Traffic behavior
NPC decision systems
PART VI — MULTIPLAYER / SOCIAL WORLD
Phase 26 — Networking

Status: NOT STARTED

Networking architecture
                 SERVER
                   │
          ┌────────┼────────┐
          │        │        │
       Players   World    Events
          │        │        │
          └────────┼────────┘
                   │
             Replication
                   │
        ┌──────────┼──────────┐
        │          │          │
      Client     Client     Client
Features
Client/server architecture
Entity replication
Transform replication
Player state
Interpolation
Prediction
Authoritative server
Rooms
Presence
Chat

Potential technologies:

WebSockets / Socket.IO
WebRTC where appropriate
PART VII — PROFESSIONAL NOVA EDITOR
Phase 27 — Editor UI & UX

Status: NOT STARTED

Target:

┌───────────────────────────────────────────────┐
│ Toolbar                                       │
├─────────────┬─────────────────────┬───────────┤
│             │                     │           │
│  Hierarchy  │      VIEWPORT       │ Inspector │
│             │                     │           │
│             │                     │           │
├─────────────┴─────────────────────┴───────────┤
│ Console / Assets / Scene / Project            │
└───────────────────────────────────────────────┘
Features
Dockable panels
Tabs
Asset browser
Console
Scene tabs
Project browser
Context menus
Property editors
Search
Command palette
Editor layouts
Workspace management
PART VIII — ENGINE PERFORMANCE
Phase 28 — Optimization & Streaming

Status: NOT STARTED

Performance is a core requirement for Nova.

Target hardware includes low-end systems such as:

4 GB RAM
Intel integrated graphics
Browser environment
Target: 30–45 FPS
Optimization
Object pooling
Instancing
Batching
LOD
Frustum culling
BVH
Spatial partitioning
Asset streaming
Worker threads
Memory management
Render budget
CPU budget
GPU budget
Mobile optimization
Streaming
World streaming
Asset streaming
Distance-based loading
Entity activation/deactivation
Scene chunks
PART IX — NOVA RUNTIME / SOCIAL WORLD
Phase 29 — Nova Runtime & Game Layer

Status: NOT STARTED

The actual Nova social-world application is built on top of Nova Engine.

                    NOVA ENGINE
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     Renderer         Physics           Input
        │                │                │
        └──────────── Systems ────────────┘
                         │
                      Entities
                         │
                      Editor
                         │
                      Runtime
                         │
                    NOVA WORLD
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Player           NPCs          Stores
          │              │              │
          └──────────────┼──────────────┘
                         │
                   Social World
Nova World
Player
NPCs
Buildings
Roads
Stores
Vehicles
Interactions
Chat
Social systems
World events
Multiplayer world

The game/social-world layer must consume the engine rather than becoming part of the engine's core architecture.

FINAL ENGINE ARCHITECTURE

The intended final architecture is:

                         NOVA ENGINE
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
     Renderer              Physics                Input
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                           Systems
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
      Entity              Components             Events
        │
        ├── Transform
        ├── Mesh
        ├── Collider
        ├── Rigidbody
        ├── Script
        ├── Light
        ├── Camera
        └── Custom Components
        │
        ▼
     SceneGraph
        │
        ▼
       World
        │
   ┌────┴─────┐
   │          │
 Editor     Runtime
   │          │
   │          └───────────────┐
   │                          │
   ├── Hierarchy            Player
   ├── Inspector            NPCs
   ├── Selection            Physics
   ├── Gizmos               Interactions
   ├── Camera               Stores
   ├── Visuals              Game Logic
   ├── Snapping
   ├── Multi-selection
   └── History
        │
        ▼
   NOVA WORLD
        │
   ┌────┼────┬────────┐
   │    │    │        │
Player NPCs Stores Vehicles
   │    │    │        │
   └────┴────┴────────┘
             │
        Social World
             │
        Multiplayer
Development Rule

Nova Engine is developed incrementally.

We do not restart completed phases.

We do not replace the architecture unnecessarily.

We do not implement future subsystems prematurely.

Each phase must be:

Implemented
Tested
Verified against the architecture
Marked COMPLETE
Then the next phase begins

The README roadmap is updated whenever a phase changes status.

Current Progress
Phase	Area	Status
1	Engine Architecture	COMPLETE
2	Entity & Scene Architecture	COMPLETE
3	Editor Object Foundation	COMPLETE
4	Selection System	COMPLETE
5	Transform Gizmo	IN PROGRESS ← CURRENT
6	Editor Camera	NOT STARTED
7	Transform System	NOT STARTED
8	Hierarchy System	NOT STARTED
9	Visual Editor System	NOT STARTED
10	Editor Input & Shortcuts	NOT STARTED
11	Snapping	NOT STARTED
12	Multi-Selection	NOT STARTED
13	History	NOT STARTED
14	Resource & Asset System	NOT STARTED
15	Renderer	NOT STARTED
16	Physics	NOT STARTED
17	Input System	NOT STARTED
18	Scene Serialization	NOT STARTED
19	Prefab / Template System	NOT STARTED
20	Component Architecture	NOT STARTED
21	Runtime / Play Mode	NOT STARTED
22	Scripting System	NOT STARTED
23	Animation	NOT STARTED
24	Audio	NOT STARTED
25	Navigation & AI	NOT STARTED
26	Networking	NOT STARTED
27	Editor UI & UX	NOT STARTED
28	Optimization & Streaming	NOT STARTED
29	Nova Runtime / Social World	NOT STARTED
Current Development Target

Phase 5 — Transform Gizmo

Do not move to Phase 6 until the transform gizmo is considered reliable and verified.


This is the version I'd use as the **master `README.md` roadmap**. From now on, when we finish a phase, we only update its status and the current-stage marker rather than rewriting the roadmap.
```
