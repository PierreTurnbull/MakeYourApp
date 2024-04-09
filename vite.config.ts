import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
					@import "$styles/graphic-charter/index.scss";
				`,
			},
		},
	},
	plugins: [
		sveltekit(),
	],
});
