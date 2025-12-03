<template>
  <q-header bordered class="bg-white text-dark">
    <q-toolbar>
      <router-link to="/" class="row items-center q-gutter-x-sm" style="text-decoration: none; color: inherit;">
        <q-avatar><q-icon name="apartment" color="primary" size="md" /></q-avatar>
        <q-toolbar-title class="text-weight-bold">ARDHI\_CHAIN</q-toolbar-title>
      </router-link>

      <q-space />
      
      <q-btn flat label="Propriétés" to="/" class="q-mr-sm" />

      <q-btn 
        color="primary" 
        label="Ajouter un Bien" 
        to="/add" 
        class="q-mr-sm"
      />

      <q-btn-dropdown 
        flat 
        label="Mon Compte" 
        color="secondary"
      >
        <q-list dense>
          <q-item clickable v-close-popup @click="router.push('/register')">
            <q-item-section avatar><q-icon name="login" /></q-item-section>
            <q-item-section><q-item-label>Se Connecter / S'inscrire</q-item-label></q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

    </q-toolbar>
  </q-header>
</template>

<script setup>
// RETRAIT DE PINIA
// import { useAuthStore } from 'stores/auth-store';
import { useRouter } from 'vue-router';

// const authStore = useAuthStore(); // Retiré
const router = useRouter();

// const handleLogout = () => { /* Retiré car il n'y a plus de store */ };
</script>