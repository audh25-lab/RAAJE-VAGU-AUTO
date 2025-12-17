# RAAJE-VAGU-AUTO

Top-down GTA 1/2 style crime game: Disrupt gang ecosystems across islands.

## Setup
1. `npm install`
2. Run dev: `npm start` (opens http://localhost:1234)
3. Build PWA: `npm run build` (deploy dist/ to GitHub Pages)
4. For APK/iOS:
   - `npm run cap-init` (edit capacitor.config.ts if needed)
   - `npm run cap-add-android` and/or `npm run cap-add-ios`
   - Build web: `npm run build`
   - `npm run cap-sync`
   - Open in Android Studio/Xcode: `npm run cap-open-android` or `ios`

## Game Controls
- WASD/Arrow: Move
- Space: Shoot/Melee
- E: Enter/Steal vehicle
- Touch: Tap direction on mobile

## Bible Implementation
Fully systems-driven: Pressure grid, gang AI, police heat, etc. No scripts, pure simulation. Assets loaded from online URLs (no local files).