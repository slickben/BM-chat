<template>
    <div class="py-4 text-center">
        <!-- <img class="w-20 h-20 mx-auto rounded-full" :src="profile.avatar" alt=""> -->
        <img class="w-20 h-20 mx-auto rounded-full" src="../assets/ben.jpg" alt="">

        <h3 class="py-2 text-lg font-semibold text-gray-700">{{profile.fullName}}</h3>

        <div class="flex justify-center items-center">
            <span class="px-4 py-1 rounded-3xl text-purple-600 bg-purple-300">@{{profile.username}}</span> {{ userOnline }}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            profile: {
                required: false,
            },
            userOnline: {
                required: false
            }
        },
        mounted () {
            console.log(this.profile)
        }
    }
</script>

<style scoped>

</style>