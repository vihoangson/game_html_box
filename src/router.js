import { createRouter, createWebHistory } from 'vue-router'
import Game from './views/Game.vue'
import Test from './views/Test.vue'

const routes = [
  {
    path: '/',
    name: 'Game',
    component: Game
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
