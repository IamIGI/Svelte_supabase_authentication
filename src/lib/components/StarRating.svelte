<script lang="ts">
	interface StarRatingProps {
		value: number;
		isReadOnly?: boolean;
		updateDatabaseRating?: (newRating: number) => void;
	}

	let { isReadOnly, value, updateDatabaseRating }: StarRatingProps = $props();

	function handleRating(newRating: number) {
		value = newRating;
		if (updateDatabaseRating) updateDatabaseRating(newRating);
	}
</script>

<!-- image || group of inputs -->
<div
	class="rating"
	role={isReadOnly ? 'img' : 'group'}
	aria-label={isReadOnly ? `Rated ${value} out of 5 stars` : 'Rate this book'}
	aria-readonly={isReadOnly}
>
	<div class="rating-container">
		{#each Array(5) as _, i}
			<button
				type="button"
				class="star"
				aria-label={isReadOnly ? 'Rated' : 'Rate' + ` ${i + 1} out of 5 stars`}
				aria-pressed={!isReadOnly && value > i}
				onclick={() => handleRating(i + 1)}
				disabled={isReadOnly}
			>
				<span
					class="star-icon"
					style="--fill: {value > i ? 'gold' : 'rgba(100, 100, 100, 0.15)'}"
				>
					★
				</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.rating-container {
		display: inline-flex;
		outline: none;
	}

	.star {
		background: none;
		border: none;
		outline: none;
		cursor: pointer;
		padding: 0;
		font-size: 32px;
		color: transparent;
	}

	.star span {
		display: inline-block;
		color: var(--fill);
	}
</style>
