<script lang="ts">
    import MyaTextInput from "../common/MyaTextInput/MyaTextInput.svelte";
    import type { TNewUserInterface } from "$models/userInterface/newUserInterface.model";
    import Draggable from "$lib/components/common/Draggable/Draggable.svelte";
    import { newUserInterfaceStore } from "$stores/newUserInterface/newUserInterface.store";
    import { userInterfacesStore } from "$stores/userInterfaces/userInterfaces.store";
    import type { TUserInterface } from "$models/userInterface/userInterface.model";

	export let userInterface: TNewUserInterface;

	let rootRef: HTMLElement;

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

<div
	bind:this={rootRef}
	class="newUserInterface"
>
	<div
		class="overlay"
	>
		{#if rootRef}
			<Draggable
				draggableRef={rootRef}
				type="clickAndRelease"
				onDraggingSuccess={onDraggingSuccess}
				onDraggingFailure={onDraggingFailure}
				initialIsDragging={true}
				initialX={userInterface.left}
				initialY={userInterface.top}
			/>
		{/if}
	</div>

	{#if userInterface.type === "textInput"}
		<MyaTextInput />
	{/if}
</div>

<style lang="scss">
	.newUserInterface {
		position: absolute;
		width: min-content;
		height: min-content;

		.overlay {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>