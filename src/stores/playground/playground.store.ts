import type { TPlayground } from "$models/playground/playground.model";
import { writable } from "svelte/store";

export const playgroundStore = writable<TPlayground>({
	mouseX: 0,
	mouseY: 0,
});