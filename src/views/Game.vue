<template>
  <div class="game-wrapper">
    <ScoreDisplay :showHistory="true" />
    <div id="game-container"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import Phaser from 'phaser'
import { gameConfig } from '../../js/config'
import ScoreDisplay from '../components/ScoreDisplay.vue'

export default {
  name: 'GameView',
  components: {
    ScoreDisplay
  },
  setup() {
    onMounted(() => {
      const game = new Phaser.Game(gameConfig)
    })
  }
}
</script>

<style>
.game-wrapper {
  padding-top: 76px; /* 56px navbar height + 20px spacing */
  width: 100%;
  min-height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#game-container {
  width: 100%;
  max-width: 800px;
  aspect-ratio: 800/600;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

#game-container canvas {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain;
}

@media (max-width: 991.98px) {
  .game-wrapper {
    padding-top: 66px;
  }
}
</style>
