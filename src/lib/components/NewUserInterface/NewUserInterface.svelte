<script lang="ts">
    import MyaTextInput from "../common/MyaTextInput/MyaTextInput.svelte";
    import type { TNewUserInterface } from "$models/userInterface/newUserInterface.model";
    import Draggable from "$lib/components/common/Draggable/Draggable.svelte";
    import { newUserInterfaceStore } from "$stores/newUserInterface/newUserInterface.store";
    import { userInterfacesStore } from "$stores/userInterfaces/userInterfaces.store";
    import type { TUserInterface } from "$models/userInterface/userInterface.model";
    import Overlay from "./Overlay/Overlay.svelte";

	export let userInterface: TNewUserInterface;

	const onDraggingSuccess = async (newX: number, newY: number) => {
		try {
			const response = await fetch("/api/userInterfaces", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ x: newX, y: newY, type: userInterface.type }),
			});
			const persistedNewUserInterface: TUserInterface = await response.json();

			userInterfacesStore.set([...$userInterfacesStore, persistedNewUserInterface]);
		} catch (error) {
			console.error(error);
		}

		newUserInterfaceStore.set(null);
	};

	const onDraggingFailure = () => {
		newUserInterfaceStore.set(null);
	};
</script>

<Draggable
	type="clickAndRelease"
	onDraggingSuccess={onDraggingSuccess}
	onDraggingFailure={onDraggingFailure}
	initialIsDragging={true}
	initialX={userInterface.left}
	initialY={userInterface.top}
	let:hasError={hasError}
>
	<Overlay
		hasError={hasError}
	/>

	{#if userInterface.type === "textInput"}
		<MyaTextInput
			hasError={hasError}
		/>
	{/if}
</Draggable>