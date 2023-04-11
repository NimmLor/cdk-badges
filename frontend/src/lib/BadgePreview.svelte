<script lang="ts">
  import type { Badge } from '../types.js'

  export let badge: Badge = {
    key: '',
    updatedAt: '',
    url: '',
    tags: {},
  }

  export let isVisible = true
</script>

<div class={`transition-all duration-200 ${isVisible ? 'fadein' : 'fadeout'}`}>
  <img src={badge.url} alt={badge.key} class="block" />
  <button
    type="button"
    class="text-sky-500 hover:text-sky-700 focus:outline-none underline-offset-1 py-1 mr-3 text-sm text-center underline"
    on:click={() => navigator.clipboard.writeText(badge.url)}>Copy URL</button
  >
  <button
    type="button"
    class="text-sky-500 hover:text-sky-700 focus:outline-none underline-offset-1 py-1 mr-3 text-sm text-center underline"
    on:click={() => navigator.clipboard.writeText(`![](${badge.url})`)}
    >Copy Markdown</button
  >
</div>

<style>
  /* animate fadeout, decrease opacity to 0, then set position to absolute using keyframes */
  .fadeout {
    animation: fadeout 400ms forwards;
  }

  @keyframes fadeout {
    0% {
      opacity: 1;
    }
    40% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      position: absolute;
    }
  }

  .fadein {
    animation: fadein 300ms forwards;
  }

  @keyframes fadein {
    0% {
      opacity: 0;
      /* position: absolute; */
    }
    100% {
      opacity: 1;
    }
  }
</style>
