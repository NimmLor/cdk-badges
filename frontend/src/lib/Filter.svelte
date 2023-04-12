<script lang="ts">
  import type { Badge } from '../types.js'
  import ChipToggle from './ChipToggle.svelte'
  import Skeleton from './Skeleton.svelte'

  let availableStyles: Array<string> = []
  export let chipFilter: Record<string, boolean> = {}

  export let allBadges: Array<Badge> = []

  export let isLoading = false

  export let filterTagProperty: keyof Badge['tags'] = 'style'

  export let label = ''

  $: availableStyles = allBadges
    ? [...new Set(allBadges.map((b) => b.tags[filterTagProperty]))]
    : []

  $: chipFilter = availableStyles.reduce((acc, style) => {
    acc[style] = true
    return acc
  }, {} as Record<string, boolean>)
</script>

<div>
  <div class="text-base font-medium">{label}</div>
  <div class="flex flex-wrap">
    {#each Object.entries(chipFilter) as styleFilter}
      <div class="mt-2 mr-3">
        <ChipToggle
          isActive={styleFilter[1]}
          label={styleFilter[0]}
          onToggle={() => {
            chipFilter[styleFilter[0]] = !chipFilter[styleFilter[0]]
            if (Object.values(chipFilter).every((v) => !v)) {
              Object.keys(chipFilter).forEach((style) => {
                chipFilter[style] = true
              })
            }
          }}
        />
      </div>
    {/each}
    {#if isLoading}
      <Skeleton class="h-7 !rounded-full mr-3 w-24 mt-2" />
      <Skeleton class="h-7 !rounded-full mr-3 w-28 mt-2" />
      <Skeleton class="h-7 !rounded-full mr-3 w-20 mt-2" />
    {/if}
  </div>
</div>
