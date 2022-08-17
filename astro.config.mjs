import { defineConfig } from "astro/config";
import { astroImageTools } from "astro-imagetools";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  publicDir: "./public",
  outDir: "./dist",
  vite: {
    plugins: [
      {
        name: "import.meta.url-transformer",
        transform: (code, id) => {
          if (id.endsWith(".astro"))
            return code.replace(/import.meta.url/g, `"${id}"`);
        },
      },
    ],
    ssr: {
      external: ["svgo"],
      noExternal: ["astro", "@astrojs/image", "astro-imagetools"],
    },
  },
  experimental: {
    integrations: true,
  },
  integrations: [preact(), astroImageTools, tailwind()],
});
