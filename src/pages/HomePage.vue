<template>
  <q-page>
    <!-- Hero Section Renforcée -->
    <div class="hero-container relative-position">
      <div class="hero-overlay"></div>

      <div class="hero-content text-center q-pa-xl" style="z-index: 2;">
        <!-- Badge d'accroche -->
        <q-badge
          rounded
          color="amber-6"
          class="q-px-md q-py-xs q-mb-lg text-caption text-weight-bold"
          label="INNOVATION BLOCKCHAIN"
        />

        <!-- Titre principal -->
        <div class="text-h2 text-white q-mb-md text-weight-bold hero-title">
          ARDHI-CHAIN
        </div>

        <div class="text-h5 text-white q-mb-xl text-weight-medium">
          La Sécurité Foncière à Goma <span class="text-amber-4">Redéfinie</span>
        </div>

        <!-- Description améliorée -->
        <div class="text-body1 text-white q-mb-xl hero-description" style="max-width: 900px; margin: auto;">
          **ARDHI-CHAIN** révolutionne la sécurité foncière à Goma grâce à la puissance de la blockchain Cardano.
          Chaque titre de propriété est transformé en **NFT unique**, garantissant une **Preuve de Propriété (PoP)**
          infalsifiable et immuable. Notre plateforme élimine les risques de fraude et sécurise votre patrimoine
          immobilier pour les générations futures.
        </div>

        <!-- Widget de recherche amélioré -->
        <div class="search-container q-mt-xl" style="max-width: 800px; margin: auto;">
          <SearchWidget
            v-model:modelValue="searchTerm"
            @search="handleSearch"
            class="elevated-search"
          />
        </div>

        <!-- Indicateur de scroll -->
        <div class="scroll-indicator q-mt-xl">
          <q-icon name="keyboard_arrow_down" size="lg" color="white" class="animated-icon" />
        </div>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="main-content q-pa-xl">
      <!-- Loading state -->
      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-gears color="primary" size="3em" />
        <p class="q-mt-md text-grey-7">Chargement des propriétés...</p>
      </div>

      <div v-else>
        <!-- Section À Propos -->
        <div class="section-container q-mb-xl">
          <q-card class="about-card q-pa-lg" flat>
            <div class="row items-center q-col-gutter-xl">
              <!-- Colonne Logo et Visual -->
              <div class="col-12 col-md-5 text-center">
                <div class="logo-display q-mb-lg">
                  <div class="logo-icon q-mb-md">
                    <q-icon
                      name="account_balance"
                      size="xl"
                      color="deep-purple-7"
                      class="logo-animation"
                    />
                  </div>
                  <div class="text-h4 text-deep-purple-8 text-weight-bold q-mb-sm">
                    ARDHI-CHAIN
                  </div>
                  <q-chip
                    color="amber-1"
                    text-color="amber-9"
                    class="q-mb-lg"
                  >
                    <q-avatar icon="verified" color="amber-4" text-color="white" />
                    Plateforme Certifiée
                  </q-chip>
                </div>

                <q-img
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Sécurité Foncière Blockchain"
                  class="rounded-borders shadow-5"
                  style="height: 300px;"
                  placeholder-src="https://placehold.co/800x400/a392e2/ffffff?text=Securite+Blockchain"
                >
                  <div class="absolute-bottom text-subtitle2 text-center q-pa-sm bg-deep-purple-9 text-white">
                    {{ totalProperties }} biens sécurisés par la Blockchain Cardano
                  </div>
                </q-img>
              </div>

              <!-- Colonne Description -->
              <div class="col-12 col-md-7">
                <div class="text-h4 text-deep-purple-9 q-mb-md text-weight-bold">
                  <q-icon name="info" color="deep-purple-7" class="q-mr-sm" />
                  Qu'est-ce que ARDHI-CHAIN ?
                </div>

                <div class="description-content">
                  <p class="text-body1 q-mb-md">
                    <q-icon name="check_circle" color="green-6" size="sm" class="q-mr-sm" />
                    <strong>ARDHI-CHAIN</strong> est une initiative révolutionnaire qui transforme le secteur foncier
                    à Goma en apportant une <strong>transparence totale</strong> et une <strong>sécurité inégalée</strong>.
                  </p>

                  <p class="text-body1 q-mb-md">
                    <q-icon name="check_circle" color="green-6" size="sm" class="q-mr-sm" />
                    Nous exploitons la <strong>Blockchain Cardano</strong> pour créer un registre de propriété
                    <strong>immuable</strong> et <strong>infalsifiable</strong>, accessible à tous.
                  </p>

                  <p class="text-body1 q-mb-md">
                    <q-icon name="check_circle" color="green-6" size="sm" class="q-mr-sm" />
                    Chaque parcelle est tokenisée en <strong>NFT unique</strong>, servant de <strong>Preuve de Propriété (PoP)</strong>
                    numérique vérifiable à tout moment.
                  </p>

                  <p class="text-body1">
                    <q-icon name="check_circle" color="green-6" size="sm" class="q-mr-sm" />
                    Notre mission : garantir la <strong>confiance</strong> et la <strong>sécurité</strong> pour
                    les propriétaires et investisseurs, avec un système où l'authenticité de votre bien est
                    gravée dans la blockchain pour l'éternité.
                  </p>
                </div>

                <!-- Statistiques réelles -->
                <div class="row q-mt-xl q-gutter-md">
                  <div class="col">
                    <div class="text-h5 text-deep-purple-9 text-weight-bold text-center">{{ totalProperties }}</div>
                    <div class="text-caption text-grey-7 text-center">Biens sécurisés</div>
                  </div>
                  <div class="col">
                    <div class="text-h5 text-deep-purple-9 text-weight-bold text-center">{{ forSaleCount }}</div>
                    <div class="text-caption text-grey-7 text-center">À vendre</div>
                  </div>
                  <div class="col">
                    <div class="text-h5 text-deep-purple-9 text-weight-bold text-center">{{ forRentCount }}</div>
                    <div class="text-caption text-grey-7 text-center">À louer</div>
                  </div>
                  <div class="col">
                    <div class="text-h5 text-deep-purple-9 text-weight-bold text-center">{{ uniqueCities.length }}</div>
                    <div class="text-caption text-grey-7 text-center">Villes</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>

        <!-- Section Avantages -->
        <div class="section-container q-mb-xl">
          <div class="text-center q-mb-lg">
            <div class="text-h4 text-deep-purple-9 q-mb-sm text-weight-bold">
              <q-icon name="star" color="amber-6" class="q-mr-sm" />
              Pourquoi Choisir ARDHI-CHAIN ?
            </div>
            <div class="text-subtitle1 text-grey-7">
              Des solutions innovantes pour une sécurité foncière absolue
            </div>
          </div>

          <div class="row q-col-gutter-lg q-mb-xl">
            <q-card class="col-12 col-md-4 benefit-card" flat bordered>
              <q-card-section class="text-center">
                <div class="benefit-icon q-mb-md">
                  <q-icon name="fingerprint" size="xl" color="deep-purple-7" />
                </div>
                <div class="text-h6 text-weight-bold text-deep-purple-9 q-mb-sm">
                  Identités Vérifiées (DID)
                </div>
                <p class="text-body2 text-grey-7">
                  Système d'identité décentralisée pour une confiance absolue entre toutes les parties prenantes,
                  éliminant les risques d'usurpation d'identité.
                </p>
              </q-card-section>
            </q-card>

            <q-card class="col-12 col-md-4 benefit-card highlight" flat bordered>
              <q-card-section class="text-center">
                <div class="benefit-icon q-mb-md">
                  <q-icon name="token" size="xl" color="amber-6" />
                </div>
                <div class="text-h6 text-weight-bold text-deep-purple-9 q-mb-sm">
                  Tokenisation des Parcelles
                </div>
                <p class="text-body2 text-grey-7">
                  Chaque titre est un <strong>NFT unique</strong> sur Cardano, garantissant son authenticité
                  et son immuabilité. Une révolution dans la propriété foncière.
                </p>
              </q-card-section>
            </q-card>

            <q-card class="col-12 col-md-4 benefit-card" flat bordered>
              <q-card-section class="text-center">
                <div class="benefit-icon q-mb-md">
                  <q-icon name="gavel" size="xl" color="light-blue-7" />
                </div>
                <div class="text-h6 text-weight-bold text-deep-purple-9 q-mb-sm">
                  Transparence du Registre
                </div>
                <p class="text-body2 text-grey-7">
                  Historique des transactions accessible à tous, réduisant drastiquement les risques de litiges.
                  Chaque modification est traçable et vérifiable.
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Section Recherche - Affichage en grille de cartes carrées -->
        <div class="section-container">
          <div class="text-center q-mb-lg">
            <div class="text-h4 text-deep-purple-9 q-mb-sm text-weight-bold">
              <q-icon name="search" color="deep-purple-7" class="q-mr-sm" />
              Biens Disponibles sur la Blockchain
            </div>
            <div class="text-subtitle1 text-grey-7">
              Explorez les propriétés sécurisées et certifiées NFT
            </div>
          </div>

          <!-- Compteur de biens -->
          <q-card flat class="q-mb-lg bg-deep-purple-1">
            <q-card-section class="text-center">
              <div class="text-h5 text-deep-purple-9 text-weight-bold">
                {{ totalProperties }} Biens Disponibles
              </div>
              <div class="text-caption text-grey-7">
                Tous sécurisés par la technologie blockchain et disponibles en NFT
              </div>
            </q-card-section>
          </q-card>

          <!-- Navigation par catégorie -->
          <div class="category-tabs q-mb-lg">
            <q-tabs
              v-model="activeCategory"
              inline-label
              class="text-deep-purple-9"
              active-color="deep-purple-7"
              indicator-color="amber-6"
            >
              <q-tab
                name="all"
                icon="all_inclusive"
                label="Tous les biens"
                :ripple="false"
              />
              <q-tab
                name="houses"
                icon="house"
                label="Maisons"
                :ripple="false"
              />
              <q-tab
                name="land"
                icon="map"
                label="Terrains"
                :ripple="false"
              />
            </q-tabs>
          </div>

          <!-- Grille de propriétés en cartes carrées -->
          <div class="properties-grid-container q-mb-xl">
            <!-- Maisons et Appartements -->
            <div v-if="activeCategory === 'all' || activeCategory === 'houses'" class="category-section q-mb-xl">
              <div class="text-h5 text-deep-purple-9 q-mb-md">
                <q-icon name="house" color="deep-purple-7" class="q-mr-sm" />
                Maisons et Appartements ({{ filteredHouses.length }})
              </div>

              <div v-if="filteredHouses.length > 0" class="properties-grid">
                <div class="grid-row">
                  <!-- Première ligne (max 3 cartes) -->
                  <div
                    v-for="property in filteredHouses.slice(0, 3)"
                    :key="property.id"
                    class="grid-item"
                  >
                    <PropertyCardSquare :property="property" />
                  </div>

                  <!-- Placeholders si moins de 3 maisons -->
                  <template v-if="filteredHouses.length < 3">
                    <div
                      v-for="n in (3 - filteredHouses.length)"
                      :key="`placeholder-${n}`"
                      class="grid-item placeholder-card"
                    >
                      <q-card class="empty-property-card" flat>
                        <div class="text-center q-pa-xl">
                          <q-icon name="add_circle" size="xl" color="grey-4" />
                          <div class="text-caption text-grey-5 q-mt-sm">Prochain bien à venir</div>
                        </div>
                      </q-card>
                    </div>
                  </template>
                </div>

                <!-- Deuxième ligne (max 3 cartes suivantes) -->
                <div v-if="filteredHouses.length > 3" class="grid-row">
                  <div
                    v-for="property in filteredHouses.slice(3, 6)"
                    :key="property.id"
                    class="grid-item"
                  >
                    <PropertyCardSquare :property="property" />
                  </div>

                  <!-- Placeholders si moins de 3 maisons sur la deuxième ligne -->
                  <template v-if="filteredHouses.length < 6">
                    <div
                      v-for="n in (6 - Math.min(filteredHouses.length, 6))"
                      :key="`placeholder2-${n}`"
                      class="grid-item placeholder-card"
                    >
                      <q-card class="empty-property-card" flat>
                        <div class="text-center q-pa-xl">
                          <q-icon name="add_circle" size="xl" color="grey-4" />
                          <div class="text-caption text-grey-5 q-mt-sm">Disponible bientôt</div>
                        </div>
                      </q-card>
                    </div>
                  </template>
                </div>

                <!-- Bouton Voir Plus si plus de 6 maisons -->
                <div v-if="filteredHouses.length > 6" class="text-center q-mt-md">
                  <q-btn
                    flat
                    color="deep-purple-7"
                    :label="showAllHouses ? 'Voir moins' : 'Voir plus de maisons'"
                    :icon-right="showAllHouses ? 'expand_less' : 'expand_more'"
                    @click="showAllHouses = !showAllHouses"
                  />

                  <!-- Affichage des maisons supplémentaires -->
                  <div v-if="showAllHouses" class="additional-properties q-mt-md">
                    <div class="grid-row">
                      <div
                        v-for="property in filteredHouses.slice(6)"
                        :key="property.id"
                        class="grid-item"
                      >
                        <PropertyCardSquare :property="property" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="empty-state q-pa-lg text-center">
                <q-icon name="house_siding" size="xl" color="grey-4" class="q-mb-sm" />
                <div class="text-h6 text-grey-6">Aucune maison disponible actuellement</div>
                <div class="text-caption text-grey-5">Revenez bientôt pour découvrir de nouvelles propriétés</div>
              </div>
            </div>

            <!-- Terrains et Parcelles -->
            <div v-if="activeCategory === 'all' || activeCategory === 'land'" class="category-section q-mb-xl">
              <div class="text-h5 text-deep-purple-9 q-mb-md">
                <q-icon name="map" color="teal-7" class="q-mr-sm" />
                Terrains et Parcelles ({{ filteredLand.length }})
              </div>

              <div v-if="filteredLand.length > 0" class="properties-grid">
                <div class="grid-row">
                  <!-- Première ligne (max 3 cartes) -->
                  <div
                    v-for="property in filteredLand.slice(0, 3)"
                    :key="property.id"
                    class="grid-item"
                  >
                    <PropertyCardSquare :property="property" />
                  </div>

                  <!-- Placeholders si moins de 3 terrains -->
                  <template v-if="filteredLand.length < 3">
                    <div
                      v-for="n in (3 - filteredLand.length)"
                      :key="`placeholder-land-${n}`"
                      class="grid-item placeholder-card"
                    >
                      <q-card class="empty-property-card" flat>
                        <div class="text-center q-pa-xl">
                          <q-icon name="add_circle" size="xl" color="grey-4" />
                          <div class="text-caption text-grey-5 q-mt-sm">Nouvelle parcelle prochainement</div>
                        </div>
                      </q-card>
                    </div>
                  </template>
                </div>

                <!-- Deuxième ligne (max 3 cartes suivantes) -->
                <div v-if="filteredLand.length > 3" class="grid-row">
                  <div
                    v-for="property in filteredLand.slice(3, 6)"
                    :key="property.id"
                    class="grid-item"
                  >
                    <PropertyCardSquare :property="property" />
                  </div>

                  <!-- Placeholders si moins de 3 terrains sur la deuxième ligne -->
                  <template v-if="filteredLand.length < 6">
                    <div
                      v-for="n in (6 - Math.min(filteredLand.length, 6))"
                      :key="`placeholder-land2-${n}`"
                      class="grid-item placeholder-card"
                    >
                      <q-card class="empty-property-card" flat>
                        <div class="text-center q-pa-xl">
                          <q-icon name="add_circle" size="xl" color="grey-4" />
                          <div class="text-caption text-grey-5 q-mt-sm">Disponible bientôt</div>
                        </div>
                      </q-card>
                    </div>
                  </template>
                </div>

                <!-- Bouton Voir Plus si plus de 6 terrains -->
                <div v-if="filteredLand.length > 6" class="text-center q-mt-md">
                  <q-btn
                    flat
                    color="teal-7"
                    :label="showAllLand ? 'Voir moins' : 'Voir plus de terrains'"
                    :icon-right="showAllLand ? 'expand_less' : 'expand_more'"
                    @click="showAllLand = !showAllLand"
                  />

                  <!-- Affichage des terrains supplémentaires -->
                  <div v-if="showAllLand" class="additional-properties q-mt-md">
                    <div class="grid-row">
                      <div
                        v-for="property in filteredLand.slice(6)"
                        :key="property.id"
                        class="grid-item"
                      >
                        <PropertyCardSquare :property="property" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="empty-state q-pa-lg text-center">
                <q-icon name="fence" size="xl" color="grey-4" class="q-mb-sm" />
                <div class="text-h6 text-grey-6">Aucune parcelle disponible actuellement</div>
                <div class="text-caption text-grey-5">Explorez notre carte pour voir les disponibilités futures</div>
              </div>
            </div>
          </div>

          <!-- Section Carte Interactive -->
          <div class="map-section">
            <q-card class="map-card" flat bordered>
              <q-card-section>
                <div class="text-h5 text-deep-purple-9 q-mb-md">
                  <q-icon name="location_on" color="red-7" class="q-mr-sm" />
                  Vue Globale sur Carte
                </div>
                <!-- Note: Vous devrez implémenter MapView ou le retirer temporairement -->
                <div class="map-container text-center q-pa-xl bg-grey-3 rounded-borders">
                  <q-icon name="map" size="xl" color="grey-6" class="q-mb-sm" />
                  <div class="text-h6 text-grey-7">Carte interactive à venir</div>
                  <div class="text-caption text-grey-5">Visualisation géographique des propriétés</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <FooterBar />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePropertiesStore } from 'src/stores/properties'
