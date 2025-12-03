<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-container">

      <!-- Logo ARDHI_CHAIN -->
      <div class="logo-container q-mb-xl">
        <q-icon
          name="account_balance"
          size="xl"
          color="deep-purple-7"
          class="logo-icon"
        />
        <div class="logo-text text-h4 text-weight-bold">
          ARDHI<span class="text-amber-6">_</span>CHAIN
        </div>
        <div class="text-subtitle1 text-grey-6 q-mt-sm">
          Sécurité Foncière Blockchain
        </div>
      </div>

      <!-- Cercle de chargement animé -->
      <div class="spinner-container">
        <div class="spinner-border">
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
        </div>

        <!-- Cercle de progression -->
        <div class="progress-ring">
          <svg class="progress-ring__circle" width="120" height="120">
            <!-- Définition du gradient SVG -->
            <defs>
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#311B92" />
                <stop offset="50%" stop-color="#4527A0" />
                <stop offset="100%" stop-color="#7E57C2" />
              </linearGradient>
            </defs>
            
            <circle
              class="progress-ring__circle-background"
              stroke-width="4"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
            />
            <circle
              class="progress-ring__circle-progress"
              stroke-width="4"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
              :style="circleStyle"
            />
          </svg>
          <div class="progress-text">
            {{ Math.round(progress) }}%
          </div>
        </div>
      </div>

      <!-- Message de chargement -->
      <div class="loading-message q-mt-xl">
        <div class="text-h6 text-deep-purple-8 q-mb-md">Initialisation de la plateforme</div>

        <!-- Étapes de chargement -->
        <div class="loading-steps">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <q-icon
              :name="currentStep > 1 ? 'check_circle' : 'fiber_manual_record'"
              :color="currentStep > 1 ? 'green-6' : 'grey-5'"
              size="sm"
              class="q-mr-sm"
            />
            <span class="text-caption">Connexion Blockchain</span>
          </div>

          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <q-icon
              :name="currentStep > 2 ? 'check_circle' : 'fiber_manual_record'"
              :color="currentStep > 2 ? 'green-6' : 'grey-5'"
              size="sm"
              class="q-mr-sm"
            />
            <span class="text-caption">Chargement des biens</span>
          </div>

          <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
            <q-icon
              :name="currentStep > 3 ? 'check_circle' : 'fiber_manual_record'"
              :color="currentStep > 3 ? 'green-6' : 'grey-5'"
              size="sm"
              class="q-mr-sm"
            />
            <span class="text-caption">Vérification sécurité</span>
          </div>
        </div>

        <!-- Message dynamique -->
        <div class="dynamic-message q-mt-lg">
          <div class="text-body2 text-grey-7">
            {{ loadingMessage }}
          </div>
        </div>
      </div>

      <!-- Indicateur de sécurité -->
      <div class="security-indicator q-mt-xl">
        <q-chip
          square
          color="teal-1"
          text-color="teal-9"
          class="q-px-md"
        >
          <q-avatar icon="verified" color="teal-6" text-color="white" />
          <span class="text-caption">Sécurisé par Cardano Blockchain</span>
        </q-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    default: 10000 // 10 secondes
  }
});

const emit = defineEmits(['loading-complete']);

const isLoading = ref(true);
const progress = ref(0);
const currentStep = ref(1);
const loadingMessage = ref('Connexion à la blockchain Cardano...');
const circleStyle = ref({});
let intervalId = null;
let stepIntervalId = null;

// Messages de chargement plus nombreux pour 10 secondes
const loadingMessages = [
  'Connexion à la blockchain Cardano...',
  'Authentification des utilisateurs...',
  'Vérification des certificats NFT...',
  'Chargement du catalogue immobilier...',
  'Initialisation de la cartographie...',
  'Synchronisation des données cadastrales...',
  'Vérification de la sécurité des données...',
  'Chargement des contrats intelligents...',
  'Optimisation des performances...',
  'Préparation de votre expérience...',
  'Presque terminé...'
];

// Calcul du style du cercle de progression
const updateCircleStyle = () => {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress.value / 100) * circumference;
  circleStyle.value = {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset
  };
};

// Démarrage de l'animation de chargement
const startLoading = () => {
  const duration = props.duration;
  const steps = 100;
  const interval = duration / steps; // 100ms pour 10 secondes
  let currentStepCount = 0;
  let messageIndex = 0;

  // Animation de progression
  intervalId = setInterval(() => {
    currentStepCount++;
    progress.value = (currentStepCount / steps) * 100;

    // Mise à jour du cercle
    updateCircleStyle();

    // Changement de message toutes les 10%
    if (currentStepCount % 10 === 0 && messageIndex < loadingMessages.length - 1) {
      messageIndex++;
      loadingMessage.value = loadingMessages[messageIndex];
    }

    // Changement d'étape
    if (currentStepCount === 33) {
      currentStep.value = 2;
    } else if (currentStepCount === 66) {
      currentStep.value = 3;
    }

    // Fin du chargement
    if (currentStepCount >= steps) {
      clearInterval(intervalId);

      // Délai avant de masquer l'écran de chargement
      setTimeout(() => {
        isLoading.value = false;
        emit('loading-complete');
      }, 500);
    }
  }, interval);
};

// Changement automatique des étapes (plus lent pour 10 secondes)
const startStepAnimation = () => {
  stepIntervalId = setInterval(() => {
    if (currentStep.value < 3) {
      currentStep.value++;
    }
  }, 2000); // Changement d'étape toutes les 2 secondes
};

onMounted(() => {
  // Initialiser le style du cercle
  updateCircleStyle();

  // Démarrer les animations
  startLoading();
  startStepAnimation();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (stepIntervalId) clearInterval(stepIntervalId);
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.5s ease;
}

.loading-container {
  text-align: center;
  max-width: 500px;
  padding: 40px;
  animation: slideUp 0.8s ease;
}

/* Logo */
.logo-container {
  animation: pulse 2s infinite;
}

.logo-icon {
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  background: linear-gradient(90deg, #311B92 0%, #4527A0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

/* Conteneur du spinner */
.spinner-container {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 30px auto;
}

/* Spinner animé */
.spinner-border {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
}

.spinner-circle {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #311B92, #4527A0, #7E57C2, #B39DDB);
}

.spinner-circle:nth-child(1) {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: pulseDot 1.5s ease-in-out infinite;
}

.spinner-circle:nth-child(2) {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  animation: pulseDot 1.5s ease-in-out infinite 0.5s;
}

.spinner-circle:nth-child(3) {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: pulseDot 1.5s ease-in-out infinite 1s;
}

.spinner-circle:nth-child(4) {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation: pulseDot 1.5s ease-in-out infinite 1.5s;
}

/* Cercle de progression */
.progress-ring {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 120px;
  height: 120px;
}

.progress-ring__circle-background {
  stroke: #E0E0E0;
}

.progress-ring__circle-progress {
  stroke: url(#loadingGradient);
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.35s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #311B92;
}

/* Étapes de chargement */
.loading-steps {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.step {
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 1;
}

.step.completed span {
  color: #4CAF50;
  font-weight: 500;
}

.dynamic-message {
  min-height: 24px;
  animation: fadeInOut 3s ease-in-out infinite;
}

/* Indicateur de sécurité */
.security-indicator {
  animation: fadeIn 1s ease 1s both;
}

/* Animations */
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulseDot {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.7;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .loading-container {
    padding: 20px;
    max-width: 90%;
  }
  
  .logo-text {
    font-size: 1.8rem;
  }
  
  .loading-steps {
    flex-direction: column;
    gap: 15px;
  }
}
</style>