<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    bordered
    :width="280"
    :breakpoint="768"
  >
    <q-scroll-area class="fit">
      <q-list padding class="menu-list">
        <!-- Menu items -->
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Accueil</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/parcelles">
          <q-item-section avatar>
            <q-icon name="landscape" />
          </q-item-section>
          <q-item-section>Terrains</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/properties">
          <q-item-section avatar>
            <q-icon name="house" />
          </q-item-section>
          <q-item-section>Maisons</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple to="/add-property">
          <q-item-section avatar>
            <q-icon name="add_circle" color="positive" />
          </q-item-section>
          <q-item-section class="text-positive">Ajouter un bien</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/wallet">
          <q-item-section avatar>
            <q-icon name="account_balance_wallet" />
          </q-item-section>
          <q-item-section>Mon portefeuille</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item clickable v-ripple to="/login">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>Connexion</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/register">
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>Inscription</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.menu-list .q-item {
  border-radius: 8px;
  margin: 4px 8px;
}

.menu-list .q-item:hover {
  background: rgba(103, 58, 183, 0.1);
}
</style>
