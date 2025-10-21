
<script lang="ts">
  import { get } from 'svelte/store';
  import { translations } from '$lib/translations';
  import HairCareTipCard from '$lib/components/HairCare/HairCareTipCard.svelte';
  import HairCareFilters from '$lib/components/HairCare/HairCareFilters.svelte';
  import HairCareQuiz from '$lib/components/HairCare/HairCareQuiz.svelte';
  import TipModal from '$lib/components/HairCare/TipModal.svelte';

  const t = get(translations);
  const allTips = t.hair_care_tips;
  const categories = t.hair_care_categories;

  let filteredTips = allTips;
  let selectedCategory = 'all';
  let selectedTip: any = null;
  let showQuiz = false;

  function handleCategorySelect(event: CustomEvent<string>) {
    selectedCategory = event.detail;
    showQuiz = false; // Hide quiz when a filter is selected
    if (selectedCategory === 'all') {
      filteredTips = allTips;
    } else {
      filteredTips = allTips.filter(tip => tip.category === selectedCategory);
    }
  }

  function handleQuizComplete(event: CustomEvent<string[]>) {
    const recommendedCategories = event.detail;
    // Filter tips based on the top 2 recommended categories
    filteredTips = allTips.filter(tip => recommendedCategories.includes(tip.category));
    // You might want to automatically select a filter button or show a specific title
    selectedCategory = 'all'; // Reset visual filter selection
    showQuiz = true; // Keep quiz visible to show results
  }

  function handleQuizReset() {
    showQuiz = false;
    selectedCategory = 'all';
    filteredTips = allTips;
  }
  
  function openTipModal(tip: any) {
    selectedTip = tip;
  }

  function closeModal() {
    selectedTip = null;
  }

</script>

<svelte:head>
  <title>{t.hair_care_title}</title>
  <meta name="description" content={t.hair_care_meta_description} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold text-center mb-4">{t.hair_care_header}</h1>
  <p class="text-xl text-center text-gray-600 mb-8">{t.hair_care_subheader}</p>

  <!-- Toggle Quiz Button -->
  <div class="text-center mb-8">
      <button class="btn btn-lg btn-accent" on:click={() => { showQuiz = !showQuiz; if (!showQuiz) handleQuizReset(); }}>
          {showQuiz ? t.hair_care_hide_quiz_button : t.hair_care_show_quiz_button}
      </button>
  </div>

  <!-- Quiz Component -->
  {#if showQuiz}
      <HairCareQuiz 
          on:quizComplete={handleQuizComplete} 
          on:quizReset={handleQuizReset}
      />
  {/if}

  <!-- Filters Component -->
  <div class:hidden={showQuiz}>
    <HairCareFilters {categories} {selectedCategory} on:categorySelect={handleCategorySelect} />
  </div>

  <!-- Tips Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" class:hidden={showQuiz}>
    {#each filteredTips as tip}
      <HairCareTipCard {tip} onClick={() => openTipModal(tip)} />
    {/each}
  </div>

  <!-- Modal -->
  {#if selectedTip}
    <TipModal tip={selectedTip} on:close={closeModal} />
  {/if}

</div>
