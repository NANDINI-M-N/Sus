import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import * as TOML from '@iarna/toml';
import { readFileSync } from 'fs';

// Read the TOML config
const configPath = path.join(process.cwd(), 'supabase', 'config.toml');
const configContent = readFileSync(configPath, 'utf-8');
const config = TOML.parse(configContent) as { supabase: { url: string; anon_key: string } };

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Expose the config values to the client
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(config.supabase.url),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(config.supabase.anon_key),
  },
}));
