<script>
    import Playground from "$lib/components/Playground/Playground.svelte";
    import PreviewItem from "$lib/components/PreviewItem/PreviewItem.svelte";
    import UserInterface from "$lib/components/UserInterface/UserInterface.svelte";
    import { userInterfacesStore } from "$stores/userInterfaces/userInterfaces.store";
</script>

<Playground>
	{#each $userInterfacesStore as userInterface (userInterface.id)}
		<PreviewItem userInterface={userInterface} />
	{/each}
</Playground>