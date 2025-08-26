<template>
  <div class="score-display">
    <div class="current-score">
      <h3>Current Score: {{ Math.floor(currentPoints) }}</h3>
      <h4>High Score: {{ highScore }}</h4>
    </div>

    <div class="score-history" v-if="showHistory">
      <h4>History</h4>
      <ul class="list-group">
        <li v-for="(score, index) in pointHistory" :key="index" class="list-group-item">
          <span class="score">{{ Math.floor(score.score) }}</span>
          <small class="date">{{ new Date(score.date).toLocaleString() }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ScoreDisplay',
  props: {
    showHistory: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore()

    return {
      currentPoints: computed(() => store.getters['point/getCurrentPoints']),
      highScore: computed(() => store.getters['point/getHighScore']),
      pointHistory: computed(() => store.getters['point/getPointHistory'])
    }
  }
}
</script>

<style scoped>
.score-display {
  position: fixed;
  top: 70px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
}

.current-score {
  text-align: right;
}

.current-score h3 {
  margin: 0;
  font-size: 1.5rem;
}

.current-score h4 {
  margin: 5px 0;
  color: #ffd700;
  font-size: 1.2rem;
}

.score-history {
  margin-top: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.list-group {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-group-item {
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 5px;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score {
  font-weight: bold;
  color: #4CAF50;
}

.date {
  color: #999;
}

@media (max-width: 768px) {
  .score-display {
    top: auto;
    bottom: 20px;
    right: 20px;
    left: 20px;
  }
}
</style>