import PropertyCardSquare from 'src/components/PropertyCardSquare.vue'
import FooterBar from 'src/components/FooterBar.vue'
import SearchWidget from 'src/components/SearchWidget.vue'

// Utilisation du store
const propertiesStore = usePropertiesStore()
const loading = ref(true)
const searchTerm = ref('')
const activeCategory = ref('all')
const showAllHouses = ref(false)
const showAllLand = ref(false)

// Computed properties basées sur les vraies données
const allProperties = computed(() => {
  return propertiesStore.formattedProperties || []
})

const filteredProperties = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) {
    return allProperties.value
  }

  return allProperties.value.filter(property => {
    return (
      property.name?.toLowerCase().includes(term) ||
      property.description?.toLowerCase().includes(term) ||
      property.location?.toLowerCase().includes(term) ||
      property.price?.toLowerCase().includes(term)
    )
  })
})

// Maisons filtrées (avec recherche si appliquée)
const filteredHouses = computed(() => {
  const properties = activeFilters.value.ville
    ? filteredProperties.value
    : allProperties.value

  return properties.filter(property =>
    property.category === 'Maison' ||
    property.type_maison === 'appartement' ||
    property.type_maison === 'villa'
  )
})

// Terrains filtrés (placeholders pour l'instant)
const filteredLand = computed(() => {
  // Pour l'instant, retourner un tableau vide car nous n'avons pas d'API pour les terrains
  // Vous pouvez ajouter une API /api/terrains plus tard
  return []
})

