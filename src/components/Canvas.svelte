<script lang="ts">
	export let color: string = '#fff';
	export let text: string = '';
	export let imageDom: HTMLElement;

	const thaiNumerals = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
	$: transformedText = text.replace(/\d/g, (digit) => thaiNumerals[parseInt(digit)]);
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

	<span class="relative z-20 mt-14 text-4xl" style={`color: ${color}`}>{transformedText}</span>
</div>

<style>
	svg text {
		fill: #675cee;
	}

	svg text.stroked {
		fill: #675cee;
		stroke: white;
		stroke-linejoin: round;
	}
</style>
