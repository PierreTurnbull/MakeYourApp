import { supabase } from "$lib/supabaseClient.js";
import type { TUserInterface } from "$models/userInterface/userInterface.model.js";

export const PATCH = async ({ request, params }) => {
	const {
		x,
		y,
		value,
	} = await request.json();

	const updateBody: Partial<TUserInterface> = {};

	if (x !== undefined) updateBody.left = x;
	if (y !== undefined) updateBody.top = y;
	if (value !== undefined) updateBody.value = value;

	const { data } = await supabase
		.from("userInterfaces")
		.update(updateBody)
		.eq("id", params.id)
		.select();

	if (data?.length === 0) return new Response(null, { status: 404 }); 

	return new Response();
};

export const DELETE = async ({ params }) => {
	const { error } = await supabase
		.from("userInterfaces")
		.delete()
		.eq("id", params.id);

	if (error) return new Response(null, { status: 500 });

	return new Response();
};