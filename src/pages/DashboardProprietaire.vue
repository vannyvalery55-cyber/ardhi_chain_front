<template>
  <q-page class="dashboard-proprietaire">
    <!-- BANNIÈRE D'ACCUEIL -->
    <q-banner class="bg-primary text-white q-mb-md">
      <div class="row items-center">
        <div class="col">
          <div class="text-h5">Bonjour, {{ user?.nom || 'Propriétaire' }} 👋</div>
          <div class="text-subtitle1">Gérez vos propriétés et locations en temps réel</div>
        </div>
        <div class="col-auto">
          <q-btn color="white" text-color="primary" icon="refresh" @click="refreshData">
            Actualiser
          </q-btn>
        </div>
      </div>
    </q-banner>

    <!-- CARDS DE STATISTIQUES -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Total Propriétés -->
      <div class="col-6 col-sm-3">
        <q-card class="stat-card bg-blue-grey-1">
          <q-card-section class="text-center">
            <q-icon name="home" size="40px" color="blue-grey-8" class="q-mb-sm" />
            <div class="text-h5 text-weight-bold">{{ stats.totalProperties || 0 }}</div>
            <div class="text-subtitle2 text-blue-grey-8">Propriétés totales</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Maisons -->
      <div class="col-6 col-sm-3">
        <q-card class="stat-card bg-green-1">
          <q-card-section class="text-center">
            <q-icon name="house" size="40px" color="green-8" class="q-mb-sm" />
            <div class="text-h5 text-weight-bold">{{ stats.totalMaisons || 0 }}</div>
            <div class="text-subtitle2 text-green-8">Maisons</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat dense color="green-8" label="Ajouter" @click="showModal('maison')" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Terrains -->
      <div class="col-6 col-sm-3">
        <q-card class="stat-card bg-amber-1">
          <q-card-section class="text-center">
            <q-icon name="yard" size="40px" color="amber-8" class="q-mb-sm" />
            <div class="text-h5 text-weight-bold">{{ stats.totalTerrains || 0 }}</div>
            <div class="text-subtitle2 text-amber-8">Parcelles</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat dense color="amber-8" label="Ajouter" @click="showModal('parcelle')" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Revenu Mensuel -->
      <div class="col-6 col-sm-3">
        <q-card class="stat-card bg-purple-1">
          <q-card-section class="text-center">
            <q-icon name="payments" size="40px" color="purple-8" class="q-mb-sm" />
            <div class="text-h5 text-weight-bold">{{ formatCurrency(stats.revenuMensuel || 0) }}</div>
            <div class="text-subtitle2 text-purple-8">Revenu ce mois</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- SECTION PROPRIÉTÉS RÉCENTES -->
    <div class="row q-col-gutter-md q-mb-lg">
      <!-- Maisons récentes -->
      <div class="col-12 col-lg-6">
        <q-card>
          <q-card-section>
            <div class="row items-center q-mb-md">
              <div class="col">
                <div class="text-h6">Mes maisons récentes</div>
                <div class="text-subtitle2">Gestion complète de vos maisons</div>
              </div>
              <div class="col-auto">
                <q-btn color="primary" icon="add" label="Nouvelle maison" @click="showModal('maison')" />
              </div>
            </div>

            <div v-if="maisonsRecent.length > 0">
              <div v-for="maison in maisonsRecent" :key="maison.id" class="q-mb-md">
                <q-card class="property-card">
                  <q-card-section>
                    <div class="row items-center">
                      <div class="col">
                        <div class="text-h6 text-weight-bold">{{ maison.titre }}</div>
                        <div class="text-subtitle2">
                          <q-icon name="location_on" size="16px" />
                          {{ maison.ville }}, {{ maison.quartier }}
                        </div>
                      </div>
                      <div class="col-auto">
                        <q-badge :color="getStatusColor(maison.statut)">
                          {{ getStatusLabel(maison.statut) }}
                        </q-badge>
                      </div>
                    </div>

                    <div class="row items-center q-mt-sm">
                      <div class="col-4">
                        <div class="row items-center">
                          <q-icon name="square_foot" size="16px" class="text-grey q-mr-xs" />
                          <span class="text-caption">{{ maison.surface_totale }} m²</span>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="row items-center">
                          <q-icon name="bed" size="16px" class="text-grey q-mr-xs" />
                          <span class="text-caption">{{ maison.nombre_chambres }} ch.</span>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="text-h6 text-primary text-right">
                          {{ formatCurrency(maison.prix_vente || maison.prix_location) }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat dense icon="visibility" @click="viewProperty(maison, 'maison')" />
                    <q-btn flat dense icon="edit" @click="editProperty(maison, 'maison')" />
                    <q-btn flat dense icon="delete" color="negative" @click="confirmDelete(maison, 'maison')" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
            <div v-else class="text-center q-pa-lg">
              <q-icon name="house" size="60px" color="grey-4" />
              <div class="text-h6 q-mt-md">Aucune maison enregistrée</div>
              <div class="text-caption q-mb-md">Commencez par ajouter votre première maison</div>
              <q-btn color="primary" label="Ajouter une maison" @click="showModal('maison')" class="q-mt-sm" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Parcelles récentes -->
      <div class="col-12 col-lg-6">
        <q-card>
          <q-card-section>
            <div class="row items-center q-mb-md">
              <div class="col">
                <div class="text-h6">Mes parcelles récentes</div>
                <div class="text-subtitle2">Gestion de vos terrains et parcelles</div>
              </div>
              <div class="col-auto">
                <q-btn color="primary" icon="add" label="Nouvelle parcelle" @click="showModal('parcelle')" />
              </div>
            </div>

            <div v-if="parcellesRecent.length > 0">
              <div v-for="parcelle in parcellesRecent" :key="parcelle.id" class="q-mb-md">
                <q-card class="property-card">
                  <q-card-section>
                    <div class="row items-center">
                      <div class="col">
                        <div class="text-h6 text-weight-bold">{{ parcelle.titre }}</div>
                        <div class="text-subtitle2">
                          <q-icon name="location_on" size="16px" />
                          {{ parcelle.ville }}, {{ parcelle.quartier }}
                        </div>
                      </div>
                      <div class="col-auto">
                        <q-badge :color="getStatusColor(parcelle.statut)">
                          {{ getStatusLabel(parcelle.statut) }}
                        </q-badge>
                      </div>
                    </div>

                    <div class="row items-center q-mt-sm">
                      <div class="col-6">
                        <div class="row items-center">
                          <q-icon name="square_foot" size="16px" class="text-grey q-mr-xs" />
                          <span class="text-caption">{{ parcelle.superficie }} m²</span>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="text-h6 text-primary text-right">
                          {{ formatCurrency(parcelle.prix) }}
                        </div>
                      </div>
                    </div>

                    <div class="text-caption q-mt-xs">
                      <q-icon name="terrain" size="14px" class="q-mr-xs" />
                      Type: {{ getTerrainTypeLabel(parcelle.type_terrain) }}
                    </div>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat dense icon="visibility" @click="viewProperty(parcelle, 'parcelle')" />
                    <q-btn flat dense icon="edit" @click="editProperty(parcelle, 'parcelle')" />
                    <q-btn flat dense icon="delete" color="negative" @click="confirmDelete(parcelle, 'parcelle')" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
            <div v-else class="text-center q-pa-lg">
              <q-icon name="yard" size="60px" color="grey-4" />
              <div class="text-h6 q-mt-md">Aucune parcelle enregistrée</div>
              <div class="text-caption q-mb-md">Ajoutez vos premiers terrains</div>
              <q-btn color="primary" label="Ajouter une parcelle" @click="showModal('parcelle')" class="q-mt-sm" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- BOUTONS RAPIDES FLOTTANTS -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        color="primary"
        icon="add"
        direction="up"
        label="Actions rapides"
      >
        <q-fab-action
          color="primary"
          icon="house"
          label="Nouvelle maison"
          @click="showModal('maison')"
        />
        <q-fab-action
          color="orange"
          icon="yard"
          label="Nouvelle parcelle"
          @click="showModal('parcelle')"
        />
      </q-fab>
    </q-page-sticky>

    <!-- MODALE AVANCÉE POUR MAISONS ET PARCELLES -->
    <q-dialog v-model="showPropertyModal" full-width persistent>
      <q-card class="property-modal-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ modalMode === 'edit' ? 'Modifier' : 'Ajouter' }}
            {{ propertyType === 'maison' ? 'une Maison' : 'une Parcelle' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="resetModal" />
        </q-card-section>

        <q-tabs
          v-model="propertyType"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="center"
        >
          <q-tab name="maison" icon="house" label="Maison" />
          <q-tab name="parcelle" icon="yard" label="Parcelle" />
        </q-tabs>

        <q-card-section class="q-pt-none">
          <q-tab-panels v-model="propertyType" animated>
            <!-- FORMULAIRE MAISON -->
            <q-tab-panel name="maison">
              <q-form @submit.prevent="submitPropertyForm" class="q-gutter-md">
                <!-- Titre et description -->
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <q-input
                      v-model="newMaison.titre"
                      label="Titre de la maison *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="newMaison.description"
                      label="Description"
                      type="textarea"
                      rows="2"
                      outlined
                    />
                  </div>
                </div>

                <!-- Localisation -->
                <div class="text-subtitle2 q-mt-md">Localisation</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newMaison.ville"
                      label="Ville *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newMaison.quartier"
                      label="Quartier *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newMaison.avenue"
                      label="Avenue"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Caractéristiques -->
                <div class="text-subtitle2 q-mt-md">Caractéristiques</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-6 col-md-3">
                    <q-input
                      v-model="newMaison.surface_totale"
                      label="Surface (m²) *"
                      type="number"
                      min="0"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-6 col-md-3">
                    <q-input
                      v-model="newMaison.nombre_chambres"
                      label="Chambres"
                      type="number"
                      min="0"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-6 col-md-3">
                    <q-input
                      v-model="newMaison.nombre_salles_bain"
                      label="Salles de bain"
                      type="number"
                      min="0"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-6 col-md-3">
                    <q-input
                      v-model="newMaison.etage"
                      label="Étage"
                      type="number"
                      min="0"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Type, standing et offre -->
                <div class="row q-col-gutter-sm q-mt-sm">
                  <div class="col-12 col-md-4">
                    <q-select
                      v-model="newMaison.type_maison"
                      :options="maisonTypes"
                      label="Type de maison *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-select
                      v-model="newMaison.standing"
                      :options="maisonStandings"
                      label="Standing *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-select
                      v-model="newMaison.type_offre"
                      :options="maisonOffreTypes"
                      label="Type d'offre *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Prix selon le type d'offre -->
                <div class="text-subtitle2 q-mt-md">Prix</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-6" v-if="newMaison.type_offre === 'vente' || newMaison.type_offre === 'vente_location'">
                    <q-input
                      v-model="newMaison.prix_vente"
                      label="Prix de vente (€)"
                      prefix="€"
                      type="number"
                      min="0"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-6" v-if="newMaison.type_offre === 'location' || newMaison.type_offre === 'vente_location'">
                    <q-input
                      v-model="newMaison.prix_location"
                      label="Prix location mensuel (€)"
                      prefix="€"
                      type="number"
                      min="0"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Équipements -->
                <div class="text-subtitle2 q-mt-md">Équipements</div>
                <div class="row">
                  <div class="col-6 col-md-3">
                    <q-checkbox v-model="newMaison.jardin" label="Jardin" />
                  </div>
                  <div class="col-6 col-md-3">
                    <q-checkbox v-model="newMaison.garage" label="Garage" />
                  </div>
                  <div class="col-6 col-md-3">
                    <q-checkbox v-model="newMaison.piscine" label="Piscine" />
                  </div>
                  <div class="col-6 col-md-3">
                    <q-checkbox v-model="newMaison.climatisation" label="Climatisation" />
                  </div>
                </div>

                <!-- Statut -->
                <div class="q-mt-md">
                  <q-select
                    v-model="newMaison.statut"
                    :options="propertyStatuses"
                    label="Statut *"
                    :rules="[val => !!val || 'Champ requis']"
                    outlined
                    dense
                  />
                </div>

                <!-- Images -->
                <div class="text-subtitle2 q-mt-md">Images</div>
                <q-file
                  v-model="maisonImages"
                  label="Sélectionner des images"
                  multiple
                  accept="image/*"
                  outlined
                  class="q-mb-md"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <div v-if="maisonImagesPreview.length > 0" class="q-mt-md">
                  <div class="text-caption q-mb-sm">{{ maisonImagesPreview.length }} image(s) sélectionnée(s)</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-4 col-sm-3" v-for="(preview, index) in maisonImagesPreview" :key="index">
                      <q-img :src="preview" style="height: 100px" class="rounded-borders">
                        <q-btn
                          icon="close"
                          size="sm"
                          color="negative"
                          round
                          dense
                          class="absolute-top-right"
                          @click="removeMaisonImage(index)"
                        />
                      </q-img>
                    </div>
                  </div>
                </div>
              </q-form>
            </q-tab-panel>

            <!-- FORMULAIRE PARCELLE -->
            <q-tab-panel name="parcelle">
              <q-form @submit.prevent="submitPropertyForm" class="q-gutter-md">
                <!-- Titre et description -->
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <q-input
                      v-model="newParcelle.titre"
                      label="Titre de la parcelle *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="newParcelle.description"
                      label="Description"
                      type="textarea"
                      rows="2"
                      outlined
                    />
                  </div>
                </div>

                <!-- Localisation -->
                <div class="text-subtitle2 q-mt-md">Localisation</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newParcelle.ville"
                      label="Ville *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newParcelle.quartier"
                      label="Quartier *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newParcelle.avenue"
                      label="Avenue"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Caractéristiques -->
                <div class="text-subtitle2 q-mt-md">Caractéristiques</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-6 col-md-4">
                    <q-input
                      v-model="newParcelle.superficie"
                      label="Superficie (m²) *"
                      type="number"
                      min="0"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-6 col-md-4">
                    <q-select
                      v-model="newParcelle.type_terrain"
                      :options="parcelleTypes"
                      label="Type de terrain *"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-6 col-md-4">
                    <q-input
                      v-model="newParcelle.prix"
                      label="Prix (€) *"
                      prefix="€"
                      type="number"
                      min="0"
                      :rules="[val => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Coordonnées GPS (optionnel) -->
                <div class="row q-col-gutter-sm q-mt-sm">
                  <div class="col-6">
                    <q-input
                      v-model="newParcelle.latitude"
                      label="Latitude"
                      type="number"
                      step="any"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="newParcelle.longitude"
                      label="Longitude"
                      type="number"
                      step="any"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Statut -->
                <div class="q-mt-md">
                  <q-select
                    v-model="newParcelle.statut"
                    :options="propertyStatuses"
                    label="Statut *"
                    :rules="[val => !!val || 'Champ requis']"
                    outlined
                    dense
                  />
                </div>

                <!-- Images -->
                <div class="text-subtitle2 q-mt-md">Images</div>
                <q-file
                  v-model="parcelleImages"
                  label="Sélectionner des images"
                  multiple
                  accept="image/*"
                  outlined
                  class="q-mb-md"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <div v-if="parcelleImagesPreview.length > 0" class="q-mt-md">
                  <div class="text-caption q-mb-sm">{{ parcelleImagesPreview.length }} image(s) sélectionnée(s)</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-4 col-sm-3" v-for="(preview, index) in parcelleImagesPreview" :key="index">
                      <q-img :src="preview" style="height: 100px" class="rounded-borders">
                        <q-btn
                          icon="close"
                          size="sm"
                          color="negative"
                          round
                          dense
                          class="absolute-top-right"
                          @click="removeParcelleImage(index)"
                        />
                      </q-img>
                    </div>
                  </div>
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>

          <!-- Boutons d'action -->
          <div class="row q-mt-lg">
            <div class="col">
              <q-btn
                label="Annuler"
                color="negative"
                flat
                @click="resetModal"
                :disabled="loadingProperty"
              />
            </div>
            <div class="col text-right">
              <q-btn
                :label="modalMode === 'edit' ? 'Modifier' : 'Ajouter'"
                color="primary"
                @click="submitPropertyForm"
                :loading="loadingProperty"
                :disable="loadingProperty"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// Configuration API
const API_BASE_URL = 'http://localhost:3000/api'

// États principaux
const showPropertyModal = ref(false)
const propertyType = ref('maison') // 'maison' ou 'parcelle'
const modalMode = ref('add') // 'add' ou 'edit'
const loadingProperty = ref(false)
const currentPropertyId = ref(null) // Pour l'édition

// Données statistiques
const stats = ref({
  totalProperties: 0,
  totalMaisons: 0,
  totalParcelles: 0,
  revenuMensuel: 0
})

// Listes de propriétés
const maisonsRecent = ref([])
const parcellesRecent = ref([])
const loadingProperties = ref(false)

// Données utilisateur (récupéré du localStorage)
const user = ref({
  id: null,
  nom: "",
  email: "",
  type: ""
})

// Données formulaire MAISON
const newMaison = ref({
  titre: '',
  description: '',
  ville: '',
  quartier: '',
  avenue: '',
  surface_totale: '',
  nombre_chambres: '',
  nombre_salles_bain: '',
  etage: '',
  type_maison: '',
  standing: '',
  type_offre: 'vente',
  prix_vente: '',
  prix_location: '',
  jardin: false,
  garage: false,
  piscine: false,
  climatisation: false,
  statut: 'disponible',
  utilisateur_id: null // Sera rempli automatiquement
})

// Données formulaire PARCELLE
const newParcelle = ref({
  titre: '',
  description: '',
  ville: '',
  quartier: '',
  avenue: '',
  superficie: '',
  type_terrain: '',
  prix: '',
  latitude: '',
  longitude: '',
  statut: 'disponible',
  utilisateur_id: null // Sera rempli automatiquement
})

// Images
const maisonImages = ref([])
const maisonImagesPreview = ref([])
const parcelleImages = ref([])
const parcelleImagesPreview = ref([])

// Options des sélecteurs
const maisonTypes = ['villa', 'appartement', 'duplex', 'studio', 'fermette', 'contemporaine']
const maisonStandings = ['luxe', 'haut_de_gamme', 'standard', 'economique']
const maisonOffreTypes = ['vente', 'location', 'vente_location']
const parcelleTypes = ['urbain', 'agricole', 'residentiel', 'commercial']
const propertyStatuses = ['disponible', 'loué', 'vendu', 'en_negociation', 'maintenance']

// Fonctions utilitaires
const formatCurrency = (amount) => {
  if (!amount) return '0 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const getStatusColor = (statut) => {
  const colors = {
    'disponible': 'positive',
    'loué': 'primary',
    'vendu': 'info',
    'en_negociation': 'warning',
    'maintenance': 'negative'
  }
  return colors[statut] || 'grey'
}

const getStatusLabel = (statut) => {
  const labels = {
    'disponible': 'Disponible',
    'loué': 'Loué',
    'vendu': 'Vendu',
    'en_negociation': 'En négociation',
    'maintenance': 'En maintenance'
  }
  return labels[statut] || statut
}

const getTerrainTypeLabel = (type) => {
  const labels = {
    'urbain': 'Urbain',
    'agricole': 'Agricole',
    'residentiel': 'Résidentiel',
    'commercial': 'Commercial'
  }
  return labels[type] || type
}

// Récupérer l'utilisateur du localStorage
const getUserFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      user.value = {
        id: parsedUser.id || parsedUser.user_id,
        nom: parsedUser.nom || parsedUser.name || 'Propriétaire',
        email: parsedUser.email || '',
        type: parsedUser.type || 'proprietaire'
      }
      console.log('Utilisateur récupéré:', user.value)
    } else {
      console.warn('Aucun utilisateur trouvé dans le localStorage')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
  }
}

// Gestion de la modale
const showModal = (type = 'maison') => {
  propertyType.value = type
  modalMode.value = 'add'
  currentPropertyId.value = null
  resetFormData()
  showPropertyModal.value = true
}

const editProperty = (property, type) => {
  propertyType.value = type
  modalMode.value = 'edit'
  currentPropertyId.value = property.id

  if (type === 'maison') {
    Object.keys(newMaison.value).forEach(key => {
      if (property[key] !== undefined) {
        newMaison.value[key] = property[key]
      }
    })
  } else {
    Object.keys(newParcelle.value).forEach(key => {
      if (property[key] !== undefined) {
        newParcelle.value[key] = property[key]
      }
    })
  }

  showPropertyModal.value = true
}

const resetModal = () => {
  showPropertyModal.value = false
  setTimeout(resetFormData, 300)
}

const resetFormData = () => {
  newMaison.value = {
    titre: '',
    description: '',
    ville: '',
    quartier: '',
    avenue: '',
    surface_totale: '',
    nombre_chambres: '',
    nombre_salles_bain: '',
    etage: '',
    type_maison: '',
    standing: '',
    type_offre: 'vente',
    prix_vente: '',
    prix_location: '',
    jardin: false,
    garage: false,
    piscine: false,
    climatisation: false,
    statut: 'disponible',
    utilisateur_id: user.value.id
  }

  newParcelle.value = {
    titre: '',
    description: '',
    ville: '',
    quartier: '',
    avenue: '',
    superficie: '',
    type_terrain: '',
    prix: '',
    latitude: '',
    longitude: '',
    statut: 'disponible',
    utilisateur_id: user.value.id
  }

  maisonImages.value = []
  maisonImagesPreview.value = []
  parcelleImages.value = []
  parcelleImagesPreview.value = []
}

// Gestion des images
watch(maisonImages, (newImages) => {
  maisonImagesPreview.value = []
  if (newImages && newImages.length > 0) {
    Array.from(newImages).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        maisonImagesPreview.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }
})

watch(parcelleImages, (newImages) => {
  parcelleImagesPreview.value = []
  if (newImages && newImages.length > 0) {
    Array.from(newImages).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        parcelleImagesPreview.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }
})

const removeMaisonImage = (index) => {
  maisonImagesPreview.value.splice(index, 1)
  const newImages = Array.from(maisonImages.value)
  newImages.splice(index, 1)
  maisonImages.value = newImages
}

const removeParcelleImage = (index) => {
  parcelleImagesPreview.value.splice(index, 1)
  const newImages = Array.from(parcelleImages.value)
  newImages.splice(index, 1)
  parcelleImages.value = newImages
}

// Fonction pour récupérer le token JWT
const getAuthToken = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
  if (!token) {
    console.warn('Aucun token JWT trouvé dans le localStorage')
  }
  return token
}

