export const mutations = {
  INCREMENT_POINTS(state, amount) {
    if (state.isGameActive) {
      state.currentPoints = Math.round((state.currentPoints + amount) * 10) / 10
    }
  },
  RESET_POINTS(state) {
    state.currentPoints = 0
  },
  SET_HIGH_SCORE(state, score) {
    state.highScore = Math.floor(score)
  },
  SET_GAME_ACTIVE(state, status) {
    state.isGameActive = status
  },
  SET_FINAL_SCORE(state, score) {
    state.currentPoints = Math.floor(score)
  },
  ADD_TO_HISTORY(state) {
    state.pointHistory.push({
      score: Math.floor(state.currentPoints),
      date: new Date().toISOString(),
      timestamp: Date.now()
    })
    // Keep only last 10 scores
    if (state.pointHistory.length > 10) {
      state.pointHistory.shift()
    }
  }
}
