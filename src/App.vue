<template>
  <div class="md:flex bg-gray-200 md:bg-white w-full h-screen max-h-screen overflow-hidden">
    <!-- logo -->
      <div class="hidden flex-none flex md:flex-col  px-3 ">
        <!-- logo -->
        <Logo/>

        <!-- nav -->
        <Nav/>

        <!-- profile -->
        <Profile/>
      </div>
    
      <router-view></router-view>
    
  </div>
</template>

<script>

import Nav from './components/Nav.vue';
import Logo from './components/Logo.vue';
import Profile from './components/ProfilePic.vue';

export default {
  name: "App",
  components: {
    Nav,
    Logo,
    Profile
  }
}


// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
</style>