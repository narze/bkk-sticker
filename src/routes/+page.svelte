<script lang="ts">
	import Canvas from '../components/Canvas.svelte';
	import Picker from 'vanilla-picker';
	import { saveAs } from 'file-saver';
	import { copyImageToClipboard } from 'copy-image-clipboard';
	import * as htmlToImage from 'html-to-image';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let text: string = `${new Date().getMonth() + 1}`;
	let color: string = '#ff7300';
	let pickerRef: HTMLButtonElement;
	let imageDom: HTMLElement;

	$: shareUrl = `https://sunny-pass.vercel.app/i?t=${text}&c=${color.replace('#', '')}`;

	onMount(() => {
		if (browser) {
			const picker = new Picker({
				parent: pickerRef,
				color: color,
				alpha: false
			});

			picker.onChange = (pickedColor) => {
				color = pickedColor.hex.substring(0, 7);
			};
		}
	});

	function copyImage() {
		htmlToImage
			.toPng(imageDom)
			.then(function (dataUrl) {
				const img = new Image();
				img.src = dataUrl;
				copyImageToClipboard(img.src);
				// saving = false
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
				console.log(error.message);
			});
	}

	function saveImage() {
		htmlToImage
			.toPng(imageDom)
			.then(function (blob) {
				saveAs(blob, `sunny-pass.png`);
				// saving = false
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
	}
</script>

<div class="container hero">
	<h1 class="text-6xl">
		<span class="highlight">Sunny</span> Pass
		<div class="text-3xl mt-2">
			แคล้วคลาด<span class="highlight">พ้นภัย</span>
		</div>
	</h1>

	<div class="flex gap-4">
		<button bind:this={pickerRef} class="bg-blue-500 hover: text-white font-bold py-2 px-4 rounded">
			เปลี่ยนสี
		</button>
		<button
			on:click={() => copyImage()}
			class="bg-blue-500 hover: text-white font-bold py-2 px-4 rounded"
		>
			ก็อปภาพ
		</button>
		<button
			on:click={() => saveImage()}
			class="bg-blue-500 hover: text-white font-bold py-2 px-4 rounded"
		>
			เซฟภาพ
		</button>
	</div>

	<div class="flex items-center justify-center text-black">
		<input
			type="text"
			bind:value={text}
			placeholder="เดือน (?)"
			class="text-center rounded p-2 text-xl"
		/>
	</div>

	<Canvas bind:color bind:text bind:imageDom />

	<input value={shareUrl} readonly class="text-black w-64" />
</div>

<style lang="postcss">
	.hero {
		display: flex;
		vertical-align: middle;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		gap: 40px;
	}

	@media screen and (min-width: 768px) {
		.hero {
			gap: 60px;
		}
	}
</style>
