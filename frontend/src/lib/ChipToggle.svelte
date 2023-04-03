<script lang="ts">
  export let isActive = false
  export let label = ''
  export let onToggle = () => {}
</script>

<div>
  <button
    class="rounded-full px-2.5 h-7 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset flex items-center transition-all duration-100 select-none"
    on:click={onToggle}
    aria-pressed={isActive}
  >
    <svg
      class={`w-4 h-4 mt-[3px] mr-1 transition-all duration-100 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <!-- Checkmark icon -->
      <path
        fill-rule="evenodd"
        d="M7.293 13.707a1 1 0 01-1.414 0L3 10.414a1 1 0 111.414-1.414L7 11.586l7.293-7.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0z"
        clip-rule="evenodd"
      />
    </svg>
    <span class="text-md">
      {label}
    </span>
  </button>
</div>

<style>
  button[aria-pressed='true'] {
    @apply bg-slate-700 text-white ring-slate-700;
  }

  button[aria-pressed='false'] {
    @apply bg-primary text-slate-300 ring-slate-800;
  }
</style>
