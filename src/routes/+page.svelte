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

	const defaultText = 'กรุงเทพฯ · Bangkok';
	let text: string = decodedData[0] || defaultText;
	let color: string = decodedData[1] || '#fff';
	let pickerRef: HTMLButtonElement;
	let imageDom: HTMLElement;

	$: ogImageUrl = `https://bkk-sticker.vercel.app/i?t=${text}&c=${color.replace('#', '')}`;
	$: encodedData = `${base64.urlEncode(text)},${base64.urlEncode(color)}`;
	$: shareUrl = `https://bkk-sticker.vercel.app?d=${encodedData}`;

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

			// Gradually add text
			text = '';
			defaultText.split('').forEach((char, index) => {
				setTimeout(() => {
					text += char;
				}, 42 * index);
			});
		}
	});

	function copyImage() {
		htmlToImage
			.toJpeg(imageDom)
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
			.toJpeg(imageDom)
			.then(function (blob) {
				saveAs(blob, `bkk-sticker.png`);
				// saving = false
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
	}

	// OG
	const title = 'Bkk Sticker';
	const description = '';
</script>

<svelte:head>
	<title>{title}</title>

	<meta name="title" content={title} />
	<meta name="description" content={description} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta property="og:url" content={'https://bkk-sticker.vercel.app'} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImageUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImageUrl} />
</svelte:head>

<div class="container hero">
	<h1 class="text-6xl">Bkk Sticker</h1>

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

	<div class="flex items-center justify-center text-black w-4/5">
		<input
			type="text"
			bind:value={text}
			placeholder=""
			class="text-center rounded p-2 text-lg w-full"
		/>
	</div>

	<div class="flex gap-2 justify-center items-center w-full bottom-4 center">
		<span class="text-lg"> Share: </span>
		<Facebook class="h-10 w-10 rounded" url={shareUrl} text="" />
		<Twitter class="h-10 w-10 rounded" url={shareUrl} text="" />
	</div>

	<Canvas bind:color bind:text bind:imageDom />

	<!-- Credits -->
	<div>
		<div class="text-center text-sm text-gray-500">
			Credits: <a
				href="https://www.facebook.com/TheNickplus/posts/pfbid0bewW8HjvXtQi6ZwbmWro6XGEbHjE9nyXt44viBYAWGWMnLxGNQ5xX37hZQs1PaaUl"
				>Image</a
			>, Font Sao Chingcha
		</div>

		<!-- Github -->
		<div class="text-center text-sm text-gray-500">
			<a href="https://github.com/narze/bkk-sticker">Github</a>
		</div>
	</div>
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
