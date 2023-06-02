<script lang="ts">
	import Canvas from '../components/Canvas.svelte';
	import Picker from 'vanilla-picker';
	import { saveAs } from 'file-saver';
	import { copyImageToClipboard } from 'copy-image-clipboard';
	import * as htmlToImage from 'html-to-image';
	import { onMount } from 'svelte';
	import { Facebook, Twitter } from 'svelte-share-buttons-component';
	import * as base64 from 'base64util';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let data = $page.url.searchParams.get('d') || '';
	let decodedData = data.split(',').map((d) => {
		try {
			return base64.urlDecode(d);
		} catch (e) {
			return null;
		}
	});

	let text: string = decodedData[0] || `${new Date().getMonth() + 1}`;
	let color: string = decodedData[1] || '#ff7300';
	let pickerRef: HTMLButtonElement;
	let imageDom: HTMLElement;

	$: ogImageUrl = `https://sunny-pass.vercel.app/i?t=${text}&c=${color.replace('#', '')}`;
	$: encodedData = `${base64.urlEncode(text)},${base64.urlEncode(color)}`;
	$: shareUrl = `https://sunny-pass.vercel.app?d=${encodedData}`;

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

	// OG
	const title = 'Sunny Pass';
	const description = 'แคล้วคลาดปลอดภัย';
</script>

<svelte:head>
	<title>{title}</title>

	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta property="og:url" content={'https://sunny-pass.vercel.app'} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImageUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImageUrl} />
</svelte:head>

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

	<div class="flex gap-2 justify-center items-center w-full bottom-4 center">
		<span class="text-lg"> Share: </span>
		<Facebook class="h-10 w-10 rounded" url={shareUrl} text="สร้างสติ๊กเกอร์ของคุณได้ที่นี่" />
		<Twitter class="h-10 w-10 rounded" url={shareUrl} text="สร้างสติ๊กเกอร์ของคุณได้ที่นี่" />
	</div>

	<Canvas bind:color bind:text bind:imageDom />
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
