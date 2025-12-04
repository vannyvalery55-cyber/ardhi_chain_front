<template>
  <q-page class="login-page flex flex-center">
    <div class="login-container">
      <!-- En-tête simplifié -->
      <div class="login-header text-center q-mb-lg">
        <div class="logo-container q-mb-md">
          <q-icon
            name="home"
            size="4em"
            color="primary"
            class="logo-icon"
          />
        </div>
        <div class="text-h4 text-weight-bold text-dark logo-text">
          ARDHI<span class="text-primary">_Chain</span>
        </div>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">
          Votre partenaire immobilier de confiance
        </div>
      </div>

      <!-- Carte de connexion -->
      <q-card class="login-card q-pa-lg">
        <!-- Tabs simplifiées -->
        <div class="tabs-header q-mb-lg">
          <q-btn-group spread class="full-width tab-group">
            <q-btn
              :outline="tab !== 'login'"
              :color="tab === 'login' ? 'primary' : 'grey-6'"
              label="Connexion"
              @click="tab = 'login'"
              class="tab-btn"
              :class="{ 'active-tab': tab === 'login' }"
            />
            <q-btn
              :outline="tab !== 'register'"
              :color="tab === 'register' ? 'primary' : 'grey-6'"
              label="Inscription"
              @click="tab = 'register'"
              class="tab-btn"
              :class="{ 'active-tab': tab === 'register' }"
            />
          </q-btn-group>
        </div>

        <q-tab-panels
          v-model="tab"
          animated
          class="tab-panels"
        >
          <!-- PANEL CONNEXION -->
          <q-tab-panel name="login">
            <div class="panel-header q-mb-md">
              <div class="text-h6 text-weight-bold text-dark">
                Bienvenue de retour
              </div>
            </div>

            <q-form @submit="handleLogin" class="q-gutter-md">
              <!-- Email -->
              <q-input
                v-model="loginForm.email"
                label="Email"
                type="email"
                outlined
                required
                color="primary"
                :rules="[
                  val => !!val || 'L\'email est requis',
                  val => /.+@.+\..+/.test(val) || 'Email invalide'
                ]"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <!-- Mot de passe -->
              <q-input
                v-model="loginForm.password"
                label="Mot de passe"
                :type="isPasswordVisible ? 'text' : 'password'"
                outlined
                required
                color="primary"
                :rules="[
                  val => !!val || 'Le mot de passe est requis',
                  val => val.length >= 6 || 'Minimum 6 caractères'
                ]"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPasswordVisible = !isPasswordVisible"
                  />
                </template>
              </q-input>

              <!-- Options -->
              <div class="login-options row items-center justify-between q-mb-md">
                <q-checkbox
                  v-model="rememberMe"
                  label="Se souvenir de moi"
                  color="primary"
                  size="sm"
                />
                <a
                  href="#"
                  class="text-primary text-caption"
                  @click.prevent="openForgotPassword"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              <!-- Bouton connexion -->
              <q-btn
                type="submit"
                label="Se connecter"
                color="primary"
                class="full-width q-mb-md"
                size="lg"
                :loading="loading"
                unelevated
              />

              <!-- Séparateur -->
              <div class="separator q-my-md">
                <div class="separator-line"></div>
                <span class="separator-text">ou continuer avec</span>
                <div class="separator-line"></div>
              </div>

              <!-- Connexion sociale -->
              <div class="social-login row q-gutter-sm">
                <q-btn
                  outline
                  color="grey-7"
                  class="social-btn col"
                  @click="loginWithGoogle"
                >
                  <q-icon name="img:https://www.google.com/favicon.ico" size="20px" class="q-mr-sm" />
                  Google
                </q-btn>

                <q-btn
                  outline
                  color="grey-7"
                  class="social-btn col"
                  @click="loginWithFacebook"
                >
                  <q-icon name="facebook" color="#1877F2" class="q-mr-sm" />
                  Facebook
                </q-btn>
              </div>
            </q-form>
          </q-tab-panel>

          <!-- PANEL INSCRIPTION -->
          <q-tab-panel name="register">
            <div class="panel-header q-mb-md">
              <div class="text-h6 text-weight-bold text-dark">
                Créer un compte
              </div>
            </div>

            <q-form @submit="handleRegister" class="q-gutter-md">
              <!-- Type de compte -->
              <q-select
                v-model="registerForm.type"
                :options="userTypes"
                label="Type de compte"
                outlined
                required
                color="primary"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-select>

              <!-- Nom complet -->
              <q-input
                v-model="registerForm.nom"
                label="Nom complet"
                outlined
                required
                color="primary"
                :rules="[val => !!val || 'Le nom est requis']"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>

              <!-- Email et Téléphone -->
              <div class="row q-gutter-md">
                <div class="col">
                  <q-input
                    v-model="registerForm.email"
                    label="Email"
                    type="email"
                    outlined
                    required
                    color="primary"
                    :rules="[
                      val => !!val || 'L\'email est requis',
                      val => /.+@.+\..+/.test(val) || 'Email invalide'
                    ]"
                    class="custom-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-input
                    v-model="registerForm.telephone"
                    label="Téléphone"
                    outlined
                    color="primary"
                    class="custom-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Adresse -->
              <q-input
                v-model="registerForm.adresse"
                label="Adresse"
                outlined
                color="primary"
                class="custom-input"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>

              <!-- Mot de passe et Confirmation -->
              <div class="row q-gutter-md">
                <div class="col">
                  <q-input
                    v-model="registerForm.mot_de_passe"
                    label="Mot de passe"
                    :type="isRegisterPasswordVisible ? 'text' : 'password'"
                    outlined
                    required
                    color="primary"
                    :rules="[
                      val => !!val || 'Le mot de passe est requis',
                      val => val.length >= 6 || 'Minimum 6 caractères'
                    ]"
                    class="custom-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isRegisterPasswordVisible ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isRegisterPasswordVisible = !isRegisterPasswordVisible"
                      />
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-input
                    v-model="registerForm.confirmPassword"
                    label="Confirmer"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    outlined
                    required
                    color="primary"
                    :rules="[
                      val => !!val || 'La confirmation est requise',
                      val => val === registerForm.mot_de_passe || 'Les mots de passe ne correspondent pas'
                    ]"
                    class="custom-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_reset" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isConfirmPasswordVisible ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                      />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Conditions -->
              <q-checkbox
                v-model="registerForm.acceptTerms"
                color="primary"
                size="sm"
                class="q-mb-md"
              >
                <span class="text-caption">
                  J'accepte les conditions d'utilisation
                </span>
              </q-checkbox>

              <!-- Bouton inscription -->
              <q-btn
                type="submit"
                label="S'inscrire"
                color="primary"
                class="full-width"
                size="lg"
                :loading="loading"
                :disable="!registerForm.acceptTerms"
                unelevated
              />

              <!-- Lien connexion -->
              <div class="text-center q-mt-md">
                <span class="text-caption text-grey-7">Déjà inscrit ? </span>
                <a
                  href="#"
                  class="text-primary text-caption"
                  @click.prevent="tab = 'login'"
                >
                  Se connecter
                </a>
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <!-- Footer -->
      <div class="login-footer text-center q-mt-lg">
        <div class="text-caption text-grey-6 q-mb-sm">
          © 2024 ARDHI_Chain. Tous droits réservés.
        </div>
        <q-btn
          flat
          color="primary"
          label="Retour à l'accueil"
          icon="arrow_back"
          @click="goToHome"
          size="sm"
        />
      </div>
    </div>

    <!-- Dialog mot de passe oublié -->
    <q-dialog v-model="forgotPasswordDialog">
      <q-card class="forgot-password-dialog">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Mot de passe oublié</div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-form @submit="handleForgotPassword" class="q-gutter-md">
            <div class="text-center q-mb-md">
              <q-icon name="email" size="3em" color="primary" />
              <div class="text-subtitle2 text-grey-7 q-mt-sm">
                Entrez votre email pour recevoir un lien de réinitialisation
              </div>
            </div>

            <q-input
              v-model="forgotPasswordEmail"
              label="Votre email"
              type="email"
              outlined
              required
              color="primary"
              :rules="[
                val => !!val || 'L\'email est requis',
                val => /.+@.+\..+/.test(val) || 'Email invalide'
              ]"
            />

            <div class="row q-mt-lg">
              <q-space />
              <q-btn
                label="Annuler"
                color="grey-7"
                flat
                @click="forgotPasswordDialog = false"
                class="q-mr-sm"
              />
              <q-btn
                label="Envoyer"
                color="primary"
                type="submit"
                :loading="loading"
                unelevated
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

