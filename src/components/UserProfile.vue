<template>
    <div class="py-4 text-center">
        <!-- <img class="w-20 h-20 mx-auto rounded-full" :src="profile.avatar" alt=""> -->
        <img class="w-20 h-20 mx-auto rounded-full" src="../assets/ben.jpg" alt="">

        <h3 class="py-2 text-lg font-semibold text-gray-700">{{profile.fullName}}</h3>

        <div class="flex justify-center items-center">
            <span class="px-4 py-1 rounded-3xl text-purple-600 bg-purple-300">@{{profile.username}}</span> 
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        computed: mapState({
            // arrow functions can make the code very succinct!
            profile: state => state.userProfile
        }),
        mounted () {
            console.log(this.$store.state.userProfile)
        }
    }
</script>

<style scoped>

</style>