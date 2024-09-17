<script lang="ts">
    import Icon from "@iconify/svelte";
	import Dialog from "@smui/dialog";

	export let isOpen: boolean;
	export let close: () => void;
	export let title: string = "";
</script>

<Dialog
	bind:open={isOpen}
	aria-labelledby="simple-title"
	aria-describedby="simple-content"
>
	<button
		class="close"
		on:click={close}
	>
		<Icon icon="fa-solid:times" height="12px" />
	</button>
	<div class="space-y-4">
		{#if title}
			<p class="title">{title}</p>
		{/if}
		<slot></slot>
	</div>
</Dialog>

<style lang="scss">
	.title {
		font-size: 18px;
		font-weight: 600;
	}

	.close {
		width: 24px;
		height: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 9999px;
		border: 2px solid $border;
		position: absolute;
		top: 4px;
		right: 4px;
		background-color: $inner-background;

		&:hover {
			background-color: $inner-background-hover;
		}
	}
</style>