// États
const tab = ref('login')
const loading = ref(false)
const rememberMe = ref(false)
const isPasswordVisible = ref(false)
const isRegisterPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const forgotPasswordDialog = ref(false)

// Types d'utilisateurs
const userTypes = [
  'Particulier',
  'Professionnel',
  'Agent immobilier'
]

// Formulaire de connexion
const loginForm = reactive({
  email: '',
  password: ''
})

// Formulaire d'inscription
const registerForm = reactive({
  type: 'Particulier',
  nom: '',
  email: '',
  telephone: '',
  adresse: '',
  mot_de_passe: '',
  confirmPassword: '',
  acceptTerms: false
})

// Mot de passe oublié
const forgotPasswordEmail = ref('')

// Vérifier si l'utilisateur est déjà connecté
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

// Connexion
const handleLogin = async () => {
  loading.value = true

  try {
    if (!loginForm.email || !loginForm.password) {
      throw new Error('Veuillez remplir tous les champs')
    }

    await authStore.login({
      email: loginForm.email,
      password: loginForm.password
    })

    $q.notify({
      color: 'positive',
      message: 'Connexion réussie !',
      icon: 'check_circle',
      position: 'top-right',
      timeout: 2000
    })

    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)

  } catch (error) {
    console.error('Erreur de connexion:', error)
    $q.notify({
      color: 'negative',
      message: error.message || 'Erreur de connexion',
      icon: 'error',
      position: 'top-right'
    })
  } finally {
    loading.value = false
  }
}