// Filtres actifs
const activeFilters = computed(() => {
  return {}
})

// Statistiques
const totalProperties = computed(() => {
  return allProperties.value.length
})

const forSaleCount = computed(() => {
  return allProperties.value.filter(p => p.type_offre === 'vente').length
})

const forRentCount = computed(() => {
  return allProperties.value.filter(p => p.type_offre === 'location').length
})

const uniqueCities = computed(() => {
  const cities = allProperties.value
    .map(p => p.original?.parcelle?.ville)
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index)
  return cities
})

const handleSearch = (filters) => {
  console.log('🔍 Recherche avec filtres:', filters)
  // Vous pouvez implémenter la logique de filtrage ici
}

// Charger les données au montage
onMounted(async () => {
  try {
    // Si les données ne sont pas déjà chargées, les charger
    if (propertiesStore.houses.length === 0) {
      await propertiesStore.fetchHouses()
    }
  } catch (error) {
    console.error('Erreur chargement données:', error)
  } finally {
    loading.value = false
    console.log('🏠 Données chargées:', {
      total: allProperties.value.length,
      maisons: filteredHouses.value.length,
      terrains: filteredLand.value.length,
      villes: uniqueCities.value
    })
  }
})
</script>

<style scoped>
/* Hero Section */
.hero-container {
  min-height: 90vh;
  background: linear-gradient(135deg, #4527A0 0%, #311B92 50%, #1A237E 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover;
  opacity: 0.1;
  z-index: 1;
}

.hero-title {
  font-size: 4rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(90deg, #FFFFFF 30%, #FFD54F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 1s ease;
}

.hero-description {
  line-height: 1.8;
  font-size: 1.2rem;
  opacity: 0.95;
}

.search-container {
  animation: slideUp 1s ease 0.3s both;
}

.elevated-search {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.scroll-indicator {
  animation: bounce 2s infinite;
}

/* Category Tabs */
.category-tabs {
  background: #F5F5F5;
  border-radius: 12px;
  padding: 8px;
}

.category-tabs .q-tab {
  border-radius: 8px;
  margin: 0 4px;
}

.category-tabs .q-tab--active {
  background: white;
  box-shadow: 0 4px 12px rgba(103, 58, 183, 0.15);
}

/* Properties Grid */
.properties-grid-container {
  margin-top: 2rem;
}

.properties-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.grid-item {
  min-height: 350px;
}

/* Responsive Grid */
@media (max-width: 992px) {
  .grid-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-row {
    grid-template-columns: 1fr;
  }
}

/* Placeholder Cards */
.placeholder-card {
  opacity: 0.7;
}

.empty-property-card {
  height: 350px;
  border: 2px dashed #E0E0E0;
  border-radius: 16px;
  background: #FAFAFA;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Category Sections */
.category-section {
  padding-bottom: 2rem;
  border-bottom: 2px solid #F0F0F0;
}

.category-section:last-child {
  border-bottom: none;
}

/* Empty States */
.empty-state {
  border: 2px dashed #E0E0E0;
  border-radius: 16px;
  background: #FAFAFA;
  margin: 2rem 0;
}

/* Map Section */
.map-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid #F0F0F0;
}

.map-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.map-container {
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Additional Properties */
.additional-properties {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Logo Animation */
.logo-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Cards */
.about-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #FFFFFF 0%, #F3E5F5 100%);
}

.benefit-card {
  border-radius: 15px;
  transition: all 0.3s ease;
  height: 100%;
}

.benefit-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(103, 58, 183, 0.15) !important;
}

.benefit-card.highlight {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFF3E0 100%);
  border: 2px solid #FFD54F;
}

.benefit-icon {
  transition: all 0.3s ease;
}

.benefit-card:hover .benefit-icon {
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 992px) {
  .hero-title {
    font-size: 3rem;
  }

  .main-content {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .benefit-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }

  .main-content {
    padding: 1rem;
  }

  .category-tabs .q-tab {
    min-width: 100px;
    padding: 8px 12px;
  }
}
</style>