// Soumission du formulaire avec API réelle
const submitPropertyForm = async () => {
  loadingProperty.value = true

  try {
    // Récupérer l'ID utilisateur
    if (!user.value.id) {
      throw new Error('Utilisateur non connecté. Veuillez vous reconnecter.')
    }

    let formData = new FormData()
    let apiUrl
    let method = 'POST'

    if (propertyType.value === 'maison') {
      // Validation maison
      if (!newMaison.value.titre || !newMaison.value.ville || !newMaison.value.quartier || !newMaison.value.surface_totale) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      // Ajouter les données du formulaire
      Object.keys(newMaison.value).forEach(key => {
        if (newMaison.value[key] !== '' && newMaison.value[key] !== null && newMaison.value[key] !== undefined) {
          // Convertir les booléens en chaînes
          if (typeof newMaison.value[key] === 'boolean') {
            formData.append(key, newMaison.value[key] ? 'true' : 'false')
          } else {
            formData.append(key, newMaison.value[key])
          }
        }
      })

      // Ajouter l'ID utilisateur
      formData.append('utilisateur_id', user.value.id)

      // Ajouter les images
      if (maisonImages.value && maisonImages.value.length > 0) {
        Array.from(maisonImages.value).forEach((file, index) => {
          formData.append('images', file)
        })
      }

      // Définir l'URL API
      if (modalMode.value === 'edit' && currentPropertyId.value) {
        apiUrl = `${API_BASE_URL}/maisons/${currentPropertyId.value}`
        method = 'PUT'
      } else {
        apiUrl = `${API_BASE_URL}/maisons`
      }

    } else {
      // Validation parcelle
      if (!newParcelle.value.titre || !newParcelle.value.ville || !newParcelle.value.quartier || !newParcelle.value.superficie || !newParcelle.value.prix) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      // Ajouter les données du formulaire
      Object.keys(newParcelle.value).forEach(key => {
        if (newParcelle.value[key] !== '' && newParcelle.value[key] !== null && newParcelle.value[key] !== undefined) {
          formData.append(key, newParcelle.value[key])
        }
      })

      // Ajouter l'ID utilisateur
      formData.append('utilisateur_id', user.value.id)

      // Ajouter les images
      if (parcelleImages.value && parcelleImages.value.length > 0) {
        Array.from(parcelleImages.value).forEach((file, index) => {
          formData.append('images', file)
        })
      }

      // Définir l'URL API
      if (modalMode.value === 'edit' && currentPropertyId.value) {
        apiUrl = `${API_BASE_URL}/parcelles/${currentPropertyId.value}`
        method = 'PUT'
      } else {
        apiUrl = `${API_BASE_URL}/parcelles`
      }
    }

    // Récupérer le token JWT
    const token = getAuthToken()

    // Options pour la requête fetch
    const requestOptions = {
      method: method,
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
        // Note: Ne pas mettre 'Content-Type' pour FormData, le navigateur le fera automatiquement avec boundary
      },
      body: formData
    }

    console.log(`Envoi ${method} vers:`, apiUrl)
    console.log('Données envoyées:', Object.fromEntries(formData))

    // Envoyer la requête
    const response = await fetch(apiUrl, requestOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Réponse API:', result)

    // Fermer la modale
    showPropertyModal.value = false

    // Notification de succès
    $q.notify({
      type: 'positive',
      message: modalMode.value === 'edit'
        ? `${propertyType.value === 'maison' ? 'Maison' : 'Parcelle'} modifié(e) avec succès`
        : `${propertyType.value === 'maison' ? 'Maison' : 'Parcelle'} ajouté(e) avec succès`,
      icon: 'check_circle',
      timeout: 3000
    })

    // Recharger les données
    await fetchData()

  } catch (error) {
    console.error('Erreur API:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.',
      icon: 'error',
      timeout: 5000
    })
  } finally {
    loadingProperty.value = false
  }
}

