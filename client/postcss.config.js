export const plugins = {
  tailwindcss: {},
  autoprefixer: {},
  ...(process.env.VITE_NODE_ENV === "production" ? { cssnano: {} } : {}),
};
