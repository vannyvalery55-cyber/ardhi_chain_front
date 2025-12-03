<template>
  <footer class="footer-container">

    <!-- Top Footer -->
    <div class="footer-top bg-deep-purple-10">
      <div class="footer-content q-px-xl q-py-lg">

        <div class="row q-col-gutter-xl items-start">

          <!-- Logo et Description -->
          <div class="col-12 col-md-4">
            <div class="footer-brand q-mb-lg">
              <div class="row items-center q-mb-md">
                <q-icon
                  name="account_balance"
                  size="lg"
                  color="amber-4"
                  class="q-mr-sm"
                />
                <div class="text-h5 text-white text-weight-bold logo-text">
                  ARDHI<span class="text-amber-4">_</span>CHAIN
                </div>
              </div>

              <p class="text-body2 text-grey-3 q-mb-md">
                La plateforme immobilière congolaise révolutionnaire, sécurisée par la technologie NFT sur la
                <strong class="text-teal-4">Blockchain Cardano</strong>.
                Nous garantissons la transparence et l'immuabilité absolue des titres de propriété.
              </p>

              <!-- Badge de sécurité -->
              <div class="security-badge q-mb-lg">
                <q-chip
                  color="teal-9"
                  text-color="white"
                  class="q-px-md"
                  icon="verified"
                >
                  <span class="text-caption text-weight-bold">SÉCURISÉ BLOCKCHAIN</span>
                </q-chip>
              </div>

              <!-- Social Media -->
              <div class="social-media">
                <div class="text-caption text-grey-4 q-mb-sm">Suivez-nous</div>
                <div class="row q-gutter-xs">
                  <q-btn
                    round
                    flat
                    color="grey-3"
                    icon="fab fa-twitter"
                    size="sm"
                    class="social-btn"
                  />
                  <q-btn
                    round
                    flat
                    color="grey-3"
                    icon="fab fa-facebook-f"
                    size="sm"
                    class="social-btn"
                  />
                  <q-btn
                    round
                    flat
                    color="grey-3"
                    icon="fab fa-linkedin-in"
                    size="sm"
                    class="social-btn"
                  />
                  <q-btn
                    round
                    flat
                    color="grey-3"
                    icon="fab fa-telegram-plane"
                    size="sm"
                    class="social-btn"
                  />
                  <q-btn
                    round
                    flat
                    color="grey-3"
                    icon="fab fa-github"
                    size="sm"
                    class="social-btn"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="col-12 col-md-2">
            <div class="footer-section">
              <div class="text-h6 text-white q-mb-md section-title">
                Navigation
              </div>
              <q-list class="footer-list" dense>
                <q-item
                  clickable
                  v-ripple
                  :to="{ name: 'home' }"
                  class="footer-list-item"
                  active-class="active-link"
                >
                  <q-item-section avatar>
                    <q-icon name="home" color="grey-4" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-grey-3">Accueil</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  :to="{ name: 'properties' }"
                  class="footer-list-item"
                  active-class="active-link"
                >
                  <q-item-section avatar>
                    <q-icon name="apartment" color="grey-4" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-grey-3">Biens</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  :to="{ name: 'add-property' }"
                  class="footer-list-item"
                  active-class="active-link"
                >
                  <q-item-section avatar>
                    <q-icon name="add_circle" color="amber-4" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-grey-3">Ajouter un bien</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  :to="{ name: 'account' }"
                  class="footer-list-item"
                  active-class="active-link"
                >
                  <q-item-section avatar>
                    <q-icon name="account_balance_wallet" color="teal-4" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-grey-3">Mon Wallet</q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Contact -->
          <div class="col-12 col-md-3">
            <div class="footer-section">
              <div class="text-h6 text-white q-mb-md section-title">
                <q-icon name="support_agent" size="sm" class="q-mr-sm" />
                Support
              </div>
              <q-list class="footer-list" dense>
                <q-item class="footer-contact-item">
                  <q-item-section avatar>
                    <q-avatar color="deep-purple-8" text-color="white" size="sm">
                      <q-icon name="email" size="xs" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <div class="text-caption text-grey-4">Email</div>
                    <div class="text-body2 text-white">contact@ardhichain.cd</div>
                  </q-item-section>
                </q-item>
                <q-item class="footer-contact-item">
                  <q-item-section avatar>
                    <q-avatar color="deep-purple-8" text-color="white" size="sm">
                      <q-icon name="phone" size="xs" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <div class="text-caption text-grey-4">Téléphone</div>
                    <div class="text-body2 text-white">+243 970 000 000</div>
                  </q-item-section>
                </q-item>
                <q-item class="footer-contact-item">
                  <q-item-section avatar>
                    <q-avatar color="deep-purple-8" text-color="white" size="sm">
                      <q-icon name="location_on" size="xs" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <div class="text-caption text-grey-4">Adresse</div>
                    <div class="text-body2 text-white">Goma, RDC</div>
                  </q-item-section>
                </q-item>
                <q-item clickable v-ripple class="footer-list-item">
                  <q-item-section avatar>
                    <q-avatar color="teal-9" text-color="white" size="sm">
                      <q-icon name="help" size="xs" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <div class="text-body2 text-grey-3">Centre d'aide</div>
                    <div class="text-caption text-teal-3">FAQ & Documentation</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Légal -->
          <div class="col-12 col-md-3">
            <div class="footer-section">
              <div class="text-h6 text-white q-mb-md section-title">
                <q-icon name="gavel" size="sm" class="q-mr-sm" />
                Légal
              </div>
              <q-list class="footer-list" dense>
                <q-item clickable v-ripple class="footer-list-item">
                  <q-item-section avatar>
                    <q-icon name="description" color="grey-4" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-grey-3">Conditions d'utilisation</q-item-section>
                </q-item>
                <q-item clickable v-ripple class="footer-list-item">
                  <q-item-section avatar>
                    <q-icon name="security" color="grey-4" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-grey-3">Politique de confidentialité</q-item-section>
                </q-item>
                <q-item clickable v-ripple class="footer-list-item">
                  <q-item-section avatar>
                    <q-icon name="cookie" color="grey-4" size="xs" />
                  </q-item-section>
                  <q-item-section class="text-body2 text-grey-3">Gestion des cookies</q-item-section>
                </q-item>
                <q-item class="footer-list-item">
                  <q-item-section avatar>
                    <q-avatar color="amber-9" text-color="white" size="sm">
                      <q-icon name="token" size="xs" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <div class="text-body2 text-white">Certifié Cardano</div>
                    <div class="text-caption text-amber-3">Powered by ADA Blockchain</div>
                  </q-item-section>
                </q-item>
              </q-list>

              <!-- Newsletter -->
              <div class="newsletter q-mt-lg">
                <div class="text-caption text-grey-4 q-mb-xs">Restez informé</div>
                <div class="row items-center q-gutter-xs">
                  <q-input
                    dense
                    outlined
                    placeholder="Votre email"
                    dark
                    color="grey-4"
                    class="newsletter-input"
                    bg-color="deep-purple-8"
                  >
                    <template v-slot:append>
                      <q-btn
                        flat
                        dense
                        icon="send"
                        color="amber-4"
                        size="sm"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="footer-bottom bg-deep-purple-11">
      <div class="footer-bottom-content q-px-xl q-py-md">
        <div class="row items-center justify-between">

          <!-- Copyright -->
          <div class="col-12 col-sm-6">
            <div class="row items-center q-gutter-md">
              <div class="text-body2 text-grey-5">
                &copy; {{ new Date().getFullYear() }} <strong class="text-white">ARDHI_CHAIN</strong>. Tous droits réservés.
              </div>
              <q-chip
                dense
                color="deep-purple-8"
                text-color="amber-4"
                size="sm"
                icon="code"
              >
                <span class="text-caption">v2.0.1</span>
              </q-chip>
            </div>
          </div>

          <!-- Liens supplémentaires -->
          <div class="col-12 col-sm-6 text-right">
            <div class="row justify-end items-center q-gutter-lg">
              <q-btn
                flat
                dense
                label="Statistiques"
                color="grey-4"
                size="sm"
                icon="analytics"
              />
              <q-btn
                flat
                dense
                label="API"
                color="grey-4"
                size="sm"
                icon="api"
              />
              <q-btn
                flat
                dense
                label="Statut"
                color="green-4"
                size="sm"
                icon="check_circle"
              >
                <q-tooltip>Tous les systèmes sont opérationnels</q-tooltip>
              </q-btn>
            </div>
          </div>

        </div>
      </div>

      <!-- Barre d'accentuation -->
      <div class="footer-accent bg-gradient"></div>
    </div>

  </footer>
