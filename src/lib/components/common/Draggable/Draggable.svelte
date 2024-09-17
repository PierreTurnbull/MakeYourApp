<script lang="ts">
    import type { TDragType } from "$models/drag/drag.model";
    import { onMount } from "svelte";

	export let type: TDragType;
	export let onDraggingStart: (() => void) | undefined = undefined;
	export let onDraggingEnd: (() => void) | undefined = undefined;
	export let onDraggingSuccess: ((newX: number, newY: number) => void) | undefined = undefined;
	export let onDraggingFailure: (() => void) | undefined = undefined;
	export let onCollisionStart: (() => void) | undefined = undefined;
	export let onCollisionEnd: (() => void) | undefined = undefined;
	export let initialIsDragging = false;
	export let initialX: number = 0;
	export let initialY: number = 0;

	let rootRef: HTMLElement;
	let collides = false;
	let isDragging = false;
	let currentX = initialX;
	let currentY = initialY;
	let snapshotX: number | null = null;
	let snapshotY: number | null = null;
	let width = 0;
	let height = 0;

	const minX = 0;
	const minY = 0;
	let maxX = 0;
	let maxY = 0;

	const getObstacles = () => {
		if (!rootRef.parentElement) throw new Error("Missing parent for draggable element.");

		const obstacles = [...rootRef.parentElement.children]
			.filter(child => child !== rootRef)
			.filter((child: Element): child is HTMLElement => child instanceof HTMLElement);

		return obstacles;
	};

	const takeSnapshot = () => {
		snapshotX = currentX;
		snapshotY = currentY;
	};

	const resetSnapshot = () => {
		snapshotX = null;
		snapshotY = null;
	};

	const restoreSnapshot = () => {
		if (snapshotX === null || snapshotY === null) throw new Error("Cannot restore nullish snapshot coordinates.");

		moveElement(snapshotX, snapshotY);
		applyNextCollides(false);
	};

	const applyStyle = () => {
		rootRef.style.top = `${currentY}px`;
		rootRef.style.left = `${currentX}px`;
	};

	const startDragging = () => {
		isDragging = true;
		onDraggingStart?.();
		takeSnapshot();
	};

	const stopDragging = () => {
		if (collides) {
			restoreSnapshot();
			onDraggingFailure?.();
		} else {
			onDraggingSuccess?.(currentX, currentY);
		}
		onDraggingEnd?.();
		isDragging = false;
		resetSnapshot();
	};

	/**
	 * Returns whether the event's initial target is part of the draggable ref's descendance.
	 * This enables to know when an event occurred on the draggable ref through interaction with a nested element.
	 * For example if the draggable ref contains a span, clicking on the span corresponds to clicking on the draggable ref.
	 * @param event mouse event
	 * @returns whether the event occurred from the draggable ref's descendance
	 */
	const checkIfrootRefContainsTarget = (event: MouseEvent) => {
		if (!(event.target instanceof Element)) return false;

		return rootRef.contains(event.target);
	};

	const getNextCoordinates = (movementX: number, movementY: number) => {
		const nextX = currentX + movementX;
		const nextY = currentY + movementY;

		return { nextX, nextY };
	};

	const moveElement = (nextX: number, nextY: number) => {
		currentX = nextX;
		currentY = nextY;

		applyStyle();
	};

	const checkStrictHitbox = (nextX: number, nextY: number) => {
		let nextRestrainedX: number;
		let nextRestrainedY: number;

		const xIsTooLow = nextX < minX;
		const xIsTooHigh = nextX > maxX;
		const yIsTooLow = nextY < minY;
		const yIsTooHigh = nextY > maxY;

		if (xIsTooLow) nextRestrainedX = minX;
		else if (xIsTooHigh) nextRestrainedX = maxX;
		else nextRestrainedX = nextX;

		if (yIsTooLow) nextRestrainedY = minY;
		else if (yIsTooHigh) nextRestrainedY = maxY;
		else nextRestrainedY = nextY;

		return { nextRestrainedX, nextRestrainedY };
	};

	const checkSoftHitbox = (nextX: number, nextY: number) => {
		let nextCollides = false;
		getObstacles().forEach(obstacle => {
			const obstacleX = obstacle.offsetLeft;
			const obstacleY = obstacle.offsetTop;

			const obstacleStartX = obstacleX;
			const obstacleStartY = obstacleY;
			const obstacleEndX = obstacleX + obstacle.offsetWidth;
			const obstacleEndY = obstacleY + obstacle.offsetHeight;

			const topLeftCornerCollides = (nextX > obstacleStartX) && (nextX < obstacleEndX) && (nextY > obstacleStartY) && (nextY < obstacleEndY);
			const topRightCornerCollides = (nextX + width > obstacleStartX) && (nextX + width < obstacleEndX) && (nextY > obstacleStartY) && (nextY < obstacleEndY);
			const bottomLeftCornerCollides = (nextX > obstacleStartX) && (nextX < obstacleEndX) && (nextY + height > obstacleStartY) && (nextY + height < obstacleEndY);
			const bottomRightCornerCollides = (nextX + width > obstacleStartX) && (nextX + width < obstacleEndX) && (nextY + height > obstacleStartY) && (nextY + height < obstacleEndY);

			const currentCollides = topLeftCornerCollides || topRightCornerCollides || bottomLeftCornerCollides || bottomRightCornerCollides;

			if (currentCollides) nextCollides = true;
		});

		return nextCollides;
	};

	const _onCollisionStart = () => {
		collides = true;
		onCollisionStart?.();
	};

	const _onCollisionEnd = () => {
		collides = false;
		onCollisionEnd?.();
	};

	const applyNextCollides = (nextCollides: boolean) => {
		const startsColliding = !collides && nextCollides;
		const endsColliding = collides && !nextCollides;

		if (startsColliding) {
			_onCollisionStart();
		} else if (endsColliding) {
			_onCollisionEnd();
		}
	};

	const drag = (event: MouseEvent) => {
		const { nextX, nextY } = getNextCoordinates(event.movementX, event.movementY);

		const { nextRestrainedX, nextRestrainedY } = checkStrictHitbox(nextX, nextY);
		const nextCollides = checkSoftHitbox(nextRestrainedX, nextRestrainedY);

		applyNextCollides(nextCollides);

		moveElement(nextRestrainedX, nextRestrainedY);
	};

	let onMouseDown: ((event: MouseEvent) => void) | undefined;
	let onMouseUp: ((event: MouseEvent) => void) | undefined;
	let onMouseMove: ((event: MouseEvent) => void) | undefined;

	if (type === "clickAndRelease") {
		onMouseUp = (event: MouseEvent) => {
			if (!checkIfrootRefContainsTarget(event)) return;

			if (isDragging) {
				stopDragging();
			} else {
				startDragging();
			}
		};
	} else if (type === "clickAndHold") {
		onMouseDown = () => {
			startDragging();
		};

		onMouseUp = (event: MouseEvent) => {
			if (!checkIfrootRefContainsTarget(event)) return;

			stopDragging();
		};
	}

	onMouseMove = (event: MouseEvent) => {
		if (isDragging) {
			drag(event);
		}
	};

	onMount(() => {
		if (!rootRef.parentElement) throw new Error("Missing parent for draggable element.");

		width = rootRef.getBoundingClientRect().width;
		height = rootRef.getBoundingClientRect().height;
		maxX = rootRef.parentElement.clientWidth - rootRef.clientWidth;
		maxY = rootRef.parentElement.clientHeight - rootRef.clientHeight;

		applyStyle();
		if (initialIsDragging) startDragging();
	});
</script>

<svelte:window
	on:mouseup={onMouseUp}
	on:mousemove={onMouseMove}
/>
<div
	bind:this={rootRef}
	class="draggable"
	class:colliding={collides}
	class:dragged={isDragging}
	role="button"
	tabindex="0"
	on:mousedown={onMouseDown}
>
	<slot hasError={collides} />
</div>


<style lang="scss">
	.draggable {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: grab;
		position: absolute;
		z-index: 1;

		&.dragged {
			z-index: 2;
		}
	}
</style>