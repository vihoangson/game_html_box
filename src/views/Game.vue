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
#game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
