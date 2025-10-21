
<script lang="ts">
  import { get } from 'svelte/store';
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/translations';
  import { createEventDispatcher } from 'svelte';

  export let tip: any;

  const dispatch = createEventDispatcher();
  const t = get(translations);
  $: currentLanguage = get(language);

  function closeModal() {
    dispatch('close');
  }

  // Handle clicks inside the modal to prevent closing
  function onModalClick(event: MouseEvent) {
    event.stopPropagation();
  }
</script>

<div class="modal-backdrop" on:click={closeModal}>
  <div class="modal-box w-11/12 max-w-4xl" on:click={onModalClick}>
    <button class="btn btn-sm btn-circle absolute right-2 top-2" on:click={closeModal}>✕</button>
    
    <h3 class="text-3xl font-bold mb-4">{tip.title[currentLanguage]}</h3>
    <img src={tip.image} alt={tip.title[currentLanguage]} class="w-full h-64 object-cover rounded-lg mb-4">

    <div class="prose max-w-none">
        <p class="lead">{tip.detail.intro[currentLanguage]}</p>

        <h4>{t.hair_care_modal_do_title}</h4>
        <ul>
            {#each tip.detail.do[currentLanguage] as item}
                <li>{item}</li>
            {/each}
        </ul>

        <h4>{t.hair_care_modal_dont_title}</h4>
        <ul>
            {#each tip.detail.dont[currentLanguage] as item}
                <li>{item}</li>
            {/each}
        </ul>

        {#if tip.detail.products && tip.detail.products.length > 0}
            <h4 class="mt-6">{t.hair_care_modal_products_title}</h4>
            <div class="flex flex-wrap gap-4">
                {#each tip.detail.products as productKey}
                    <a href="/product/{productKey}" class="underline hover:text-primary">
                      {t[`products_${productKey}_name`]}
                    </a>
                {/each}
            </div>
        {/if}
    </div>

    <div class="modal-action mt-6">
      <button class="btn" on:click={closeModal}>{t.hair_care_modal_close_button}</button>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  .modal-box {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  .prose {
      color: black;
  }
</style>
