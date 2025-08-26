export const getters = {
  getCurrentPoints: (state) => {
    // Làm tròn đến 1 chữ số thập phân cho điểm hiện tại
    return Math.round(state.currentPoints * 10) / 10
  },
  getHighScore: (state) => {
    // Làm tròn xuống thành số nguyên cho high score
    return Math.floor(state.highScore)
  },
  getPointHistory: (state) => {
    // Làm tròn điểm trong lịch sử
    return state.pointHistory.map(record => ({
      ...record,
      score: Math.floor(record.score)
    }))
  },
  isGameActive: (state) => state.isGameActive,

  // Thêm getter cho việc hiển thị điểm dạng số nguyên
  getCurrentPointsAsInteger: (state) => {
    return Math.floor(state.currentPoints)
  }
}
