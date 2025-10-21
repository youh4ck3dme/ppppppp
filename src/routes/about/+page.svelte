
<script lang="ts">
  import ProfileCard from '$lib/components/About/ProfileCard.svelte';
  import { translations } from '$lib/translations';

  let t: any;
  translations.subscribe(value => {
    t = value;
  });

  const founder = t.team?.founder;
  const teamMembers = t.team?.members || [];
</script>

<div class="container mx-auto px-4 py-16">
  <svelte:head>
    <title>{t.about_us_title || 'O nás'}</title>
  </svelte:head>

  <!-- Founder Section -->
  {#if founder}
    <section class="mb-20 text-center">
        <h1 class="text-4xl font-bold tracking-tight mb-4">{t.about_us_header || 'Náš Tím'}</h1>
        <p class="text-lg text-gray-600 mb-12">{t.about_us_subheader || 'Ľudia, ktorí sa postarajú o vaše vlasy.'}</p>
        <div class="max-w-2xl mx-auto">
            <ProfileCard 
                name={founder.name} 
                title={founder.title} 
                bio={founder.bio} 
                imageUrl={founder.imageUrl} 
            />
        </div>
    </section>
  {/if}

  <!-- Team Members Section -->
  {#if teamMembers.length > 0}
    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {#each teamMembers as member}
          <ProfileCard 
            name={member.name} 
            title={member.title} 
            bio={member.bio} 
            imageUrl={member.imageUrl}
          />
        {/each}
      </div>
    </section>
  {/if}
</div>
