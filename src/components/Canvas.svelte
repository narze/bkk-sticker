<script lang="ts">
	export let color = '#fff';
	export let text = '';
	export let imageDom: HTMLElement;

	const thaiNumerals = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
	$: transformedText = text.replace(/\d/g, (digit) => thaiNumerals[parseInt(digit)]);

	function updateFontSizeAndPosition() {
		if (imageDom) {
			const parentHeight = imageDom.clientHeight;
			const fontSize = parentHeight * 0.05; // Adjust the multiplier as needed
			const topPosition = parentHeight * 0.505; // % of parent height

			imageDom.style.setProperty('--font-size', `${fontSize}px`);
			imageDom.style.setProperty('--top-position', `${topPosition}px`);
		}
	}

	$: {
		updateFontSizeAndPosition();
	}

	onMount(() => {
		window.addEventListener('resize', updateFontSizeAndPosition);

		updateFontSizeAndPosition();
	});

	import { onDestroy, onMount } from 'svelte';
	onDestroy(() => {
		window.removeEventListener('resize', updateFontSizeAndPosition);
	});
</script>

<div
	class="relative w-full max-w-5xl aspect-square mx-auto flex items-center justify-center overflow-visible"
	bind:this={imageDom}
>
	<img
		src="/images/bg.jpg"
		class="absolute inset-0 w-full h-full aspect-square z-10"
		alt="template"
	/>

	<span
		class="relative z-20"
		style={`color: ${color}; font-size: var(--font-size); top: var(--top-position);`}
		>{transformedText}</span
	>
</div>

<style>
	span {
		position: absolute;
	}
</style>
