<script lang="ts">
  import { IconCheck } from '@tabler/icons-svelte'
  export let isActive = false
  export let label = ''
  export let onToggle = () => {}
  export let disabled = false
</script>

<div>
  <button
    class="rounded-full px-2.5 h-8 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset flex items-center transition-all duration-100 select-none"
    on:click={onToggle}
    aria-pressed={isActive}
    {disabled}
  >
    {#if disabled !== true}
      <IconCheck
        class={`w-4 h-4 mt-[1px] mr-1 transition-all duration-100 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
        stroke={2.5}
      />
    {/if}
    <span class="text-md whitespace-nowrap tracking-wide">
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

  button[disabled] {
    @apply bg-slate-800 text-slate-500 ring-slate-900 cursor-not-allowed;
  }
</style>
