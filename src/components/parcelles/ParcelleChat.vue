<template>
  <div class="parcelle-chat" :class="{ 'chat-open': isOpen }">
    <!-- En-tête du chat -->
    <div class="chat-header" @click="toggleChat">
      <div class="chat-header-content">
        <q-icon name="chat" class="q-mr-sm" />
        <span class="chat-title">Chat avec le propriétaire</span>
        <q-badge v-if="unreadCount > 0" color="red" rounded>
          {{ unreadCount }}
        </q-badge>
        <q-icon :name="isOpen ? 'expand_less' : 'expand_more'" class="q-ml-auto" />
      </div>
    </div>

    <!-- Contenu du chat (visible seulement quand ouvert) -->
    <div v-if="isOpen" class="chat-content">
      <!-- Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index"
             :class="['message', message.type]">

          <!-- En-tête du message -->
          <div v-if="message.sender" class="message-sender">
            <q-avatar size="24px" class="q-mr-xs">
              <q-icon :name="message.type === 'sent' ? 'person' : 'support_agent'" />
            </q-avatar>
            <span class="sender-name">{{ message.sender }}</span>
            <span class="message-time">{{ message.time }}</span>
          </div>

          <!-- Contenu du message -->
          <div class="message-content">
            {{ message.text }}
          </div>

          <!-- Status du message -->
          <div v-if="message.status" class="message-status">
            <q-icon :name="getStatusIcon(message.status)" size="xs" />
            <span class="status-text">{{ message.status }}</span>
          </div>
        </div>

        <!-- Indicateur de saisie -->
        <div v-if="isTyping" class="typing-indicator">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="typing-text">Le propriétaire est en train d'écrire...</span>
        </div>
      </div>

      <!-- Zone de saisie -->
      <div class="chat-input">
        <q-input
          v-model="newMessage"
          placeholder="Tapez votre message..."
          dense
          outlined
          rounded
          class="message-input"
          @keyup.enter="sendMessage"
        >
          <template v-slot:before>
            <q-btn flat round icon="attach_file" size="sm">
              <q-tooltip>Joindre un fichier</q-tooltip>
            </q-btn>
          </template>

          <template v-slot:append>
            <q-btn
              round
              dense
              flat
              :icon="newMessage.trim() ? 'send' : 'mic'"
              :color="newMessage.trim() ? 'green-7' : 'grey-6'"
              @click="newMessage.trim() ? sendMessage() : startRecording()"
              :loading="sending"
            >
              <q-tooltip>
                {{ newMessage.trim() ? 'Envoyer' : 'Enregistrer un message vocal' }}
              </q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  parcelleId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['toggle', 'send-message', 'read-messages'])

const messages = ref([])
const newMessage = ref('')
const sending = ref(false)
const isTyping = ref(false)
const messagesContainer = ref(null)

// Messages de démonstration
const loadDemoMessages = () => {
  messages.value = [
    {
      type: 'received',
      sender: 'Hervé IRAGI',
      text: 'Bonjour ! Je suis intéressé par votre terrain. Est-il toujours disponible ?',
      time: '10:30',
      status: 'lu'
    },
    {
      type: 'sent',
      sender: 'Vous',
      text: 'Bonjour ! Oui, le terrain est toujours disponible. Il se trouve à Goma, quartier Mabanga Sud.',
      time: '10:32',
      status: 'envoyé'
    },
    {
      type: 'received',
      sender: 'Hervé IRAGI',
      text: 'Parfait ! Pouvons-nous fixer une visite sur place ?',
      time: '10:33',
      status: 'lu'
    },
    {
      type: 'sent',
      sender: 'Vous',
      text: 'Bien sûr, je suis disponible demain après-midi à partir de 14h.',
      time: '10:35',
      status: 'envoyé'
    }
  ]
}

const toggleChat = () => {
  emit('toggle')

  // Marquer les messages comme lus quand on ouvre le chat
  if (!props.isOpen) {
    emit('read-messages')
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const message = {
    type: 'sent',
    sender: 'Vous',
    text: newMessage.value,
    time: new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    status: 'en attente'
  }

  messages.value.push(message)
  const messageText = newMessage.value
  newMessage.value = ''
  sending.value = true

  // Émettre l'événement
  emit('send-message', messageText)

  // Simuler l'envoi
  setTimeout(() => {
    const sentMessage = messages.value.find(m => m.status === 'en attente')
    if (sentMessage) {
      sentMessage.status = 'envoyé'
    }
    sending.value = false
  }, 500)

  // Simuler une réponse automatique
  setTimeout(() => {
    simulateResponse()
  }, 2000)

  scrollToBottom()
}

const simulateResponse = () => {
  isTyping.value = true

  setTimeout(() => {
    const responses = [
      'Je vous recontacte dès que possible pour confirmer.',
      'Merci pour votre message. Pouvons-nous en discuter par téléphone ?',
      'Je note votre demande de visite. Je vous confirme l\'horaire ce soir.',
      'Parfait ! Apportez une pièce d\'identité pour la visite.'
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    messages.value.push({
      type: 'received',
      sender: 'Hervé IRAGI',
      text: randomResponse,
      time: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'lu'
    })

    isTyping.value = false
    scrollToBottom()
  }, 1500)
}

const startRecording = () => {
  console.log('Démarrage enregistrement vocal')
  // Implémenter la logique d'enregistrement vocal ici
}

const getStatusIcon = (status) => {
  switch(status) {
    case 'en attente': return 'schedule'
    case 'envoyé': return 'done'
    case 'lu': return 'done_all'
    default: return 'info'
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Charger les messages initiaux
onMounted(() => {
  loadDemoMessages()
  scrollToBottom()
})

// Surveiller les changements d'ouverture
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      scrollToBottom()
    })
  }
})
</script>

<style scoped>
.parcelle-chat {
  position: fixed;
  bottom: 80px; /* Au-dessus du footer */
  right: 20px;
  width: 350px;
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.parcelle-chat.chat-open {
  max-height: 70vh;
}

.chat-header {
  padding: 12px 16px;
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  user-select: none;
}

.chat-header-content {
  display: flex;
  align-items: center;
}

.chat-title {
  font-weight: 500;
  flex: 1;
}

.chat-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 300px;
  max-height: 60vh;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8f9fa;
}

.message {
  max-width: 85%;
  padding: 12px;
  border-radius: 12px;
  position: relative;
}

.message.sent {
  align-self: flex-end;
  background: linear-gradient(135deg, #2E7D32 0%, #388E3C 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received {
  align-self: flex-start;
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message-sender {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.sender-name {
  font-weight: 500;
  margin-right: 8px;
}

.message-time {
  font-size: 0.7rem;
  opacity: 0.6;
}

.message-content {
  word-wrap: break-word;
  line-height: 1.4;
}

.message-status {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
  font-size: 0.7rem;
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  align-self: flex-start;
}

.typing-dots {
  display: flex;
  gap: 3px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2E7D32;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.typing-text {
  font-size: 0.8rem;
  color: #666;
}

.chat-input {
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  background: white;
}

.message-input {
  background: #f8f9fa;
}

/* Animation */
@keyframes typing {
  0%, 100% {
    opacity: 0.4;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .parcelle-chat {
    width: calc(100vw - 40px);
    right: 10px;
    bottom: 70px;
  }

  .parcelle-chat.chat-open {
    max-height: 60vh;
  }
}
</style>
