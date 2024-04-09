<script lang="ts">
    import { playgroundStore } from "$stores/playground/playground.store";
    import { onDestroy, onMount } from "svelte";
	import { browser } from "$app/environment";

	let playgroundEl: HTMLElement;

	const onMouseMove = (event: MouseEvent) => {
		// offsets of the mouse compared to the playground
		const offsetLeft = event.pageX - playgroundEl.offsetLeft;
		const offsetTop = event.pageY - playgroundEl.offsetTop;

		$playgroundStore.mouseX = offsetLeft;
		$playgroundStore.mouseY = offsetTop;
	};

	if (browser) {
		onMount(() => {
			window.addEventListener("mousemove", onMouseMove);
		});
		onDestroy(() => {
			window.removeEventListener("mousemove", onMouseMove);
		});
	}
</script>

<div
	class="playground"
	bind:this={playgroundEl}
>
	<slot></slot>
</div>

<style lang="scss">
	.playground {
		flex: 1;
		border: 2px solid red;
		position: relative;
		background-color: $outer-background;
	}
</style>