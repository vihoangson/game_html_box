<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <i class="fas fa-gamepad"></i> Game Zone
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: $route.path === '/' }" to="/">
              <i class="fas fa-home"></i> Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: $route.path === '/test' }" to="/test">
              <i class="fas fa-flask"></i> Test
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://github.com" target="_blank">
              <i class="fab fa-github"></i> GitHub
            </a>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="fas fa-user"></i> Login
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
}

.navbar-brand i {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .navbar-nav {
    padding: 10px 0;
  }

  .nav-item {
    padding: 5px 0;
  }
}
</style>
