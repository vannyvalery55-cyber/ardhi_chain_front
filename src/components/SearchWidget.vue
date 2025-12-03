<template>
  <q-card
    flat
    bordered
    class="bg-white shadow-10 search-widget q-pa-md q-ma-md"
    style="max-width: 900px; width: 100%; border-radius: 12px; transform: translateY(50px);"
  >
    <div class="row q-col-gutter-sm">

      <div class="col-12 col-md-5">
        <q-input
          :model-value="searchTerm"
          @update:model-value="$emit('update:searchTerm', $event)"
          outlined
          placeholder="Localisation (Himbi, Ndosho...) ou mot-clé"
          bg-color="grey-1"
        >
          <template v-slot:prepend>
            <q-icon name="location_city" color="deep-purple-7" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <q-select
          v-model="propertyType"
          :options="typeOptions"
          outlined
          placeholder="Type de bien"
          bg-color="grey-1"
        >
          <template v-slot:prepend>
            <q-icon name="apartment" color="teal-6" />
          </template>
        </q-select>
      </div>

      <div class="col-12 col-md-3">
        <q-btn
          label="Rechercher"
          icon="search"
          color="teal-7"
          class="full-width"
          size="lg"
          @click="$emit('search')"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

// Supprimez `defineProps` et `defineEmits` si non utilisés
// const props = defineProps({
//   searchTerm: String,
// });
// const emits = defineEmits(['update:searchTerm', 'search']);

// À la place, utilisez directement avec le v-model et @search dans le template
const propertyType = ref('Tout type');
const typeOptions = [
  'Tout type',
  'Maison',
  'Appartement',
  'Parcelle'
];
</script>

<style scoped>
.search-widget {
    z-index: 10;
}
</style>
