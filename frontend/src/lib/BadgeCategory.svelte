<script lang="ts">
  import type { Badge } from '../types.js'
  import BadgePreview from './BadgePreview.svelte'

  export let label = ''
  export let badges: Array<{ badge: Badge; isVisible: boolean }> = []
</script>

{#if badges.filter(({ isVisible }) => isVisible).length > 0}
  <div class="border-secondary mt-4 border-b">
    <h3 class="p-2 text-lg font-semibold">{label}</h3>
    <div class="grid grid-cols-2 gap-4 p-2">
      {#each badges as badge}
        <BadgePreview badge={badge.badge} isVisible={badge.isVisible} />
      {/each}
    </div>
  </div>
{/if}
