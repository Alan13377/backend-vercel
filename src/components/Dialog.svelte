<script>
	import { isOverlayOpen } from '../stores/OverlayStore';
</script>

<div
	class="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-gray-400 opacity-90 z-40"
>
	<div class="bg-white text-lg font-bold rounded-md px-8 py-10 relative max-w-lg">
		<button
			class="absolute top-2 right-3 text-4xl text-gray-300 hover:-translate-y-0.5 transition-transform"
			on:click={() => {
				isOverlayOpen.set(false);
			}}>&times;</button
		>
		<slot />
	</div>
</div>
