<script>
    import "../styles/app.scss";
    import "/src/styles/reset.scss";
    import "/src/styles/smui/index.scss";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { userInterfacesStore } from "$stores/userInterfaces/userInterfaces.store";

    export let data;

	onMount(() => {
		userInterfacesStore.set(data.userInterfaces);

		goto("/interfaces-editor");
	});
</script>

<div id="root">
	<p>Mode d'affichage :</p>
	<div>
		<button on:click={() => goto("/interfaces-editor")}>Interfaces</button>
		<button on:click={() => goto("/preview")}>Aperçu</button>
	</div>
	<h2>
		{#if $page.url.pathname === "/interfaces-editor"}
			Interfaces
		{:else if $page.url.pathname === "/preview"}
			Aperçu
		{/if}
	</h2>

	<slot></slot>
</div>

<style lang="scss">
	#root {
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		background-color: $outer-background;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>