<template>
  <q-card class="locataire-stats">
    <q-card-section>
      <div class="text-h6 text-weight-bold">Vos statistiques</div>
    </q-card-section>
    
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-6" v-for="stat in stats" :key="stat.id">
          <div class="stat-item text-center">
            <div class="text-h4 text-weight-bold" :style="{ color: stat.color }">
              {{ stat.value }}
            </div>
            <div class="text-caption text-grey-7">{{ stat.label }}</div>
            <div class="text-caption" :class="`text-${stat.trendColor}`">
              <q-icon :name="stat.trendIcon" />
              {{ stat.trend }}%
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  {
    id: 1,
    label: 'Taux de réponse',
    value: '85%',
    trend: '+5',
    trendIcon: 'trending_up',
    trendColor: 'green',
    color: '#4CAF50'
  },
  {
    id: 2,
    label: 'Visites/mois',
    value: '3.2',
    trend: '+0.8',
    trendIcon: 'trending_up',
    trendColor: 'green',
    color: '#2196F3'
  },
  {
    id: 3,
    label: 'Délai moyen',
    value: '7j',
    trend: '-2',
    trendIcon: 'trending_down',
    trendColor: 'red',
    color: '#FF9800'
  },
  {
    id: 4,
    label: 'Satisfaction',
    value: '4.7',
    trend: '+0.3',
    trendIcon: 'trending_up',
    trendColor: 'green',
    color: '#9C27B0'
  }
])
</script>

<style scoped>
.locataire-stats {
  border-radius: 12px;
}

.stat-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: #e3f2fd;
  transform: translateY(-3px);
}
</style>