<script lang="ts">
  import type { Badge } from '../types.js'
  import ChipToggle from './ChipToggle.svelte'
  import Skeleton from './Skeleton.svelte'

  let availableStyles: Array<string> = []
  let chipFilter: Record<string, boolean> = {}

  export let allBadges: Array<Badge> = []

  export let isLoading = false

  $: availableStyles = allBadges
    ? [...new Set(allBadges.map((b) => b.tags['style']))]
    : []

  $: chipFilter = availableStyles.reduce((acc, style) => {
    acc[style] = true
    return acc
  }, {} as Record<string, boolean>)

  export let filteredBadges: Array<{ badge: Badge; isVisible: boolean }> = []
  $: filteredBadges = allBadges.map((badge) => {
    const isVisible = Object.entries(chipFilter).some(
      ([style, isActive]) => isActive && badge.tags['style'] === style
    )
    return { badge, isVisible }
  })
</script>

<div>
  <div class="text-base font-medium">Filter by style:</div>
  <div class="wrap flex space-x-3">
    {#each Object.entries(chipFilter) as styleFilter}
      <div class="mt-2">
        <ChipToggle
          isActive={styleFilter[1]}
          label={styleFilter[0]}
          onToggle={() =>
            (chipFilter[styleFilter[0]] = !chipFilter[styleFilter[0]])}
        />
      </div>
    {/each}
    {#if isLoading}
      <Skeleton class="h-7 !rounded-full w-24 mt-2" />
      <Skeleton class="h-7 !rounded-full w-28 mt-2" />
      <Skeleton class="h-7 !rounded-full w-20 mt-2" />
    {/if}
  </div>
</div>
