
<script lang="ts">
  export let name: string;
  export let title: string;
  export let bio: string;
  export let imageUrl: string;

  let imageError = false;

  function handleImageError() {
    imageError = true;
  }

  function getInitials(name: string) {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    } else if (name.length > 0) {
      return name[0].toUpperCase();
    }
    return '?';
  }
</script>

<div class="card bg-base-100 shadow-xl text-center">
  <div class="px-10 pt-10">
    {#if imageUrl && !imageError}
      <img 
        src={imageUrl} 
        alt={`Fotografia ${name}`} 
        class="w-40 h-40 object-cover rounded-full mx-auto" 
        on:error={handleImageError}
      />
    {:else}
      <div class="w-40 h-40 rounded-full bg-neutral text-neutral-content mx-auto flex items-center justify-center">
        <span class="text-5xl font-bold">{getInitials(name)}</span>
      </div>
    {/if}
  </div>
  <div class="card-body items-center">
    <h2 class="card-title text-2xl">{name}</h2>
    <p class="text-primary font-semibold">{title}</p>
    <p class="mt-4 text-base text-gray-600">{bio}</p>
  </div>
</div>