// Charger les propriétés depuis l'API
const fetchProperties = async () => {
  loadingProperties.value = true

  try {
    const token = getAuthToken()
    const userId = user.value.id

    if (!userId) {
      console.warn('ID utilisateur manquant pour charger les propriétés')
      return
    }

    // Charger les maisons
    const maisonsResponse = await fetch(`${API_BASE_URL}/maisons/utilisateur/${userId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })

    if (maisonsResponse.ok) {
      const maisonsData = await maisonsResponse.json()
      maisonsRecent.value = Array.isArray(maisonsData) ? maisonsData.slice(0, 3) : []
      stats.value.totalMaisons = maisonsRecent.value.length
    } else {
      console.warn('Erreur lors du chargement des maisons:', maisonsResponse.status)
    }

    // Charger les parcelles
    const parcellesResponse = await fetch(`${API_BASE_URL}/parcelles/utilisateur/${userId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    })

    if (parcellesResponse.ok) {
      const parcellesData = await parcellesResponse.json()
      parcellesRecent.value = Array.isArray(parcellesData) ? parcellesData.slice(0, 3) : []
      stats.value.totalParcelles = parcellesRecent.value.length
    } else {
      console.warn('Erreur lors du chargement des parcelles:', parcellesResponse.status)
    }

    // Mettre à jour le total
    stats.value.totalProperties = stats.value.totalMaisons + stats.value.totalParcelles

  } catch (error) {
    console.error('Erreur lors du chargement des propriétés:', error)
    // Données de démo en cas d'erreur
    maisonsRecent.value = [
      {
        id: 1,
        titre: "Villa Moderne à Katindo",
        ville: "Goma",
        quartier: "Katindo",
        surface_totale: 250,
        nombre_chambres: 4,
        prix_vente: 250000,
        prix_location: 1500,
        statut: "disponible",
        type_maison: "villa",
        standing: "luxe"
      }
    ]

    parcellesRecent.value = [
      {
        id: 1,
        titre: "Terrain résidentiel à Mabanga",
        ville: "Goma",
        quartier: "Mabanga",
        superficie: 500,
        type_terrain: "residentiel",
        prix: 75000,
        statut: "disponible"
      }
    ]

    stats.value.totalMaisons = maisonsRecent.value.length
    stats.value.totalParcelles = parcellesRecent.value.length
    stats.value.totalProperties = stats.value.totalMaisons + stats.value.totalParcelles
  } finally {
    loadingProperties.value = false
  }
}

