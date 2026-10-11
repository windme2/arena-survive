# CYBER DOME // PROTOCOL: SURVIVE

A complete, high-fidelity 3D Cyberpunk Arena Survival game built with **Three.js (r128)**, **WebGL**, procedural Canvas textures, and the **Web Audio API**.

Zero external image/audio asset dependencies — 100% self-contained and procedurally synthesized.

---

## ✨ Features & Gameplay

- **Expanded 3D Arena (65-unit Radius)**: Directional key light with soft dynamic shadows (`PCFSoftShadowMap`), atmospheric cyberpunk fog (`THREE.FogExp2`), neon boundary laser fence, and 10 tactical cover pillars.
- **Boss Fights (Wave 5, 10, 15...)**:
  - **Wave 5 Boss**: `CYBER COLOSSUS // TITAN-01`
    - Dual rotary plasma cannons with heavy missile bursts.
    - 16-way Omnidirectional Bullet Spiral.
    - Ground Stomp Shockwave (expanding ring that requires Cyber Dash to evade).
    - Berserk Phase (under 45% HP) with increased speed, fiery eye glow, and minion drone summons.
  - Dedicated **Boss Health Bar HUD** with threat level alerts and real-time damage feedback.
  - Emergency warning siren audio synthesizers and red screen pulse.
- **Drone Enemies with Flocking AI**:
  - **Chaser Drone**: Fast, sharp tetrahedral swarmer.
  - **Shooter Drone**: Hovering sniper turret that strafes and shoots energy darts.
  - **Heavy Juggernaut**: High-durability cyber-golem with high-yield blast radius.
- **Combat Mechanics**:
  - Dual alternating plasma cannons with muzzle flashes and critical hits.
  - **Cyber Dash (SPACE)**: Rapid thrust with invulnerability frames.
  - **EMP Shockwave (E / Right-Click)**: Annihilates all incoming enemy projectiles and stuns nearby enemies.
  - **Combo Multiplier with Visual Countdown Bar**: Earn up to x4.0 score multiplier with a real-time decay meter.
  - **Floating Damage Numbers**: 3D-to-2D projected combat text (`28`, `56 CRIT!`, `150 EMP!`).
- **.IO Style Leaderboard & Pilot Registration**:
  - Enter custom **Pilot Callsign** with random cyber name generator.
  - Local & simulated rival pilots on the **Global Arena Leaderboard**.
  - Persistent High Scores and Ranks saved in `localStorage`.
- **Procedural Web Audio API Synthesizer**:
  - Pure procedural sound effects: player plasma shots, enemy darts, metallic hits, multi-stage low-pass filtered noise explosions, dash whooshes, energy core chimes, boss siren alarms, and ground stomps.

---

## 🎮 Controls

| Key / Input | Action |
| :--- | :--- |
| `W`, `A`, `S`, `D` / Arrows | Thruster movement (smooth vector physics) |
| `Mouse` | 3D ground aim with laser sight & reticle |
| `Left Click` (Hold/Tap) | Fire alternating dual plasma cannons |
| `Spacebar` / `Shift` | Cyber Dash (phase burst with invulnerability) |
| `Right Click` / `E` | EMP Shockwave (when gauge is 100%) |
| `ESC` / `P` | Tactical Pause / Settings menu |

---

## 🚀 How to Run

Simply open `index.html` in any modern web browser or run a local server:

```bash
# Using Python
python3 -m http.server 8080

# Or using Node.js
npx serve .
```

Then visit `http://localhost:8080`.
