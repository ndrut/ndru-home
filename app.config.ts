import { defineConfig } from "@solidjs/start/config";

export default defineConfig(
    {
        server: { gzip: true, brotli: true }
    }
);
