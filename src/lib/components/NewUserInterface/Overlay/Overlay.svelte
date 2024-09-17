<script lang="ts">
    import Icon from "@iconify/svelte";

	export let hasError: boolean;
</script>

<div
	class="overlay"
	class:withError={hasError}
>
	<div class="dragIconWrapper">
		<Icon icon="fa-solid:arrows-alt" />
	</div>
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
		justify-content: center;
		align-items: center;

		&:hover {
			opacity: 1;
		}

		.dragIconWrapper {
			line-height: 0;
			padding: 4px;
			border-radius: 9999px;
			background-color: $outer-background;
		}

		&.withError {
			.dragIconWrapper {
				color: $error-text;
			}
		}
	}
</style>