<script lang="ts">
    import Icon from "@iconify/svelte";
	import { newUserInterfaceStore } from "$stores/newUserInterface/newUserInterface.store";
    import { playgroundStore } from "$stores/playground/playground.store";
    import type { TUserInterfaceType } from "$models/userInterface/userInterface.model";

	const addTextInput = (type: TUserInterfaceType) => {
		let offsetX = 0;
		let offsetY = 0;

		if (type === "textInput") {
			offsetX = -85;
			offsetY = -20;
		}

		newUserInterfaceStore.set({
			left: $playgroundStore.mouseX + offsetX,
			top: $playgroundStore.mouseY + offsetY,
			type: type,
			value: "",
		});
	};

	const removeTextInput = () => {
		newUserInterfaceStore.set(null);
	};
</script>

<div class="userInterfaceToolbox">
	<button
		class="tool"
		on:click={$newUserInterfaceStore ? removeTextInput : () => addTextInput("textInput")}
	>
		<Icon icon="fa-solid:keyboard" height="48px" />
	</button>
</div>

<style lang="scss">
	.userInterfaceToolbox {
		height: 64px;
		border: 2px solid $text;
		border-bottom: none;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		padding: 8px;
		position: fixed; // this should be absolte. then the playground should have a way of knowing this is not counted as one of the draggable siblings, for example by passing it a special key or a special slot.
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: $outer-background;
		z-index: 10;

		.tool {
			background-color: $inner-background;
			aspect-ratio: 1/1;
			height: 100%;
			border-radius: 6px;
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			border: none;
		}
	}
</style>