import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_CLERK_PUBLISHABLE_KEY": JSON.stringify(
        env.VITE_CLERK_PUBLISHABLE_KEY
      ),
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL
      ),
    },
  };
});
