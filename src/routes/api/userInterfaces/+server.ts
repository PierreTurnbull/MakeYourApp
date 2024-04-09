import { supabase } from "$lib/supabaseClient.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request }) => {
	const {
		x,
		y,
		type,
	} = await request.json();

	const { data } = await supabase
		.from("userInterfaces")
		.insert({ left: x, top: y, type: type })
		.select();

	if (data === null || data?.length === 0) return new Response(null, { status: 500 }); 

	return json(data[0]);
};