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
          <q-card-actions align="center">
            <q-btn flat dense color="blue-grey-8" icon="info" @click="showStatsInfo" />
          </q-card-actions>
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

      <!-- Parcelles -->
      <div class="col-6 col-sm-3">
        <q-card class="stat-card bg-amber-1">
          <q-card-section class="text-center">
            <q-icon name="yard" size="40px" color="amber-8" class="q-mb-sm" />
            <div class="text-h5 text-weight-bold">{{ stats.totalParcelles || 0 }}</div>
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
            <div class="text-h5 text-weight-bold">
              {{ formatCurrency(stats.revenuMensuel || 0) }}
            </div>
            <div class="text-subtitle2 text-purple-8">Revenu ce mois</div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat dense color="purple-8" icon="trending_up" @click="showRevenueInfo" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- MESSAGE SI AUCUNE DONNÉE -->
    <div
      v-if="maisonsRecent.length === 0 && parcellesRecent.length === 0"
      class="text-center q-mb-xl"
    >
      <q-card class="bg-blue-grey-1">
        <q-card-section>
          <q-icon name="info" size="60px" color="blue-grey-6" class="q-mb-md" />
          <div class="text-h5 text-blue-grey-8">Bienvenue sur votre dashboard !</div>
          <div class="text-subtitle1 q-mt-sm q-mb-lg">
            Commencez par ajouter vos premières propriétés
          </div>

          <div class="row justify-center q-gutter-md">
            <q-btn
              color="primary"
              icon="house"
              label="Ajouter une maison"
              @click="showModal('maison')"
            />
            <q-btn
              color="orange"
              icon="yard"
              label="Ajouter une parcelle"
              @click="showModal('parcelle')"
            />
          </div>

          <div class="q-mt-lg text-blue-grey-7">
            <div class="text-caption">
              💡 <strong>Conseil :</strong> Vous pouvez ajouter plusieurs images pour chaque
              propriété
            </div>
            <div class="text-caption">
              📱 <strong>Astuce :</strong> Utilisez le bouton flottant en bas à droite pour un accès
              rapide
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- SECTION PROPRIÉTÉS RÉCENTES (seulement si données) -->
    <div
      v-if="maisonsRecent.length > 0 || parcellesRecent.length > 0"
      class="row q-col-gutter-md q-mb-lg"
    >
      <!-- Maisons récentes -->
      <div class="col-12 col-lg-6" v-if="maisonsRecent.length > 0">
        <q-card>
          <q-card-section>
            <div class="row items-center q-mb-md">
              <div class="col">
                <div class="text-h6">Mes maisons récentes</div>
                <div class="text-subtitle2">
                  {{ maisonsRecent.length }} maison(s) enregistrée(s)
                </div>
              </div>
              <div class="col-auto">
                <q-btn color="primary" icon="add" label="Nouvelle" @click="showModal('maison')" />
              </div>
            </div>

            <div v-for="maison in maisonsRecent" :key="maison.id" class="q-mb-md">
              <q-card class="property-card">
                <q-card-section>
                  <div class="row items-center">
                    <div class="col">
                      <div class="text-h6 text-weight-bold ellipsis">{{ maison.titre }}</div>
                      <div class="text-subtitle2">
                        <q-icon name="location_on" size="16px" />
                        Parcelle ID: {{ maison.parcelle_id }}
                        <span v-if="maison.parcelle_details">
                          ({{ maison.parcelle_details.ville }},
                          {{ maison.parcelle_details.quartier }})
                        </span>
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
                        <span class="text-caption">{{ maison.surface_totale || '0' }} m²</span>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="row items-center">
                        <q-icon name="bed" size="16px" class="text-grey q-mr-xs" />
                        <span class="text-caption">{{ maison.nombre_chambres || '0' }} ch.</span>
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="text-h6 text-primary text-right">
                        {{ formatCurrency(maison.prix_vente || maison.prix_location || 0) }}
                      </div>
                    </div>
                  </div>

                  <div v-if="maison.type_maison" class="text-caption q-mt-xs">
                    <q-icon name="category" size="14px" class="q-mr-xs" />
                    {{ getMaisonTypeLabel(maison.type_maison) }} •
                    {{ getStandingLabel(maison.standing) }}
                    <span v-if="maison.etat" class="q-ml-sm">
                      • État: {{ getEtatLabel(maison.etat) }}
                    </span>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat dense icon="visibility" @click="viewProperty(maison, 'maison')" />
                  <q-btn flat dense icon="edit" @click="editProperty(maison, 'maison')" />
                  <q-btn
                    flat
                    dense
                    icon="delete"
                    color="negative"
                    @click="confirmDelete(maison, 'maison')"
                  />
                </q-card-actions>
              </q-card>
            </div>

            <div v-if="stats.totalMaisons > maisonsRecent.length" class="text-center q-mt-md">
              <q-btn
                flat
                color="primary"
                :label="`Voir toutes les maisons (${stats.totalMaisons})`"
                @click="router.push('/maisons')"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Parcelles récentes -->
      <div class="col-12 col-lg-6" v-if="parcellesRecent.length > 0">
        <q-card>
          <q-card-section>
            <div class="row items-center q-mb-md">
              <div class="col">
                <div class="text-h6">Mes parcelles récentes</div>
                <div class="text-subtitle2">
                  {{ parcellesRecent.length }} parcelle(s) enregistrée(s)
                </div>
              </div>
              <div class="col-auto">
                <q-btn color="primary" icon="add" label="Nouvelle" @click="showModal('parcelle')" />
              </div>
            </div>

            <div v-for="parcelle in parcellesRecent" :key="parcelle.id" class="q-mb-md">
              <q-card class="property-card">
                <q-card-section>
                  <div class="row items-center">
                    <div class="col">
                      <div class="text-h6 text-weight-bold ellipsis">{{ parcelle.titre }}</div>
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
                        <span class="text-caption">{{ parcelle.superficie || '0' }} m²</span>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="text-h6 text-primary text-right">
                        {{ formatCurrency(parcelle.prix_vente || parcelle.prix || 0) }}
                      </div>
                    </div>
                  </div>

                  <div class="text-caption q-mt-xs">
                    <q-icon name="terrain" size="14px" class="q-mr-xs" />
                    Type: {{ getTerrainTypeLabel(parcelle.type_terrain) }}
                    <span v-if="parcelle.role" class="q-ml-sm">
                      • Rôle: {{ getRoleLabel(parcelle.role) }}
                    </span>
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat dense icon="visibility" @click="viewProperty(parcelle, 'parcelle')" />
                  <q-btn flat dense icon="edit" @click="editProperty(parcelle, 'parcelle')" />
                  <q-btn
                    flat
                    dense
                    icon="delete"
                    color="negative"
                    @click="confirmDelete(parcelle, 'parcelle')"
                  />
                </q-card-actions>
              </q-card>
            </div>

            <div v-if="stats.totalParcelles > parcellesRecent.length" class="text-center q-mt-md">
              <q-btn
                flat
                color="primary"
                :label="`Voir toutes les parcelles (${stats.totalParcelles})`"
                @click="router.push('/parcelles')"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- BOUTONS RAPIDES FLOTTANTS -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="primary" icon="add" direction="up" label="Ajouter">
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
                      :rules="[(val) => !!val || 'Champ requis']"
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

                <!-- Parcelle associée -->
                <div class="text-subtitle2 q-mt-md">Parcelle associée</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <q-select
                      v-model="newMaison.parcelle_id"
                      :options="parcellesOptions"
                      label="Sélectionner une parcelle *"
                      emit-value
                      map-options
                      outlined
                      dense
                      clearable
                      :rules="[(val) => !!val || 'Une parcelle est requise']"
                    >
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Aucune parcelle disponible. Ajoutez d'abord une parcelle.
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
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
                      :rules="[(val) => !!val || 'Champ requis']"
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

                <!-- Type, standing, état et offre -->
                <div class="row q-col-gutter-sm q-mt-sm">
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="newMaison.type_maison"
                      :options="maisonTypes"
                      label="Type de maison *"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="newMaison.standing"
                      :options="maisonStandings"
                      label="Standing *"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="newMaison.etat"
                      :options="maisonEtats"
                      label="État *"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="newMaison.type_offre"
                      :options="maisonOffreTypes"
                      label="Type d'offre *"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Prix selon le type d'offre -->
                <div class="text-subtitle2 q-mt-md">Prix</div>
                <div class="row q-col-gutter-sm">
                  <div
                    class="col-12 col-md-6"
                    v-if="
                      newMaison.type_offre === 'vente' || newMaison.type_offre === 'vente_location'
                    "
                  >
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
                  <div
                    class="col-12 col-md-6"
                    v-if="
                      newMaison.type_offre === 'location' ||
                      newMaison.type_offre === 'vente_location'
                    "
                  >
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
                    :rules="[(val) => !!val || 'Champ requis']"
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
                  <div class="text-caption q-mb-sm">
                    {{ maisonImagesPreview.length }} image(s) sélectionnée(s)
                  </div>
                  <div class="row q-col-gutter-sm">
                    <div
                      class="col-4 col-sm-3"
                      v-for="(preview, idx) in maisonImagesPreview"
                      :key="idx"
                    >
                      <q-img :src="preview" style="height: 100px" class="rounded-borders">
                        <q-btn
                          icon="close"
                          size="sm"
                          color="negative"
                          round
                          dense
                          class="absolute-top-right"
                          @click="removeMaisonImage(idx)"
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
                      :rules="[(val) => !!val || 'Champ requis']"
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
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="newParcelle.quartier"
                      label="Quartier *"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input v-model="newParcelle.avenue" label="Avenue" outlined dense />
                  </div>
                </div>

                <!-- Numéro et caractéristiques -->
                <div class="row q-col-gutter-sm">
                  <div class="col-6 col-md-3">
                    <q-input v-model="newParcelle.numero" label="Numéro" outlined dense />
                  </div>
                  <div class="col-6 col-md-4">
                    <q-input
                      v-model="newParcelle.superficie"
                      label="Superficie (m²) *"
                      type="number"
                      min="0"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-5">
                    <q-select
                      v-model="newParcelle.type_terrain"
                      :options="parcelleTypes"
                      label="Type de terrain *"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                </div>

                <!-- Prix -->
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <q-input
                      v-model="newParcelle.prix_vente"
                      label="Prix de vente (€) *"
                      prefix="€"
                      type="number"
                      min="0"
                      :rules="[(val) => !!val || 'Champ requis', (val) => val > 0 || 'Le prix doit être supérieur à 0']"
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

                <!-- Statut et Rôle -->
                <div class="row q-col-gutter-sm q-mt-md">
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="newParcelle.statut"
                      :options="propertyStatuses"
                      label="Statut *"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-select
                      v-model="newParcelle.role"
                      :options="roleOptions"
                      label="Rôle *"
                      :rules="[(val) => !!val || 'Champ requis']"
                      outlined
                      dense
                    />
                  </div>
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
                  <div class="text-caption q-mb-sm">
                    {{ parcelleImagesPreview.length }} image(s) sélectionnée(s)
                  </div>
                  <div class="row q-col-gutter-sm">
                    <div
                      class="col-4 col-sm-3"
                      v-for="(preview, idx) in parcelleImagesPreview"
                      :key="idx"
                    >
                      <q-img :src="preview" style="height: 100px" class="rounded-borders">
                        <q-btn
                          icon="close"
                          size="sm"
                          color="negative"
                          round
                          dense
                          class="absolute-top-right"
                          @click="removeParcelleImage(idx)"
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
  revenuMensuel: 0,
})

