import { writable } from "svelte/store";
import type { TNewUserInterface } from "$models/userInterface/newUserInterface.model";

export const newUserInterfaceStore = writable<TNewUserInterface | null>(null);