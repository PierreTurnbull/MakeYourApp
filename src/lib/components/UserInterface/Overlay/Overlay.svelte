<script lang="ts">
    import Icon from "@iconify/svelte";

	export let addConnection: () => void;
	export let removeRef: HTMLElement;
	export let remove: () => void;
	export let hasError: boolean;
</script>

<div
	class="overlay"
	class:withError={hasError}
>
	<div class="dragIconWrapper">
		<Icon icon="fa-solid:arrows-alt" />
	</div>

	<button
		class="addConnectionButton"
		on:click={addConnection}
		on:mousedown|stopPropagation
		on:mouseup|stopPropagation
	>
		<Icon icon="fa-solid:wrench" />
	</button>

	<button
		class="removeButton"
		bind:this={removeRef}
		on:click={remove}
		on:mousedown|stopPropagation
		on:mouseup|stopPropagation
	>
		<Icon icon="fa-solid:times" />
	</button>
</div>

<style lang="scss">
	.overlay {
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
		opacity: 0;
		justify-content: flex-end;
		align-items: center;
		border-radius: 6px;

		&::after {
			clip-path: polygon(75% 0, 100% 25%, 50% 100%, 50% 50%, 0 50%);
			position: absolute;
			z-index: 1;
			top: 0;
			right: 0;
			transform: translate(50%, -50%);
			content: "";
			display: block;
			width: 40px;
			height: 40px;
		}

		&:hover {
			opacity: 1;
		}

		.addConnectionButton {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 30px;
			height: 100%;
			box-sizing: border-box;
			border: 2px solid $border;
			cursor: pointer;
			background-color: $inner-background;

			&:hover {
				background-color: $inner-background-hover;
			}
		}

		.addConnectionButton {
			border-top-right-radius: 6px;
			border-bottom-right-radius: 6px;

			&::after {
				right: -3px;
				border-top-right-radius: 2px;
				border-bottom-right-radius: 2px;
			}
		}

		.dragIconWrapper {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			line-height: 0;
			padding: 4px;
			border-radius: 9999px;
			background-color: $outer-background;
		}

		.removeButton {
			position: absolute;
			z-index: 2;
			top: -18px;
			right: -18px;
			width: 18px;
			height: 18px;
			border-radius: 9999px;
			background-color: $inner-background;
			border: 2px solid $border;
			box-sizing: border-box;
			font-size: 12px;
			font-weight: bold;
			justify-content: center;
			align-items: center;
			display: none;
			cursor: pointer;

			&:hover {
				background-color: $inner-background-hover;
			}
		}

		&:hover .removeButton {
			display: flex;
		}

		&.withError {
			background-color: $error-background;

			.dragIconWrapper {
				color: $error-text;
			}

			.addConnectionButton {
				border-color: $error-border;
				color: $error-text;
			}

			.removeButton {
				border-color: $error-border;
				color: $error-text;
			}
		}
	}
</style>