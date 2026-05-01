// astro.config.mjs
// Source: https://docs.astro.build/en/guides/deploy/github/
// Source: https://docs.astro.build/en/guides/fonts/
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://neoasaad.github.io",
  output: "static",
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["100 900"],
      styles: ["normal"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      weights: ["400 900"],
      styles: ["normal", "italic"],
    },
  ],
});
