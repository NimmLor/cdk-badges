<script lang="ts">
  import type { Badge } from '../types.js'
  import ChipToggle from './ChipToggle.svelte'
  import Skeleton from './Skeleton.svelte'

  let availableChoices: Array<string> = []
  export let chipFilter: Record<string, boolean> = {}

  export let allBadges: Array<Badge> = []

  export let isLoading = false

  export let filterTagProperty: keyof Badge['tags'] = 'style'

  export let label = ''

  $: availableChoices = allBadges
    ? [...new Set(allBadges.map((b) => b.tags[filterTagProperty]))]
    : []

  $: chipFilter = availableChoices.reduce((acc, choiceKey) => {
    acc[choiceKey] = true
    return acc
  }, {} as Record<string, boolean>)
</script>

<div>
  <div class="text-base font-medium">{label}</div>
  <div class="flex flex-wrap">
    {#each Object.entries(chipFilter) as choice}
      <div class="mt-2 mr-3">
        <ChipToggle
          isActive={choice[1]}
          label={choice[0]}
          onToggle={() => {
            chipFilter[choice[0]] = !chipFilter[choice[0]]

            // select all if none are selected
            // if (Object.values(chipFilter).every((v) => !v)) {
            //   Object.keys(chipFilter).forEach((choiceKey) => {
            //     chipFilter[choiceKey] = true
            //   })
            // }
          }}
        />
      </div>
    {/each}
    {#if !isLoading && availableChoices.length === 0}
      <div class="mt-2 mr-3">
        <ChipToggle isActive={false} disabled={true} label="No badges found" />
      </div>
    {/if}
    {#if isLoading}
      <Skeleton class="h-7 !rounded-full mr-3 w-24 mt-2" />
      <Skeleton class="h-7 !rounded-full mr-3 w-28 mt-2" />
      <Skeleton class="h-7 !rounded-full mr-3 w-20 mt-2" />
    {/if}
  </div>
</div>
