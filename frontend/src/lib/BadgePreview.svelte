<script lang="ts">
  import type { Badge } from '../types.js'

  export let badge: Badge = {
    key: '',
    updatedAt: '',
    url: '',
  }
</script>

<div>
  <img src={badge.url} alt={badge.key} class="block" />
  <button
    type="button"
    class="text-sky-500 hover:text-sky-700 focus:outline-none py-1 mr-3 text-sm text-center"
    on:click={() => navigator.clipboard.writeText(badge.url)}>Copy URL</button
  >
  <button
    type="button"
    class="text-sky-500 hover:text-sky-700 focus:outline-none py-1 mr-3 text-sm text-center"
    on:click={() => navigator.clipboard.writeText(`![](${badge.url})`)}
    >Copy Markdown</button
  >
</div>
