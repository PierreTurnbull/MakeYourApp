<script lang="ts">
	import type { TUserInterface } from "$models/userInterface/userInterface.model";
    import { userInterfacesStore } from "$stores/userInterfaces/userInterfaces.store";
	import MyaTextInput from "../common/MyaTextInput/MyaTextInput.svelte";
	import debounce from "lodash/debounce";

	export let userInterface: TUserInterface;

	const persistChange = debounce(
		async (newValue: TUserInterface["value"]) => {
			try {
				await fetch(`/api/userInterfaces/${userInterface.id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						value: newValue,
					}),
				});
			} catch (error) {
				console.error(error);
			}
		},
		1000,
	);

	const onChange = async (event: CustomEvent) => {
		const newValue = (event.target as HTMLInputElement).value;

		userInterfacesStore.update(userInterfaces => {
			const userInterfacesCopy = structuredClone(userInterfaces);

			const userInterfaceToUpdate = userInterfacesCopy.find(currentUserInterface => currentUserInterface.id === userInterface.id);

			if (userInterfaceToUpdate) {
				userInterfaceToUpdate.value = newValue;
			}

			return userInterfacesCopy;
		});

		persistChange(newValue);
	};
</script>

<div
	class="previewItem"
	style:top={`${userInterface.top}px`}
	style:left={`${userInterface.left}px`}
>
	{#if userInterface.type === "textInput"}
		<MyaTextInput
			value={userInterface.value || ""}
			on:input={onChange}
		/>
	{/if}
</div>

<style lang="scss">
	.previewItem {
		position: absolute;	
	}
</style>