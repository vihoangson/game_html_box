export const mutations = {
  INCREMENT_POINTS(state, amount) {
    if (state.isGameActive) {
      state.currentPoints += amount
    }
  },
  RESET_POINTS(state) {
    state.currentPoints = 0
  },
  SET_HIGH_SCORE(state, score) {
    state.highScore = score
  },
  SET_GAME_ACTIVE(state, status) {
    state.isGameActive = status
  },
  ADD_TO_HISTORY(state) {
    state.pointHistory.push({
      score: state.currentPoints,
      date: new Date().toISOString(),
      timestamp: Date.now()
    })
    // Keep only last 10 scores
    if (state.pointHistory.length > 10) {
      state.pointHistory.shift()
    }
  }
}

