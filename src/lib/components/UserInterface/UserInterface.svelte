<script lang="ts">
    import type { TUserInterface } from "$models/userInterface/userInterface.model";
    import Draggable from "$lib/components/common/Draggable/Draggable.svelte";
    import MyaTextInput from "../common/MyaTextInput/MyaTextInput.svelte";
    import { userInterfacesStore } from "$stores/userInterfaces/userInterfaces.store";
    import Overlay from "./Overlay/Overlay.svelte";
    import MyaDialog from "../common/MyaDialog/MyaDialog.svelte";
    import Select, { Option } from "@smui/select";
    import Button from "@smui/button";

	export let userInterface: TUserInterface;

	let removeRef: HTMLElement;

	let addConnectionDialogIsOpen = true;

	const onDraggingSuccess = async (newX: number, newY: number) => {
		try {
			await fetch(`/api/userInterfaces/${userInterface.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ x: newX, y: newY }),
			});

			userInterfacesStore.update(userInterfaces => {
				const userInterfacesCopy = structuredClone(userInterfaces);

				const userInterfaceToUpdate = userInterfacesCopy.find(currentUserInterface => currentUserInterface.id === userInterface.id);

				if (userInterfaceToUpdate) {
					userInterfaceToUpdate.left = newX;
					userInterfaceToUpdate.top = newY;
				}

				return userInterfacesCopy;
			});
		} catch (error) {
			console.error(error);
		}
	};

	const remove = async () => {
		try {
			await fetch(`/api/userInterfaces/${userInterface.id}`, {
				method: "DELETE",
			});

			userInterfacesStore.set($userInterfacesStore.filter(currentUserInterface => currentUserInterface.id !== userInterface.id));
		} catch (error) {
			console.error(error);
		}
	};

	const openAddConnectionDialog = () => {
		addConnectionDialogIsOpen = true;
	};

	const closeAddConnectionDialog = () => {
		addConnectionDialogIsOpen = false;

		selectedChoice = "";
	};

	let selectedChoice: string | null = "";

	const choices = [
		{
			name: "Afficher le texte dans un bloc",
			value: "displayText",
		},
	];

	let canSubmit = false;

	$: if (selectedChoice === "displayText") canSubmit = true;
	else canSubmit = false;
</script>

<Draggable
	type="clickAndHold"
	onDraggingSuccess={onDraggingSuccess}
	initialX={userInterface.left}
	initialY={userInterface.top}
	let:hasError={hasError}
>
	<Overlay
		addConnection={openAddConnectionDialog}
		removeRef={removeRef}
		remove={remove}
		hasError={hasError}
	/>

	{#if userInterface.type === "textInput"}
		<MyaTextInput
			value={userInterface.value || ""}
			hasError={hasError}
		/>
	{/if}
</Draggable>

<MyaDialog
	isOpen={addConnectionDialogIsOpen}
	close={closeAddConnectionDialog}
	title={"Champ texte"}
>
	<p>Que voulez-vous faire ?</p>
	<Select
		bind:value={selectedChoice}
		on:close={() => {
			console.log("ok");
		}}
	>
		{#each choices as choice (choice.name)}
			<Option value={choice.value}>
				{choice.name}
			</Option>
		{/each}
	</Select>
	<div class="buttons">
		<Button
			disabled={!canSubmit}
		>
			Valider
		</Button>
		<Button
			on:click={closeAddConnectionDialog}
		>
			Annuler
		</Button>
	</div>
</MyaDialog>

<style lang="scss">
	.buttons {
		display: flex;
		justify-content: center;
		gap: 16px;
	}
</style>