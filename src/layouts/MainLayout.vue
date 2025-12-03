<template>
  <q-layout view="lHh Lpr lFf">
    
    <q-header elevated class="bg-deep-purple-7">
      <q-toolbar>
        
        <q-toolbar-title 
          class="q-ml-md cursor-pointer text-weight-bolder" 
          @click="$router.push({ name: 'home' })"
        >
          ARDHI\_CHAIN
        </q-toolbar-title>

        <q-space />

        <q-btn flat label="Accueil" :to="{ name: 'home' }" icon="home" class="q-mr-sm" />
        <q-btn flat label="Ajouter Bien" :to="{ name: 'add-property' }" icon="add_business" class="q-mr-sm" />
        <q-btn flat label="Mon Compte" :to="{ name: 'account' }" icon="account_circle" />

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    </q-layout>
</template>

<script setup>
// Pas d'importations nécessaires si le FooterBar et le Drawer sont retirés.
</script>