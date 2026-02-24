<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
useHead({
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' }
  ]
});
</script>

<style>
:root {
  --gold-gradient: linear-gradient(135deg, #D4AF37 0%, #F1D279 50%, #AA841D 100%);
  --charcoal-texture: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%);
}

body {
  font-family: "Inter", sans-serif;
  background-color: #0A0A0A;
}

.text-gold-gradient {
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bg-gold-gradient {
  background: var(--gold-gradient);
}

.charcoal-grain {
  background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuB01GnzXB4Z7ilAC-G_U4SVUzPTSZ2ZenMOuXpum8wzqJL74kuC1x6_I5xRjCsLq_HaU8dBGTq2-6LtZF9qlOSJ01q5CWS7B5gZdocrcmnAk-gcsC0r1hA2pIybqhNDP9JanhOPlqNYWVjwbYweDDqpUChe1uLt3QBLtRtD0fOOHuNizvWREXsz-zu-re0wqvIbOXw7VZKDr-1l_xvVqstKkMsxkKluHk8hYTrD2hfS5cbde-wKccE4iKuhwEEp5LNNNpq1JeALHeA);
  opacity: 0.03;
}

.premium-border {
  border: 1px solid transparent;
  background: linear-gradient(#1a1a1a, #1a1a1a) padding-box, var(--gold-gradient) border-box;
}

.hero-background {
  background-image: linear-gradient(to bottom, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.95) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgfOluDD0_jUZzc2T5NC6w6W311bRyNBc_NncGONipSTb0NbzkgWDdkyI-Lo1Tuaxlr7KyuZU1BFVL7Slsi32xFm_3yDJ4p84zsV9gcp7pbq-1NkrvnvyOHhpZOitzpaXBTdqwX2Bo6Zl-V2z-8byX3R7af_3kCEaWNb_cr56ByOZEgwCzTjfAp_lT7wzKIsJVvHHUZ2t0zA2-rXlUQiBCFLXLlfZGo1kiEonCJhTROPQyNmq5hjFz_523FqKYWRv9CQtC9ULNg-U");
}
</style>
