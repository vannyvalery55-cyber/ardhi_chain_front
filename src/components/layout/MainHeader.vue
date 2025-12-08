<template>
  <q-header elevated class="bg-white text-deep-purple-9">
    <q-toolbar>
      <!-- Logo et navigation -->
      <div class="row items-center full-width">
        <div class="col-auto">
          <q-btn flat @click="$emit('toggle-drawer')" aria-label="Menu">
            <q-icon name="menu" />
          </q-btn>
        </div>

        <div class="col text-center">
          <div class="logo-container">
            <q-icon name="account_balance" size="lg" color="deep-purple-7" />
            <div class="logo-text text-h6 text-weight-bold text-deep-purple-9">
              ARDHI-CHAIN
            </div>
          </div>
        </div>

        <div class="col-auto">
          <q-btn flat round icon="account_circle" color="deep-purple-7">
            <q-tooltip>Mon compte</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
defineEmits(['toggle-drawer'])
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo-text {
  font-family: 'Roboto', sans-serif;
  letter-spacing: 1px;
}
</style>
