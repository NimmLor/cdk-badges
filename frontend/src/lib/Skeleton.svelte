<script lang="ts">
  let clazz = ''
  export { clazz as class }
</script>

<div role="status" class="animate-pulse max-w-sm">
  <div class={`skeleton-bar ${clazz}`} />
</div>

<style>
  .skeleton-bar {
    @apply bg-gray-700 rounded-md;
  }
</style>
