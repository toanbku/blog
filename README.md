# Personal Blog bases on Astro

Features:

- ✅ SEO-friendly setup with canonical URLs and OpenGraph data
- ✅ Full Markdown support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
├── README.md
├── astro.config.mjs
├── package.json
├── public
│   ├── assets
│   │   └── blog
│   │       └── introducing-astro.jpg
│   ├── favicon.ico
│   ├── social.jpg
│   └── social.png
├── sandbox.config.json
├── src
│   ├── components
│   │   ├── Author.astro
│   │   ├── BaseHead.astro
│   │   ├── BlogHeader.astro
│   │   ├── BlogPost.astro
│   │   ├── BlogPostPreview.astro
│   │   ├── Heading.astro
│   │   └── Logo.astro
│   ├── layouts
│   │   └── BlogPost.astro
│   ├── pages
│   │   ├── index.astro
│   │   └── posts
│   │       └── index.md
│   └── styles
│       └── blog.css
└── tsconfig.json
```

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
|:----------------  |:-------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:3000`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
