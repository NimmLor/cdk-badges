<script lang="ts">
  import { onMount } from 'svelte'
  import Skeleton from './lib/Skeleton.svelte'
  import Spinner from './lib/Spinner.svelte'
  import BadgePreview from './lib/BadgePreview.svelte'
  import type { Badge } from './types.js'
  import Filter from './lib/Filter.svelte'
  import BadgeCategory from './lib/BadgeCategory.svelte'

  let baseUrl = import.meta.env['VITE_API_URL'] ?? window.location.origin
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1)
  }
  const url = `${baseUrl}/badges`

  let response:
    | {
        baseUrl: string
        stackName: string
        badges: Array<Badge>
      }
    | undefined = undefined

  onMount(async () => {
    response = await fetch(url).then((r) => r.json())
  })

  let badges: Array<{ badge: Badge; isVisible }> = []

  $: badgesByStyle = badges.reduce((acc, badge) => {
    if (!acc[badge.badge.tags['style']]) {
      acc[badge.badge.tags['style']] = []
    }
    acc[badge.badge.tags['style']].push(badge)
    return acc
  }, {} as Record<string, Array<{ badge: Badge; isVisible }>>)

  $: badgesByLabel = badges.reduce((acc, badge) => {
    if (!acc[badge.badge.tags['label']]) {
      acc[badge.badge.tags['label']] = []
    }
    acc[badge.badge.tags['label']].push(badge)
    return acc
  }, {} as Record<string, Array<{ badge: Badge; isVisible }>>)

  let displayStyle: 'grid' | 'byStyle' | 'byLabel' = 'byStyle'
</script>

<main class="max-w-4xl px-4 pt-6 pb-32 mx-auto">
  <div class="max-w-3xl mx-auto">
    <div class="border-secondary border rounded-lg">
      <h2
        class="lg:p-4 border-secondary w-full p-2 text-lg font-semibold border-b"
      >
        {#if response}
          <div class="h-5 leading-5">
            {response.stackName}
          </div>
        {:else}
          <Skeleton class="w-32 h-5" />
        {/if}
      </h2>
      <Filter
        bind:filteredBadges={badges}
        allBadges={response?.badges}
        isLoading={!response}
      />
      <div class="lg:px-8 px-4 pb-8">
        {#if !response}
          <div class="mb-44 mt-8">
            <Spinner />
          </div>
        {:else if displayStyle === 'grid'}
          <div
            class="lg:grid-cols-2 gap-x-6 gap-y-4 grid transition-all duration-500"
          >
            {#each badges as badge}
              <BadgePreview badge={badge.badge} isVisible={badge.isVisible} />
            {/each}
          </div>
        {:else if displayStyle === 'byStyle'}
          {#each Object.entries(badgesByStyle) as style}
            <BadgeCategory label={style[0]} badges={style[1]} />
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
