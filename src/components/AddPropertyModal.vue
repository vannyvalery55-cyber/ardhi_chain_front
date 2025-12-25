<template>
  <q-card style="min-width: 500px; max-width: 800px">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Ajouter une nouvelle propriété</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-card-section>
      <q-form @submit="submitForm">
        <div class="row q-col-gutter-md">
          <!-- Informations de base -->
          <div class="col-12">
            <q-input
              v-model="form.titre"
              label="Titre de la propriété *"
              :rules="[val => !!val || 'Champ requis']"
              outlined
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="form.type_maison"
              :options="typesMaison"
              label="Type de maison *"
              :rules="[val => !!val || 'Champ requis']"
              outlined
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="form.standing"
              :options="standings"
              label="Standing *"
              :rules="[val => !!val || 'Champ requis']"
              outlined
            />
          </div>

          <!-- Localisation -->
          <div class="col-12">
            <div class="text-subtitle1 q-mb-sm">Localisation</div>
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="form.ville"
              label="Ville *"
              :rules="[val => !!val || 'Champ requis']"
              outlined
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="form.quartier"
              label="Quartier *"
              :rules="[val => !!val || 'Champ requis']"
              outlined
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="form.avenue"
              label="Avenue"
              outlined
            />
          </div>

          <!-- Caractéristiques -->
          <div class="col-12">
            <div class="text-subtitle1 q-mb-sm">Caractéristiques</div>
          </div>

          <div class="col-6 col-md-3">
            <q-input
              v-model="form.nombre_chambres"
              label="Chambres"
              type="number"
              outlined
            />
          </div>

          <div class="col-6 col-md-3">
            <q-input
              v-model="form.nombre_salles_bain"
              label="Salles de bain"
              type="number"
              outlined
            />
          </div>

          <div class="col-6 col-md-3">
            <q-input
              v-model="form.surface_totale"
              label="Surface (m²) *"
              type="number"
              :rules="[val => !!val || 'Champ requis']"
              outlined
            />
          </div>

          <div class="col-6 col-md-3">
            <q-input
              v-model="form.etage"
              label="Étage"
              type="number"
              outlined
            />
          </div>

          <!-- Équipements -->
          <div class="col-12">
            <div class="text-subtitle1 q-mb-sm">Équipements</div>
            <div class="row">
              <div class="col-6 col-md-3">
                <q-checkbox v-model="form.jardin" label="Jardin" />
              </div>
              <div class="col-6 col-md-3">
                <q-checkbox v-model="form.garage" label="Garage" />
              </div>
              <div class="col-6 col-md-3">
                <q-checkbox v-model="form.piscine" label="Piscine" />
              </div>
              <div class="col-6 col-md-3">
                <q-checkbox v-model="form.climatisation" label="Climatisation" />
              </div>
            </div>
          </div>

          <!-- Prix -->
          <div class="col-12">
            <div class="text-subtitle1 q-mb-sm">Prix</div>
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="form.type_offre"
              :options="typesOffre"
              label="Type d'offre *"
              :rules="[val => !!val || 'Champ requis']"
              outlined
            />
          </div>

          <div class="col-12 col-md-6" v-if="form.type_offre === 'vente' || form.type_offre === 'vente_location'">
            <q-input
              v-model="form.prix_vente"
              label="Prix de vente (€)"
              prefix="€"
              type="number"
              outlined
            />
          </div>

          <div class="col-12 col-md-6" v-if="form.type_offre === 'location' || form.type_offre === 'vente_location'">
            <q-input
              v-model="form.prix_location"
              label="Prix de location mensuel (€)"
              prefix="€"
              type="number"
              outlined
            />
          </div>

          <!-- Description -->
          <div class="col-12">
            <q-input
              v-model="form.description"
              label="Description"
              type="textarea"
              rows="3"
              outlined
            />
          </div>

          <!-- Images -->
          <div class="col-12">
            <div class="text-subtitle1 q-mb-sm">Images</div>
            <q-file
              v-model="images"
              label="Sélectionner des images"
              multiple
              accept="image/*"
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <div v-if="imagesPreview.length > 0" class="q-mt-md">
              <div class="row q-col-gutter-sm">
                <div class="col-4 col-sm-3" v-for="(preview, index) in imagesPreview" :key="index">
                  <q-img :src="preview" style="height: 100px" class="rounded-borders">
                    <q-btn
                      icon="close"
                      size="sm"
                      color="negative"
                      round
                      dense
                      class="absolute-top-right"
                      @click="removeImage(index)"
                    />
                  </q-img>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row q-mt-lg">
          <div class="col">
            <q-btn
              label="Annuler"
              color="negative"
              flat
              v-close-popup
            />
          </div>
          <div class="col text-right">
            <q-btn
              label="Ajouter la propriété"
              color="primary"
              type="submit"
              :loading="loading"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const emit = defineEmits(['property-added'])

const loading = ref(false)
const images = ref([])
const imagesPreview = ref([])

const form = ref({
  titre: '',
  type_maison: '',
  standing: '',
  ville: '',
  quartier: '',
  avenue: '',
  nombre_chambres: '',
  nombre_salles_bain: '',
  surface_totale: '',
  etage: '',
  jardin: false,
  garage: false,
  piscine: false,
  climatisation: false,
  type_offre: '',
  prix_vente: '',
  prix_location: '',
  description: ''
})

const typesMaison = ['villa', 'appartement', 'duplex', 'studio', 'fermette', 'contemporaine']
const standings = ['luxe', 'haut_de_gamme', 'standard', 'economique']
const typesOffre = ['vente', 'location', 'vente_location']

// Gestion des images
watch(images, (newImages) => {
  imagesPreview.value = []
  if (newImages && newImages.length > 0) {
    Array.from(newImages).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagesPreview.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }
})

const removeImage = (index) => {
  imagesPreview.value.splice(index, 1)
  const newImages = Array.from(images.value)
  newImages.splice(index, 1)
  images.value = newImages
}

const submitForm = async () => {
  loading.value = true

  try {
    const formData = new FormData()

    // Ajouter les données du formulaire
    Object.keys(form.value).forEach(key => {
      if (form.value[key] !== '') {
        formData.append(key, form.value[key])
      }
    })

    // Ajouter les images
    if (images.value && images.value.length > 0) {
      Array.from(images.value).forEach(file => {
        formData.append('images', file)
      })
    }

    // Ici, vous feriez l'appel API réel
    // await api.post('/maisons', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // })

    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1500))

    $q.notify({
      type: 'positive',
      message: 'Propriété ajoutée avec succès'
    })

    emit('property-added')

  } catch (error) {
    console.error('Erreur:', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de l\'ajout de la propriété'
    })
  } finally {
    loading.value = false
  }
}
</script>