// Listes de propriétés
const maisonsRecent = ref([])
const parcellesRecent = ref([])
const loadingProperties = ref(false)

// Options pour parcelle dans formulaire maison
const parcellesOptions = ref([])

// Données utilisateur (récupéré du localStorage)
const user = ref({
  id: null,
  nom: '',
  email: '',
  type: '',
})

// Données formulaire MAISON
const newMaison = ref({
  titre: '',
  description: '',
  parcelle_id: '',
  surface_totale: '',
  nombre_chambres: '',
  nombre_salles_bain: '',
  etage: '',
  etat: 'bon_etat', // AJOUTÉ
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
  utilisateur_id: null,
})

// Données formulaire PARCELLE
const newParcelle = ref({
  titre: '',
  description: '',
  ville: '',
  quartier: '',
  avenue: '',
  numero: '',
  superficie: '',
  type_terrain: '',
  prix_vente: '',
  latitude: '',
  longitude: '',
  statut: 'disponible',
  utilisateur_id: null,
  role: 'proprietaire', // AJOUTÉ
})

// Images
const maisonImages = ref([])
const maisonImagesPreview = ref([])
const parcelleImages = ref([])
const parcelleImagesPreview = ref([])

// Options des sélecteurs
const maisonTypes = ['villa', 'appartement', 'duplex', 'studio', 'fermette', 'contemporaine']
const maisonStandings = ['luxe', 'haut_de_gamme', 'standard', 'economique']
const maisonEtats = ['neuf', 'bon_etat', 'renovation', 'ancien'] // AJOUTÉ
const maisonOffreTypes = ['vente', 'location', 'vente_location']
const parcelleTypes = ['urbain', 'agricole', 'residentiel', 'commercial']
const propertyStatuses = ['disponible', 'loué', 'vendu', 'en_negociation', 'maintenance']
const roleOptions = ['proprietaire', 'commissionnaire'] // AJOUTÉ

