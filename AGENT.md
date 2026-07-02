# Rules for Antigravity (AGENT.md)

You must strictly adhere to the following rules and workflows when developing, upgrading, or maintenance this project:

## 1. Verification Workflow
- **Compilation Check**: Every code change must be verified by running `npm run build` in both the root directory (frontend) and the `server` directory (backend) to ensure no TypeScript or packaging errors exist.
- **Server Runtime Check**: Start the backend Express server (`npm run dev` in `server/`) and check that it starts without crash.
- **Linter Check**: Run the linter (`npm run lint` in root) to ensure zero warnings and errors.
- **Console Log Check**: Always verify the frontend in a browser subagent and inspect the browser's developer console for any runtime JavaScript exceptions or network request failures.

## 2. Catalog & Price Configurations
- Do not introduce shopping cart or checkout flows unless explicitly requested by the user.
- **Price Toggling Logic**: Ensure all price display components respect both the individual product option `product.showPrice` and the global config option `landingData.hideAllPrices`. When hidden, show the text "Liên hệ".
- **Contact Widgets**: Keep contact buttons pointing to configured channels (Zalo, Messenger, Hotline) dynamically.

## 3. Visual Aesthetics (3D & Gradient Effects)
- Retain the custom theme classes (`theme-luxury-silver`, `theme-warm-rose-gold`, `theme-royal-emerald`).
- Ensure elements with the `.tilt-card` class receive the mouse movement listeners for the 3D parallax tilt effect.
- Ensure the background gradient bubbles are animated and only rendered when `enableGlowBubbles` is active.
- Use `IntersectionObserver` on `.reveal-on-scroll` elements for premium scroll fade-in animations.
