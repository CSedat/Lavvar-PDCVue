<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="text-center text-white"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="flex-1 p-2 m-2 h-[90vh] overflow-y-auto">
            <router-view v-slot="{ Component }">
              <transition name="route" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>
<script>
export default {
  name: "App",
  compoments: {
    RouterLink,
    RouterView,
  },
  mounted() {
    window.addEventListener("unload", this.handler);
  },
  methods: {
    handler: function handler(event) {
      console.log("handler");
      this.$router.push("/");
    },
  },
  Updated() {
    console.log("Updated");
  },
};
</script>

<style>
@import "@/assets/base.css";
.route-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.route-enter-active {
  transition: all 0.3s ease-out;
}
.route-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
.route-leave-active {
  transition: all 0.3s ease-in;
}
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.router-link-active {
  opacity: 1 !important;
}

::-webkit-scrollbar {
  display: none !important;
  /* background: #fff; */
}
</style>