// Inscription
const handleRegister = async () => {
  loading.value = true

  try {
    if (registerForm.mot_de_passe !== registerForm.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas')
    }

    const userData = {
      type: registerForm.type,
      nom: registerForm.nom,
      email: registerForm.email,
      mot_de_passe: registerForm.mot_de_passe,
      telephone: registerForm.telephone || null,
      adresse: registerForm.adresse || null
    }

    await authStore.register(userData)

    $q.notify({
      color: 'positive',
      message: 'Inscription réussie ! Vous êtes maintenant connecté.',
      icon: 'check_circle',
      position: 'top-right',
      timeout: 2500
    })

    router.push('/')

  } catch (error) {
    console.error('Erreur d\'inscription:', error)
    $q.notify({
      color: 'negative',
      message: error.message || 'Erreur d\'inscription',
      icon: 'error',
      position: 'top-right'
    })
  } finally {
    loading.value = false
  }
}

// Mot de passe oublié
const openForgotPassword = () => {
  forgotPasswordEmail.value = loginForm.email
  forgotPasswordDialog.value = true
}

const handleForgotPassword = async () => {
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))

    $q.notify({
      color: 'positive',
      message: `Un email de réinitialisation a été envoyé à ${forgotPasswordEmail.value}`,
      icon: 'email',
      position: 'top-right'
    })

    forgotPasswordDialog.value = false
    forgotPasswordEmail.value = ''

  } catch (error) {
    console.error('Erreur:', error)
    $q.notify({
      color: 'negative',
      message: 'Erreur lors de l\'envoi de l\'email',
      icon: 'error',
      position: 'top-right'
    })
  } finally {
    loading.value = false
  }
}

// Connexion sociale
const loginWithGoogle = () => {
  $q.notify({
    message: 'Connexion Google - Fonctionnalité à implémenter',
    color: 'info',
    icon: 'info',
    position: 'top'
  })
}

const loginWithFacebook = () => {
  $q.notify({
    message: 'Connexion Facebook - Fonctionnalité à implémenter',
    color: 'info',
    icon: 'info',
    position: 'top'
  })
}

// Navigation
const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* Page principale */
.login-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Conteneur principal */
.login-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

/* En-tête */
.login-header {
  margin-bottom: 30px;
}

.logo-text {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  letter-spacing: -0.5px;
}

/* Carte de connexion */
.login-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

/* Tabs */
.tab-group {
  border-radius: 12px;
  overflow: hidden;
}

.tab-btn {
  border-radius: 0;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.3px;
}

.tab-btn:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.tab-btn:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

/* Inputs */
.custom-input :deep(.q-field__control) {
  border-radius: 10px;
  transition: all 0.2s ease;
}

.custom-input :deep(.q-field--outlined .q-field__control:hover) {
  border-color: var(--q-primary);
}

/* Séparateur */
.separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
}

.separator-line {
  flex: 1;
  height: 1px;
  background: #e9ecef;
}

.separator-text {
  padding: 0 16px;
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Connexion sociale */
.social-login {
  margin-bottom: 8px;
}

.social-btn {
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

/* Footer */
.login-footer {
  margin-top: 30px;
}

/* Dialog */
.forgot-password-dialog {
  border-radius: 16px;
  overflow: hidden;
  max-width: 400px;
  width: 90vw;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 600px) {
  .login-container {
    padding: 16px;
  }

  .login-card {
    padding: 20px !important;
  }

  .logo-text {
    font-size: 2rem;
  }

  .social-login {
    flex-direction: column;
  }

  .social-btn {
    width: 100%;
  }
}

/* Animations douces */
.login-container {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Effets de hover */
.tab-btn:hover {
  transform: translateY(-1px);
}

.q-btn--unelevated:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--q-primary-rgb, 102, 126, 234), 0.2);
}

/* Styles pour les liens */
a {
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  text-decoration: underline;
}

/* Ajustements pour les panels */
.tab-panels {
  min-height: 400px;
}
</style>
