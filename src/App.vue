<template>
  <div id="app">
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}

/* Reset some bootstrap conflicts with the game */
#game-container {
  margin-top: 20px;
}

.navbar-dark {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
