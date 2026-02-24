<template>
  <div class="politicas-page">
    <div class="politicas-inner">
      <h1 class="politicas-title">{{ $t('politicas.title') }}</h1>
      <p class="politicas-date">{{ $t('politicas.lastUpdate') }}</p>

      <div class="politicas-sections">
        <section class="politicas-section">
          <h2 class="politicas-h2">
            <span class="material-symbols-outlined politicas-icon">public</span>
            {{ $t('politicas.scopeTitle') }}
          </h2>
          <p class="politicas-p">{{ $t('politicas.scopeBody') }}</p>
        </section>

        <section class="politicas-section">
          <h2 class="politicas-h2">
            <span class="material-symbols-outlined politicas-icon">shield</span>
            {{ $t('politicas.dataTitle') }}
          </h2>
          <p class="politicas-p">{{ $t('politicas.dataIntro') }}</p>
          <ul class="politicas-ul">
            <li>{{ $t('politicas.dataItem1') }}</li>
            <li>{{ $t('politicas.dataItem2') }}</li>
            <li>{{ $t('politicas.dataItem3') }}</li>
            <li>{{ $t('politicas.dataItem4') }}</li>
          </ul>
          <p class="politicas-p">{{ $t('politicas.dataOutro') }}</p>
        </section>

        <section class="politicas-section">
          <h2 class="politicas-h2">
            <span class="material-symbols-outlined politicas-icon">payments</span>
            {{ $t('politicas.paymentsTitle') }}
          </h2>
          <p class="politicas-p">{{ $t('politicas.paymentsBody') }}</p>
          <p class="politicas-p">{{ $t('politicas.paymentsCurrency') }}</p>
        </section>

        <section class="politicas-section">
          <h2 class="politicas-h2">
            <span class="material-symbols-outlined politicas-icon">local_shipping</span>
            {{ $t('politicas.shippingTitle') }}
          </h2>
          <p class="politicas-p">{{ $t('politicas.shippingBody') }}</p>
        </section>

        <section class="politicas-section">
          <h2 class="politicas-h2">
            <span class="material-symbols-outlined politicas-icon">event_available</span>
            {{ $t('politicas.bookingsTitle') }}
          </h2>
          <p class="politicas-p">{{ $t('politicas.bookingsBody') }}</p>
        </section>

        <section class="politicas-section">
          <h2 class="politicas-h2">
            <span class="material-symbols-outlined politicas-icon">contact_page</span>
            {{ $t('politicas.contactTitle') }}
          </h2>
          <p class="politicas-p">{{ $t('politicas.contactBody') }}</p>
        </section>
      </div>

      <div class="politicas-back">
        <NuxtLink to="/" class="politicas-link">
          <span class="material-symbols-outlined">arrow_back</span>
          {{ $t('nav.home') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const $t = t;
useHead({
  title: t('politicas.headTitle'),
  meta: [
    { name: 'description', content: t('politicas.metaDescription') },
  ],
});
</script>

<style scoped>
.politicas-page {
  min-height: 80vh;
  background-color: #0A0A0A;
  color: #d1d5db;
}
.politicas-inner {
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  padding: 3rem 1.5rem;
}
.politicas-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}
.politicas-date {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 3rem;
}
.politicas-sections {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.politicas-section {
  display: block;
}
.politicas-h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #D4AF37;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.politicas-icon {
  font-size: 1.5rem;
  color: #D4AF37;
}
.politicas-p {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.625;
  margin-bottom: 1rem;
}
.politicas-p:last-child {
  margin-bottom: 0;
}
.politicas-ul {
  list-style: disc;
  list-style-position: inside;
  padding-left: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.625;
  margin: 1rem 0;
}
.politicas-ul li {
  margin-bottom: 0.5rem;
}
.politicas-back {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}
.politicas-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #D4AF37;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-decoration: none;
}
.politicas-link:hover {
  text-decoration: underline;
}
</style>
