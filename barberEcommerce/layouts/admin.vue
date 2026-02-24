<template>
  <div class="dark min-h-screen bg-background-deep text-white">
    <header
      class="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-background-deep px-10 py-3 sticky top-0 z-50"
    >
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-4 text-primary font-display">
          <div class="size-8">
            <img
              src="/logo_barber.png"
              alt="Barber Sosa Logo"
              class="h-8 w-8 object-contain"
            />
          </div>
          <h2
            class="text-white text-xl font-black leading-tight tracking-tight uppercase"
          >
            Barber Sosa <span class="text-primary">Admin</span>
          </h2>
        </div>

        <nav class="hidden md:flex items-center gap-6 font-display">
          <NuxtLink
            :class="linkClass('/admin/calendar')"
            to="/admin/calendar"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            :class="linkClass('/admin/report')"
            to="/admin/report"
          >
            Reportes
          </NuxtLink>
        </nav>
      </div>

      <div class="flex flex-1 justify-end gap-6 items-center">
        <label class="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
          <div
            class="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden border border-white/10"
          >
            <div
              class="text-white/50 flex bg-accent-gray items-center justify-center px-3"
            >
              <span class="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              class="form-input flex w-full min-w-0 flex-1 border-none bg-accent-gray text-white focus:ring-0 placeholder:text-white/30 text-sm"
              placeholder="Buscar..."
            />
          </div>
        </label>
        <div class="flex items-center gap-3">
          <span
            class="material-symbols-outlined text-white/70 hover:text-primary cursor-pointer"
            >notifications</span
          >
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/50"
            aria-label="Admin avatar profile picture"
            :style="{
              backgroundImage:
                'url(https://lh3.googleusercontent.com/aida-public/AB6AXuA4N9zHHW9r1LENBTcjlirqGt8UJ2XONkpIZvgEhlLoxCWn-Tdo_k1GE2OGX5rIX6n2xcSysbCw_JA7eaxqDHp5F37yZRhqnjL3L4sMhxeAetb89yGnb7hKIykjGntPBlV8ykoWFgmFOP_r2FBlPrEHAlH3uMMt9lNXcrIy799tSB0R7IMKsCAKIu3VBNVKAnwGHV08aIGv5-R6V8rzIz_zIgpCDsn_Djq47tMXMZhgu8FNzhT8KsAd5cLP1KRp-eW3HDiHvq_GFr8)',
            }"
          ></div>
        </div>
      </div>
    </header>

    <slot />
  </div>
</template>

<script setup>
const route = useRoute();

const linkClass = (path) => {
  const isActive = route.path.startsWith(path);
  return [
    "text-sm font-medium transition-colors",
    isActive
      ? "text-primary font-bold border-b-2 border-primary pb-1"
      : "text-white/70 hover:text-white",
  ].join(" ");
};
</script>