// Fonctions utilitaires
const formatCurrency = (amount) => {
  if (!amount) return '0 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const getStatusColor = (statut) => {
  const colors = {
    disponible: 'positive',
    loué: 'primary',
    vendu: 'info',
    en_negociation: 'warning',
    maintenance: 'negative',
  }
  return colors[statut] || 'grey'
}

const getStatusLabel = (statut) => {
  const labels = {
    disponible: 'Disponible',
    loué: 'Loué',
    vendu: 'Vendu',
    en_negociation: 'En négociation',
    maintenance: 'En maintenance',
  }
  return labels[statut] || statut
}

const getTerrainTypeLabel = (type) => {
  const labels = {
    urbain: 'Urbain',
    agricole: 'Agricole',
    residentiel: 'Résidentiel',
    commercial: 'Commercial',
  }
  return labels[type] || type
}

const getMaisonTypeLabel = (type) => {
  const labels = {
    villa: 'Villa',
    appartement: 'Appartement',
    duplex: 'Duplex',
    studio: 'Studio',
    fermette: 'Fermette',
    contemporaine: 'Contemporaine',
  }
  return labels[type] || type
}

const getStandingLabel = (standing) => {
  const labels = {
    luxe: 'Luxe',
    haut_de_gamme: 'Haut de gamme',
    standard: 'Standard',
    economique: 'Économique',
  }
  return labels[standing] || standing
}

