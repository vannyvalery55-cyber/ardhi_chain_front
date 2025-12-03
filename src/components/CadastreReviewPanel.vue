<template>
    <q-card flat bordered class="cadastre-panel q-pa-lg bg-red-1">
        <div class="text-h5 text-red-8 q-mb-md flex items-center">
            <q-icon name="gavel" class="q-mr-sm" /> Espace de Revue Cadastre (Simulation)
        </div>
        <q-banner dense rounded class="bg-red-2 text-red-9 q-mb-md">
            Ceci est une simulation de l'interface utilisée par les autorités
            pour valider la légalité des biens **avant** la tokenisation NFT.
        </q-banner>

        <q-list bordered separator>
            <q-item v-for="(item, index) in pendingSubmissions" :key="index" clickable v-ripple>
                <q-item-section avatar>
                    <q-icon name="pending_actions" color="orange-8" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-weight-bold">{{ item.name }} ({{ item.location }})</q-item-label>
                    <q-item-label caption>Statut: {{ item.status }} | ID Soumission: {{ item.id }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-btn-dropdown 
                        color="teal-7" 
                        label="Action"
                        flat
                    >
                        <q-list>
                            <q-item clickable v-close-popup @click="$emit('certify', item.id)">
                                <q-item-section avatar><q-icon name="verified" color="green-8" /></q-item-section>
                                <q-item-section>Certifier & Tokeniser</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup @click="$emit('reject', item.id)">
                                <q-item-section avatar><q-icon name="cancel" color="red-8" /></q-item-section>
                                <q-item-section>Rejeter (Problèmes légaux)</q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </q-item-section>
            </q-item>
        </q-list>

    </q-card>
</template>

<script setup>
import { ref } from 'vue';

// Simulation de données en attente de vérification
const pendingSubmissions = ref([
    { id: 'sub-001', name: 'Maison non enregistrée', location: 'Himbi', status: 'Nouveau / Besoin de titrage initial' },
    { id: 'sub-002', name: 'Parcelle Titrée #456', location: 'Ndosho', status: 'Revue de documents' },
]);

// Les événements 'certify' et 'reject' seraient envoyés à un backend.
const emits = defineEmits(['certify', 'reject']);
</script>