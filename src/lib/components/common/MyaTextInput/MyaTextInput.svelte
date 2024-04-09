<script lang="ts">
    import Textfield from "@smui/textfield";

	export let hasError: boolean = false;
	export let value: string = "";
</script>

<Textfield
	bind:value
	variant="outlined"
	invalid={hasError}
	on:input
/>