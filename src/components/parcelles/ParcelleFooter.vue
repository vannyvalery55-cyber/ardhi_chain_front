<template>
  <footer class="simple-footer">
    <div class="footer-content">
      <div class="footer-text">
        <q-icon name="copyright" size="16px" />
        <span>2025 ARDHI-CHAIN - Sécurité foncière par blockchain</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer ultra simple
</script>

<style scoped>
.simple-footer {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  color: white;
  padding: 16px 20px;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-text {
    font-size: 0.8rem;
    flex-direction: column;
    gap: 4px;
  }
}
</style>