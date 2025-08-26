<template>
  <div id="game">
    <div id="game-container"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import Phaser from 'phaser'
import { gameConfig } from '../../js/config'

export default {
  name: 'GameView',
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
