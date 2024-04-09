import { supabase } from "$lib/supabaseClient";
import type { TUserInterface } from "$models/userInterface/userInterface.model";

export const load = async () => {
	const response = await supabase.from("userInterfaces").select();

	const userInterfaces: TUserInterface[] | null = response.data;

	if (!userInterfaces) throw new Error("Cannot retrieve userInterfaces.");

	return {
		userInterfaces: userInterfaces,
	};
};