const getEtatLabel = (etat) => {
  const labels = {
    neuf: 'Neuf',
    bon_etat: 'Bon état',
    renovation: 'À rénover',
    ancien: 'Ancien',
  }
  return labels[etat] || etat
}

const getRoleLabel = (role) => {
  const labels = {
    proprietaire: 'Propriétaire',
    commissionnaire: 'Commissionnaire',
  }
  return labels[role] || role
}

// Fonction pour récupérer les détails de la parcelle
const getParcelleDetails = async (parcelleId) => {
  try {
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}/parcelles/${parcelleId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Erreur récupération parcelle:', error)
  }
  return null
}

// Fonction pour charger les parcelles de l'utilisateur
const fetchUserParcelles = async () => {
  try {
    const token = getAuthToken()
    const userId = user.value.id

    if (!userId) {
      parcellesOptions.value = []
      return
    }

    const response = await fetch(`${API_BASE_URL}/parcelles/utilisateur/${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const responseData = await response.json()
      // Vérifier si la réponse est un tableau
      const parcelles = Array.isArray(responseData) ? responseData : responseData.data || []

      parcellesOptions.value = parcelles.map((p) => ({
        label: `${p.titre} (${p.ville}, ${p.quartier})`,
        value: p.id,
        description: `${p.superficie} m² - ${formatCurrency(p.prix_vente)}`,
      }))
      console.log('Parcelles chargées pour sélection:', parcellesOptions.value)
    } else {
      console.warn('Erreur API pour chargement parcelles:', response.status)
      parcellesOptions.value = []
    }
  } catch (error) {
    console.error('Erreur chargement parcelles:', error)
    parcellesOptions.value = []
  }
}

// Fonctions d'information
const showStatsInfo = () => {
  $q.dialog({
    title: 'Statistiques',
    message:
      'Ces chiffres représentent le nombre total de vos propriétés enregistrées dans le système.',
    ok: 'Compris',
  })
}

const showRevenueInfo = () => {
  $q.dialog({
    title: 'Revenus',
    message: 'Le revenu mensuel est calculé à partir des loyers actifs et des ventes en cours.',
    ok: 'Compris',
  })
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
        type: parsedUser.type || 'proprietaire',
      }
      console.log('Utilisateur récupéré:', user.value)
    } else {
      console.warn('Aucun utilisateur trouvé dans le localStorage')
      // Pour le développement, créer un utilisateur de test
      user.value = {
        id: 1,
        nom: 'Propriétaire Test',
        email: 'test@example.com',
        type: 'proprietaire',
      }
      console.log('Utilisateur de test créé:', user.value)
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    // Créer un utilisateur de test en cas d'erreur
    user.value = {
      id: 1,
      nom: 'Propriétaire',
      email: '',
      type: 'proprietaire',
    }
  }
}

// Gestion de la modale
const showModal = async (type = 'maison') => {
  propertyType.value = type
  modalMode.value = 'add'
  currentPropertyId.value = null
  resetFormData()

  // Charger les parcelles si on ajoute/modifie une maison
  if (type === 'maison') {
    await fetchUserParcelles()
  }

  showPropertyModal.value = true
}

const editProperty = async (property, type) => {
  propertyType.value = type
  modalMode.value = 'edit'
  currentPropertyId.value = property.id

  if (type === 'maison') {
    // Charger les parcelles avant de remplir le formulaire
    await fetchUserParcelles()

    Object.keys(newMaison.value).forEach((key) => {
      if (property[key] !== undefined && property[key] !== null) {
        newMaison.value[key] = property[key]
      }
    })

    // S'assurer que les champs requis ont des valeurs par défaut
    if (!newMaison.value.etat) {
      newMaison.value.etat = 'bon_etat'
    }
    if (!newMaison.value.statut) {
      newMaison.value.statut = 'disponible'
    }

    // S'assurer que l'ID utilisateur est présent
    newMaison.value.utilisateur_id = user.value.id
  } else {
    Object.keys(newParcelle.value).forEach((key) => {
      if (property[key] !== undefined && property[key] !== null) {
        newParcelle.value[key] = property[key]
      }
    })

    // S'assurer que les champs requis ont des valeurs par défaut
    if (!newParcelle.value.role) {
      newParcelle.value.role = 'proprietaire'
    }
    if (!newParcelle.value.statut) {
      newParcelle.value.statut = 'disponible'
    }

    // S'assurer que l'ID utilisateur est présent
    newParcelle.value.utilisateur_id = user.value.id
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
    parcelle_id: '',
    surface_totale: '',
    nombre_chambres: '',
    nombre_salles_bain: '',
    etage: '',
    etat: 'bon_etat', // AJOUTÉ
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
    utilisateur_id: user.value.id,
  }

  newParcelle.value = {
    titre: '',
    description: '',
    ville: '',
    quartier: '',
    avenue: '',
    numero: '',
    superficie: '',
    type_terrain: '',
    prix_vente: '',
    latitude: '',
    longitude: '',
    statut: 'disponible',
    utilisateur_id: user.value.id,
    role: 'proprietaire', // AJOUTÉ
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
    Array.from(newImages).forEach((file) => {
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
    Array.from(newImages).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        parcelleImagesPreview.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }
})

const removeMaisonImage = (idx) => {
  maisonImagesPreview.value.splice(idx, 1)
  const newImages = Array.from(maisonImages.value)
  newImages.splice(idx, 1)
  maisonImages.value = newImages
}

const removeParcelleImage = (idx) => {
  parcelleImagesPreview.value.splice(idx, 1)
  const newImages = Array.from(parcelleImages.value)
  newImages.splice(idx, 1)
  parcelleImages.value = newImages
}

// Fonction pour récupérer le token JWT
const getAuthToken = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
  if (!token) {
    console.warn('Aucun token JWT trouvé dans le localStorage')
    // Pour le développement, retourner un token de test
    return 'test-token-for-development'
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
      if (
        !newMaison.value.titre ||
        !newMaison.value.surface_totale ||
        !newMaison.value.parcelle_id ||
        !newMaison.value.etat // AJOUTÉ
      ) {
        throw new Error('Veuillez remplir tous les champs obligatoires (titre, surface, parcelle, état)')
      }

      // Ajouter les données du formulaire
      Object.keys(newMaison.value).forEach((key) => {
        if (
          newMaison.value[key] !== '' &&
          newMaison.value[key] !== null &&
          newMaison.value[key] !== undefined
        ) {
          // Convertir les booléens en chaînes
          if (typeof newMaison.value[key] === 'boolean') {
            formData.append(key, newMaison.value[key] ? 'true' : 'false')
          } else {
            formData.append(key, newMaison.value[key])
          }
        }
      })

      // S'ASSURER QUE LE CHAMP ETAT EST BIEN ENVOYÉ
      if (!formData.has('etat')) {
        formData.append('etat', newMaison.value.etat || 'bon_etat')
      }

      // Ajouter l'ID utilisateur
      formData.append('utilisateur_id', user.value.id)

      // Ajouter les images
      if (maisonImages.value && maisonImages.value.length > 0) {
        Array.from(maisonImages.value).forEach((file) => {
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
      if (
        !newParcelle.value.titre ||
        !newParcelle.value.ville ||
        !newParcelle.value.quartier ||
        !newParcelle.value.superficie ||
        !newParcelle.value.type_terrain ||
        !newParcelle.value.prix_vente ||
        !newParcelle.value.role || // AJOUTÉ
        !user.value.id
      ) {
        throw new Error('Veuillez remplir tous les champs obligatoires (titre, ville, quartier, superficie, type terrain, prix, rôle)')
      }

      // Vérifier que le prix est valide
      const prix = parseFloat(newParcelle.value.prix_vente)
      if (isNaN(prix) || prix <= 0) {
        throw new Error('Le prix de vente doit être un nombre positif')
      }

      // Ajouter les données du formulaire
      Object.keys(newParcelle.value).forEach((key) => {
        if (
          newParcelle.value[key] !== '' &&
          newParcelle.value[key] !== null &&
          newParcelle.value[key] !== undefined
        ) {
          formData.append(key, newParcelle.value[key])
        }
      })

      // S'ASSURER QUE LE CHAMP ROLE EST BIEN ENVOYÉ
      if (!formData.has('role')) {
        formData.append('role', newParcelle.value.role || 'proprietaire')
      }

      // Ajouter l'ID utilisateur
      formData.append('utilisateur_id', user.value.id)

      // Ajouter les images
      if (parcelleImages.value && parcelleImages.value.length > 0) {
        Array.from(parcelleImages.value).forEach((file) => {
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

    // DEBUG: Voir tout ce qui est dans le FormData
    console.log('=== DEBUG FormData ===')
    const formDataEntries = {}
    for (let pair of formData.entries()) {
      formDataEntries[pair[0]] = pair[1]
    }
    console.log('Données envoyées:', formDataEntries)
    console.log('=== Fin DEBUG ===')

    // Options pour la requête fetch
    const requestOptions = {
      method: method,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    }

    console.log(`Envoi ${method} vers:`, apiUrl)

    // Envoyer la requête
    const response = await fetch(apiUrl, requestOptions)

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Erreur ${response.status}: ${response.statusText}`

      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.error || errorMessage

        // Si l'erreur contient des détails spécifiques
        if (errorData.errors) {
          const errorDetails = Object.entries(errorData.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ')
          errorMessage += ` (${errorDetails})`
        }
      } catch {
        errorMessage = errorText || errorMessage
      }

      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log('Réponse API:', result)

    // Fermer la modale
    showPropertyModal.value = false

    // Notification de succès
    $q.notify({
      type: 'positive',
      message:
        modalMode.value === 'edit'
          ? `${propertyType.value === 'maison' ? 'Maison' : 'Parcelle'} modifié(e) avec succès`
          : `${propertyType.value === 'maison' ? 'Maison' : 'Parcelle'} ajouté(e) avec succès`,
      icon: 'check_circle',
      timeout: 3000,
    })

    // Recharger les données
    await fetchData()
  } catch (error) {
    console.error('Erreur API:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.',
      icon: 'error',
      timeout: 5000,
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
      loadDemoData()
      return
    }

    // Charger les maisons
    try {
      const maisonsResponse = await fetch(`${API_BASE_URL}/maisons/utilisateur/${userId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      })

      if (maisonsResponse.ok) {
        const responseData = await maisonsResponse.json()
        // Vérifier si la réponse est un tableau
        const maisonsData = Array.isArray(responseData) ? responseData : responseData.data || []

        if (maisonsData.length > 0) {
          // Récupérer les détails des parcelles pour chaque maison
          const maisonsAvecDetails = await Promise.all(
            maisonsData.map(async (maison) => {
              if (maison.parcelle_id) {
                const parcelleDetails = await getParcelleDetails(maison.parcelle_id)
                return {
                  ...maison,
                  parcelle_details: parcelleDetails,
                  ville: parcelleDetails?.ville || 'Non spécifié',
                  quartier: parcelleDetails?.quartier || 'Non spécifié',
                }
              }
              return maison
            }),
          )

          maisonsRecent.value = maisonsAvecDetails.slice(0, 3)
          stats.value.totalMaisons = maisonsData.length
          console.log('Maisons chargées avec détails parcelle:', maisonsRecent.value)
        } else {
          maisonsRecent.value = []
          stats.value.totalMaisons = 0
          console.log('Aucune maison trouvée pour cet utilisateur')
        }
      } else {
        console.warn('Erreur lors du chargement des maisons:', maisonsResponse.status)
        maisonsRecent.value = []
      }
    } catch (maisonError) {
      console.warn('Erreur réseau pour maisons:', maisonError)
      maisonsRecent.value = []
    }

    // Charger les parcelles
    try {
      const parcellesResponse = await fetch(`${API_BASE_URL}/parcelles/utilisateur/${userId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      })

      if (parcellesResponse.ok) {
        const responseData = await parcellesResponse.json()
        // Vérifier si la réponse est un tableau
        const parcellesData = Array.isArray(responseData) ? responseData : responseData.data || []

        parcellesRecent.value = parcellesData.slice(0, 3)
        stats.value.totalParcelles = parcellesData.length
        console.log('Parcelles chargées:', parcellesRecent.value)
      } else {
        console.warn('Erreur lors du chargement des parcelles:', parcellesResponse.status)
        parcellesRecent.value = []
      }
    } catch (parcelleError) {
      console.warn('Erreur réseau pour parcelles:', parcelleError)
      parcellesRecent.value = []
    }

    // Mettre à jour le total
    stats.value.totalProperties = stats.value.totalMaisons + stats.value.totalParcelles

    // Calculer le revenu mensuel (somme des prix de location des maisons disponibles)
    if (maisonsRecent.value.length > 0) {
      const revenu = maisonsRecent.value.reduce((total, maison) => {
        if (maison.statut === 'loué' || maison.statut === 'disponible') {
          return total + (maison.prix_location || 0)
        }
        return total
      }, 0)
      stats.value.revenuMensuel = revenu
    } else {
      stats.value.revenuMensuel = 0
    }

    // Si aucune donnée n'a été chargée, afficher les données de démo
    if (maisonsRecent.value.length === 0 && parcellesRecent.value.length === 0) {
      console.log('Aucune donnée chargée, utilisation des données de démo')
      loadDemoData()
    }
  } catch (error) {
    console.error('Erreur lors du chargement des propriétés:', error)
    // Charger des données de démo en cas d'erreur
    loadDemoData()
  } finally {
    loadingProperties.value = false
  }
}

// Données de démo pour le développement
const loadDemoData = () => {
  console.log('Chargement des données de démo...')

  // Parcelles de démo
  parcellesRecent.value = [
    {
      id: 2,
      titre: 'my parcelle',
      ville: 'goma',
      quartier: 'mabanga sud',
      avenue: 'kulanga',
      numero: '15A',
      superficie: 2787389,
      type_terrain: 'urbain',
      prix_vente: 2900000,
      statut: 'disponible',
      role: 'proprietaire', // AJOUTÉ
      description: 'un bon parcelle au bord du lac',
      images: [
        '/uploads/parcelles/parcelle-1764439344495-972877967.jpg',
        '/uploads/parcelles/parcelle-1764439344502-760093764.jpg',
      ],
    },
  ]

  // Maisons de démo avec référence à parcelle
  maisonsRecent.value = [
    {
      id: 4,
      titre: 'Asta la vista',
      description: 'une maison plus performante',
      parcelle_id: 2,
      parcelle_details: parcellesRecent.value[0],
      nombre_chambres: 7,
      nombre_salles_bain: 2,
      surface_totale: 130,
      etat: 'bon_etat', // AJOUTÉ
      type_maison: 'contemporaine',
      standing: 'standard',
      jardin: false,
      garage: false,
      piscine: false,
      prix_vente: null,
      prix_location: 500,
      type_offre: 'vente',
      statut: 'disponible',
      ville: 'goma',
      quartier: 'mabanga sud',
      images: [
        '/uploads/parcelles/parcelle-1764799179478-582326921.PNG',
        '/uploads/parcelles/parcelle-1764799179488-604925661.PNG',
        '/uploads/parcelles/parcelle-1764799179498-751304246.PNG',
      ],
    },
  ]

  stats.value.totalMaisons = maisonsRecent.value.length
  stats.value.totalParcelles = parcellesRecent.value.length
  stats.value.totalProperties = stats.value.totalMaisons + stats.value.totalParcelles
  stats.value.revenuMensuel = 500 // Loyer de la maison de démo

  console.log('Données de démo chargées:', stats.value)
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
    persistent: true,
  }).onOk(async () => {
    try {
      const token = getAuthToken()
      const apiUrl =
        type === 'maison'
          ? `${API_BASE_URL}/maisons/${property.id}`
          : `${API_BASE_URL}/parcelles/${property.id}`

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        $q.notify({
          type: 'positive',
          message: 'Propriété supprimée avec succès',
        })
        await fetchData()
      } else {
        throw new Error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      $q.notify({
        type: 'negative',
        message: 'Erreur lors de la suppression',
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
    timeout: 2000,
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
  min-height: 100vh;
}

.stat-card {
  transition: transform 0.3s ease;
  cursor: pointer;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.property-card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: #1976d2;
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

/* Améliorations visuelles */
.text-subtitle2 {
  opacity: 0.8;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
