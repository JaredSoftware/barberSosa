<template>
  <div class="dark bg-charcoal font-sans text-gray-200">
    <div
      class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden"
    >
      <div class="layout-container flex h-full grow flex-col">
        <!-- Main Content -->
        <main
          class="px-4 sm:px-6 lg:px-20 xl:px-40 flex flex-1 justify-center py-8 sm:py-10 md:py-12"
        >
          <div
            class="layout-content-container flex flex-col max-w-[1200px] flex-1"
          >
            <div
              class="flex flex-wrap justify-between gap-4 sm:gap-6 px-2 sm:px-4 mb-6 sm:mb-8 md:mb-10"
            >
              <div class="flex w-full sm:min-w-72 flex-col gap-2">
                <h1
                  class="text-white text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight uppercase"
                >
                  {{ t("reservations.title") }}
                </h1>
                <div class="h-1 w-16 sm:w-20 bg-primary mb-3 sm:mb-4"></div>
                <p
                  class="text-light-gray text-base sm:text-lg font-normal leading-relaxed max-w-2xl italic"
                >
                  {{ t("reservations.subtitle") }}
                </p>
              </div>
            </div>

            <div
              class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12 px-2 sm:px-4"
            >
              <!-- Services Section -->
              <div class="lg:col-span-7 space-y-8">
                <!-- Reservas Premium (grid) - SOLO SI HAY OFERTAS CON premium === true -->
                <template v-if="hasPremiumOffers">
                  <div class="space-y-4">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="material-symbols-outlined text-primary"
                        >star</span
                      >
                      <h2
                        class="text-white text-xl font-display font-bold uppercase tracking-widest"
                      >
                        {{ t("reservations.premiumReservations") }}
                      </h2>
                    </div>
                    <div
                      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 p-2 sm:p-4"
                    >
                      <div
                        v-for="service in (offers || []).filter(
                          (s) => s.premium === true,
                        )"
                        :key="service._id"
                        @click="selectService(service._id)"
                        :class="[
                          'group service-card flex flex-col gap-3 border p-4 transition-all cursor-pointer relative',
                          selectedServices.includes(service._id)
                            ? 'border-primary bg-black/60'
                            : 'border-white/10 bg-black/40 hover:bg-black/60',
                        ]"
                      >
                        <div
                          v-if="selectedServices.includes(service._id)"
                          class="absolute top-0 right-0 p-2 bg-primary text-black"
                        >
                          <span
                            class="material-symbols-outlined text-sm font-bold"
                            >check</span
                          >
                        </div>
                        <div class="flex items-center gap-2">
                          <span
                            class="material-symbols-outlined text-primary text-xl"
                            >star</span
                          >
                          <span
                            class="text-primary/80 text-[10px] font-bold uppercase tracking-widest"
                            >{{ t("reservations.premium") }}</span
                          >
                        </div>
                        <h3
                          class="text-white text-base font-display font-bold uppercase"
                        >
                          {{ service.title }}
                        </h3>
                        <p class="text-light-gray text-sm line-clamp-2">
                          {{ service.description }}
                        </p>
                        <div
                          class="flex justify-between items-center mt-auto pt-2 border-t border-white/10"
                        >
                          <span class="text-primary font-display font-bold"
                            >${{ Number(service.price).toFixed(0) }}</span
                          >
                          <span
                            class="text-white/40 text-[10px] uppercase tracking-widest"
                            >{{ service.duration }} MIN</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Servicios generales (cards) -->
                <div class="flex items-center gap-3 mb-2">
                  <h2
                    class="text-white text-xl font-display font-bold uppercase tracking-widest"
                  >
                    {{ t("reservations.selectServices") }}
                  </h2>
                </div>
                <div v-if="servicesLoading" class="grid grid-cols-1 gap-6">
                  <div
                    v-for="i in 3"
                    :key="i"
                    class="border border-white/10 p-6 rounded-sm animate-pulse flex gap-6"
                  >
                    <div class="w-24 h-24 bg-white/10 rounded"></div>
                    <div class="flex-1 space-y-3">
                      <div class="h-6 bg-white/10 rounded w-1/2"></div>
                      <div class="h-4 bg-white/5 rounded w-full"></div>
                      <div class="h-4 bg-white/5 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <div
                  v-else-if="
                    (offers || []).filter((s) => s.premium !== true).length ===
                      0 && !servicesLoading
                  "
                  class="text-center py-12 border border-white/10 rounded-sm"
                >
                  <p class="text-gray-400 mb-2">
                    {{ t("reservations.noStandardServices") }}
                  </p>
                  <p class="text-gray-500 text-sm">
                    {{ t("reservations.addOffersAdmin") }}
                  </p>
                </div>
                <div v-else class="grid grid-cols-1 gap-6">
                  <div
                    v-for="service in (offers || []).filter(
                      (s) => s.premium !== true,
                    )"
                    :key="service._id"
                    @click="selectService(service._id)"
                    :class="[
                      'group service-card flex flex-col md:flex-row gap-6 border p-6 transition-all cursor-pointer relative',
                      selectedServices.includes(service._id)
                        ? 'border-primary bg-black/60'
                        : 'border-white/10 bg-black/40 hover:bg-black/60',
                    ]"
                  >
                    <div
                      v-if="selectedServices.includes(service._id)"
                      class="absolute top-0 right-0 p-2 bg-primary text-black"
                    >
                      <span class="material-symbols-outlined text-sm font-bold"
                        >check</span
                      >
                    </div>
                    <div
                      class="bg-center bg-no-repeat aspect-square bg-cover w-20 h-20 sm:w-24 sm:h-24 shrink-0 border border-white/5 grayscale group-hover:grayscale-0 transition-all"
                      :style="
                        service.image
                          ? { backgroundImage: `url(${service.image})` }
                          : {}
                      "
                    >
                      <span
                        v-if="!service.image && service.icon"
                        class="flex w-full h-full items-center justify-center text-primary text-4xl"
                      >
                        <span class="material-symbols-outlined">{{
                          service.icon
                        }}</span>
                      </span>
                      <span
                        v-else-if="!service.image"
                        class="flex w-full h-full items-center justify-center text-white/30 text-3xl"
                      >
                        <span class="material-symbols-outlined"
                          >content_cut</span
                        >
                      </span>
                    </div>
                    <div class="flex flex-col flex-1 justify-center">
                      <div
                        class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2"
                      >
                        <h3
                          class="text-white text-lg sm:text-xl font-display font-bold uppercase"
                        >
                          {{ service.title }}
                        </h3>
                        <div class="flex flex-col items-start sm:items-end">
                          <span
                            class="text-white/40 text-[10px] uppercase font-bold tracking-widest"
                            >{{ t("reservations.priceLabel") }}</span
                          >
                          <span
                            class="text-primary text-xl sm:text-2xl font-display font-bold"
                            >${{ Number(service.price).toFixed(0) }}</span
                          >
                        </div>
                      </div>
                      <p class="text-light-gray text-sm mt-2">
                        {{ service.description }}
                      </p>
                      <div
                        class="flex items-center gap-2 mt-4 text-primary/70 text-[10px] font-bold uppercase tracking-[0.2em]"
                      >
                        <span class="material-symbols-outlined text-xs"
                          >schedule</span
                        >
                        {{ t("reservations.durationMinutes", null, { n: service.duration }) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Booking Section -->
              <div class="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
                <!-- Barber selection -->
                <div
                  class="bg-black border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl relative"
                >
                  <h2
                    class="text-white text-lg font-display font-bold uppercase tracking-widest mb-4 sm:mb-6"
                  >
                    {{ t("reservations.chooseBarber") }}
                  </h2>
                  <div
                    v-if="barbersLoading"
                    class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                  >
                    <div
                      v-for="i in 3"
                      :key="i"
                      class="flex flex-col items-center p-4 border border-white/10 rounded animate-pulse"
                    >
                      <div
                        class="size-14 sm:size-16 rounded-full bg-white/10 mb-2"
                      />
                      <div class="h-4 bg-white/10 rounded w-20 mb-1" />
                      <div class="h-3 bg-white/5 rounded w-16" />
                    </div>
                  </div>
                  <div
                    v-else-if="barbers.length === 0"
                    class="text-center py-6 text-gray-500 text-sm"
                  >
                    {{ t("reservations.noBarbers") }}
                  </div>
                  <div
                    v-else
                    class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
                  >
                    <button
                      type="button"
                      @click="selectedBarber = null"
                      :class="[
                        'flex flex-col items-center p-4 border transition-all cursor-pointer text-left',
                        selectedBarber === null
                          ? 'border-primary bg-black/60 ring-1 ring-primary'
                          : 'border-white/10 bg-black/40 hover:border-primary/50 hover:bg-black/60',
                      ]"
                    >
                      <div
                        class="size-14 sm:size-16 rounded-full border-2 border-white/10 overflow-hidden mb-2 shrink-0 bg-black/40 flex items-center justify-center"
                      >
                        <span
                          class="material-symbols-outlined text-white/30 text-3xl"
                          >groups</span
                        >
                      </div>
                      <span
                        class="text-white text-sm font-bold truncate w-full text-center"
                        >{{ t("reservations.anyBarber") }}</span
                      >
                      <span
                        class="text-primary/80 text-[10px] font-bold uppercase tracking-wider truncate w-full text-center"
                        >{{ t("reservations.availability") }}</span
                      >
                    </button>

                    <button
                      v-for="barber in barbers"
                      :key="barber.id"
                      type="button"
                      @click="selectedBarber = barber.id"
                      :class="[
                        'flex flex-col items-center p-4 border transition-all cursor-pointer text-left',
                        selectedBarber === barber.id
                          ? 'border-primary bg-black/60 ring-1 ring-primary'
                          : 'border-white/10 bg-black/40 hover:border-primary/50 hover:bg-black/60',
                      ]"
                    >
                      <div
                        class="size-14 sm:size-16 rounded-full border-2 border-white/10 overflow-hidden mb-2 shrink-0 bg-black/40"
                      >
                        <img
                          v-if="barber.image"
                          :src="barber.image"
                          :alt="barber.name"
                          class="w-full h-full object-cover"
                        />
                        <span
                          v-else
                          class="flex w-full h-full items-center justify-center text-white/30"
                        >
                          <span class="material-symbols-outlined text-3xl"
                            >person</span
                          >
                        </span>
                      </div>
                      <span
                        class="text-white text-sm font-bold truncate w-full text-center"
                        >{{ barber.name }}</span
                      >
                      <span
                        v-if="barber.role"
                        class="text-primary/80 text-[10px] font-bold uppercase tracking-wider truncate w-full text-center"
                        >{{ barber.role }}</span
                      >
                    </button>
                  </div>
                </div>

                <!-- Calendar -->
                <div
                  class="bg-black border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl relative"
                >
                  <div class="flex items-center justify-between mb-8">
                    <h2
                      class="text-white text-lg font-display font-bold uppercase tracking-widest"
                    >
                      {{ t("reservations.selectDate") }}
                    </h2>
                    <div class="flex gap-2">
                      <button
                        @click="previousMonth"
                        class="text-light-gray hover:text-primary transition-colors"
                      >
                        <span class="material-symbols-outlined"
                          >chevron_left</span
                        >
                      </button>
                      <button
                        @click="nextMonth"
                        class="text-light-gray hover:text-primary transition-colors"
                      >
                        <span class="material-symbols-outlined"
                          >chevron_right</span
                        >
                      </button>
                    </div>
                  </div>
                  <div class="text-center mb-6">
                    <span
                      class="text-primary font-display font-bold text-sm tracking-[0.3em] uppercase"
                      >{{ currentMonthYear }}</span
                    >
                  </div>
                  <div class="grid grid-cols-7 gap-2 text-center mb-4">
                    <div class="text-white/40 text-[10px] font-bold uppercase">
                      D
                    </div>
                    <div class="text-white/40 text-[10px] font-bold uppercase">
                      L
                    </div>
                    <div class="text-white/40 text-[10px] font-bold uppercase">
                      M
                    </div>
                    <div class="text-white/40 text-[10px] font-bold uppercase">
                      M
                    </div>
                    <div class="text-white/40 text-[10px] font-bold uppercase">
                      J
                    </div>
                    <div class="text-white/40 text-[10px] font-bold uppercase">
                      V
                    </div>
                    <div class="text-white/40 text-[10px] font-bold uppercase">
                      S
                    </div>
                  </div>
                  <div class="grid grid-cols-7 gap-2">
                    <div
                      v-for="(day, index) in calendarDays"
                      :key="index"
                      @click="
                        day.isCurrentMonth && !day.isDisabled
                          ? selectDate(day.date)
                          : null
                      "
                      :class="[
                        'aspect-square flex items-center justify-center text-sm font-medium transition-all rounded-full border',
                        day.isCurrentMonth && !day.isDisabled
                          ? day.isSelected
                            ? 'bg-primary text-black font-bold border-primary cursor-pointer'
                            : 'text-gray-300 border-white/20 hover:bg-white/10 hover:text-primary hover:border-primary/50 cursor-pointer'
                          : 'text-white/20 border-transparent cursor-not-allowed opacity-40',
                      ]"
                    >
                      {{ day.day }}
                    </div>
                  </div>
                  <div class="mt-8 sm:mt-12">
                    <h3
                      class="text-white text-sm font-display font-bold uppercase tracking-widest mb-4 sm:mb-6"
                    >
                      {{ t("reservations.availableTimes") }}
                    </h3>

                    <div
                      v-if="slotsLoading"
                      class="text-center py-4 text-primary animate-pulse"
                    >
                      {{ t("reservations.loadingSlots") }}
                    </div>
                    <div
                      v-else-if="!selectedDate"
                      class="text-center py-4 text-gray-500 text-xs"
                    >
                      {{ t("reservations.selectDateToSeeSlots") }}
                    </div>
                    <div
                      v-else-if="availableSlots.length === 0"
                      class="text-center py-4 text-gray-500 text-xs"
                    >
                      {{ t("reservations.noSlotsAvailable") }}
                    </div>

                    <div
                      v-else
                      class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3"
                    >
                      <button
                        v-for="slot in availableSlots"
                        :key="slot"
                        @click="selectTime(slot)"
                        :class="[
                          'py-3 border text-[10px] font-bold tracking-widest transition-colors',
                          selectedTime === slot
                            ? 'border-primary bg-primary text-black'
                            : 'border-white/10 text-light-gray hover:border-primary',
                        ]"
                      >
                        {{ formatTime(slot) }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Summary -->
                <!-- Summary -->
                <div
                  class="bg-black border border-white/10 p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden"
                >
                  <h2
                    class="text-white text-lg font-display font-bold mb-6 uppercase tracking-widest"
                  >
                    {{ t("reservations.contactDetails") }}
                  </h2>
                  <div class="space-y-4 mb-6">
                    <div>
                      <label
                        class="block text-xs uppercase tracking-wider text-light-gray mb-1"
                        >{{ t("reservations.name") }}</label
                      >
                      <input
                        v-model="clientName"
                        type="text"
                        class="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-primary focus:outline-none transition-colors"
                        :placeholder="t('reservations.namePlaceholder')"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-xs uppercase tracking-wider text-light-gray mb-1"
                        >{{ t("reservations.email") }}</label
                      >
                      <input
                        v-model="clientEmail"
                        type="email"
                        class="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-primary focus:outline-none transition-colors"
                        :placeholder="t('reservations.emailPlaceholder')"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-xs uppercase tracking-wider text-light-gray mb-1"
                        >{{ t("reservations.phone") }}</label
                      >
                      <input
                        v-model="clientPhone"
                        type="tel"
                        class="w-full bg-black/50 border border-white/10 p-2 text-white focus:border-primary focus:outline-none transition-colors"
                        :placeholder="t('reservations.phonePlaceholder')"
                      />
                    </div>
                  </div>

                  <h2
                    class="text-white text-lg font-display font-bold mb-6 uppercase tracking-widest pt-6 border-t border-white/10"
                  >
                    {{ t("reservations.summary") }}
                  </h2>
                  <div class="space-y-4 mb-8">
                    <div
                      v-for="service in selectedServicesData"
                      :key="service._id"
                      class="flex justify-between items-center text-sm"
                    >
                      <span class="text-light-gray italic">{{
                        service.title
                      }}</span>
                      <span class="text-white font-bold"
                        >${{ Number(service.price).toFixed(2) }}</span
                      >
                    </div>
                    <div
                      v-if="selectedBarberName"
                      class="flex justify-between items-center text-sm"
                    >
                      <span class="text-light-gray italic">{{ t("reservations.barberLabel") }}</span>
                      <span class="text-white font-medium">{{
                        selectedBarberName || t("reservations.barberAssigned")
                      }}</span>
                    </div>
                    <div
                      v-if="selectedDate && selectedTime"
                      class="flex justify-between items-center text-xs pb-4 border-b border-white/10"
                    >
                      <span class="text-light-gray italic"
                        >{{ formattedDate }},
                        {{ formatTime(selectedTime) }}</span
                      >
                      <span
                        class="text-primary uppercase tracking-tighter font-bold"
                        >{{ t("reservations.pendingConfirm") }}</span
                      >
                    </div>
                    <div class="flex justify-between items-center text-xl pt-2">
                      <span
                        class="text-white font-display uppercase tracking-widest"
                        >{{ t("reservations.total") }}</span
                      >
                      <span class="text-primary font-display font-bold"
                        >${{ Number(totalPrice).toFixed(2) }}</span
                      >
                    </div>
                  </div>

                  <label
                    class="flex items-start gap-3 mb-4 cursor-pointer group"
                  >
                    <input
                      v-model="termsAccepted"
                      type="checkbox"
                      class="mt-1 rounded border-white/30 bg-black/40 text-primary focus:ring-primary"
                    />
                    <span class="text-white/80 text-xs group-hover:text-white">
                      {{ t("reservations.termsLabel") }}
                      <NuxtLink
                        to="/politicas"
                        target="_blank"
                        class="text-primary underline hover:no-underline"
                        >{{ t("reservations.termsLink") }}</NuxtLink
                      >.
                    </span>
                  </label>
                  <div
                    v-if="errorMessage"
                    class="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs"
                  >
                    {{ errorMessage }}
                  </div>

                  <button
                    @click="bookAppointment"
                    :disabled="!isValidBooking || !termsAccepted || bookingLoading"
                    class="w-full bg-primary hover:bg-white text-black py-4 font-bold uppercase tracking-[0.3em] text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="bookingLoading">{{ t("reservations.processing") }}</span>
                    <span v-else>{{ t("reservations.confirmBooking") }}</span>
                  </button>
                  <p
                    class="text-center text-white/30 text-[9px] mt-6 uppercase tracking-[0.2em] font-medium"
                  >
                    {{ t("reservations.paymentNote") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer
          class="px-4 sm:px-6 lg:px-20 xl:px-40 py-12 sm:py-16 bg-black border-t border-white/10 mt-12 sm:mt-16 md:mt-20"
        >
          <div
            class="layout-content-container max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12"
          >
            <div class="col-span-1 md:col-span-2">
              <div class="flex items-center gap-4 text-white mb-6">
                <h2
                  class="text-primary text-2xl font-display font-black tracking-widest uppercase"
                >
                  Sosa Barber
                </h2>
              </div>
              <p class="text-light-gray text-sm max-w-sm italic">
                {{ t("reservations.footerTagline") }}
              </p>
            </div>
            <div>
              <h4
                class="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8"
              >
                {{ t("reservations.contact") }}
              </h4>
              <ul class="text-light-gray text-xs space-y-4 tracking-wider">
                <li>{{ t("reservations.address") }}</li>
                <li>(555) 123-4567</li>
                <li>hola@sosabarber.com</li>
              </ul>
            </div>
            <div>
              <h4
                class="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8"
              >
                {{ t("reservations.hours") }}
              </h4>
              <ul class="text-light-gray text-xs space-y-4 tracking-wider">
                <li class="flex justify-between">
                  <span>{{ t("reservations.monFri") }}</span>
                  <span class="text-primary">9am - 8pm</span>
                </li>
                <li class="flex justify-between">
                  <span>{{ t("reservations.sat") }}</span> <span class="text-primary">10am - 6pm</span>
                </li>
                <li class="flex justify-between">
                  <span>{{ t("reservations.sun") }}</span> <span class="text-white/20">{{ t("reservations.closed") }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div
            class="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p
              class="text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold"
            >
              {{ t("reservations.copyrightReservas") }}
            </p>
            <div class="flex gap-8">
              <span
                class="material-symbols-outlined text-white/20 hover:text-primary cursor-pointer text-lg"
                >content_cut</span
              >
              <span
                class="material-symbols-outlined text-white/20 hover:text-primary cursor-pointer text-lg"
                >spa</span
              >
              <span
                class="material-symbols-outlined text-white/20 hover:text-primary cursor-pointer text-lg"
                >history_edu</span
              >
            </div>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();

useHead({
  title: "Sosa Barber | Servicios y Reservas",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
});

const { offers, loading: servicesLoading, fetchOffers } = useOffers();
const {
  barbers: barbersRaw,
  loading: barbersLoading,
  fetchBarbers,
} = useBarbers();

const hasPremiumOffers = computed(() =>
  (offers.value || []).some((s) => s.premium === true),
);

/** Barberos con forma { id, name, role, image } para la UI de reservas */
const barbers = computed(() => {
  const list = barbersRaw.value || [];
  return list.map((b) => ({
    id: b._id,
    name: b.nombreArtista || b.name || b.email || t("reservations.barberFallback"),
    role: b.rol || "",
    image: b.imagen || b.picture || "",
  }));
});

const selectedServices = ref([]);
const selectedBarber = ref(null);
const selectedDate = ref(null);
const selectedTime = ref("10:30 AM");
const currentDate = ref(new Date());

const { shopConfig, fetchConfig } = useShopConfig();

onMounted(async () => {
  await Promise.all([
    fetchOffers(true, true),
    fetchBarbers(true),
    fetchConfig(),
  ]);
});

// ... (existing code)

const calendarDays = computed(() => {
  const currentYear = currentDate.value.getFullYear();
  const currentMonth = currentDate.value.getMonth();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare only dates

  const days = [];

  // Días del mes anterior
  const prevMonth = new Date(currentYear, currentMonth, 0);
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonth.getDate() - i,
      date: null,
      isCurrentMonth: false,
      isPast: true,
      isHoliday: false,
      isWorkingDay: false,
    });
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split("T")[0];
    const isPast = date < today;

    // Check configuration
    let isWorkingDay = true;
    let isHoliday = false;

    if (shopConfig.value) {
      // Check working days (0 = Sunday, 1 = Monday, etc.)
      if (
        shopConfig.value.workingDays &&
        !shopConfig.value.workingDays.includes(date.getDay())
      ) {
        isWorkingDay = false;
      }

      // Check holidays
      if (shopConfig.value.holidays) {
        // holidays are ISO strings
        const holidayStrs = shopConfig.value.holidays.map(
          (h) => new Date(h).toISOString().split("T")[0],
        );
        if (holidayStrs.includes(dateStr)) {
          isHoliday = true;
        }
      }
    }

    days.push({
      day,
      date: dateStr,
      isCurrentMonth: true,
      isSelected: selectedDate.value === dateStr,
      isPast,
      isHoliday,
      isWorkingDay,
      isDisabled: isPast || isHoliday || !isWorkingDay,
    });
  }

  // Completar hasta 42 días (6 semanas)
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      day,
      date: null,
      isCurrentMonth: false,
      isPast: false,
      isHoliday: false,
      isWorkingDay: false,
    });
  }

  return days;
});

