<script lang="ts">
  import { onMount } from 'svelte'
  import Skeleton from './lib/Skeleton.svelte'
  import Spinner from './lib/Spinner.svelte'
  import BadgePreview from './lib/BadgePreview.svelte'
  import type { Badge } from './types.js'

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
      <div class="lg:grid-cols-2 gap-x-6 gap-y-4 lg:p-8 grid p-4">
        {#if !response}
          <div>
            <Spinner />
          </div>
        {/if}
        {#if response}
          {#each response.badges as badge}
            <BadgePreview {badge} />
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
