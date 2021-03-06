<template>
    <div class="flex-grow flex items-center">
        <div class="mx-auto flex flex-col items-center text-sm text-gray-400">
            <router-link to="/" class="py-2 px-3  rounded mb-2 ">
                <font-awesome-icon icon="home" />
            </router-link>

            <router-link to="/chat" class="py-2 px-3 bg-purple-100 rounded mb-2 text-purple-400">
                <font-awesome-icon icon="users" />
            </router-link>
            
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>

</style>