<script lang="ts">
    import type { TUserInterface } from "$models/userInterface/userInterface.model";
    import Draggable from "$lib/components/common/Draggable/Draggable.svelte";
    import MyaTextInput from "../common/MyaTextInput/MyaTextInput.svelte";
    import { userInterfacesStore } from "$stores/userInterfaces/userInterfaces.store";
    import Icon from "@iconify/svelte";

	export let userInterface: TUserInterface;

	let rootRef: HTMLElement;
	let removeRef: HTMLElement;

	let collides = false;
	let isDragging = false;

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
</script>

<div
	bind:this={rootRef}
	class="userInterface"
	class:colliding={collides}
	class:dragged={isDragging}
>
	<div
		class="overlay"
	>
		{#if rootRef}
			<div class="inputProvider">
				<Icon icon="fa-solid:arrow-right" />
			</div>

			<Draggable
				draggableRef={rootRef}
				type="clickAndHold"
				onDraggingStart={() => isDragging = true}
				onDraggingEnd={() => isDragging = false}
				onDraggingSuccess={onDraggingSuccess}
				onCollisionStart={() => collides = true}
				onCollisionEnd={() => collides = false}
				initialX={userInterface.left}
				initialY={userInterface.top}
			/>

			<div class="outputProvider">
				<Icon icon="fa-solid:arrow-right" />
			</div>

			<button
				class="removeButton"
				bind:this={removeRef}
				on:click={remove}
			>
				<Icon icon="fa-solid:times" />
			</button>
		{/if}
	</div>

	{#if userInterface.type === "textInput"}
		<MyaTextInput
			value={userInterface.value || ""}
			hasError={collides}
		/>
	{/if}
</div>

<style lang="scss">
	.userInterface {
		position: absolute;
		z-index: 1;
		width: min-content;
		height: min-content;

		.overlay {
			position: absolute;
			z-index: 2;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			display: flex;
			opacity: 0;
			justify-content: center;
			align-items: center;

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

			.inputProvider, .outputProvider {
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
	
			.inputProvider {
				border-top-left-radius: 6px;
				border-bottom-left-radius: 6px;
	
				&::before {
					left: -3px;
					border-top-left-radius: 2px;
					border-bottom-left-radius: 2px;
				}
			}
	
			.outputProvider {
				border-top-right-radius: 6px;
				border-bottom-right-radius: 6px;
	
				&::after {
					right: -3px;
					border-top-right-radius: 2px;
					border-bottom-right-radius: 2px;
				}
			}
	
			.inputProvider::before, .outputProvider::after {
				content: "";
				display: block;
				height: 4px;
				width: 3px;
				background-color: $border;
				position: absolute;
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
		}

		&.dragged {
			z-index: 2;
		}

		&.colliding {
			.inputProvider, .outputProvider {
				border-color: $error-border;
				color: $error-text;
			}

			.inputProvider::before, .outputProvider::after {
				background-color: $error-border;
			}

			.removeButton {
				border-color: $error-border;
				color: $error-text;
			}
		}
	}
</style>