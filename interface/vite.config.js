import { defineConfig } from "vite";
import inject from "@rollup/plugin-inject";

export default defineConfig({
    plugins: [
        inject({
            p5: "p5",
        }),
    ],
});