const config = useRuntimeConfig();
const API_URL = config.public.apiBase;

const clientName = ref("");
const clientEmail = ref("");
const clientPhone = ref("");
const termsAccepted = ref(false);
const errorMessage = ref("");
const bookingLoading = ref(false);

const availableSlots = ref([]);
const slotsLoading = ref(false);

const selectService = (serviceId) => {
  const index = selectedServices.value.indexOf(serviceId);
  if (index > -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(serviceId);
  }
};

const selectDate = (dateStr) => {
  if (!dateStr) return;
  selectedDate.value = dateStr;
  selectedTime.value = null;
  fetchSlots();
};

const selectTime = (isoDate) => {
  selectedTime.value = isoDate;
};

const fetchSlots = async () => {
  if (!selectedDate.value) return; // Only date is required now

  slotsLoading.value = true;
  availableSlots.value = [];

  try {
    const params = { date: selectedDate.value };
    if (selectedBarber.value) {
      params.barberId = selectedBarber.value;
    }

    const { data } = await useFetch(
      `${API_URL}/api/appointments/availability`,
      { params },
    );

    if (data.value) {
      availableSlots.value = data.value;
    }
  } catch (error) {
    console.error("Error fetching slots:", error);
  } finally {
    slotsLoading.value = false;
  }
};