</template>

<script setup>
// Pas de logique spécifique ici
</script>

<style scoped>
.footer-container {
  font-family: 'Roboto', sans-serif;
}

/* Top Footer */
.footer-top {
  background: linear-gradient(135deg, #1a237e 0%, #311b92 100%);
  position: relative;
  overflow: hidden;
}

.footer-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffd54f 0%, #ff9800 100%);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Brand Section */
.logo-text {
  font-family: 'Segoe UI', sans-serif;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.security-badge .q-chip {
  border: 1px solid rgba(255, 213, 79, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.social-btn {
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-2px);
  border-color: rgba(255, 213, 79, 0.5);
}

/* Section Titles */
.section-title {
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #ffd54f 0%, #ff9800 100%);
  border-radius: 2px;
}

/* Footer Lists */
.footer-list {
  background: transparent;
}

.footer-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.footer-list-item:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-left-color: #ffd54f;
  transform: translateX(5px);
}

.footer-list-item.active-link {
  background: rgba(103, 58, 183, 0.2) !important;
  border-left-color: #7e57c2;
}

.footer-contact-item {
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 8px 0;
}

.footer-contact-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

/* Newsletter */
.newsletter-input {
  border-radius: 8px;
}

.newsletter-input :deep(.q-field__control) {
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter-input :deep(.q-field__control):hover {
  border-color: rgba(255, 213, 79, 0.5);
}

/* Bottom Footer */
.footer-bottom {
  background: #0d0b1a;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.footer-bottom-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Footer Accent */
.footer-accent {
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg,
    #ffd54f 0%,
    #ff9800 25%,
    #ff5722 50%,
    #e91e63 75%,
    #9c27b0 100%
  );
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    padding: 2rem 1rem;
  }

  .footer-section {
    margin-bottom: 2rem;
  }

  .footer-bottom-content {
    text-align: center;
  }

  .footer-bottom .row {
    flex-direction: column;
    gap: 1rem;
  }

  .footer-bottom .text-right {
    text-align: center !important;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .footer-content {
    padding: 1.5rem 1rem;
  }

  .logo-text {
    font-size: 1.5rem;
  }

  .social-media .row {
    justify-content: center;
  }
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer-section {
  animation: fadeInUp 0.6s ease;
}

.footer-section:nth-child(2) {
  animation-delay: 0.1s;
}

.footer-section:nth-child(3) {
  animation-delay: 0.2s;
}

.footer-section:nth-child(4) {
  animation-delay: 0.3s;
}
</style>
