export const actions = {
  incrementPoints({ commit }, amount) {
    // Làm tròn số trước khi commit
    const roundedAmount = Math.round(amount * 10) / 10;
    commit('INCREMENT_POINTS', roundedAmount)
  },

  updateHighScore({ commit, state }) {
    // Làm tròn điểm trước khi cập nhật high score
    const roundedScore = Math.floor(state.currentPoints);
    if (roundedScore > state.highScore) {
      commit('SET_HIGH_SCORE', roundedScore)
      localStorage.setItem('highScore', roundedScore.toString())
    }
  },

  resetPoints({ commit }) {
    commit('RESET_POINTS')
  },

  startGame({ commit }) {
    commit('SET_GAME_ACTIVE', true)
    commit('RESET_POINTS')
  },

  endGame({ commit, dispatch, state }) {
    commit('SET_GAME_ACTIVE', false)
    // Làm tròn điểm cuối cùng trước khi lưu vào history
    const finalScore = Math.floor(state.currentPoints);
    commit('SET_FINAL_SCORE', finalScore)
    dispatch('updateHighScore')
    commit('ADD_TO_HISTORY')
  }
}
