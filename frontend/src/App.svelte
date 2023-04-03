<script lang="ts">
  import { onMount } from 'svelte'
  import Skeleton from './lib/Skeleton.svelte'
  import Spinner from './lib/Spinner.svelte'
  import BadgePreview from './lib/BadgePreview.svelte'
  import type { Badge } from './types.js'
  import ChipToggle from './lib/ChipToggle.svelte'

  let baseUrl = import.meta.env['VITE_API_URL'] ?? window.location.origin
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1)
  }
  const url = `${baseUrl}/badges`

  let availableStyles: Array<string> = []
  let chipFilter: Record<string, boolean> = {}

  let response:
    | {
        baseUrl: string
        stackName: string
        badges: Array<Badge>
      }
    | undefined = undefined

  onMount(async () => {
    response = await fetch(url).then((r) => r.json())
    availableStyles = response?.badges
      ? [...new Set(response.badges.map((b) => b.tags['style']))]
      : []

    chipFilter = availableStyles.reduce((acc, style) => {
      acc[style] = true
      return acc
    }, {} as Record<string, boolean>)
  })

  // calculate filteredBadges on every change of chipFilter
  $: filteredBadges = () => {
    if (!response) {
      return []
    }

    return response.badges.map((badge) => {
      const isVisible = Object.entries(chipFilter).some(
        ([style, isActive]) => isActive && badge.tags['style'] === style
      )
      return { ...badge, isVisible }
    })
  }
</script>

<main class="max-w-4xl px-4 pt-6 pb-32 mx-auto">
  <div class="max-w-3xl mx-auto">
    <div class="border border-gray-700 rounded-lg">
      <h2
        class="lg:p-4 w-full p-2 text-lg font-semibold border-b border-gray-700"
      >
        {#if response}
          <div class="h-5">
            {response?.stackName ?? 'Failed to load'}
          </div>
        {:else}
          <Skeleton class="w-32 h-5" />
        {/if}
      </h2>
      <div class="lg:p-8 p-4">
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
        </div>
      </div>
      <div
        class="lg:grid-cols-2 grid-flow-dense gap-x-6 gap-y-4 lg:p-8 grid p-4 transition-all duration-500 min-h-[30rem]"
      >
        {#if !response}
          <div>
            <Spinner />
          </div>
        {/if}
        {#if response}
          {#each filteredBadges() as badge}
            <BadgePreview {badge} isVisible={badge.isVisible} />
          {/each}
        {/if}
      </div>
    </div>
    <div class="mt-4 text-right">
      powered by
      <a
        href="https://github.com/NimmLor/cdk-badges"
        class="link"
        target="_blank">cdk-badges</a
      >
    </div>
  </div>
</main>
