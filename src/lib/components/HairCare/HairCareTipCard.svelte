
<script lang="ts">
  import { get } from 'svelte/store';
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/translations';

  export let tip: any;
  export let onClick: () => void;

  $: t = get(translations);
  $: currentLanguage = get(language);

  $: title = tip.title[currentLanguage];
  $: description = tip.description[currentLanguage];
  $: image = tip.image;

</script>

<div class="card bg-base-100 shadow-xl transition-transform transform hover:scale-105 cursor-pointer" on:click={onClick}>
  <figure class="aspect-h-1 aspect-w-1 w-full overflow-hidden">
    <img src={image} alt={title} class="h-full w-full object-cover object-center" />
  </figure>
  <div class="card-body">
    <h2 class="card-title text-lg font-bold">{title}</h2>
    <p class="text-sm">{description}</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary btn-sm">{t.hair_care_read_more}</button>
    </div>
  </div>
</div>
