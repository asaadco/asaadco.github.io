// astro.config.mjs
// Updated for Data Modernist design: Space Grotesk + JetBrains Mono via fontsource.
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://asaad101.sa",
  output: "static",
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Space Grotesk",
      cssVariable: "--font-space-grotesk",
      weights: ["300 700"],
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: ["400 700"],
      styles: ["normal"],
    },
  ],
});
