<script>
    import { userInterfacesStore } from "$stores/userInterfaces/userInterfaces.store";
    import { newUserInterfaceStore } from "$stores/newUserInterface/newUserInterface.store";
    import UserInterface from "$lib/components/UserInterface/UserInterface.svelte";
    import UserInterfaceToolbox from "$lib/components/UserInterfaceToolbox/UserInterfaceToolbox.svelte";
    import Playground from "$lib/components/Playground/Playground.svelte";
    import NewUserInterface from "$lib/components/NewUserInterface/NewUserInterface.svelte";
</script>

<Playground>
	{#each $userInterfacesStore as userInterface (userInterface.id)}
		<UserInterface userInterface={userInterface} />
	{/each}

	{#if $newUserInterfaceStore}
		<NewUserInterface
			userInterface={$newUserInterfaceStore}
		/>
	{/if}
</Playground>

<UserInterfaceToolbox />