<script lang="ts">
    import Icon from "@iconify/svelte";
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
	export let draggableRef: HTMLElement;

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
		if (!draggableRef.parentElement) throw new Error("Missing parent for draggable element.");

		const obstacles = [...draggableRef.parentElement.children]
			.filter(child => child !== draggableRef)
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
		draggableRef.style.top = `${currentY}px`;
		draggableRef.style.left = `${currentX}px`;
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
	const checkIfDraggableRefContainsTarget = (event: MouseEvent) => {
		if (!(event.target instanceof Element)) return false;

		return draggableRef.contains(event.target);
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

			const topLeftCornerCollides = (nextX > obstacleStartX) && (nextX <= obstacleEndX) && (nextY > obstacleStartY) && (nextY <= obstacleEndY);
			const topRightCornerCollides = (nextX + width > obstacleStartX) && (nextX + width <= obstacleEndX) && (nextY > obstacleStartY) && (nextY <= obstacleEndY);
			const bottomLeftCornerCollides = (nextX > obstacleStartX) && (nextX <= obstacleEndX) && (nextY + height > obstacleStartY) && (nextY + height <= obstacleEndY);
			const bottomRightCornerCollides = (nextX + width > obstacleStartX) && (nextX + width <= obstacleEndX) && (nextY + height > obstacleStartY) && (nextY + height <= obstacleEndY);

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
			if (!checkIfDraggableRefContainsTarget(event)) return;

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
			if (!checkIfDraggableRefContainsTarget(event)) return;

			stopDragging();
		};
	}

	onMouseMove = (event: MouseEvent) => {
		if (isDragging) {
			drag(event);
		}
	};

	onMount(() => {
		if (!draggableRef.parentElement) throw new Error("Missing parent for draggable element.");

		width = draggableRef.getBoundingClientRect().width;
		height = draggableRef.getBoundingClientRect().height;
		maxX = draggableRef.parentElement.clientWidth - draggableRef.clientWidth;
		maxY = draggableRef.parentElement.clientHeight - draggableRef.clientHeight;

		applyStyle();
		if (initialIsDragging) startDragging();
	});
</script>

<svelte:window
	on:mouseup={onMouseUp}
	on:mousemove={onMouseMove}
/>
<div
	class="draggable"
	class:colliding={collides}
	role="button"
	tabindex="0"
	on:mousedown={onMouseDown}
>
	<div class="draggable-dragIconWrapper">
		<Icon icon="fa-solid:arrows-alt" />
	</div>
</div>

<style lang="scss">
	.draggable {
		border-radius: 6px;
		opacity: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: grab;
		flex: 1;
		height: 100%;

		&:not(&:first-child) {
			border-top-left-radius: initial;
			border-bottom-left-radius: initial;
		}

		&:not(&:last-child) {
			border-top-right-radius: initial;
			border-bottom-right-radius: initial;
		}

		&:hover {
			opacity: 1;
		}

		&-dragIconWrapper {
			line-height: 0;
			padding: 4px;
			border-radius: 9999px;
			background-color: rgba($outer-background, 1);
		}

		&.colliding {
			background-color: $error-background;
			color: $error-text;
		}
	}
</style>