// Refetch slots if barber changes while date is selected
watch(selectedBarber, () => {
  if (selectedDate.value) {
    fetchSlots();
    selectedTime.value = null;
  }
});

const formatTime = (isoDate) => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1,
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1,
  );
};

const currentMonthYear = computed(() => {
  const monthIndex = currentDate.value.getMonth() + 1;
  return `${t(`reservations.month${monthIndex}`)} ${currentDate.value.getFullYear()}`;
});

const selectedBarberName = computed(() => {
  if (!selectedBarber.value) return null;
  const b = barbers.value.find((x) => x.id === selectedBarber.value);
  return b ? b.name : null;
});

const selectedServicesData = computed(() => {
  return (offers.value || []).filter((o) =>
    selectedServices.value.includes(o._id),
  );
});

const totalPrice = computed(() => {
  return selectedServicesData.value.reduce(
    (sum, service) => sum + Number(service.price || 0),
    0,
  );
});

const totalDuration = computed(() => {
  return selectedServicesData.value.reduce(
    (sum, service) => sum + Number(service.duration || 0),
    0,
  );
});

const formattedDate = computed(() => {
  if (!selectedDate.value) return "";
  const date = new Date(selectedDate.value);
  const day = date.getDate();
  const monthKey = `reservations.month${date.getMonth() + 1}`;
  return `${day} ${t("reservations.dateOf")} ${t(monthKey)}`;
});

