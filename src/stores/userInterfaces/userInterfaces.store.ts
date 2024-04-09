import { writable } from "svelte/store";
import type { TUserInterface } from "$models/userInterface/userInterface.model";

export const userInterfacesStore = writable<TUserInterface[]>([]);