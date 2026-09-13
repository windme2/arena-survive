# CYBER DOME // PROTOCOL: SURVIVE

A complete, high-fidelity 3D Cyberpunk Arena Survival game built with **Three.js (r128)**, **WebGL**, procedural Canvas textures, and the **Web Audio API**.

Zero external image/audio asset dependencies — 100% self-contained and procedurally synthesized.

---

## Features

- **Dynamic 3D Arena & Lighting**: Directional key light with soft shadows (`PCFSoftShadowMap`), atmospheric cyberpunk fog (`THREE.FogExp2`), neon boundary laser fence, and tactical cover pylons.
- **Procedural Canvas Textures**: Obsidian hex grid floor, warning hazard stripes, and particle flare sprites rendered on-the-fly via HTML5 Canvas.
- **Procedural Web Audio API Sound Synthesizer**: Pure oscillator & noise-based sound effects for plasma blasts, enemy darts, metallic impacts, multi-stage low-pass filtered explosions, dash thrusters, and harmonic energy core pickups.
- **Player Combat Mech**: Smooth vector acceleration, damping, alternating dual plasma cannons, 3D laser targeting line, ground reticle, and Cyber Dash with invulnerability frames.
- **Drone Enemies with Flocking AI**:
  - **Chaser Drone**: Fast, sharp tetrahedral swarmer.
  - **Shooter Drone**: Hovering sniper turret that strafes and shoots energy projectiles.
  - **Heavy Juggernaut**: High-durability cyber-golem with devastating blast radius.
- **Power-ups & Skills**:
  - **Energy Cores**: Magnetic suction towards player, restores health and charges EMP meter.
  - **EMP Super Shockwave**: Neutralizes all enemy projectiles in the arena and stuns drones.
- **Cyberpunk HUD**: Health & Kinetic Shield meters, Combo Multiplier, Wave counter, real-time 2D Minimap/Radar, Tactical Pause (`ESC`/`P`), and High Score tracking (`localStorage`).

---

## Controls

| Key / Input | Action |
| :--- | :--- |
| `W`, `A`, `S`, `D` / Arrows | Thruster movement (smooth vector physics) |
| `Mouse` | 3D ground aim with laser sight |
| `Left Click` (Hold/Tap) | Fire alternating dual plasma cannons |
| `Spacebar` / `Shift` | Cyber Dash (phase burst with invulnerability) |
| `Right Click` / `E` | EMP Shockwave (when gauge is 100%) |
| `ESC` / `P` | Tactical Pause / Settings menu |

---

## How to Run

Simply open `index.html` in any modern web browser or serve locally:

```bash
# Using Python
python3 -m http.server 8080

# Or using Node.js
npx serve .
```

Then visit `http://localhost:8080`.
