<template>
  <q-card flat bordered class="chat-interface full-height column">
    
    <q-card-section class="bg-deep-purple-7 text-white q-py-sm">
      <div class="text-subtitle1 text-weight-bold">
        Discussion avec {{ contactName }}
      </div>
      <div class="text-caption">Statut : En Ligne</div>
    </q-card-section>

    <q-card-section class="col q-py-md scroll" ref="chatAreaRef">
      <div v-for="(message, index) in messages" :key="index" class="q-mb-sm">
        <q-chat-message
          :name="message.sender === 'client' ? 'Vous' : contactName"
          :avatar="message.sender === 'client' ? clientAvatar : contactAvatar"
          :text="[message.text]"
          :sent="message.sender === 'client'"
          :bg-color="message.sender === 'client' ? 'teal-1' : 'deep-purple-1'"
          :text-color="message.sender === 'client' ? 'dark' : 'dark'"
          class="q-mx-sm"
        />
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none q-pb-md">
      <q-input
        v-model="newMessage"
        dense
        outlined
        placeholder="Tapez votre message..."
        @keyup.enter="sendMessage"
      >
        <template v-slot:after>
          <q-btn 
            round 
            dense 
            flat 
            icon="send" 
            color="teal-7" 
            @click="sendMessage"
            :disable="!newMessage.trim()"
          />
        </template>
      </q-input>
    </q-card-section>

  </q-card>
</template>

<script setup>
import { ref, defineProps, nextTick, onMounted } from 'vue';

const props = defineProps({
  contactName: {
    type: String,
    required: true,
    default: 'Propriétaire Certifié'
  },
  propertyId: String 
});

// Avatars simulés
const clientAvatar = 'https://cdn.quasar.dev/img/avatar.png';
const contactAvatar = 'https://cdn.quasar.dev/img/boy-avatar.png';

// Données simulées pour la conversation
const messages = ref([
  { sender: 'contact', text: `Bonjour ! Je suis le propriétaire de la propriété ${props.propertyId}. Comment puis-je vous aider ?` },
  { sender: 'client', text: 'Bonjour ! J\'ai des questions sur le statut NFT du titre. Est-il disponible pour une vérification immédiate ?' }
]);

const newMessage = ref('');
const chatAreaRef = ref(null);

// Fonction pour défiler vers le bas des messages
const scrollToBottom = () => {
  if (chatAreaRef.value) {
    const element = chatAreaRef.value.$el;
    element.scrollTop = element.scrollHeight;
  }
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      sender: 'client',
      text: newMessage.value.trim(),
    });
    // Simuler une réponse rapide du contact après un court délai
    setTimeout(() => {
        messages.value.push({
            sender: 'contact',
            text: 'J\'ai bien reçu votre question, je vérifie les détails immédiatement.',
        });
        nextTick(scrollToBottom);
    }, 1500);

    newMessage.value = '';
    nextTick(scrollToBottom);
  }
};

onMounted(() => {
    // Assure le défilement vers le bas au chargement initial
    nextTick(scrollToBottom);
});
</script>

<style scoped>
.chat-interface {
    border-radius: 8px;
    height: 100%;
}
.scroll {
    overflow-y: auto;
}
</style>