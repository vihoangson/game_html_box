export const state = {
  currentPoints: 0,
  highScore: parseInt(localStorage.getItem('highScore')) || 0,
  pointHistory: [],
  isGameActive: false
}

