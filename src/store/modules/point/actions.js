export const actions = {
  incrementPoints({ commit }, amount) {
    commit('INCREMENT_POINTS', amount)
  },
  updateHighScore({ commit, state }) {
    if (state.currentPoints > state.highScore) {
      commit('SET_HIGH_SCORE', state.currentPoints)
      localStorage.setItem('highScore', state.currentPoints.toString())
    }
  },
  resetPoints({ commit }) {
    commit('RESET_POINTS')
  },
  startGame({ commit }) {
    commit('SET_GAME_ACTIVE', true)
    commit('RESET_POINTS')
  },
  endGame({ commit, dispatch }) {
    commit('SET_GAME_ACTIVE', false)
    dispatch('updateHighScore')
    commit('ADD_TO_HISTORY')
  }
}

