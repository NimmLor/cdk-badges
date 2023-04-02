<script lang="ts">
  import { onMount } from 'svelte'

  const url =
    'https://nfedae3rdd7k2f34lgebnvenca0jisps.lambda-url.eu-central-1.on.aws/badges'

  let response:
    | {
        baseUrl: string
        stackName: string
        badges: Array<{ key: string; updatedAt: string; url: string }>
      }
    | undefined = undefined

  onMount(async () => {
    response = await fetch(url).then((r) => r.json())
  })
</script>

<main class="max-w-4xl pt-6 pb-32 px-4 mx-auto">
  <div class="max-w-3xl mx-auto">
    <div class="border border-gray-700 rounded-lg">
      <h2
        class="w-full border-b border-gray-700 p-2 lg:p-4 font-semibold text-lg"
      >
        {response?.stackName ?? ''}
      </h2>
      <div class="grid lg:grid-cols-2 gap-x-6 gap-y-4 p-4 lg:p-8">
        {#if !response}
          <p>Loading...</p>
        {/if}
        {#if response}
          {#each response.badges as badge}
            <div>
              <img src={badge.url} alt={badge.key} class="block" />
              <button
                type="button"
                class="py-1 mr-3 text-sm text-center text-sky-500 hover:text-sky-700 focus:outline-none"
                on:click={() => navigator.clipboard.writeText(badge.url)}
                >Copy URL</button
              >
              <button
                type="button"
                class="py-1 mr-3 text-sm text-center text-sky-500 hover:text-sky-700 focus:outline-none"
                on:click={() =>
                  navigator.clipboard.writeText(`![](${badge.url})`)}
                >Copy Markdown</button
              >
            </div>
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
