<script lang="ts">
	import Canvas from '../components/Canvas.svelte';

	let text: string = `${new Date().getMonth() + 1}`;
	let color: string = '#ff7300';
	let pickerRef: HTMLButtonElement;

	function copyImage() {}

	function saveImage() {}
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

	<Canvas bind:color bind:text />
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

	.hero p {
		color: white;
		margin: 0;
		font-size: 1rem;
	}

	.button-group {
		display: flex;
		flex-direction: row;
		gap: 24px;
	}

	.label {
		drop-shadow: 0 1.2px 1.2px rgba(0, 0, 0, 0.8);
	}

	@media screen and (min-width: 768px) {
		.hero {
			gap: 60px;
		}

		.hero p {
			font-size: 1.3rem;
		}
	}
</style>
