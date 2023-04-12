<script lang="ts">
  import {
    IconCode,
    IconList,
    IconSignature,
    IconSparkles,
  } from '@tabler/icons-svelte'

  type DisplayMode = 'grid' | 'byStyle' | 'byLabel' | 'byService'

  export let value: DisplayMode = 'grid'
  export let onChange = (value: DisplayMode) => value
</script>

<div class="mt-auto">
  <div
    class="border-secondary divide-secondary inline-flex h-8 overflow-hidden border divide-x rounded-lg"
  >
    <button
      type="button"
      aria-pressed={value === 'byLabel'}
      on:click={() => onChange('byLabel')}
    >
      <IconSignature class="w-4 h-4 mr-2" /> by Label
    </button>
    <button
      type="button"
      aria-pressed={value === 'byService'}
      on:click={() => onChange('byService')}
    >
      <IconCode class="w-4 h-4 mr-2" /> by Service
    </button>
    <button
      type="button"
      aria-pressed={value === 'byStyle'}
      on:click={() => onChange('byStyle')}
    >
      <IconSparkles class="w-4 h-4 mr-2" /> by Style
    </button>
    <button
      type="button"
      aria-pressed={value === 'grid'}
      on:click={() => onChange('grid')}
    >
      <IconList class="w-4 h-4 mr-2" /> List
    </button>
  </div>
</div>

<style lang="postcss">
  button {
    @apply inline-flex items-center px-3 py-2 text-center text-xs font-medium transition-colors duration-200 whitespace-nowrap;
  }

  button[aria-pressed='true'] {
    @apply bg-slate-700 text-white ring-slate-700;
  }

  button[aria-pressed='false'] {
    @apply bg-primary text-slate-300 ring-slate-800;
  }
</style>
