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

	import InAppSpy from "inapp-spy";
	const { isInApp } = InAppSpy();
	const isIOS = () => {
		const userAgent = navigator.userAgent || navigator.vendor || window.opera;
		return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
	}

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
	let bgColor = 'transparent';

	const ciColors = [
		['สีพื้นหลัง', 'transparent'],
		['Original', 'transparent'],
		['เขียว 1', '#205a41'],
		['เขียว 2', '#67a33b'],
		['เขียว 3', '#00c08b'],
		['ส้ม', '#ffb449'],
		['เหลือง', '#f8df52'],
		['น้ำเงิน', '#0071ce'],
		['ม่วง', '#480086']
	];

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

			const save: boolean = $page.url.searchParams.get('save') === 'true';
			if (!save) {
				// Gradually add text
				const textToType = text;
				text = '';
				textToType.split('').forEach((char, index) => {
					setTimeout(() => {
						text += char;
					}, 42 * index);
				});
			} else {
				saveImage();
			}
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
				if (!isInApp) {
					saveAs(blob, `bkk-sticker.jpg`);
				} else {
					if (isIOS()) {
						window.location.href = `com-apple-mobilesafari-tab:https://bkk-sticker.vercel.app/?d=${encodedData}&save=true`;
					} else {
						window.location.href = `intent:https://bkk-sticker.vercel.app/?d=${encodedData}&save=true#Intent;end`;
					}
				}
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
			สีตัวอักษร
		</button>

		<select
			class="bg-blue-500 hover: text-white font-bold py-2 px-4 rounded"
			on:change={(e) => (bgColor = e.target.value)}
		>
			{#each ciColors as [name, color]}
				<option value={color}>{name}</option>
			{/each}
		</select>

		<button
			on:click={() => copyImage()}
			class="bg-blue-500 hover: text-white font-bold py-2 px-4 rounded"
		>
			ก๊อปภาพ
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

	<Canvas bind:color bind:text bind:imageDom bind:bgColor />

	<!-- Credits -->
	<div>
		<div class="text-center text-sm">
			Credits: <a
				href="https://www.facebook.com/TheNickplus/posts/pfbid0bewW8HjvXtQi6ZwbmWro6XGEbHjE9nyXt44viBYAWGWMnLxGNQ5xX37hZQs1PaaUl"
				>Image</a
			>,
			<a
				href="https://www.facebook.com/bangkokbma/posts/pfbid02U5b4WCpdx59MN1Wnkpv3BJpuTXus63cTMKrFAZpV46jzBBTQNktDV7PYqouj9on8l"
				>Font Sao Chingcha</a
			>
		</div>

		<!-- Github -->
		<div class="text-center text-sm">
			<a href="https://github.com/narze/bkk-sticker">Github</a>
		</div>

		<div class="text-center text-sm">
			See also: <a href="https://working3times.narze.live">ทำงาน ทำงาน ทำงาน</a>
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
