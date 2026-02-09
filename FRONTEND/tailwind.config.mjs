export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        core: {
          primary: "var(--color-core-primary)",
          light: "var(--color-core-light)",
          gray: "var(--color-core-gray)",
          dark: "var(--color-core-dark)",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
  prefix: "hs-",
};
