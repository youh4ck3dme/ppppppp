
<script lang="ts">
  import { get } from 'svelte/store';
  import { translations } from '$lib/translations';
  import { createEventDispatcher } from 'svelte';

  export let categories: string[];
  export let selectedCategory: string;

  const dispatch = createEventDispatcher();

  const t = get(translations);

  function selectCategory(category: string) {
    dispatch('categorySelect', category);
  }
</script>

<div class="filters mb-8 flex flex-wrap justify-center gap-2">
  <button
    class="btn {selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}"
    on:click={() => selectCategory('all')}
  >
    {t.hair_care_filter_all}
  </button>
  {#each categories as category}
    <button
      class="btn {selectedCategory === category ? 'btn-primary' : 'btn-outline'}"
      on:click={() => selectCategory(category)}
    >
      {t[`hair_care_category_${category}`] || category}
    </button>
  {/each}
</div>
