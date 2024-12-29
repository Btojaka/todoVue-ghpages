import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/todoVue-ghpages/", // Reemplaza 'todoVue-ghpages' por el nombre de tu repositorio
});