// Autres fonctions
const viewProperty = (property, type) => {
  const route = type === 'maison' ? '/maisons' : '/parcelles'
  router.push(`${route}/${property.id}`)
}

const confirmDelete = async (property, type) => {
  $q.dialog({
    title: 'Confirmer la suppression',
    message: `Êtes-vous sûr de vouloir supprimer "${property.titre}" ?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const token = getAuthToken()
      const apiUrl = type === 'maison'
        ? `${API_BASE_URL}/maisons/${property.id}`
        : `${API_BASE_URL}/parcelles/${property.id}`

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        $q.notify({
          type: 'positive',
          message: 'Propriété supprimée avec succès'
        })
        await fetchData()
      } else {
        throw new Error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      $q.notify({
        type: 'negative',
        message: 'Erreur lors de la suppression'
      })
    }
  })
}

// Chargement des données
const fetchData = async () => {
  await fetchProperties()
}

const refreshData = () => {
  fetchData()
  $q.notify({
    type: 'info',
    message: 'Données actualisées',
    timeout: 2000
  })
}

// Initialisation
onMounted(async () => {
  // Récupérer l'utilisateur du localStorage
  getUserFromLocalStorage()

  // Attendre un peu que l'utilisateur soit chargé
  setTimeout(async () => {
    if (user.value.id) {
      // Mettre à jour les IDs dans les formulaires
      newMaison.value.utilisateur_id = user.value.id
      newParcelle.value.utilisateur_id = user.value.id

      // Charger les données
      await fetchData()
    } else {
      console.warn('Utilisateur non trouvé, chargement des données de démo')
      await fetchData()
    }
  }, 100)
})
</script>

<style scoped lang="scss">
.dashboard-proprietaire {
  padding: 16px;
  background: #f5f5f5;
}

.stat-card {
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
}

.property-card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border-color: #1976D2;
  }
}

.property-modal-card {
  min-width: 800px;
  max-width: 1000px;

  @media (max-width: 768px) {
    min-width: 95vw;
    margin: 0 10px;
  }
}

/* Images preview */
.q-img {
  object-fit: cover;
}

.absolute-top-right {
  position: absolute;
  top: 4px;
  right: 4px;
}

/* Responsive */
@media (max-width: 600px) {
  .dashboard-proprietaire {
    padding: 8px;
  }

  .stat-card .text-h5 {
    font-size: 1.5rem;
  }

  .property-modal-card {
    min-width: 100%;
    margin: 0;
  }
}
</style>