const isValidBooking = computed(() => {
  return (
    selectedServices.value.length > 0 &&
    selectedDate.value &&
    selectedTime.value &&
    clientName.value &&
    clientEmail.value &&
    clientPhone.value
  );
});

const bookAppointment = async () => {
  if (!isValidBooking.value) return;
  if (!termsAccepted.value) {
    errorMessage.value = t("reservations.termsRequired");
    return;
  }

  bookingLoading.value = true;
  errorMessage.value = "";

  try {
    const { data, error } = await useFetch(`${API_URL}/api/appointments`, {
      method: "POST",
      body: {
        barberId: selectedBarber.value,
        date: selectedTime.value, // selectedTime holds the ISO string of the slot
        clientName: clientName.value,
        clientEmail: clientEmail.value,
        clientPhone: clientPhone.value,
        notes: `Services: ${selectedServicesData.value.map((s) => s.title).join(", ")}`,
        price: totalPrice.value,
        duration: totalDuration.value || 60,
      },
    });

    if (error.value) {
      throw new Error(error.value.message || "Error creating appointment");
    }

    alert(
      t("reservations.bookingSuccess", null, {
        barber: selectedBarberName.value || t("reservations.barberAssigned"),
        date: formattedDate.value,
        time: formatTime(selectedTime.value),
      }),
    );

    // Reset form
    selectedDate.value = null;
    selectedTime.value = null;
    selectedServices.value = [];
    clientName.value = "";
    clientEmail.value = "";
    clientPhone.value = "";
  } catch (e) {
    errorMessage.value = t("reservations.bookingError");
    console.error(e);
  } finally {
    bookingLoading.value = false;
  }
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

.service-card:hover {
  border-color: #d4af37;
}

.calendar-date-active {
  background-color: #d4af37;
  color: black;
  font-weight: bold;
}
</style>
